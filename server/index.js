"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const express_1 = require("@remix-run/express");
const compression_1 = __importDefault(require("compression"));
const express_2 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const Socket_1 = require("./declares/interfaces/Socket");
const users_1 = require("./utils/users");
const MODE = process.env.NODE_ENV;
const BUILD_DIR = path_1.default.join(process.cwd(), "server/build");
if (!fs_1.default.existsSync(BUILD_DIR)) {
    console.warn("Build directory doesn't exist, please run `npm run dev` or `npm run build` before starting the server.");
}
const app = (0, express_2.default)();
const httpServer = (0, http_1.createServer)(app);
// Attach the socket.io server to the HTTP server
const io = new socket_io_1.Server(httpServer);
let connectedClients = [];
io.on("connection", (socket) => {
    // from this point you are on the WS connection with a specific client
    /**
     * CLIENT WAITING LIST
     */
    connectedClients.push({ socketId: socket.id });
    socket.on(Socket_1.SocketEvent.CLIENT_CONNECTED, ({ user }) => {
        if (user) {
            const curUser = connectedClients.find((client) => client.socketId === socket.id);
            if (curUser) {
                curUser.userId = user.id;
                curUser.username = user.username;
            }
        }
        io.emit(Socket_1.SocketEvent.SERVER_CLIENT_CONNECTED, connectedClients);
    });
    /**
     * CLIENT JOIN A ROOM
     */
    socket.on(Socket_1.SocketEvent.CLIENT_JOIN_ROOM, ({ userId, roomId, score, moves, plus, status, socketStatus, }) => {
        const isExistUser = (0, users_1.getCurrentUser)(socket.id);
        if (isExistUser)
            return;
        const user = (0, users_1.userJoin)({
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
        io.to(user.roomId).emit(Socket_1.SocketEvent.SERVER_ADD_CLIENT, {
            usersInfo: (0, users_1.getRoomUsers)(roomId).map((v) => ({
                userId: v.userId,
                moves: v.moves,
                score: v.score,
                plus: v.plus,
                status: v.status,
                socketStatus: v.socketStatus,
            })),
        });
    });
    /**
     * CLIENT PLAY A MOVE
     */
    socket.on(Socket_1.SocketEvent.CLIENT_PLAY, ({ pair, value, userPlayId, }) => {
        const user = (0, users_1.getCurrentUser)(socket.id);
        if (user)
            io.to(user.roomId).emit(Socket_1.SocketEvent.SERVER_CLIENT_PLAY, {
                pair,
                value,
                userPlayId,
            });
    });
    /**
     * UPDATE CLIENT INFO IN A ROOM
     */
    socket.on(Socket_1.SocketEvent.CLIENT_UPDATE_CLIENT, ({ userInfo, roomId }) => {
        (0, users_1.updateUser)(userInfo, roomId);
        io.to(roomId).emit(Socket_1.SocketEvent.SERVER_UPDATE_CLIENT, {
            userInfo: userInfo,
        });
    });
    /**
     * UPDATE CLIENT INFO WHEN THEY CHANGE THEIR STATUS IN A ROOM
     */
    socket.on(Socket_1.SocketEvent.CLIENT_UPDATE_CLIENT_STATUS, ({ userInfo, roomId }) => {
        (0, users_1.updateUserStatus)(userInfo, roomId);
        io.to(roomId).emit(Socket_1.SocketEvent.SERVER_UPDATE_CLIENT_STATUS, {
            userInfo: userInfo,
        });
    });
    /**
     * REMOVE CLIENT WHEN LEAVE ROOM
     */
    socket.on(Socket_1.SocketEvent.CLIENT_LEAVE_ROOM, () => {
        const user = (0, users_1.userLeave)(socket.id);
        if (user) {
            socket.leave(user.roomId);
            user.socketStatus = "OFFLINE";
            io.to(user.roomId).emit(Socket_1.SocketEvent.SERVER_REMOVE_CLIENT, {
                userInfo: user,
            });
        }
    });
    socket.on("disconnect", () => {
        connectedClients = connectedClients.filter((client) => client.socketId !== socket.id);
        io.emit(Socket_1.SocketEvent.SERVER_CLIENT_CONNECTED, connectedClients);
        const user = (0, users_1.userLeave)(socket.id);
        if (user) {
            io.to(user.roomId).emit(Socket_1.SocketEvent.SERVER_REMOVE_CLIENT, {
                userInfo: user,
            });
        }
    });
});
app.use((0, compression_1.default)());
// You may want to be more aggressive with this caching
app.use(express_2.default.static("public", { maxAge: "1h" }));
// Remix fingerprints its assets so we can cache forever
app.use(express_2.default.static("public/build", { immutable: true, maxAge: "1y" }));
app.use((0, morgan_1.default)("tiny"));
app.all("*", MODE === "production"
    ? (0, express_1.createRequestHandler)({ build: require("./build") })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require("./build");
        return (0, express_1.createRequestHandler)({ build, mode: MODE })(req, res, next);
    });
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
//# sourceMappingURL=index.js.map