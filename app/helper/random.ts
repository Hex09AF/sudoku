import { baseBoard } from "~/const/board";
import type { Board } from "~/declares/interaces/Board";

/**
 *
 * @param {*} left [left, left+right)
 * @param {*} right [left, left+right)
 * return x [left, left+right)
 */
const RANDOMNUMBER = (left: number, right: number) => {
  return ((Math.random() * right) >> 0) + left;
};

const RANDOMPAIR = (left: number, right: number) => {
  let fs = RANDOMNUMBER(left, right);
  let sc = RANDOMNUMBER(left, right);

  return { first: fs, second: sc };
};

const TRANSPOSE = (matrix: number[][]) => {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
};

const RANDOMBOARD = () => {
  return new Promise<Board>((resolve) => {
    let newBoardValue: Board = JSON.parse(JSON.stringify(baseBoard));

    /**
     * SHUFFLE ROW THEN COL THEN ROW THEN COL THEN ...
     */

    for (let times = 0; times <= 10; ++times) {
      for (let left = 0; left <= 6; left += 3) {
        const pair = RANDOMPAIR(left, 3);
        [newBoardValue[pair.first], newBoardValue[pair.second]] = [
          newBoardValue[pair.second],
          newBoardValue[pair.first],
        ];
      }

      TRANSPOSE(newBoardValue);
    }

    /**
     * ERASE SOME NUMBER
     * EZ = 40, MD = 50, HA = 60
     */

    let eraseCell = 40;
    while (eraseCell) {
      let pair = RANDOMPAIR(0, 9);
      if (newBoardValue[pair.first][pair.second]) {
        newBoardValue[pair.first][pair.second] = 0;
        --eraseCell;
      }
    }

    resolve(newBoardValue);
  });
};

export default RANDOMBOARD;
