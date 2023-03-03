const path = require("path");
const { createServer } = require("http");
const fs = require("fs");

const express = require("express");
const { Server } = require("socket.io");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "../build");

if (!fs.existsSync(BUILD_DIR)) {
  console.warn(
    "Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server."
  );
}

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  updateUser,
  updateUserStatus,
} = require("./utils/users");

const app = express();

// You need to create the HTTP server from the Express app
const httpServer = createServer(app);

// And then attach the socket.io server to the HTTP server
const io = new Server(httpServer);

let connectedClients = [];

// Then you can use `io` to listen the `connection` event and get a socket
// from a client
io.on("connection", (socket) => {
  // from this point you are on the WS connection with a specific client
  connectedClients.push({ socketId: socket.id });
  socket.on("get connected clients", ({ user, socketId }) => {
    if (user) {
      const curUser = connectedClients.find(
        (client) => client.socketId === socketId
      );
      if (curUser) {
        curUser.userId = user.id;
        curUser.username = user.username;
      }
    }
    io.emit("connected clients", connectedClients);
  });

  socket.on("event", (data) => {
    socket.emit("event", "pong");
  });

  socket.on("joinRoom", ({ userId, roomId, score, moves, plus, status }) => {
    const isExistUser = getCurrentUser(socket.id);
    if (isExistUser) return;
    const user = userJoin(
      socket.id,
      userId,
      roomId,
      score,
      moves,
      plus,
      status
    );
    socket.join(user.roomId);
    io.to(user.roomId).emit("addClientInfo", {
      usersInfo: getRoomUsers(roomId).map((v) => ({
        userId: v.userId,
        moves: v.moves,
        score: v.score,
        plus: v.plus,
        status: v.status,
      })),
    });
  });

  socket.on("play", (boardValue) => {
    const user = getCurrentUser(socket.id);
    socket.to(user.roomId).emit("play", boardValue);
  });

  // userId, roomId, score, moves, plus
  socket.on("updateInfo", ({ userInfo, roomId }) => {
    updateUser(userInfo, roomId);
    socket.to(roomId).emit("updateClientInfo", { userInfo: userInfo });
  });

  // userId, status
  socket.on("updateStatus", ({ userInfo, roomId }) => {
    updateUserStatus(userInfo, roomId);
    io.to(roomId).emit("updateClientInfoStatus", { userInfo: userInfo });
  });

  socket.on("disconnect", () => {
    connectedClients = connectedClients.filter(
      (client) => client.socketId !== socket.id
    );
    // Emit the updated list of connected clients to all clients
    io.emit("connected clients", connectedClients);

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.roomId).emit("removeClientInfo", { userInfo: user });
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
    ? createRequestHandler({ build: require("../build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("../build");
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
