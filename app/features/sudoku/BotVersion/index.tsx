import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import Confetti from "~/assets/svg/Confetti";
import ConfettiMedium from "~/assets/svg/ConfettiMedium";
import ConfettiSlow from "~/assets/svg/ConfettiSlow";
import { Button } from "~/comps/Button";
import { gameMachine } from "~/features/sudoku/machine/game";
import type { Board } from "~/utils/declares/interfaces/Board";
import type { GameMove } from "~/utils/declares/interfaces/GameMove";
import type { RoomId, UserId } from "~/utils/declares/interfaces/Id";
import type { Pair } from "~/utils/declares/interfaces/Pair";
import {
  SUDOKU_EVENT,
  SUDOKU_STATE,
} from "~/utils/declares/sudoku-machine/sudoku.machine.type";
import {
  checkValid,
  getCellUserId,
  isEnemyCell,
  isMatchCell,
  isUserCell,
  randBetween,
} from "~/utils/game";
import Cell from "../Cell/Index";
import Score from "../Score";

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
      winner: null,
      cellAnimateMap: new Map(),
    },
  });

  const [isGameStart, setIsGameStart] = useState(false);

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
          type: SUDOKU_EVENT.move,
          pair: {
            row: (gameState.context.selectCell.row + mapping.row + 9) % 9,
            col: (gameState.context.selectCell.col + mapping.col + 9) % 9,
          },
        });
      }
    }

    if (
      !e.repeat &&
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
      send({
        type: SUDOKU_EVENT.fill,
        pair: gameState.context.selectCell,
        value,
        userPlayId: userId,
      });
    }
  };

  useEffect(() => {
    if (gameState.matches(SUDOKU_STATE.ending)) return;
    if (!isGameStart) return;

    const botPlay = setInterval(() => {
      let canMoves: Pair[] = [];

      for (let rowIdx = 0; rowIdx < 9; ++rowIdx) {
        for (let colIdx = 0; colIdx < 9; ++colIdx) {
          if (
            gameState.context.board[rowIdx][colIdx] !==
            gameState.context.solveBoard[rowIdx][colIdx]
          ) {
            canMoves.push({ row: rowIdx, col: colIdx });
          }
        }
      }

      const { row, col } = canMoves[randBetween(0, canMoves.length - 1)];
      let isCorrect = randBetween(1, 10) <= 7;
      const value = isCorrect
        ? gameState.context.solveBoard[row][col]
        : randBetween(1, 9);

      if (
        checkValid(
          value,
          gameState.context.players,
          "BOT_LOCAL_ID",
          initBoard,
          solveBoard,
          gameState.context.board,
          { row, col }
        )
      ) {
        send({
          type: SUDOKU_EVENT.fill,
          pair: { row, col },
          value,
          userPlayId: "BOT_LOCAL_ID",
        });
      }
    }, 1000);

    return () => {
      clearInterval(botPlay);
    };
  }, [gameState, solveBoard, initBoard, send, isGameStart]);

  return (
    <div className="sudoku-wrapper" tabIndex={-1} onKeyDown={handleKeyDown}>
      <div className="score-wrapper">
        {gameState.context.players.map((userInRoom) => (
          <Score
            socketStatus=""
            winner={gameState.context.winner}
            userId={userInRoom.userId}
            isUser={userInRoom.userId == userId}
            key={userInRoom.userId}
            score={userInRoom.score}
            plusPoint={userInRoom.plus || 0}
            status={""}
          />
        ))}
        {!isGameStart && (
          <div className="start-button-c">
            <Button
              className="start-button"
              type="button"
              onClick={() => {
                setIsGameStart(true);
              }}
            >
              Play with bot
            </Button>
          </div>
        )}
      </div>

      <div className="game-info">
        <div className="game-flex-wrapper">
          <div className="game-wrapper">
            <div className="game">
              <table className="game-table">
                <tbody>
                  {gameState.context.board.map((row, idx) => (
                    <tr key={idx} className="game-row">
                      {row.map((val, idx2) => {
                        return (
                          <Cell
                            cellAnimateClass={
                              gameState.context.cellAnimateMap.get(
                                idx * 10 + idx2
                              ) || ""
                            }
                            isHightLight={gameState.matches(
                              SUDOKU_STATE.playing
                            )}
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
                              send({ type: SUDOKU_EVENT.move, pair });
                            }}
                            cellIdx={{ row: idx, col: idx2 }}
                            cellVal={isGameStart ? val : 0}
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
            {gameState.matches(SUDOKU_STATE.ending) && (
              <div className="game-win-scence">
                <div className="game-win-confetti">
                  <Confetti />
                </div>
                <div className="game-win-confetti confetti-medium">
                  <ConfettiMedium />
                </div>
                <div className="game-win-confetti confetti-slow">
                  <ConfettiSlow />
                </div>
              </div>
            )}
          </div>
          <div className="game-intro">
            <p>🕹️ Play with arrow ⬅️ ➡️ ⬆️ ⬇️ and number keys 🔢</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardGame;
