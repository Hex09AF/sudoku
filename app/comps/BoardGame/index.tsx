import { useSubmit } from "@remix-run/react";
import { useMachine } from "@xstate/react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";
import type { Board } from "~/declares/interfaces/Board";
import type { GameMove } from "~/declares/interfaces/GameMove";
import type { RoomId, UserId } from "~/declares/interfaces/Id";
import type { Pair } from "~/declares/interfaces/Pair";
import { SocketEvent } from "~/declares/interfaces/Socket";
import type { UserInfoStatus, UserInRoom } from "~/declares/interfaces/Socket";
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

  const [usersInRoom, setUsersInRoom] = useState(
    initGameMoves.filter((v) => v.userId == userId)
  );

  const postGameMoves = useCallback(
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
    }, 650),
    [boardState.context.selectCell]
  );

  const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
    const newBoardValue = JSON.parse(JSON.stringify(boardState.context.board));
    newBoardValue[boardState.context.selectCell.row][
      boardState.context.selectCell.col
    ] = value;

    socket?.emit(SocketEvent.CLIENT_PLAY, newBoardValue);

    const curInfo = JSON.parse(
      JSON.stringify(gameState.context.players.find((v) => v.userId == userId))
    ) as GameMove;

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
      socket?.emit(SocketEvent.CLIENT_UPDATE_CLIENT, {
        userInfo: curInfo,
        roomId,
      });
      postGameMoves({ moves: curInfo.moves, score: curInfo.score });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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

  useEffect(() => {
    if (!socket) return;
    const handleUpdateBoard = (boardValue: Board) => {
      boardSend({ type: "UPDATE", board: boardValue });
    };

    const handleUpdateClientInfo = ({ userInfo }: { userInfo: GameMove }) => {
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
    const handleUpdateStatus = ({ userInfo }: { userInfo: UserInfoStatus }) => {
      setUsersInRoom((preUsers) => {
        const curUser = preUsers.find((user) => user.userId == userInfo.userId);
        if (curUser) {
          curUser.status = userInfo.status;
        }
        return JSON.parse(JSON.stringify(preUsers));
      });
    };
    const handleRemoveClient = ({ userInfo }: { userInfo: UserInRoom }) => {
      setUsersInRoom((preUsers) => {
        const newUsers = preUsers.filter((v) => v.userId != userInfo.userId);
        return JSON.parse(JSON.stringify(newUsers));
      });
    };
    const handleAddClient = ({ usersInfo }: { usersInfo: GameMove[] }) => {
      setUsersInRoom((preUsers) => {
        if (preUsers.length > usersInfo.length) return preUsers;
        return usersInfo;
      });
    };

    socket.on(SocketEvent.SERVER_CLIENT_PLAY, handleUpdateBoard);
    socket.on(SocketEvent.SERVER_UPDATE_CLIENT, handleUpdateClientInfo);
    socket.on(SocketEvent.SERVER_UPDATE_CLIENT_STATUS, handleUpdateStatus);
    socket.on(SocketEvent.SERVER_REMOVE_CLIENT, handleRemoveClient);
    socket.on(SocketEvent.SERVER_ADD_CLIENT, handleAddClient);
    return () => {
      socket.off(SocketEvent.SERVER_CLIENT_PLAY, handleUpdateBoard);
      socket.off(SocketEvent.SERVER_UPDATE_CLIENT, handleUpdateClientInfo);
      socket.off(SocketEvent.SERVER_UPDATE_CLIENT_STATUS, handleUpdateStatus);
      socket.off(SocketEvent.SERVER_REMOVE_CLIENT, handleRemoveClient);
      socket.off(SocketEvent.SERVER_ADD_CLIENT, handleAddClient);
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
    const readyUsers = JSON.parse(
      JSON.stringify(usersInRoom.filter((v) => v.status === "READY"))
    ) as GameMove[];
    formData.append(
      "readyUsers",
      JSON.stringify(readyUsers.map((v) => v.userId))
    );

    for (const user of readyUsers) {
      if (user.userId === userId) {
        socket?.emit(SocketEvent.CLIENT_UPDATE_CLIENT_STATUS, {
          userInfo: {
            userId: user.userId,
            status: "PLAYING",
          },
          roomId,
        });
      }
    }
    submit(formData, {
      method: "post",
      action: `/solo/${roomId}`,
      replace: true,
    });
    send({
      type: "GAME.UPDATE.ALL",
      usersInfo: readyUsers.map((v) => ({ ...v, status: "PLAYING" })),
    });
  };

  return (
    <div className="sudoku-wrapper" tabIndex={-1} onKeyDown={handleKeyDown}>
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
                socket?.emit(SocketEvent.CLIENT_UPDATE_CLIENT_STATUS, {
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
