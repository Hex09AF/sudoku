// @ts-nocheck

import fs from "fs";
import { createServer } from "http";
import path from "path";

import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";

import type {
  ConnectedClient,
  GameMove,
  InfoConnected,
  InfoJoinRoom,
  UserInfoStatus,
} from "./declares/interfaces/Socket";
import { SocketEvent } from "./declares/interfaces/Socket";

import {
  getCurrentUser,
  getRoomUsers,
  updateUser,
  updateUserStatus,
  userJoin,
  userLeave,
} from "./utils/users";
import type { Pair } from "./declares/interfaces/Pair";
import type { UserId } from "./declares/interfaces/Id";

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");

if (!fs.existsSync(BUILD_DIR)) {
  console.warn(
    "Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server."
  );
}

const app = express();

const httpServer = createServer(app);

// Attach the socket.io server to the HTTP server
const io = new Server(httpServer);

let connectedClients: ConnectedClient[] = [];

io.on("connection", (socket) => {
  // from this point you are on the WS connection with a specific client

  /**
   * CLIENT WAITING LIST
   */
  connectedClients.push({ socketId: socket.id });
  socket.on(SocketEvent.CLIENT_CONNECTED, ({ user }: InfoConnected) => {
    if (user) {
      const curUser = connectedClients.find(
        (client) => client.socketId === socket.id
      );
      if (curUser) {
        curUser.userId = user.id;
        curUser.username = user.username;
      }
    }
    io.emit(SocketEvent.SERVER_CLIENT_CONNECTED, connectedClients);
  });

  /**
   * CLIENT JOIN A ROOM
   */
  socket.on(
    SocketEvent.CLIENT_JOIN_ROOM,
    ({
      userId,
      roomId,
      score,
      moves,
      plus,
      status,
      socketStatus,
    }: InfoJoinRoom) => {
      const isExistUser = getCurrentUser(socket.id);
      if (isExistUser) return;
      const user = userJoin({
        id: socket.id,
        userId,
        roomId,
        score,
        moves,
        plus,
        status,
        socketStatus,
      });
      socket.join(user.roomId);
      io.to(user.roomId).emit(SocketEvent.SERVER_ADD_CLIENT, {
        usersInfo: getRoomUsers(roomId).map((v) => ({
          userId: v.userId,
          moves: v.moves,
          score: v.score,
          plus: v.plus,
          status: v.status,
          socketStatus: v.socketStatus,
        })),
      });
    }
  );

  /**
   * CLIENT PLAY A MOVE
   */
  socket.on(
    SocketEvent.CLIENT_PLAY,
    ({
      pair,
      value,
      userPlayId,
    }: {
      pair: Pair;
      value: number;
      userPlayId: UserId;
    }) => {
      const user = getCurrentUser(socket.id);
      if (user)
        io.to(user.roomId).emit(SocketEvent.SERVER_CLIENT_PLAY, {
          pair,
          value,
          userPlayId,
        });
    }
  );

  /**
   * UPDATE CLIENT INFO IN A ROOM
   */
  socket.on(
    SocketEvent.CLIENT_UPDATE_CLIENT,
    ({ userInfo, roomId }: { userInfo: GameMove; roomId: string }) => {
      updateUser(userInfo, roomId);
      io.to(roomId).emit(SocketEvent.SERVER_UPDATE_CLIENT, {
        userInfo: userInfo,
      });
    }
  );

  /**
   * UPDATE CLIENT INFO WHEN THEY CHANGE THEIR STATUS IN A ROOM
   */
  socket.on(
    SocketEvent.CLIENT_UPDATE_CLIENT_STATUS,
    ({ userInfo, roomId }: { userInfo: UserInfoStatus; roomId: string }) => {
      updateUserStatus(userInfo, roomId);
      io.to(roomId).emit(SocketEvent.SERVER_UPDATE_CLIENT_STATUS, {
        userInfo: userInfo,
      });
    }
  );

  /**
   * REMOVE CLIENT WHEN LEAVE ROOM
   */
  socket.on(SocketEvent.CLIENT_LEAVE_ROOM, () => {
    const user = userLeave(socket.id);

    if (user) {
      socket.leave(user.roomId);
      user.socketStatus = "OFFLINE";
      io.to(user.roomId).emit(SocketEvent.SERVER_REMOVE_CLIENT, {
        userInfo: user,
      });
    }
  });

  socket.on("disconnect", () => {
    connectedClients = connectedClients.filter(
      (client) => client.socketId !== socket.id
    );
    io.emit(SocketEvent.SERVER_CLIENT_CONNECTED, connectedClients);

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.roomId).emit(SocketEvent.SERVER_REMOVE_CLIENT, {
        userInfo: user,
      });
    }
  });
});

app.use(compression());

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("./build");
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      }
);

const port = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
