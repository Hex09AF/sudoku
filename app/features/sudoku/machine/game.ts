import { assign, createMachine } from "xstate";
import type { Board } from "~/utils/declares/interfaces/Board";
import type { GameMove } from "~/utils/declares/interfaces/GameMove";
import type { UserId } from "~/utils/declares/interfaces/Id";
import type { Pair } from "~/utils/declares/interfaces/Pair";
import {
  SUDOKU_ACTION as A,
  SUDOKU_CALLBACK as C,
  SUDOKU_EVENT as E,
  SUDOKU_GUARD as G,
  SUDOKU_STATE as S,
} from "~/utils/declares/sudoku-machine/sudoku.machine.type";

interface GameContext {
  players: GameMove[];
  board: Board;
  solveBoard: Board;
  selectCell: Pair;
  canRowXNumberY: any[][];
  canColXNumberY: any[][];
  canSquareXYNumberZ: any[][];
  winner: UserId | null;
  cellAnimateMap: Map<number, string>;
}

const gameMachine = createMachine<GameContext>(
  {
    predictableActionArguments: true,
    id: "game",
    initial: S.playing,
    states: {
      [S.ending]: {
        id: S.ending,
      },
      [S.playing]: {
        initial: S.playingCheckingGameState,
        states: {
          [S.playingTakingTurn]: {
            entry: [A.executeUpdateCanArray],
            on: {
              [E.fill]: [
                {
                  cond: G.validateFill,
                  actions: [
                    A.executeFill,
                    C.updateGameMovesToDB,
                    A.executeUpdateCanArray,
                    A.executeAnimateCell,
                  ],
                  target: S.playingCheckingGameState,
                },
              ],
              [E.move]: {
                actions: [A.executeMove],
              },
              [E.bulkUsers]: {
                actions: [A.executeBulkUsers],
              },
              [E.updateUserStatus]: {
                actions: [A.executeUpdateUserStatus],
              },
              [E.updateUserOnlineStatus]: {
                actions: [A.executeUpdateUserOnlineStatus],
              },
            },
          },
          [S.playingCheckingGameState]: {
            entry: A.executeTryGameEnd,
            always: [
              {
                target: `#${S.ending}`,
                cond: G.verifyGameEnd,
              },
              {
                target: S.playingTakingTurn,
              },
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      [A.executeAnimateCell]: assign({
        cellAnimateMap: (context, event) => {
          const { board, solveBoard } = context;
          const { pair } = event;
          const { row, col } = pair;
          let mapping = new Map<number, string>();
          let flagRow = 0,
            flagCol = 0,
            flagSqr = 0;

          for (let idx = 0; idx < 9; ++idx) {
            flagCol += board[idx][col] === solveBoard[idx][col] ? 1 : 0;
            flagRow += board[row][idx] === solveBoard[row][idx] ? 1 : 0;
          }

          const startRow = ((row / 3) >> 0) * 3,
            startCol = ((col / 3) >> 0) * 3;
          for (let idx = 0; idx < 3; ++idx) {
            for (let idx2 = 0; idx2 < 3; ++idx2) {
              flagSqr +=
                board[startRow + idx][startCol + idx2] ===
                solveBoard[startRow + idx][startCol + idx2]
                  ? 1
                  : 0;
            }
          }

          for (let idxRow = 0; idxRow < 9; ++idxRow)
            for (let idxCol = 0; idxCol < 9; ++idxCol) {
              let styles = [];
              if (idxRow === row && flagRow === 9) {
                styles.push(`animate-row delay-row-${Math.abs(col - idxCol)}`);
              }
              if (idxCol === col && flagCol === 9) {
                styles.push(`animate-col delay-col-${Math.abs(row - idxRow)}`);
              }
              if (
                (idxRow / 3) >> 0 === (row / 3) >> 0 &&
                (idxCol / 3) >> 0 === (col / 3) >> 0 &&
                flagSqr === 9
              ) {
                styles.push(
                  `animate-sqr delay-sqr-${
                    Math.abs(col - idxCol) + Math.abs(row - idxRow)
                  }`
                );
              }
              const strStyles = styles.join(" ");
              if (strStyles)
                mapping.set(idxRow * 10 + idxCol, styles.join(" "));
            }

          return mapping;
        },
      }),
      [A.executeTryGameEnd]: assign({
        winner: ({ winner, board, solveBoard, players }) => {
          for (let rowIdx = 0; rowIdx < 9; ++rowIdx) {
            for (let colIdx = 0; colIdx < 9; ++colIdx) {
              if (board[rowIdx][colIdx] !== solveBoard[rowIdx][colIdx]) {
                return winner;
              }
            }
          }

          const findingWinner = players.reduce((curWinner, curPlayer) => {
            return curWinner.score > curPlayer.score ? curWinner : curPlayer;
          });

          return findingWinner.userId;
        },
      }),

      [A.executeFill]: assign((context, event) => {
        const { board, solveBoard, players } = context;
        const { pair, value, userPlayId } = event;
        board[pair.row][pair.col] = value;

        const curInfo = players.find((v) => v.userId == userPlayId);

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
        }

        return {
          players,
          board,
        };
      }),

      [A.executeMove]: assign({
        selectCell: (_, event) => {
          return event.pair;
        },
      }),

      [A.executeBulkUsers]: assign({
        players: (context, event) => {
          const { usersInfo } = event;
          const { players } = context;
          usersInfo.forEach((user: GameMove) => {
            const curUser = players.find(
              (player) => player.userId == user.userId
            );
            if (curUser) {
              curUser.moves = user.moves;
              curUser.plus = user.plus;
              curUser.score = user.score;
              curUser.status = user.status;
              curUser.socketStatus = user.socketStatus;
            } else {
              players.push(user);
            }
          });
          return players;
        },
      }),

      [A.executeUpdateUserStatus]: assign({
        players: (context, event) => {
          const { userInfo } = event;
          const { players } = context;
          const curUser = players.find(
            (player) => player.userId == userInfo.userId
          );
          if (curUser) {
            curUser.status = userInfo.status;
          }
          return players;
        },
      }),

      [A.executeUpdateUserOnlineStatus]: assign({
        players: (context, event) => {
          const { userInfo } = event;
          const { players } = context;
          if (userInfo.status === "PLAYING") {
            const curUser = players.find(
              (player) => player.userId == userInfo.userId
            );
            if (curUser) {
              curUser.socketStatus = userInfo.socketStatus;
            }
            return players;
          } else {
            return players.filter(
              (player) => player.userId !== userInfo.userId
            );
          }
        },
      }),

      [A.executeUpdateCanArray]: assign((ctx) => {
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
            if (ctx.board[i][j] === 0) continue;
            newCanRowXNumberY[i][ctx.board[i][j]] += 1;
            newCanColXNumberY[j][ctx.board[i][j]] += 1;
            newCanSquareXYNumberZ[(i / 3) >> 0][(j / 3) >> 0][
              ctx.board[i][j]
            ] += 1;
          }
        }
        return {
          canRowXNumberY: newCanRowXNumberY,
          canColXNumberY: newCanColXNumberY,
          canSquareXYNumberZ: newCanSquareXYNumberZ,
        };
      }),
    },
    guards: {
      [G.validateFill]: () => {
        return true;
      },
      [G.verifyGameEnd]: ({ winner }) => {
        return !!winner;
      },
    },
  }
);

export { gameMachine };
