import React, { useEffect, useState } from "react";

import zeroBoard from "~/const/board";
import GameControl from "~/comps/Control";

import RANDOMBOARD from "../../helper/random";

const BoardGame = () => {
  const [selectCell, setSelectCell] = useState({ row: 4, col: 4 });

  const [curBoardValue, setCurBoardValue] = useState(zeroBoard);

  const [firstBoardValue, setFirstBoardValue] = useState(zeroBoard);

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

  const checkValid = (pair) => {
    return (
      pair.row >= 0 &&
      pair.row < 9 &&
      pair.col >= 0 &&
      pair.col < 9 &&
      !firstBoardValue[pair.row][pair.col]
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      let value = -1;

      if ("1234567890".includes(e.key)) {
        value = Number.parseInt(e.key, 10);
      } else if (e.key === "Backspace") {
        value = 0;
      } else if (e.key === "ArrowUp") {
        setSelectCell((preState) => ({
          row: (preState.row - 1 + 9) % 9,
          col: preState.col
        }));
      } else if (e.key === "ArrowLeft") {
        setSelectCell((preState) => ({
          row: preState.row,
          col: (preState.col - 1 + 9) % 9
        }));
      } else if (e.key === "ArrowRight") {
        setSelectCell((preState) => ({
          row: preState.row,
          col: (preState.col + 1) % 9
        }));
      } else if (e.key === "ArrowDown") {
        setSelectCell((preState) => ({
          row: (preState.row + 1) % 9,
          col: preState.col
        }));
      }

      if (!e.repeat && checkValid(selectCell) && value !== -1) {
        const newBoardValue = JSON.parse(JSON.stringify(curBoardValue));
        newBoardValue[selectCell.row][selectCell.col] = value;
        setCurBoardValue(newBoardValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [curBoardValue, selectCell, checkValid]);

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
    const fetchFirstBoardValue = async () => {
      try {
        let x = await RANDOMBOARD();
        setCurBoardValue(x);
        setFirstBoardValue(x);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFirstBoardValue();
  }, []);

  return (
    <div className="sudoku-wrapper">
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
        <GameControl
          curBoardValue={curBoardValue}
          setCurBoardValue={setCurBoardValue}
          firstBoardValue={firstBoardValue}
          selectCell={selectCell}
          setFirstBoardValue={setFirstBoardValue}
        />
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
  isSameValue
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
