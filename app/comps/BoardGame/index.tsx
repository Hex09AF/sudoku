import { useSubmit } from "@remix-run/react";
import debounce from "lodash.debounce";
import type { SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import Score from "../Score";

type Pair = {
  row: number;
  col: number;
};

type UserMove = {
  moves: number[][];
  userId: string;
  score: number;
  plus?: number;
};

type BoardGameProps = {
  solveBoard: number[][];
  boardData: number[][];
  roomId: string;
  userId: string;
  socket?: Socket;
  initMoves: UserMove[];
  // moves: [[posX, posY, value], ...]
};

const BoardGame = ({
  solveBoard,
  boardData,
  roomId,
  userId,
  socket,
  initMoves,
}: BoardGameProps) => {
  const submit = useSubmit();

  const sudokuWrapperRef = useRef<HTMLDivElement>(null);

  const [infoUsersInRoom, setInfoUsersInRoom] = useState(
    initMoves.filter((v) => v.userId == userId)
  );

  const [selectCell, setSelectCell] = useState<Pair>({ row: 4, col: 4 });

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

  const isEnemyCell = (pair: Pair) => {
    let flag = false;
    const usersInfo = infoUsersInRoom.filter((user) => user.userId != userId);
    usersInfo?.forEach((user) => {
      user?.moves?.forEach((move) => {
        if (move[0] == pair.row && move[1] == pair.col) flag = true;
      });
    });
    return flag;
  };

  const isUserCell = (pair: Pair) => {
    let flag = false;
    const userInfo = infoUsersInRoom.find((user) => user.userId == userId);
    userInfo?.moves.forEach((move) => {
      if (move[0] == pair.row && move[1] == pair.col) flag = true;
    });
    return flag;
  };

  const isMatchCell = (pair: Pair) => {
    return solveBoard[pair.row][pair.col] == curBoardValue[pair.row][pair.col];
  };

  const checkValid = (pair: Pair) => {
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
    debounce(({ moves, score }) => {
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("userId", userId);
      formData.append("newCurUserMoves", JSON.stringify(moves));
      formData.append("newScore", JSON.stringify(score));
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
    if (sudokuWrapperRef === null) return;
    const currentSudokuRef = sudokuWrapperRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      let value = -1;
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
        setCurBoardValue((preState) => {
          const newBoardValue = JSON.parse(JSON.stringify(preState));
          newBoardValue[selectCell.row][selectCell.col] = value;
          socket.emit("play", newBoardValue);
          return newBoardValue;
        });
        setInfoUsersInRoom((preState) => {
          const curInfo = preState.find((v) => v.userId == userId);
          console.log("WHATIS GOING ON HERE")
          console.log(curInfo, "BEFORE");
          
          if (curInfo) {
            if (solveBoard[selectCell.row][selectCell.col] == value) {
              curInfo.plus = 50;
              curInfo.score += 50;
            } else {
              curInfo.plus = -100;
              curInfo.score += -100;
            }

            console.log(curInfo, "AFTER")

            const isExistCell = curInfo.moves.findIndex((v: number[]) => {
              return v[0] == selectCell.row && v[1] == selectCell.col;
            });
            if (isExistCell != -1) {
              curInfo.moves[isExistCell] = [
                selectCell.row,
                selectCell.col,
                value,
              ];
            } else {
              curInfo.moves.push([selectCell.row, selectCell.col, value]);
            }
            sayHello({ moves: curInfo.moves, score: curInfo.score });
            socket.emit("updateInfo", { userInfo: curInfo, roomId });
            return JSON.parse(JSON.stringify(preState));
          }
          return preState;
        });
      }
    };
    currentSudokuRef?.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      if (currentSudokuRef)
        currentSudokuRef?.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    sudokuWrapperRef,
    socket,
    curBoardValue,
    selectCell,
    checkValid,
    solveBoard,
  ]);

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
    socket.on("updateClientInfo", ({ userInfo }) => {
      setInfoUsersInRoom((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.moves = userInfo.moves;
          curUser.plus = userInfo.plus;
          curUser.score = userInfo.score;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });
    });
    socket.on("removeClientInfo", ({ userInfo }) => {
      setInfoUsersInRoom((preUsers) => {
        const newUsers = preUsers.filter((v) => v.userId != userInfo.userId);
        return JSON.parse(JSON.stringify(newUsers));
      });
    });
    socket.on("addClientInfo", ({ usersInfo }) => {
      setInfoUsersInRoom(usersInfo);
    });
  }, [socket]);

  return (
    <div className="sudoku-wrapper" ref={sudokuWrapperRef} tabIndex={-1}>
      <div className="score-wrapper">
        {infoUsersInRoom.map((userInRoom) => (
          <Score
            isUser={userInRoom.userId == userId}
            key={userInRoom.userId}
            score={userInRoom.score}
            plusPoint={userInRoom.plus || 0}
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
                          isMatchCell={isMatchCell({ row: idx, col: idx2 })}
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
                            !!curBoardValue[selectCell.row][selectCell.col] &&
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
        <div className="game-intro">
          <p>🕹️ Play with arrow and number keys</p>
        </div>
      </div>
    </div>
  );
};

type CellProps = {
  isEnemy: boolean;
  isUserCell: boolean;
  isSameValue: boolean;
  isDefault: boolean;
  isConflictSquare: boolean;
  setSelectCell: React.Dispatch<SetStateAction<Pair>>;
  selectCell: Pair;
  cellIdx: Pair;
  cellVal: number;
  isConflictRow: boolean;
  isConflictCol: boolean;
  isMatchCell: boolean;
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
  isMatchCell,
}: CellProps) => {
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

  const isNumber = isUserCell || (!isDefault && cellVal !== 0);
  const numberClass = isNumber ? " number " : "";

  const isMatchCellClass = isUserCell && isMatchCell ? " match-cell " : "";
  const isUnMatchCellClas = isUserCell && !isMatchCell;
  const conflictCellClass =
    (isConflictCol || isConflictRow || isConflictSquare || isUnMatchCellClas) &&
    !isMatchCell
      ? " number-conflict "
      : "";

  const conflictValueClass =
    (isConflictCol || isConflictRow || isConflictSquare || isUnMatchCellClas) &&
    (!isDefault || isUserCell) &&
    !isMatchCell
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
          numerHightLightClass +
          isMatchCellClass
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
