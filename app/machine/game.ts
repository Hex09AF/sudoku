import { assign, createMachine } from "xstate";
import type { Board } from "~/declares/interfaces/Board";
import type { GameMove } from "~/declares/interfaces/GameMove";
import type { Pair } from "~/declares/interfaces/Pair";

interface IGame {
  players: GameMove[];
  board: Board;
  solveBoard: Board;
  selectCell: Pair;
  canRowXNumberY: any[][];
  canColXNumberY: any[][];
  canSquareXYNumberZ: any[][];
}

const gameMachine = createMachine<IGame>(
  {
    predictableActionArguments: true,
    id: "game",
    initial: "playing",
    entry: ["updateCanArray"],
    states: {
      playing: {
        on: {
          UPDATE: {
            actions: [
              assign({ board: (_, event) => event.board }),
              "updateCanArray",
            ],
          },
          MOVE: {
            actions: assign({
              selectCell: (_, event) => {
                return event.pair;
              },
            }),
          },
          FILL: {
            actions: [
              assign({
                board: (ctx, event) => {
                  const newBoardValue = JSON.parse(JSON.stringify(ctx.board));
                  newBoardValue[ctx.selectCell.row][ctx.selectCell.col] =
                    event.value;
                  return newBoardValue;
                },
              }),
              "updateCanArray",
            ],
          },
          "GAME.UPDATE.ALL": {
            actions: [
              assign({
                players: (_, event) => {
                  return event.usersInfo;
                },
              }),
            ],
          },
          "GAME.UPDATE": {
            actions: [
              assign({
                players: (context, event) => {
                  const curUser = context.players.find(
                    (user) => user.userId == event.userInfo.userId
                  );
                  if (curUser) {
                    curUser.moves = event.userInfo.moves;
                    curUser.plus = event.userInfo.plus;
                    curUser.score = event.userInfo.score;
                    curUser.status = event.userInfo.status;
                  }
                  return context.players;
                },
              }),
            ],
          },
          "GAME.FILL": {
            actions: [
              assign({
                players: (context, event) => {
                  const curInfo = context.players.find(
                    (v) => v.userId == event.value.userId
                  ) as GameMove;

                  if (
                    event.value.solveBoard[event.value.selectCell.row][
                      event.value.selectCell.col
                    ] == event.value.value
                  ) {
                    curInfo.plus = 50;
                    curInfo.score += 50;
                  } else {
                    curInfo.plus = -100;
                    curInfo.score += -100;
                  }

                  const isExistCell = curInfo.moves.findIndex((v: number[]) => {
                    return (
                      v[0] == event.value.selectCell.row &&
                      v[1] == event.value.selectCell.col
                    );
                  });
                  if (isExistCell != -1) {
                    curInfo.moves[isExistCell] = [
                      event.value.selectCell.row,
                      event.value.selectCell.col,
                      event.value.value,
                    ];
                  } else {
                    curInfo.moves.push([
                      event.value.selectCell.row,
                      event.value.selectCell.col,
                      event.value.value,
                    ]);
                  }

                  return context.players;
                },
              }),
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      updateCanArray: assign((ctx) => {
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
          ...ctx,
          canRowXNumberY: newCanRowXNumberY,
          canColXNumberY: newCanColXNumberY,
          canSquareXYNumberZ: newCanSquareXYNumberZ,
        };
      }),
    },
  }
);

export { gameMachine };
