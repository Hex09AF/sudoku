export default function mergeMovesWithBoard(moves, board) {
  moves.forEach(move => {
    move.moves.forEach(userMove => {
      board[userMove[0]][userMove[1]] = userMove[2];
    })
  })
  return board;
}