import type { SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import type { Board } from "~/declares/interaces/Board";
import type { GameMove } from "~/declares/interaces/GameMove";
import type { Pair } from "~/declares/interaces/Pair";
import type { UserId } from "~/declares/interaces/User";
import { checkValid, isEnemyCell, isMatchCell, isUserCell } from "~/utils/game";
import Score from "../Score";

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

  const [gameMoves, setGameMoves] = useState(
    initGameMoves.filter((v) => v.userId == userId)
  );

  const [selectCell, setSelectCell] = useState<Pair>({ row: 4, col: 4 });

  const [curBoard, setCurBoard] = useState(initBoard);

  const [firstBoardValue] = useState(initBoard);

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
        setCurBoard((preState) => {
          const newBoardValue = JSON.parse(JSON.stringify(preState));
          newBoardValue[selectCell.row][selectCell.col] = value;
          return newBoardValue;
        });
        setGameMoves((preState) => {
          const curInfo = preState.find((v) => v.userId == userId);

          if (curInfo) {
            if (value) {
              if (solveBoard[selectCell.row][selectCell.col] == value) {
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

  return (
    <div className="sudoku-wrapper" ref={sudokuWrapperRef} tabIndex={-1}>
      <div className="score-wrapper">
        {gameMoves.map((userInRoom) => (
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
