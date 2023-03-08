import type { Pair } from "~/declares/interfaces/Pair";
import hashToAvatar from "~/helper/hash";

type CellProps = {
  userId: string;
  isEnemy: boolean;
  isUser: boolean;
  isSameValue: boolean;
  isDefault: boolean;
  isConflictSquare: boolean;
  setSelectCell: Function;
  selectCell: Pair;
  cellIdx: Pair;
  cellVal: number;
  isConflictRow: boolean;
  isConflictCol: boolean;
  isMatchCell: boolean;
};

const Cell = ({
  userId,
  setSelectCell,
  selectCell,
  cellIdx,
  cellVal,
  isConflictRow,
  isConflictCol,
  isConflictSquare,
  isDefault,
  isSameValue,
  isUser,
  isEnemy,
  isMatchCell,
}: CellProps) => {
  const avatarStyle = {
    ["--avatar-image-cell" as any]: `url("${hashToAvatar(userId)}")`,
  };

  const isUserCell = isEnemy || isUser;

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

  const conflictCellClass =
    (isConflictCol || isConflictRow || isConflictSquare) &&
    isNumber &&
    !isMatchCell
      ? " number-conflict "
      : "";
  const conflictValueClass = conflictCellClass ? " default-conflict " : "";

  const isUserClass = isUser ? " user-cell " : "";
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
        style={avatarStyle}
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
