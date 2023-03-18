"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = void 0;
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["CLIENT_PLAY"] = "GAME:PLAY_A_MOVE";
    SocketEvent["SERVER_CLIENT_PLAY"] = "SERVER:GAME:PLAY_A_MOVE";
    SocketEvent["CLIENT_CONNECTED"] = "CLIENT:CONNECTED";
    SocketEvent["SERVER_CLIENT_CONNECTED"] = "SERVER:CLIENT:CONNECTED";
    SocketEvent["CLIENT_JOIN_ROOM"] = "CLIENT:GAME:JOIN_ROOM";
    SocketEvent["SERVER_ADD_CLIENT"] = "SERVER:GAME:ADD_CLIENT";
    SocketEvent["CLIENT_LEAVE_ROOM"] = "CLIENT:GAME:LEAVE_ROOM";
    SocketEvent["CLIENT_UPDATE_CLIENT"] = "CLIENT:GAME:UPDATE_CLIENT";
    SocketEvent["SERVER_UPDATE_CLIENT"] = "SERVER:GAME:UPDATE_CLIENT";
    SocketEvent["CLIENT_UPDATE_CLIENT_STATUS"] = "CLIENT:GAME:UPDATE_CLIENT_STATUS";
    SocketEvent["SERVER_UPDATE_CLIENT_STATUS"] = "SERVER:GAME:UPDATE_CLIENT_STATUS";
    SocketEvent["SERVER_REMOVE_CLIENT"] = "SERVER:GAME:REMOVE_CLIENT";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
//# sourceMappingURL=Socket.js.map