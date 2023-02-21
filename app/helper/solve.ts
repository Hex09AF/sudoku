import type { Board } from "~/declares/interaces/Board";
import type { Pair } from "~/declares/interaces/Pair";

const SOLVE = (boardValue: Board) => {
  return new Promise<Board>((resolve, reject) => {
    let canRowXNumberY = new Array(9)
      .fill(0)
      .map(() => new Array(9 + 1).fill(true));
    let canColXNumberY = new Array(9)
      .fill(0)
      .map(() => new Array(9 + 1).fill(true));
    let canSquareXYNumberZ = new Array(3)
      .fill(0)
      .map(() => new Array(3).fill(0).map(() => new Array(9 + 1).fill(true)));

    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        if (boardValue[i][j] === 0) continue;
        if (
          !canRowXNumberY[i][boardValue[i][j]] ||
          !canColXNumberY[j][boardValue[i][j]] ||
          !canSquareXYNumberZ[(i / 3) >> 0][(j / 3) >> 0][boardValue[i][j]]
        ) {
          reject(false);
          return;
        }

        canRowXNumberY[i][boardValue[i][j]] = false;
        canColXNumberY[j][boardValue[i][j]] = false;
        canSquareXYNumberZ[(i / 3) >> 0][(j / 3) >> 0][boardValue[i][j]] =
          false;
      }
    }

    const checkValidIndex = (pair: Pair, number: number) => {
      return (
        pair.row >= 0 &&
        pair.row < 9 &&
        pair.col >= 0 &&
        pair.col < 9 &&
        canColXNumberY[pair.col][number] &&
        canRowXNumberY[pair.row][number] &&
        canSquareXYNumberZ[Math.floor(pair.row / 3)][Math.floor(pair.col / 3)][
          number
        ]
      );
    };

    const markIndex = (pair: Pair, number: number, value: boolean) => {
      canColXNumberY[pair.col][number] =
        canRowXNumberY[pair.row][number] =
        canSquareXYNumberZ[Math.floor(pair.row / 3)][Math.floor(pair.col / 3)][
          number
        ] =
          value;
    };

    const solveSudoku = (sudokuBoard: Board, x: number, y: number): boolean => {
      if (sudokuBoard[x][y] !== 0) {
        if (y + 1 === 9) {
          if (x + 1 === 9) return true;
          return solveSudoku(sudokuBoard, x + 1, 0);
        } else {
          return solveSudoku(sudokuBoard, x, y + 1);
        }
      } else {
        let c = sudokuBoard[x][y];
        for (let i = 1; i <= 9; ++i) {
          if (checkValidIndex({ row: x, col: y }, i)) {
            sudokuBoard[x][y] = i;
            markIndex({ row: x, col: y }, i, false);
            if (y + 1 === 9) {
              if (x + 1 === 9) return true;
              if (solveSudoku(sudokuBoard, x + 1, 0)) return true;
            } else {
              if (solveSudoku(sudokuBoard, x, y + 1)) return true;
            }
            markIndex({ row: x, col: y }, i, true);
          }
        }
        sudokuBoard[x][y] = c;
        return false;
      }
    };

    let boardSolve = JSON.parse(JSON.stringify(boardValue));
    solveSudoku(boardSolve, 0, 0);
    resolve(boardSolve);
  });
};

export default SOLVE;
