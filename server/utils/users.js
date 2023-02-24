const users = [];

// Join user to chat
function userJoin(id, userId, roomId, score, moves, plus, status) {
  const user = { id, userId, roomId, score, moves, plus, status };

  users.push(user);

  return user;
}

function updateUser(userInfo, roomId) {
  const user = users.find(
    (user) => user.userId == userInfo.userId && user.roomId == roomId
  );
  if (user) {
    user.moves = userInfo.moves;
    user.score = userInfo.score;
    user.plus = userInfo.plus;
  }
}

function updateUserStatus(userInfo, roomId) {
  const user = users.find(
    (user) => user.userId == userInfo.userId && user.roomId == roomId
  );
  if (user) {
    user.status = userInfo.status;
  }
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(roomId) {
  return users.filter((user) => user.roomId === roomId);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  updateUser,
  updateUserStatus,
};
