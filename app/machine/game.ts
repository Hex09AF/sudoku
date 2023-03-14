import { assign, createMachine } from "xstate";
import type { Board } from "~/declares/interfaces/Board";
import type { GameMove } from "~/declares/interfaces/GameMove";
import type { UserId } from "~/declares/interfaces/Id";
import type { Pair } from "~/declares/interfaces/Pair";
import {
  SUDOKU_ACTION as A,
  SUDOKU_CALLBACK as C,
  SUDOKU_EVENT as E,
  SUDOKU_GUARD as G,
  SUDOKU_STATE as S,
} from "~/declares/sudoku-machine/sudoku.machine.type";

interface GameContext {
  players: GameMove[];
  board: Board;
  solveBoard: Board;
  selectCell: Pair;
  canRowXNumberY: any[][];
  canColXNumberY: any[][];
  canSquareXYNumberZ: any[][];
  winner: UserId | null;
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
            return curWinner.score > curPlayer.score ? curWinner : curWinner;
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
