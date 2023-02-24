import type { SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import type { Board } from "~/declares/interaces/Board";
import type { GameMove } from "~/declares/interaces/GameMove";
import type { Pair } from "~/declares/interaces/Pair";
import type { UserId } from "~/declares/interaces/Id";
import {
  checkValid,
  isEnemyCell,
  isMatchCell,
  isUserCell,
  randBetween,
} from "~/utils/game";
import Score from "../Score";
import Cell from "./Cell";

type BoardGameProps = {
  solveBoard: Board;
  initBoard: Board;
  userId: UserId;
  initGameMoves: GameMove[];
};

const BoardGame = ({
  solveBoard,
  initBoard,
  userId,
  initGameMoves,
}: BoardGameProps) => {
  const sudokuWrapperRef = useRef<HTMLDivElement>(null);

  const [isGameStart, setIsGameStart] = useState(false);

  const [gameMoves, setGameMoves] = useState(initGameMoves);

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

  useEffect(() => {
    if (!isGameStart) return;
    if (sudokuWrapperRef === null) return;
    const currentSudokuRef = sudokuWrapperRef.current;
    const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
      setCurBoard((preState) => {
        const newBoardValue = JSON.parse(JSON.stringify(preState));
        newBoardValue[pair.row][pair.col] = value;
        return newBoardValue;
      });
      setGameMoves((preState) => {
        const curInfo = preState.find((v) => v.userId == userPlayId);

        if (curInfo) {
          if (value) {
            if (solveBoard[pair.row][pair.col] == value) {
              curInfo.plus = 50;
              curInfo.score += 50;
            } else {
              curInfo.plus = -100;
              curInfo.score += -100;
            }
          } else {
            curInfo.plus = 0;
          }

          const isExistCell = curInfo.moves.findIndex((v: number[]) => {
            return v[0] == pair.row && v[1] == pair.col;
          });
          if (isExistCell != -1) {
            curInfo.moves[isExistCell] = [pair.row, pair.col, value];
          } else {
            curInfo.moves.push([pair.row, pair.col, value]);
          }
          return JSON.parse(JSON.stringify(preState));
        }
        return preState;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
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
    if (!isGameStart) return;

    const makeMove = (pair: Pair, value: number, userPlayId: UserId) => {
      setCurBoard((preState) => {
        const newBoardValue = JSON.parse(JSON.stringify(preState));
        newBoardValue[pair.row][pair.col] = value;
        return newBoardValue;
      });
      setGameMoves((preState) => {
        const curInfo = preState.find((v) => v.userId == userPlayId);

        if (curInfo) {
          if (value) {
            if (solveBoard[pair.row][pair.col] == value) {
              curInfo.plus = 50;
              curInfo.score += 50;
            } else {
              curInfo.plus = -100;
              curInfo.score += -100;
            }
          } else {
            curInfo.plus = 0;
          }

          const isExistCell = curInfo.moves.findIndex((v: number[]) => {
            return v[0] == pair.row && v[1] == pair.col;
          });
          if (isExistCell != -1) {
            curInfo.moves[isExistCell] = [pair.row, pair.col, value];
          } else {
            curInfo.moves.push([pair.row, pair.col, value]);
          }
          return JSON.parse(JSON.stringify(preState));
        }
        return preState;
      });
    };

    const xyz = setInterval(() => {
      const row = randBetween(0, 8);
      const col = randBetween(0, 8);
      let isCorrect = randBetween(1, 10) <= 5;
      const value = isCorrect ? solveBoard[row][col] : randBetween(1, 9);
      if (
        checkValid(
          value,
          gameMoves,
          "BOT_LOCAL_ID",
          initBoard,
          solveBoard,
          curBoard,
          { row, col }
        )
      ) {
        makeMove({ row, col }, value, "BOT_LOCAL_ID");
      }
    }, 2000);
    return () => {
      clearInterval(xyz);
    };
  }, [isGameStart, curBoard, gameMoves, initBoard, solveBoard]);

  // FINISH
  useEffect(() => {}, []);

  return (
    <div className="sudoku-wrapper">
      <div className="score-wrapper">
        {gameMoves.map((userInRoom) => (
          <Score
            isUser={userInRoom.userId == userId}
            key={userInRoom.userId}
            score={userInRoom.score}
            plusPoint={userInRoom.plus || 0}
          />
        ))}
        {!isGameStart && (
          <div className="start-button-c">
            <button
              className="start-button"
              type="button"
              onClick={() => {
                setIsGameStart(true);
              }}
            >
              Play with bot
            </button>
          </div>
        )}
      </div>

      <div className="game-flex-wrapper">
        <div className="game-wrapper" ref={sudokuWrapperRef} tabIndex={-1}>
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
                          key={idx2}
                          isConflictRow={canRowXNumberY[idx][val] > 1}
                          isConflictCol={canColXNumberY[idx2][val] > 1}
                          isConflictSquare={
                            canSquareXYNumberZ[(idx / 3) >> 0][(idx2 / 3) >> 0][
                              val
                            ] > 1
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
  );
};

export default BoardGame;
