import type { SetStateAction } from "react";
import type { Pair } from "~/declares/interaces/Pair";

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

export default Cell;
