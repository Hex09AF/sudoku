import { useState } from "react";

const GameControl = ({
  selectCell,
  firstBoardValue,
  curBoardValue,
  setCurBoardValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const BACKGAME = () => {
    setCurBoardValue(firstBoardValue);
  };

  const HANDLENUMPAD = (val) => {
    if (!firstBoardValue[selectCell.row][selectCell.col]) {
      const newBoardValue = JSON.parse(JSON.stringify(curBoardValue));
      newBoardValue[selectCell.row][selectCell.col] = val;
      setCurBoardValue(newBoardValue);
    }
  };

  return (
    <div className="game-controls-wrapper">
      <nav>
        <div className="new-game-button-wrapper">
          {/* <div className="new-game-menu">
            <div className="tooltip-arrow"></div>
            <ul className="select-difficulty">
              <li className="lost-progress-label">
                Tiến trình trò chơi hiện tại sẽ bị xóa
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.prentDefault();
                  }}
                  className="new-game-menu-new"
                >
                  Trò chơi Mới
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.prentDefault();
                  }}
                  className="new-game-menu-restart"
                >
                  Chơi lại
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.prentDefault();
                  }}
                  className="new-game-menu-cancel"
                >
                  Hủy bỏ
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="numpad-wrapper">
          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) => (
              <div
                onClick={() => HANDLENUMPAD(val)}
                key={idx}
                className="numpad-item"
              >
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="game-controls">
          <div className="game-controls-buttons">
            <div
              className="game-controls-item game-controls-undo"
              data-action="undo"
              onClick={() => BACKGAME()}
            >
              <svg
                className="icon-game-control"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 27 27"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M13.021 0C9.207 0 5.589 1.715 3.125 4.609V.521a.521.521 0 0 0-1.042 0v5.208c0 .288.234.521.521.521h5.208a.522.522 0 1 0 0-1.042H3.977c2.267-2.619 5.566-4.166 9.044-4.166C19.625 1.042 25 6.416 25 13.021 25 19.626 19.625 25 13.021 25 6.416 25 1.042 19.626 1.042 13.021a.521.521 0 0 0-1.042 0c0 7.18 5.84 13.021 13.021 13.021 7.18 0 13.021-5.841 13.021-13.021C26.042 5.841 20.201 0 13.021 0"
                ></path>
              </svg>
              <div className="game-controls-label">Trở lại</div>
            </div>
            <div
              className="game-controls-item game-controls-erase"
              data-action="erase"
              onClick={() => HANDLENUMPAD(0)}
            >
              <svg
                className="icon-game-control"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 30"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M13.861 28.126l7.01-7.017.004-.003.002-.002 9.58-9.59a2.584 2.584 0 0 0 .763-1.842c0-.695-.271-1.35-.763-1.843L23.373.739c-.986-.986-2.7-.984-3.682 0l-9.58 9.59-.004.002-.002.003-9.344 9.35A2.592 2.592 0 0 0 0 21.529c0 .695.27 1.35.761 1.842l5.64 5.645a.528.528 0 0 0 .369.153h24.48v-1.042H13.861zm6.566-26.65c.591-.587 1.621-.59 2.209 0l7.084 7.09c.295.295.458.688.458 1.106 0 .418-.163.81-.458 1.105L20.506 20l-9.292-9.302 9.213-9.222zM6.986 28.126l-5.488-5.492a1.557 1.557 0 0 1-.457-1.105c0-.418.163-.81.457-1.106l8.979-8.986 9.291 9.302-7.381 7.387H6.986z"
                ></path>
              </svg>
              <div className="game-controls-label">Xóa</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GameControl;
