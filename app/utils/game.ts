import type { Board, CellValue } from "~/declares/interaces/Board";
import type { GameMove } from "~/declares/interaces/GameMove";
import type { Pair } from "~/declares/interaces/Pair";
import type { UserId } from "~/declares/interaces/User";

const isEnemyCell = (gameMoves: GameMove[], userId: UserId, pair: Pair) => {
  let flag = false;
  const usersInfo = gameMoves.filter((user) => user.userId != userId);
  usersInfo?.forEach((user) => {
    user?.moves?.forEach((move) => {
      if (move[0] == pair.row && move[1] == pair.col) flag = true;
    });
  });
  return flag;
};

const isUserCell = (gameMoves: GameMove[], userId: UserId, pair: Pair) => {
  let flag = false;
  const userInfo = gameMoves.find((user) => user.userId == userId);
  userInfo?.moves.forEach((move) => {
    if (move[0] == pair.row && move[1] == pair.col) flag = true;
  });
  return flag;
};

const isMatchCell = (solveBoard: Board, curBoard: Board, pair: Pair) => {
  return solveBoard[pair.row][pair.col] == curBoard[pair.row][pair.col];
};

const checkValid = (
  value: CellValue,
  gameMoves: GameMove[],
  userId: UserId,
  initBoard: Board,
  solveBoard: Board,
  curBoard: Board,
  pair: Pair
) => {
  if (value === 0) return isUserCell(gameMoves, userId, pair);
  return (
    !isEnemyCell(gameMoves, userId, pair) &&
    pair.row >= 0 &&
    pair.row < 9 &&
    pair.col >= 0 &&
    pair.col < 9 &&
    !isMatchCell(solveBoard, curBoard, pair) &&
    (!initBoard[pair.row][pair.col] || isUserCell(gameMoves, userId, pair))
  );
};

export { isEnemyCell, isMatchCell, isUserCell, checkValid };
