import { useSubmit } from "@remix-run/react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import Score from "../Score";

const BoardGame = ({
  solveBoard,
  boardData,
  roomId,
  userId,
  socket,
  initMoves,
  initCurUserMoves,
}) => {
  const submit = useSubmit();

  const [usersInRoom, setUsersInRoom] = useState([userId]);

  const [score, setScore] = useState(40);
  const [plusPoint, setPlusPoint] = useState(0);

  const [curMoves] = useState(initMoves);

  const [curUserMoves, setCurUserMoves] = useState<[]>(initCurUserMoves);

  const [selectCell, setSelectCell] = useState({ row: 4, col: 4 });

  const [curBoardValue, setCurBoardValue] = useState(boardData);

  const [firstBoardValue] = useState(boardData);

  const [canRowXNumberY, setCanRowXNumberY] = useState(
    new Array(9).fill(0).map(() => new Array(10).fill(0))
  );
  const [canColXNumberY, setCanColXNumberY] = useState(
    new Array(9).fill(0).map(() => new Array(10).fill(0))
  );
  const [canSquareXYNumberZ, setCanSquareXYNumberZ] = useState(
    new Array(3)
      .fill(0)
      .map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)))
  );

  const isEnemyCell = (pair) => {
    let flag = false;
    curMoves.forEach((move) => {
      if (
        move.userId != userId &&
        move.moves.findIndex((v) => v[0] == pair.row && v[1] == pair.col) != -1
      ) {
        flag = true;
      }
    });
    return flag;
  };

  const isUserCell = (pair) => {
    return (
      curUserMoves.findIndex((v) => v[0] == pair.row && v[1] == pair.col) != -1
    );
  };

  const isMatchCell = (pair) => {
    return solveBoard[pair.row][pair.col] == curBoardValue[pair.row][pair.col];
  };

  const checkValid = (pair) => {
    return (
      !isEnemyCell(pair) &&
      pair.row >= 0 &&
      pair.row < 9 &&
      pair.col >= 0 &&
      pair.col < 9 &&
      !isMatchCell(pair) &&
      (!firstBoardValue[pair.row][pair.col] || isUserCell(pair))
    );
  };

  const sayHello = useCallback(
    debounce((curSelectCell, value) => {
      const newCurUserMoves = JSON.parse(JSON.stringify(curUserMoves));
      const isExistCell = newCurUserMoves.findIndex((v) => {
        return v[0] == curSelectCell.row && v[1] == curSelectCell.col;
      });
      if (isExistCell != -1) {
        newCurUserMoves[isExistCell] = [
          curSelectCell.row,
          curSelectCell.col,
          value,
        ];
      } else {
        newCurUserMoves.push([curSelectCell.row, curSelectCell.col, value]);
      }
      setCurUserMoves(newCurUserMoves);
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("userId", userId);
      formData.append("newCurUserMoves", JSON.stringify(newCurUserMoves));
      submit(formData, {
        method: "post",
        action: `/solo/${roomId}`,
        replace: true,
      });
    }, 1000),
    [selectCell]
  );

  useEffect(() => {
    if (!socket) return;

    const handleKeyDown = (e) => {
      let value = -1;
      setPlusPoint(Math.random() * 10);
      if ("1234567890".includes(e.key)) {
        value = Number.parseInt(e.key, 10);
      } else if (e.key === "Backspace") {
        value = 0;
      } else if (e.key === "ArrowUp") {
        setSelectCell((preState) => ({
          row: (preState.row - 1 + 9) % 9,
          col: preState.col,
        }));
      } else if (e.key === "ArrowLeft") {
        setSelectCell((preState) => ({
          row: preState.row,
          col: (preState.col - 1 + 9) % 9,
        }));
      } else if (e.key === "ArrowRight") {
        setSelectCell((preState) => ({
          row: preState.row,
          col: (preState.col + 1) % 9,
        }));
      } else if (e.key === "ArrowDown") {
        setSelectCell((preState) => ({
          row: (preState.row + 1) % 9,
          col: preState.col,
        }));
      }

      if (!e.repeat && checkValid(selectCell) && value !== -1) {
        const newBoardValue = JSON.parse(JSON.stringify(curBoardValue));
        newBoardValue[selectCell.row][selectCell.col] = value;
        setCurBoardValue(newBoardValue);
        socket.emit("play", newBoardValue);
        sayHello(selectCell, value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, curBoardValue, selectCell, checkValid]);

  useEffect(() => {
    const updateCanArray = () => {
      let newCanRowXNumberY = new Array(9)
        .fill(0)
        .map(() => new Array(10).fill(0));
      let newCanColXNumberY = new Array(9)
        .fill(0)
        .map(() => new Array(10).fill(0));
      let newCanSquareXYNumberZ = new Array(3)
        .fill(0)
        .map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)));
      for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
          if (curBoardValue[i][j] === 0) continue;
          newCanRowXNumberY[i][curBoardValue[i][j]] += 1;
          newCanColXNumberY[j][curBoardValue[i][j]] += 1;
          newCanSquareXYNumberZ[(i / 3) >> 0][(j / 3) >> 0][
            curBoardValue[i][j]
          ] += 1;
        }
      }

      setCanRowXNumberY(newCanRowXNumberY);
      setCanColXNumberY(newCanColXNumberY);
      setCanSquareXYNumberZ(newCanSquareXYNumberZ);
    };
    updateCanArray();
  }, [curBoardValue]);

  useEffect(() => {
    if (!socket) return;
    socket.on("play", (boardValue) => {
      setCurBoardValue(boardValue);
    });
    socket.on("usersInRoom", (users) => {
      console.log(users, "LA CHI TROI");
      setUsersInRoom(users);
    });
  }, [socket]);

  return (
    <div className="sudoku-wrapper">
      <div className="score-wrapper">
        {usersInRoom.map((userInRoom) => (
          <Score
            key={userInRoom}
            userId={userInRoom}
            score={score}
            plusPoint={plusPoint}
          />
        ))}
      </div>
      <div className="game-flex-wrapper">
        <div className="game-wrapper">
          <div className="game">
            <table className="game-table">
              <tbody>
                {curBoardValue.map((row, idx) => (
                  <tr key={idx} className="game-row">
                    {row.map((val, idx2) => {
                      return (
                        <Cell
                          isEnemy={isEnemyCell({ row: idx, col: idx2 })}
                          isUserCell={isUserCell({ row: idx, col: idx2 })}
                          selectCell={selectCell}
                          setSelectCell={setSelectCell}
                          cellIdx={{ row: idx, col: idx2 }}
                          cellVal={val}
                          key={idx2}
                          isConflictRow={canRowXNumberY[idx][val] > 1}
                          isConflictCol={canColXNumberY[idx2][val] > 1}
                          isConflictSquare={
                            canSquareXYNumberZ[(idx / 3) >> 0][(idx2 / 3) >> 0][
                              val
                            ] > 1
                          }
                          isDefault={firstBoardValue[idx][idx2] !== 0}
                          isSameValue={
                            curBoardValue[selectCell.row][selectCell.col] &&
                            curBoardValue[selectCell.row][selectCell.col] ===
                              val
                          }
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cell = ({
  setSelectCell,
  selectCell,
  cellIdx,
  cellVal,
  isConflictRow,
  isConflictCol,
  isConflictSquare,
  isDefault,
  isSameValue,
  isUserCell,
  isEnemy,
}) => {
  const isSelecting =
    selectCell.row === cellIdx.row && selectCell.col === cellIdx.col;
  const selectedCellClass = isSelecting ? " cell-selected " : "";

  const isSameRow = selectCell.row === cellIdx.row;
  const isSameCol = selectCell.col === cellIdx.col;
  const isSameSquare =
    (selectCell.row / 3) >> 0 === (cellIdx.row / 3) >> 0 &&
    (selectCell.col / 3) >> 0 === (cellIdx.col / 3) >> 0;

  const hightLightCellClass =
    isSameRow || isSameCol || isSameSquare || isSameValue
      ? " table-hightlight "
      : "";
  const numerHightLightClass = isSameValue ? " number-hightlight " : "";

  const isNumber = !isDefault && cellVal !== 0;
  const numberClass = isNumber ? " number " : "";

  const conflictCellClass =
    isConflictCol || isConflictRow || isConflictSquare
      ? " number-conflict "
      : "";

  const conflictValueClass =
    (isConflictCol || isConflictRow || isConflictSquare) && !isDefault
      ? " default-conflict "
      : "";

  const isUserClass = isUserCell ? " user-cell " : "";
  const isEnemyClass = isEnemy ? " enemy-cell " : "";
  /**
   *
   */
  const handleSelectCell = () => {
    setSelectCell(cellIdx);
  };

  return (
    <>
      <td
        className={
          `game-cell` +
          isEnemyClass +
          isUserClass +
          selectedCellClass +
          hightLightCellClass +
          numberClass +
          conflictCellClass +
          numerHightLightClass
        }
        onClick={() => handleSelectCell()}
      >
        <div className={`cell-value` + conflictValueClass}>
          <span>{`${cellVal || ""}`}</span>
        </div>
      </td>
    </>
  );
};

export default BoardGame;
