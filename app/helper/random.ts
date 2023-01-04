import { baseBoard } from "~/const/board";

const RANDOMBOARD = () => {
  /**
   *
   * @param {*} left [left, left+right)
   * @param {*} right [left, left+right)
   * return x [left, left+right)
   */
  const RANDOMNUMBER = (left, right) => {
    return ((Math.random() * right) >> 0) + left;
  };

  const RANDOMPAIR = (left, right) => {
    let fs = RANDOMNUMBER(left, right);
    let sc = RANDOMNUMBER(left, right);

    return { first: fs, second: sc };
  };

  return new Promise((resolve, reject) => {
    let newBoardValue = JSON.parse(JSON.stringify(baseBoard));

    /**
     * SHUFFLE ROW THEN COL THEN ROW THEN COL THEN ...
     */

    for (let times = 0; times <= 10; ++times) {
      for (let left = 0; left <= 6; left += 3) {
        let pair = RANDOMPAIR(left, 3);
        [newBoardValue[pair.first], newBoardValue[pair.second]] = [
          newBoardValue[pair.second],
          newBoardValue[pair.first]
        ];
      }

      newBoardValue = newBoardValue[0].map((_, colIndex) =>
        newBoardValue.map((row) => row[colIndex])
      );
    }

    /**
     * ERASE SOME NUMBER
     * EZ = 40, MD = 50, HA = 60
     */

    let eraseCell = 45;
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
