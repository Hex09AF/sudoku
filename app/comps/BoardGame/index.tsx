import { useSubmit } from "@remix-run/react";
import { useMachine } from "@xstate/react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import type { Board } from "~/declares/interaces/Board";
import type { GameMove } from "~/declares/interaces/GameMove";
import type { RoomId, UserId } from "~/declares/interaces/Id";
import type { Pair } from "~/declares/interaces/Pair";
import { createBoardMachine, createGameMachine } from "~/machine/game";
import {
  checkValid,
  getCellUserId,
  isEnemyCell,
  isMatchCell,
  isUserCell,
} from "~/utils/game";
import Score from "../Score";
import Cell from "./Cell";
import CountDown from "./CountDown";

type BoardGameProps = {
  initGameStatus: string;
  solveBoard: Board;
  initBoard: Board;
  userId: UserId;
  roomId: RoomId;
  socket?: Socket;

  initGameMoves: GameMove[];
};

const BoardGame = ({
  initGameStatus,
  solveBoard,
  initBoard,
  roomId,
  userId,
  socket,
  initGameMoves,
}: BoardGameProps) => {
  const [gameState, send] = useMachine(createGameMachine({ initGameMoves }));

  const [boardState, boardSend] = useMachine(
    createBoardMachine({ board: initBoard, solveBoard })
  );

  const submit = useSubmit();
  const sudokuWrapperRef = useRef<HTMLDivElement>(null);

  const [usersInRoom, setUsersInRoom] = useState(
    initGameMoves.filter((v) => v.userId == userId)
  );

  const sayHello = useCallback(
    debounce(({ moves, score }) => {
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("userId", userId);
      formData.append("newCurUserMoves", JSON.stringify(moves));
      formData.append("newScore", JSON.stringify(score));
      formData.append("intent", "updateGameMoves");
      submit(formData, {
        method: "post",
        action: `/solo/${roomId}`,
        replace: true,
      });
    }, 1000),
    [boardState.context.selectCell]
  );

  useEffect(() => {
    if (!socket) return;
    if (sudokuWrapperRef === null) return;
    const currentSudokuRef = sudokuWrapperRef.current;

    const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
      boardSend({ type: "FILL", value });
      const newBoardValue = JSON.parse(
        JSON.stringify(boardState.context.board)
      );
      newBoardValue[boardState.context.selectCell.row][
        boardState.context.selectCell.col
      ] = value;
      socket.emit("play", newBoardValue);
      send({
        type: "GAME.FILL",
        value: {
          solveBoard,
          selectCell: boardState.context.selectCell,
          userId,
        },
      });
      const curInfo = gameState.context.players.find((v) => v.userId == userId);

      if (curInfo) {
        if (
          solveBoard[boardState.context.selectCell.row][
            boardState.context.selectCell.col
          ] == value
        ) {
          curInfo.plus = 50;
          curInfo.score += 50;
        } else {
          curInfo.plus = -100;
          curInfo.score += -100;
        }

        const isExistCell = curInfo.moves.findIndex((v: number[]) => {
          return (
            v[0] == boardState.context.selectCell.row &&
            v[1] == boardState.context.selectCell.col
          );
        });
        if (isExistCell != -1) {
          curInfo.moves[isExistCell] = [
            boardState.context.selectCell.row,
            boardState.context.selectCell.col,
            value,
          ];
        } else {
          curInfo.moves.push([
            boardState.context.selectCell.row,
            boardState.context.selectCell.col,
            value,
          ]);
        }
        sayHello({ moves: curInfo.moves, score: curInfo.score });
        socket.emit("updateInfo", { userInfo: curInfo, roomId });
      }
      setUsersInRoom((preState) => {
        const curInfo = preState.find((v) => v.userId == userId);

        if (curInfo) {
          if (
            solveBoard[boardState.context.selectCell.row][
              boardState.context.selectCell.col
            ] == value
          ) {
            curInfo.plus = 50;
            curInfo.score += 50;
          } else {
            curInfo.plus = -100;
            curInfo.score += -100;
          }

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
        boardSend({
          type: "MOVE",
          pair: {
            row: (boardState.context.selectCell.row - 1 + 9) % 9,
            col: boardState.context.selectCell.col,
          },
        });
      } else if (e.key === "ArrowLeft") {
        boardSend({
          type: "MOVE",
          pair: {
            row: boardState.context.selectCell.row,
            col: (boardState.context.selectCell.col - 1 + 9) % 9,
          },
        });
      } else if (e.key === "ArrowRight") {
        boardSend({
          type: "MOVE",
          pair: {
            row: boardState.context.selectCell.row,
            col: (boardState.context.selectCell.col + 1) % 9,
          },
        });
      } else if (e.key === "ArrowDown") {
        boardSend({
          type: "MOVE",
          pair: {
            row: (boardState.context.selectCell.row + 1) % 9,
            col: boardState.context.selectCell.col,
          },
        });
      }

      if (
        !e.repeat &&
        initGameStatus === "START" &&
        value !== -1 &&
        checkValid(
          value,
          gameState.context.players,
          userId,
          initBoard,
          solveBoard,
          boardState.context.board,
          boardState.context.selectCell
        )
      ) {
        makeMove(boardState.context.selectCell, value, userId);
      }
    };
    currentSudokuRef?.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      if (currentSudokuRef)
        currentSudokuRef?.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    send,
    boardSend,
    boardState,
    gameState,
    roomId,
    sayHello,
    socket,
    initGameStatus,
    initBoard,
    solveBoard,
    userId,
    sudokuWrapperRef,
  ]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdateBoard = (boardValue) => {
      boardSend({ type: "UPDATE", board: boardValue });
    };

    const handleUpdateClientInfo = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.moves = userInfo.moves;
          curUser.plus = userInfo.plus;
          curUser.score = userInfo.score;
          curUser.status = userInfo.status;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });

      send({ type: "GAME.UPDATE", userInfo });
    };
    const handleUpdateStatus = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.status = userInfo.status;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });
    };
    const handleRemoveClient = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        const newUsers = preUsers.filter((v) => v.userId != userInfo.userId);
        return JSON.parse(JSON.stringify(newUsers));
      });
    };
    const handleAddClient = ({ usersInfo }) => {
      setUsersInRoom((preUsers) => {
        if (preUsers.length > usersInfo.length) return preUsers;
        return usersInfo;
      });
    };

    socket.on("play", handleUpdateBoard);
    socket.on("updateClientInfo", handleUpdateClientInfo);
    socket.on("updateClientInfoStatus", handleUpdateStatus);
    socket.on("removeClientInfo", handleRemoveClient);
    socket.on("addClientInfo", handleAddClient);
    return () => {
      socket.off("play", handleUpdateBoard);
      socket.off("updateClientInfo", handleUpdateClientInfo);
      socket.off("updateClientInfoStatus", handleUpdateStatus);
      socket.off("removeClientInfo", handleRemoveClient);
      socket.off("addClientInfo", handleAddClient);
    };
  }, [socket, boardSend, send]);

  const curUser = usersInRoom.find((v) => v.userId === userId);

  const isPlay = useMemo(() => {
    const readyUsers = usersInRoom.filter((v) => v.status === "READY");
    return readyUsers.length === usersInRoom.length;
  }, [usersInRoom]);

  const onFinish = () => {
    const formData = new FormData();
    formData.append("intent", "updateGameStatus");
    formData.append("roomId", roomId);
    formData.append("gameStatus", "START");
    const readyUsers = usersInRoom.filter((v) => v.status === "READY");
    formData.append(
      "readyUsers",
      JSON.stringify(readyUsers.map((v) => v.userId))
    );
    for (const user of readyUsers) {
      socket?.emit("updateStatus", {
        userInfo: {
          userId: userId,
          status: "PLAYING",
        },
        roomId,
      });
      user.status = "PLAYING";
    }
    send({ type: "GAME.UPDATE.ALL", usersInfo: readyUsers });
    submit(formData, {
      method: "post",
      action: `/solo/${roomId}`,
      replace: true,
    });
  };

  return (
    <div className="sudoku-wrapper" ref={sudokuWrapperRef} tabIndex={-1}>
      <div className="score-wrapper">
        {usersInRoom.map((userInRoom) => (
          <Score
            userId={userInRoom.userId}
            isUser={userInRoom.userId == userId}
            key={userInRoom.userId}
            score={userInRoom.score}
            plusPoint={userInRoom.plus || 0}
            status={userInRoom.status}
          />
        ))}
      </div>

      <div className="game-info">
        {initGameStatus === "READY" && (
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
              disabled={usersInRoom.length < 2}
            >
              {usersInRoom.length < 2
                ? "Wait for another player to start.."
                : curUser?.status === "READY"
                ? "Remove ready"
                : "Ready"}
            </button>
          </div>
        )}
        <div className="game-flex-wrapper">
          {isPlay && usersInRoom.length >= 2 && initGameStatus === "READY" && (
            <CountDown onFinish={onFinish} />
          )}
          <div className="game-wrapper">
            <div className="game">
              <table className="game-table">
                <tbody>
                  {boardState.context.board.map((row, idx) => (
                    <tr key={idx} className="game-row">
                      {row.map((val, idx2) => {
                        return (
                          <Cell
                            userId={getCellUserId(gameState.context.players, {
                              row: idx,
                              col: idx2,
                            })}
                            isEnemy={isEnemyCell(
                              gameState.context.players,
                              userId,
                              {
                                row: idx,
                                col: idx2,
                              }
                            )}
                            isMatchCell={isMatchCell(
                              solveBoard,
                              boardState.context.board,
                              {
                                row: idx,
                                col: idx2,
                              }
                            )}
                            isUser={isUserCell(
                              gameState.context.players,
                              userId,
                              {
                                row: idx,
                                col: idx2,
                              }
                            )}
                            selectCell={boardState.context.selectCell}
                            setSelectCell={(pair: Pair) => {
                              boardSend({ type: "MOVE", pair });
                            }}
                            cellIdx={{ row: idx, col: idx2 }}
                            cellVal={initGameStatus === "START" ? val : 0}
                            key={idx * 10 + idx2}
                            isConflictRow={
                              boardState.context.canRowXNumberY[idx][val] > 1
                            }
                            isConflictCol={
                              boardState.context.canColXNumberY[idx2][val] > 1
                            }
                            isConflictSquare={
                              boardState.context.canSquareXYNumberZ[
                                (idx / 3) >> 0
                              ][(idx2 / 3) >> 0][val] > 1
                            }
                            isDefault={initBoard[idx][idx2] !== 0}
                            isSameValue={
                              !!boardState.context.board[
                                boardState.context.selectCell.row
                              ][boardState.context.selectCell.col] &&
                              boardState.context.board[
                                boardState.context.selectCell.row
                              ][boardState.context.selectCell.col] === val
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
