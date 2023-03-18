"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.updateUser = exports.getRoomUsers = exports.userLeave = exports.getCurrentUser = exports.userJoin = exports.users = void 0;
exports.users = [];
function userJoin({ id, userId, roomId, score, moves, plus, status, socketStatus, }) {
    const user = { id, userId, roomId, score, moves, plus, status, socketStatus };
    exports.users.push(user);
    return user;
}
exports.userJoin = userJoin;
function updateUser(userInfo, roomId) {
    const user = exports.users.find((user) => user.userId == userInfo.userId && user.roomId == roomId);
    if (user) {
        user.moves = userInfo.moves;
        user.score = userInfo.score;
        user.plus = userInfo.plus;
    }
}
exports.updateUser = updateUser;
function updateUserStatus(userInfo, roomId) {
    const user = exports.users.find((user) => user.userId == userInfo.userId && user.roomId == roomId);
    if (user) {
        user.status = userInfo.status;
    }
}
exports.updateUserStatus = updateUserStatus;
function getCurrentUser(id) {
    return exports.users.find((user) => user.id === id);
}
exports.getCurrentUser = getCurrentUser;
function userLeave(id) {
    const index = exports.users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return exports.users.splice(index, 1)[0];
    }
}
exports.userLeave = userLeave;
function getRoomUsers(roomId) {
    return exports.users.filter((user) => user.roomId === roomId);
}
exports.getRoomUsers = getRoomUsers;
//# sourceMappingURL=users.js.map