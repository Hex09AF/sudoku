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
import { gameMachine } from "~/machine/game";
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
  const [gameState, send] = useMachine(gameMachine, {
    context: {
      players: initGameMoves,
      board: initBoard,
      solveBoard,
      selectCell: { row: 4, col: 4 },
      canRowXNumberY: new Array(9).fill(0).map(() => new Array(10).fill(0)),
      canColXNumberY: new Array(9).fill(0).map(() => new Array(10).fill(0)),
      canSquareXYNumberZ: new Array(3)
        .fill(0)
        .map(() => new Array(3).fill(0).map(() => new Array(10).fill(0))),
    },
  });

  const submit = useSubmit();

  const [usersInRoom, setUsersInRoom] = useState(
    initGameMoves.filter((v) => v.userId == userId)
  );

  const curUser = useMemo(
    () => usersInRoom.find((v) => v.userId === userId),
    [usersInRoom, userId]
  );

  const isPlay = useMemo(() => {
    const readyUsers = usersInRoom.filter((v) => v.status === "READY");
    return readyUsers.length === usersInRoom.length;
  }, [usersInRoom]);

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
    [gameState.context.selectCell]
  );

  const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
    const newBoardValue = JSON.parse(JSON.stringify(gameState.context.board));
    newBoardValue[pair.row][pair.col] = value;

    socket?.emit(SocketEvent.CLIENT_PLAY, { pair, value, userPlayId });

    const curInfo = JSON.parse(
      JSON.stringify(
        gameState.context.players.find((v) => v.userId == userPlayId)
      )
    ) as GameMove;

    if (curInfo) {
      if (solveBoard[pair.row][pair.col] == value) {
        curInfo.plus = 50;
        curInfo.score += 50;
      } else {
        curInfo.plus = -100;
        curInfo.score += -100;
      }

      const isExistCell = curInfo.moves.findIndex((v: number[]) => {
        return v[0] == pair.row && v[1] == pair.col;
      });
      if (isExistCell != -1) {
        curInfo.moves[isExistCell] = [pair.row, pair.col, value];
      } else {
        curInfo.moves.push([pair.row, pair.col, value]);
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
    } else {
      const arrowMap = {
        ArrowUp: { row: -1, col: 0 },
        ArrowLeft: { row: 0, col: -1 },
        ArrowRight: { row: 0, col: 1 },
        ArrowDown: { row: 1, col: 0 },
      };
      const mapping = arrowMap[e.key as keyof typeof arrowMap];
      if (mapping) {
        send({
          type: "MOVE",
          pair: {
            row: (gameState.context.selectCell.row + mapping.row + 9) % 9,
            col: (gameState.context.selectCell.col + mapping.col + 9) % 9,
          },
        });
      }
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
        gameState.context.board,
        gameState.context.selectCell
      )
    ) {
      makeMove(gameState.context.selectCell, value, userId);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleUpdateBoard = (boardValue: Board) => {
      send({ type: "UPDATE", board: boardValue });
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
  }, [socket, send]);

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

    socket?.emit(SocketEvent.CLIENT_UPDATE_CLIENT_STATUS, {
      userInfo: {
        userId: userId,
        status: "PLAYING",
      },
      roomId,
    });
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
                  {gameState.context.board.map((row, idx) => (
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
                              gameState.context.board,
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
                            selectCell={gameState.context.selectCell}
                            setSelectCell={(pair: Pair) => {
                              send({ type: "MOVE", pair });
                            }}
                            cellIdx={{ row: idx, col: idx2 }}
                            cellVal={initGameStatus === "START" ? val : 0}
                            key={idx * 10 + idx2}
                            isConflictRow={
                              gameState.context.canRowXNumberY[idx][val] > 1
                            }
                            isConflictCol={
                              gameState.context.canColXNumberY[idx2][val] > 1
                            }
                            isConflictSquare={
                              gameState.context.canSquareXYNumberZ[
                                (idx / 3) >> 0
                              ][(idx2 / 3) >> 0][val] > 1
                            }
                            isDefault={initBoard[idx][idx2] !== 0}
                            isSameValue={
                              !!gameState.context.board[
                                gameState.context.selectCell.row
                              ][gameState.context.selectCell.col] &&
                              gameState.context.board[
                                gameState.context.selectCell.row
                              ][gameState.context.selectCell.col] === val
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
