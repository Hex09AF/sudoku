import { useSubmit } from "@remix-run/react";
import debounce from "lodash.debounce";
import { SetStateAction, useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import type { Board } from "~/declares/interaces/Board";
import type { GameMove } from "~/declares/interaces/GameMove";
import type { RoomId, UserId } from "~/declares/interaces/Id";
import type { Pair } from "~/declares/interaces/Pair";
import { checkValid, isEnemyCell, isMatchCell, isUserCell } from "~/utils/game";
import Score from "../Score";
import Cell from "./Cell";
import CountDown from "./CountDown";

type BoardGameProps = {
  solveBoard: Board;
  initBoard: Board;
  userId: UserId;
  roomId: RoomId;
  socket?: Socket;

  initGameMoves: GameMove[];
};

const BoardGame = ({
  solveBoard,
  initBoard,
  roomId,
  userId,
  socket,
  initGameMoves,
}: BoardGameProps) => {
  const submit = useSubmit();
  const sudokuWrapperRef = useRef<HTMLDivElement>(null);

  const [isGameStart, setIsGameStart] = useState(false);

  // Info of the first person enter the room will be the init value
  const [gameMoves, setGameMoves] = useState(
    initGameMoves.filter((v) => v.userId == userId)
  );

  const [selectCell, setSelectCell] = useState<Pair>({ row: 4, col: 4 });

  const [curBoard, setCurBoard] = useState(initBoard);

  const [firstBoard] = useState(initBoard);

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

    const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
      setCurBoard((preState) => {
        const newBoardValue = JSON.parse(JSON.stringify(preState));
        newBoardValue[selectCell.row][selectCell.col] = value;
        socket.emit("play", newBoardValue);
        return newBoardValue;
      });
      setGameMoves((preState) => {
        const curInfo = preState.find((v) => v.userId == userId);

        if (curInfo) {
          if (solveBoard[selectCell.row][selectCell.col] == value) {
            curInfo.plus = 50;
            curInfo.score += 50;
          } else {
            curInfo.plus = -100;
            curInfo.score += -100;
          }

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
    };

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

      if (
        !e.repeat &&
        checkValid(
          value,
          gameMoves,
          userId,
          initBoard,
          solveBoard,
          curBoard,
          selectCell
        ) &&
        value !== -1
      ) {
        makeMove(selectCell, value, userId);
      }
    };
    currentSudokuRef?.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      if (currentSudokuRef)
        currentSudokuRef?.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    roomId,
    sayHello,
    socket,
    isGameStart,
    gameMoves,
    initBoard,
    curBoard,
    solveBoard,
    userId,
    sudokuWrapperRef,
    selectCell,
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
          if (curBoard[i][j] === 0) continue;
          newCanRowXNumberY[i][curBoard[i][j]] += 1;
          newCanColXNumberY[j][curBoard[i][j]] += 1;
          newCanSquareXYNumberZ[(i / 3) >> 0][(j / 3) >> 0][
            curBoard[i][j]
          ] += 1;
        }
      }

      setCanRowXNumberY(newCanRowXNumberY);
      setCanColXNumberY(newCanColXNumberY);
      setCanSquareXYNumberZ(newCanSquareXYNumberZ);
    };
    updateCanArray();
  }, [curBoard]);

  useEffect(() => {
    if (!socket) return;
    socket.on("play", (boardValue) => {
      setCurBoard(boardValue);
    });
    socket.on("updateClientInfo", ({ userInfo }) => {
      setGameMoves((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.moves = userInfo.moves;
          curUser.plus = userInfo.plus;
          curUser.score = userInfo.score;
          curUser.status = userInfo.status;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });
    });
    socket.on("updateClientInfoStatus", ({ userInfo }) => {
      setGameMoves((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.status = userInfo.status;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });
    });
    socket.on("removeClientInfo", ({ userInfo }) => {
      setGameMoves((preUsers) => {
        const newUsers = preUsers.filter((v) => v.userId != userInfo.userId);
        return JSON.parse(JSON.stringify(newUsers));
      });
    });

    socket.on("addClientInfo", ({ usersInfo }) => {
      setGameMoves(usersInfo);
    });
  }, [socket]);

  const curUser = gameMoves.find((v) => v.userId === userId);

  const isPlay = useMemo(() => {
    const readyUsers = gameMoves.filter((v) => v.status === "READY");
    return readyUsers.length === gameMoves.length;
  }, [gameMoves]);

  const onFinish = () => {
    if (gameMoves[0].userId === userId) {
    }
    setIsGameStart(true);
  };

  return (
    <div className="sudoku-wrapper" ref={sudokuWrapperRef} tabIndex={-1}>
      <div className="score-wrapper">
        {gameMoves.map((userInRoom) => (
          <Score
            isUser={userInRoom.userId == userId}
            key={userInRoom.userId}
            score={userInRoom.score}
            plusPoint={userInRoom.plus || 0}
            status={userInRoom.status}
          />
        ))}
      </div>

      <div className="game-info">
        {!isGameStart && (
          <div className="start-button-c">
            <button
              className="start-button"
              type="button"
              onClick={() => {
                socket?.emit("updateStatus", {
                  userInfo: {
                    userId,
                    status: curUser?.status === "READY" ? "NOT_READY" : "READY",
                  },
                  roomId,
                });
              }}
              disabled={gameMoves.length < 2}
            >
              {gameMoves.length < 2
                ? "Wait for another player to start.."
                : curUser?.status === "READY"
                ? "Remove ready"
                : "Ready"}
            </button>
          </div>
        )}
        <div className="game-flex-wrapper">
          {isPlay && gameMoves.length >= 2 && <CountDown onFinish={onFinish} />}
          <div className="game-wrapper">
            <div className="game">
              <table className="game-table">
                <tbody>
                  {curBoard.map((row, idx) => (
                    <tr key={idx} className="game-row">
                      {row.map((val, idx2) => {
                        return (
                          <Cell
                            isEnemy={isEnemyCell(gameMoves, userId, {
                              row: idx,
                              col: idx2,
                            })}
                            isMatchCell={isMatchCell(solveBoard, curBoard, {
                              row: idx,
                              col: idx2,
                            })}
                            isUserCell={isUserCell(gameMoves, userId, {
                              row: idx,
                              col: idx2,
                            })}
                            selectCell={selectCell}
                            setSelectCell={setSelectCell}
                            cellIdx={{ row: idx, col: idx2 }}
                            cellVal={isGameStart ? val : 0}
                            key={idx * 10 + idx2}
                            isConflictRow={canRowXNumberY[idx][val] > 1}
                            isConflictCol={canColXNumberY[idx2][val] > 1}
                            isConflictSquare={
                              canSquareXYNumberZ[(idx / 3) >> 0][
                                (idx2 / 3) >> 0
                              ][val] > 1
                            }
                            isDefault={firstBoard[idx][idx2] !== 0}
                            isSameValue={
                              !!curBoard[selectCell.row][selectCell.col] &&
                              curBoard[selectCell.row][selectCell.col] === val
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
    </div>
  );
};

export default BoardGame;
