import type {
  GameMove,
  UserInfoStatus,
  UserInRoom,
} from "server/declares/interfaces/Socket";

const users: UserInRoom[] = [];

function userJoin(
  id: string,
  userId: string,
  roomId: string,
  score: number,
  moves: number[][],
  plus: number,
  status: string
) {
  const user = { id, userId, roomId, score, moves, plus, status };

  users.push(user);

  return user;
}

function updateUser(userInfo: GameMove, roomId: string) {
  const user = users.find(
    (user) => user.userId == userInfo.userId && user.roomId == roomId
  );
  if (user) {
    user.moves = userInfo.moves;
    user.score = userInfo.score;
    user.plus = userInfo.plus;
  }
}

function updateUserStatus(userInfo: UserInfoStatus, roomId: string) {
  const user = users.find(
    (user) => user.userId == userInfo.userId && user.roomId == roomId
  );
  if (user) {
    user.status = userInfo.status;
  }
}

function getCurrentUser(id: string) {
  return users.find((user) => user.id === id);
}

function userLeave(id: string) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(roomId: string) {
  return users.filter((user) => user.roomId === roomId);
}

export {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  updateUser,
  updateUserStatus,
};
