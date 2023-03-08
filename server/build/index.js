var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 41,
        columnNumber: 7
      }, this),
      {
        onAllReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 82,
        columnNumber: 7
      }, this),
      {
        onShellReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  action: () => action,
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_react4 = require("@remix-run/react"), import_react5 = require("react"), import_socket = __toESM(require("socket.io-client"));

// app/styles/global.css
var global_default = "/build/_assets/global-HW5O7CMV.css";

// app/styles/header/header.css
var header_default = "/build/_assets/header-UUUSXR5Y.css";

// app/styles/index.css
var styles_default = "/build/_assets/index-THCLC7HZ.css";

// app/comps/Rubik/index.tsx
var import_react2 = require("react"), import_jsx_dev_runtime2 = require("react/jsx-dev-runtime"), colors = ["", "orange", "yellow", "green", "blue", "indigo", "violet"];
function Rubik() {
  let rubik = (0, import_react2.useRef)(null);
  return (0, import_react2.useEffect)(() => {
    if (rubik.current && window) {
      let fn = (e) => {
        e.preventDefault();
        let pos = [e.clientX, e.clientY], h = window.innerHeight, ratioY = 60 / window.innerWidth, ratioX = 60 / h, rotY = pos[0] * ratioY - 30, transform = `
        transition: transform 0.5s ease-out;
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateZ(0deg) skew(0deg, 0deg)
          rotateX(${-(pos[1] * ratioX - 30)}deg)
          rotateY(${rotY}deg)
        `;
        rubik.current && rubik.current.setAttribute("style", transform);
      }, fnMouseOut = () => {
        rubik.current && rubik.current.setAttribute("style", "");
      };
      return window.addEventListener("mousemove", fn), window.addEventListener("mouseout", fnMouseOut), () => {
        window.removeEventListener("mousemove", fn), window.removeEventListener("mouseout", fnMouseOut);
      };
    }
  }, [rubik]), /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "rubik-wrapper", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "rubik-layout", ref: rubik, children: Array(49).fill(0).map((_, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "rubik-cell", children: colors.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `rubik-cell-color ${v}` }, v, !1, {
    fileName: "app/comps/Rubik/index.tsx",
    lineNumber: 55,
    columnNumber: 19
  }, this)) }, idx, !1, {
    fileName: "app/comps/Rubik/index.tsx",
    lineNumber: 53,
    columnNumber: 15
  }, this)) }, void 0, !1, {
    fileName: "app/comps/Rubik/index.tsx",
    lineNumber: 48,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/comps/Rubik/index.tsx",
    lineNumber: 47,
    columnNumber: 5
  }, this);
}

// app/context.tsx
var import_react3 = require("react"), import_jsx_dev_runtime3 = require("react/jsx-dev-runtime"), context = (0, import_react3.createContext)(void 0);
function useSocket() {
  return (0, import_react3.useContext)(context);
}
function SocketProvider({ socket, children }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(context.Provider, { value: socket, children }, void 0, !1, {
    fileName: "app/context.tsx",
    lineNumber: 17,
    columnNumber: 10
  }, this);
}

// app/utils/room.server.ts
var import_node2 = require("@remix-run/node");

// app/const/board.ts
var baseBoard = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 1, 4, 3, 6, 5, 8, 9, 7],
  [3, 6, 5, 8, 9, 7, 2, 1, 4],
  [8, 9, 7, 2, 1, 4, 3, 6, 5],
  [5, 3, 1, 6, 4, 2, 9, 7, 8],
  [6, 4, 2, 9, 7, 8, 5, 3, 1],
  [9, 7, 8, 5, 3, 1, 6, 4, 2]
];

// app/helper/random.ts
var RANDOMNUMBER = (left, right) => (Math.random() * right >> 0) + left, RANDOMPAIR = (left, right) => {
  let fs = RANDOMNUMBER(left, right), sc = RANDOMNUMBER(left, right);
  return { first: fs, second: sc };
}, TRANSPOSE = (matrix) => {
  for (var i = 0; i < matrix.length; i++)
    for (var j = 0; j < i; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
}, RANDOMBOARD = () => new Promise((resolve) => {
  let newBoardValue = JSON.parse(JSON.stringify(baseBoard));
  for (let times = 0; times <= 10; ++times) {
    for (let left = 0; left <= 6; left += 3) {
      let pair = RANDOMPAIR(left, 3);
      [newBoardValue[pair.first], newBoardValue[pair.second]] = [
        newBoardValue[pair.second],
        newBoardValue[pair.first]
      ];
    }
    TRANSPOSE(newBoardValue);
  }
  let eraseCell = 40;
  for (; eraseCell; ) {
    let pair = RANDOMPAIR(0, 9);
    newBoardValue[pair.first][pair.second] && (newBoardValue[pair.first][pair.second] = 0, --eraseCell);
  }
  resolve(newBoardValue);
}), random_default = RANDOMBOARD;

// app/utils/db.server.ts
var import_client = require("@prisma/client"), db;
global.__db || (global.__db = new import_client.PrismaClient()), db = global.__db;

// app/utils/room.server.ts
async function createRoom() {
  let board = JSON.stringify(await random_default()), room = await db.room.create({
    data: { board }
  });
  return (0, import_node2.redirect)(`/solo/${room.id}`);
}
async function getRooms() {
  return await db.room.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      users: !0
    }
  });
}
async function getRoom(id) {
  return await db.room.findUnique({
    where: { id },
    select: { id: !0, board: !0, gameStatus: !0 }
  });
}
async function getMoves({ roomId }) {
  try {
    return await db.usersOnRooms.findMany({
      where: {
        roomId
      },
      select: { moves: !0, userId: !0, score: !0, role: !0 }
    });
  } catch {
  }
}
async function updateMoves({
  roomId,
  userId,
  moves,
  score
}) {
  try {
    await db.usersOnRooms.update({
      data: {
        moves,
        score
      },
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    });
  } catch {
  }
}
async function updateGameStatus({
  gameStatus,
  id,
  readyUsers
}) {
  try {
    await db.room.update({
      data: {
        gameStatus
      },
      where: {
        id
      }
    });
    for (let userId of readyUsers)
      await db.usersOnRooms.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId: id
          }
        },
        create: {
          roomId: id,
          userId,
          moves: "[]",
          score: 0,
          role: "PLAYER"
        },
        update: {}
      });
  } catch {
  }
}

// app/assets/favicon/apple-touch-icon.png
var apple_touch_icon_default = "/build/_assets/apple-touch-icon-7VD32NG2.png";

// app/assets/favicon/favicon-16x16.png
var favicon_16x16_default = "/build/_assets/favicon-16x16-L5L7LH66.png";

// app/assets/favicon/favicon-32x32.png
var favicon_32x32_default = "/build/_assets/favicon-32x32-NSVDPYK3.png";

// app/assets/favicon/site.webmanifest
var site_default = "/build/_assets/site-7ZFY4WPT.webmanifest";

// app/root.tsx
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime"), meta = () => ({
  charset: "utf-8",
  title: "Competitive sudoku",
  viewport: "width=device-width,initial-scale=1"
}), links = () => [
  { rel: "stylesheet", href: global_default },
  { rel: "stylesheet", href: header_default },
  { rel: "stylesheet", href: styles_default },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: apple_touch_icon_default
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: favicon_32x32_default
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: favicon_16x16_default
  },
  { rel: "manifest", href: site_default }
], action = async ({ request }) => createRoom();
function CatchBoundary() {
  let caught = (0, import_react4.useCatch)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("html", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("title", { children: "Oops!" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 68,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("body", { children: [
      caught.status == 404 ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Rubik, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
        "Something went wrong: ",
        caught.status,
        " ",
        caught.statusText
      ] }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 74,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 78,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 70,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 64,
    columnNumber: 5
  }, this);
}
function App() {
  let [socket, setSocket] = (0, import_react5.useState)();
  return (0, import_react5.useEffect)(() => {
    let socket2 = (0, import_socket.default)();
    return setSocket(socket2), () => {
      socket2.close();
    };
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("html", { lang: "en", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 98,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(SocketProvider, { socket, children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 103,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 102,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 106,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_react4.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 96,
    columnNumber: 5
  }, this);
}

// app/routes/solo/$roomId.tsx
var roomId_exports = {};
__export(roomId_exports, {
  action: () => action2,
  default: () => SoloRoom,
  links: () => links2,
  loader: () => loader
});
var import_node4 = require("@remix-run/node"), import_react12 = require("@remix-run/react");

// app/comps/BoardGame/index.tsx
var import_react9 = require("@remix-run/react"), import_react10 = require("@xstate/react"), import_lodash = __toESM(require("lodash.debounce")), import_react11 = require("react");

// app/machine/game.ts
var import_xstate = require("xstate"), createGameMachine = ({ initGameMoves }) => (0, import_xstate.createMachine)({
  predictableActionArguments: !0,
  id: "game",
  initial: "playing",
  context: {
    players: initGameMoves
  },
  states: {
    playing: {
      on: {
        "GAME.UPDATE.ALL": {
          actions: [
            (0, import_xstate.assign)({
              players: (_, event) => event.usersInfo
            })
          ]
        },
        "GAME.UPDATE": {
          actions: [
            (0, import_xstate.assign)({
              players: (context2, event) => {
                let curUser = context2.players.find(
                  (user) => user.userId == event.userInfo.userId
                );
                return curUser && (curUser.moves = event.userInfo.moves, curUser.plus = event.userInfo.plus, curUser.score = event.userInfo.score, curUser.status = event.userInfo.status), context2.players;
              }
            })
          ]
        },
        "GAME.FILL": {
          actions: [
            (0, import_xstate.assign)({
              players: (context2, event) => {
                let curInfo = context2.players.find(
                  (v) => v.userId == event.value.userId
                );
                event.value.solveBoard[event.value.selectCell.row][event.value.selectCell.col] == event.value.value ? (curInfo.plus = 50, curInfo.score += 50) : (curInfo.plus = -100, curInfo.score += -100);
                let isExistCell = curInfo.moves.findIndex((v) => v[0] == event.value.selectCell.row && v[1] == event.value.selectCell.col);
                return isExistCell != -1 ? curInfo.moves[isExistCell] = [
                  event.value.selectCell.row,
                  event.value.selectCell.col,
                  event.value.value
                ] : curInfo.moves.push([
                  event.value.selectCell.row,
                  event.value.selectCell.col,
                  event.value.value
                ]), context2.players;
              }
            })
          ]
        }
      }
    }
  }
}), createBoardMachine = ({
  board,
  solveBoard
}) => (0, import_xstate.createMachine)(
  {
    predictableActionArguments: !0,
    id: "board",
    context: {
      board,
      solveBoard,
      selectCell: { row: 4, col: 4 },
      canRowXNumberY: new Array(9).fill(0).map(() => new Array(10).fill(0)),
      canColXNumberY: new Array(9).fill(0).map(() => new Array(10).fill(0)),
      canSquareXYNumberZ: new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)))
    },
    initial: "playing",
    entry: ["updateCanArray"],
    states: {
      playing: {
        on: {
          UPDATE: {
            actions: [
              (0, import_xstate.assign)({ board: (_, event) => event.board }),
              "updateCanArray"
            ]
          },
          MOVE: {
            actions: (0, import_xstate.assign)({
              selectCell: (_, event) => event.pair
            })
          },
          FILL: {
            actions: [
              (0, import_xstate.assign)({
                board: (ctx, event) => {
                  let newBoardValue = JSON.parse(JSON.stringify(ctx.board));
                  return newBoardValue[ctx.selectCell.row][ctx.selectCell.col] = event.value, newBoardValue;
                }
              }),
              "updateCanArray"
            ]
          }
        }
      }
    }
  },
  {
    actions: {
      updateCanArray: (0, import_xstate.assign)((ctx) => {
        let newCanRowXNumberY = new Array(9).fill(0).map(() => new Array(10).fill(0)), newCanColXNumberY = new Array(9).fill(0).map(() => new Array(10).fill(0)), newCanSquareXYNumberZ = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)));
        for (let i = 0; i < 9; ++i)
          for (let j = 0; j < 9; ++j)
            ctx.board[i][j] !== 0 && (newCanRowXNumberY[i][ctx.board[i][j]] += 1, newCanColXNumberY[j][ctx.board[i][j]] += 1, newCanSquareXYNumberZ[i / 3 >> 0][j / 3 >> 0][ctx.board[i][j]] += 1);
        return {
          ...ctx,
          canRowXNumberY: newCanRowXNumberY,
          canColXNumberY: newCanColXNumberY,
          canSquareXYNumberZ: newCanSquareXYNumberZ
        };
      })
    }
  }
);

// app/utils/game.ts
var getCellUserId = (gameMoves, pair) => {
  let userId = "";
  return gameMoves == null || gameMoves.forEach((user) => {
    var _a;
    (_a = user == null ? void 0 : user.moves) == null || _a.forEach((move) => {
      move[0] == pair.row && move[1] == pair.col && (userId = user.userId);
    });
  }), userId;
}, isEnemyCell = (gameMoves, userId, pair) => {
  let flag = !1, usersInfo = gameMoves.filter((user) => user.userId != userId);
  return usersInfo == null || usersInfo.forEach((user) => {
    var _a;
    (_a = user == null ? void 0 : user.moves) == null || _a.forEach((move) => {
      move[0] == pair.row && move[1] == pair.col && (flag = !0);
    });
  }), flag;
}, isUserCell = (gameMoves, userId, pair) => {
  let flag = !1, userInfo = gameMoves.find((user) => user.userId == userId);
  return userInfo == null || userInfo.moves.forEach((move) => {
    move[0] == pair.row && move[1] == pair.col && (flag = !0);
  }), flag;
}, isMatchCell = (solveBoard, curBoard, pair) => solveBoard[pair.row][pair.col] == curBoard[pair.row][pair.col], checkValid = (value, gameMoves, userId, initBoard, solveBoard, curBoard, pair) => value === 0 ? !isMatchCell(solveBoard, curBoard, pair) && isUserCell(gameMoves, userId, pair) : !isEnemyCell(gameMoves, userId, pair) && pair.row >= 0 && pair.row < 9 && pair.col >= 0 && pair.col < 9 && !isMatchCell(solveBoard, curBoard, pair) && (!initBoard[pair.row][pair.col] || isUserCell(gameMoves, userId, pair));
function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// app/comps/Score/index.tsx
var import_react6 = require("react");

// app/helper/hash.ts
var userImages = [
  "https://partyanimals.com/static/img/avatars_12@2x.f05718d8.jpg",
  "https://partyanimals.com/static/img/avatars_11@2x.c841344e.jpg",
  "https://partyanimals.com/static/img/avatars_10@2x.fdc921f3.jpg",
  "https://partyanimals.com/static/img/avatars_09@2x.349eb9e1.jpg",
  "https://partyanimals.com/static/img/avatars_08@2x.f4b168ab.jpg",
  "https://partyanimals.com/static/img/avatars_07@2x.5d95c63b.jpg",
  "https://partyanimals.com/static/img/avatars_06@2x.e1140503.jpg",
  "https://partyanimals.com/static/img/avatars_05@2x.4e4403b7.jpg",
  "https://partyanimals.com/static/img/avatars_04@2x.a8f03c96.jpg",
  "https://partyanimals.com/static/img/avatars_03@2x.7ab39dde.jpg",
  "https://partyanimals.com/static/img/avatars_02@2x.c7280e5d.jpg",
  "https://partyanimals.com/static/img/avatars_01@2x.4857b43c.jpg"
];
function hashToAvatar(str) {
  let idx = 0, mod = userImages.length;
  for (let c of str)
    idx += c.charCodeAt(0), idx %= mod;
  return userImages[idx];
}

// app/comps/Score/point.tsx
var import_jsx_dev_runtime5 = require("react/jsx-dev-runtime");
function Point({ plusPoint }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "plus-point", children: [
    plusPoint < 0 ? "" : "+",
    plusPoint
  ] }, void 0, !0, {
    fileName: "app/comps/Score/point.tsx",
    lineNumber: 3,
    columnNumber: 5
  }, this);
}

// app/comps/Score/index.tsx
var import_jsx_dev_runtime6 = require("react/jsx-dev-runtime");
function Score({
  userId,
  score,
  plusPoint,
  isUser,
  status
}) {
  let MyPoint = (0, import_react6.useCallback)(() => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Point, { plusPoint }, void 0, !1, {
    fileName: "app/comps/Score/index.tsx",
    lineNumber: 20,
    columnNumber: 37
  }, this), [score]), avatarStyle = {
    ["--avatar-image"]: `url(${hashToAvatar(userId)})`
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { style: avatarStyle, className: "score-info", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { children: [
      isUser ? "MY" : "",
      " SCORES"
    ] }, void 0, !0, {
      fileName: "app/comps/Score/index.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("h2", { children: score || 0 }, void 0, !1, {
      fileName: "app/comps/Score/index.tsx",
      lineNumber: 29,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(MyPoint, {}, void 0, !1, {
      fileName: "app/comps/Score/index.tsx",
      lineNumber: 30,
      columnNumber: 7
    }, this),
    status === "NOT_READY" ? "NOT READY" : status
  ] }, void 0, !0, {
    fileName: "app/comps/Score/index.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, this);
}

// app/comps/BoardGame/Cell.tsx
var import_jsx_dev_runtime7 = require("react/jsx-dev-runtime"), Cell = ({
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
  isMatchCell: isMatchCell2
}) => {
  let avatarStyle = {
    ["--avatar-image-cell"]: `url("${hashToAvatar(userId)}")`
  }, isUserCell2 = isEnemy || isUser, selectedCellClass = selectCell.row === cellIdx.row && selectCell.col === cellIdx.col ? " cell-selected " : "", isSameRow = selectCell.row === cellIdx.row, isSameCol = selectCell.col === cellIdx.col, isSameSquare = selectCell.row / 3 >> 0 === cellIdx.row / 3 >> 0 && selectCell.col / 3 >> 0 === cellIdx.col / 3 >> 0, hightLightCellClass = isSameRow || isSameCol || isSameSquare || isSameValue ? " table-hightlight " : "", numerHightLightClass = isSameValue ? " number-hightlight " : "", isNumber = isUserCell2 || !isDefault && cellVal !== 0, numberClass = isNumber ? " number " : "", isMatchCellClass = isUserCell2 && isMatchCell2 ? " match-cell " : "", conflictCellClass = (isConflictCol || isConflictRow || isConflictSquare) && isNumber && !isMatchCell2 ? " number-conflict " : "", conflictValueClass = conflictCellClass ? " default-conflict " : "", isUserClass = isUser ? " user-cell " : "", isEnemyClass = isEnemy ? " enemy-cell " : "", handleSelectCell = () => {
    setSelectCell(cellIdx);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(import_jsx_dev_runtime7.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(
    "td",
    {
      style: avatarStyle,
      className: "game-cell" + isEnemyClass + isUserClass + selectedCellClass + hightLightCellClass + numberClass + conflictCellClass + numerHightLightClass + isMatchCellClass,
      onClick: () => handleSelectCell(),
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "cell-value" + conflictValueClass, children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { children: `${cellVal || ""}` }, void 0, !1, {
        fileName: "app/comps/BoardGame/Cell.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/comps/BoardGame/Cell.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this)
    },
    void 0,
    !1,
    {
      fileName: "app/comps/BoardGame/Cell.tsx",
      lineNumber: 80,
      columnNumber: 7
    },
    this
  ) }, void 0, !1, {
    fileName: "app/comps/BoardGame/Cell.tsx",
    lineNumber: 79,
    columnNumber: 5
  }, this);
}, Cell_default = Cell;

// app/comps/BoardGame/CountDown.tsx
var import_react8 = require("react");

// app/hooks/useCountDown.ts
var import_react7 = require("react");
function useCountdown(duration) {
  let [count, setCount] = (0, import_react7.useState)(0);
  (0, import_react7.useEffect)(() => {
    let start, previousTimeStamp;
    function step(timestamp) {
      start === void 0 && (start = timestamp);
      let elapsed = timestamp - start;
      previousTimeStamp !== timestamp && setCount(Math.min(elapsed, duration * 1e3)), elapsed < duration * 1e3 && (previousTimeStamp = timestamp, requestAnimationFrame(step));
    }
    let frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [duration]);
  let formatCountdown = (0, import_react7.useCallback)(() => {
    let remaining = Math.floor((duration * 1e3 - count) / 1e3), milliseconds = Math.floor(
      Math.floor(duration * 1e3 - count) % 1e3 / 100
    );
    return `${remaining.toString()}.${milliseconds.toString()}`;
  }, [count, duration]);
  return { count, formatCountdown };
}

// app/comps/BoardGame/CountDown.tsx
var import_jsx_dev_runtime8 = require("react/jsx-dev-runtime"), CountDown = ({ onFinish }) => {
  let { count, formatCountdown } = useCountdown(5);
  return (0, import_react8.useEffect)(() => {
    Math.floor(count) === 5e3 && onFinish();
  }, [count]), /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: [
    "The game will start in ",
    formatCountdown()
  ] }, void 0, !0, {
    fileName: "app/comps/BoardGame/CountDown.tsx",
    lineNumber: 17,
    columnNumber: 10
  }, this);
}, CountDown_default = CountDown;

// app/comps/BoardGame/index.tsx
var import_jsx_dev_runtime9 = require("react/jsx-dev-runtime"), BoardGame = ({
  initGameStatus,
  solveBoard,
  initBoard,
  roomId,
  userId,
  socket,
  initGameMoves
}) => {
  let [gameState, send] = (0, import_react10.useMachine)(createGameMachine({ initGameMoves })), [boardState, boardSend] = (0, import_react10.useMachine)(
    createBoardMachine({ board: initBoard, solveBoard })
  ), submit = (0, import_react9.useSubmit)(), [usersInRoom, setUsersInRoom] = (0, import_react11.useState)(
    initGameMoves.filter((v) => v.userId == userId)
  ), postGameMoves = (0, import_react11.useCallback)(
    (0, import_lodash.default)(({ moves, score }) => {
      let formData = new FormData();
      formData.append("roomId", roomId), formData.append("userId", userId), formData.append("newCurUserMoves", JSON.stringify(moves)), formData.append("newScore", JSON.stringify(score)), formData.append("intent", "updateGameMoves"), submit(formData, {
        method: "post",
        action: `/solo/${roomId}`,
        replace: !0
      });
    }, 650),
    [boardState.context.selectCell]
  ), makeMove = (pair, value, userPlayId) => {
    let newBoardValue = JSON.parse(JSON.stringify(boardState.context.board));
    newBoardValue[boardState.context.selectCell.row][boardState.context.selectCell.col] = value, socket == null || socket.emit("GAME:PLAY_A_MOVE" /* CLIENT_PLAY */, newBoardValue);
    let curInfo = JSON.parse(
      JSON.stringify(gameState.context.players.find((v) => v.userId == userId))
    );
    if (curInfo) {
      solveBoard[boardState.context.selectCell.row][boardState.context.selectCell.col] == value ? (curInfo.plus = 50, curInfo.score += 50) : (curInfo.plus = -100, curInfo.score += -100);
      let isExistCell = curInfo.moves.findIndex((v) => v[0] == boardState.context.selectCell.row && v[1] == boardState.context.selectCell.col);
      isExistCell != -1 ? curInfo.moves[isExistCell] = [
        boardState.context.selectCell.row,
        boardState.context.selectCell.col,
        value
      ] : curInfo.moves.push([
        boardState.context.selectCell.row,
        boardState.context.selectCell.col,
        value
      ]), socket == null || socket.emit("CLIENT:GAME:UPDATE_CLIENT" /* CLIENT_UPDATE_CLIENT */, {
        userInfo: curInfo,
        roomId
      }), postGameMoves({ moves: curInfo.moves, score: curInfo.score });
    }
  }, handleKeyDown = (e) => {
    let value = -1;
    "1234567890".includes(e.key) ? value = Number.parseInt(e.key, 10) : e.key === "Backspace" ? value = 0 : e.key === "ArrowUp" ? boardSend({
      type: "MOVE",
      pair: {
        row: (boardState.context.selectCell.row - 1 + 9) % 9,
        col: boardState.context.selectCell.col
      }
    }) : e.key === "ArrowLeft" ? boardSend({
      type: "MOVE",
      pair: {
        row: boardState.context.selectCell.row,
        col: (boardState.context.selectCell.col - 1 + 9) % 9
      }
    }) : e.key === "ArrowRight" ? boardSend({
      type: "MOVE",
      pair: {
        row: boardState.context.selectCell.row,
        col: (boardState.context.selectCell.col + 1) % 9
      }
    }) : e.key === "ArrowDown" && boardSend({
      type: "MOVE",
      pair: {
        row: (boardState.context.selectCell.row + 1) % 9,
        col: boardState.context.selectCell.col
      }
    }), !e.repeat && initGameStatus === "START" && value !== -1 && checkValid(
      value,
      gameState.context.players,
      userId,
      initBoard,
      solveBoard,
      boardState.context.board,
      boardState.context.selectCell
    ) && makeMove(boardState.context.selectCell, value, userId);
  };
  (0, import_react11.useEffect)(() => {
    if (!socket)
      return;
    let handleUpdateBoard = (boardValue) => {
      boardSend({ type: "UPDATE", board: boardValue });
    }, handleUpdateClientInfo = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        let curUser2 = preUsers.find((user) => user.userId == userInfo.userId);
        return curUser2 && (curUser2.moves = userInfo.moves, curUser2.plus = userInfo.plus, curUser2.score = userInfo.score, curUser2.status = userInfo.status), JSON.parse(JSON.stringify(preUsers));
      }), send({ type: "GAME.UPDATE", userInfo });
    }, handleUpdateStatus = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        let curUser2 = preUsers.find((user) => user.userId == userInfo.userId);
        return curUser2 && (curUser2.status = userInfo.status), JSON.parse(JSON.stringify(preUsers));
      });
    }, handleRemoveClient = ({ userInfo }) => {
      setUsersInRoom((preUsers) => {
        let newUsers = preUsers.filter((v) => v.userId != userInfo.userId);
        return JSON.parse(JSON.stringify(newUsers));
      });
    }, handleAddClient = ({ usersInfo }) => {
      setUsersInRoom((preUsers) => preUsers.length > usersInfo.length ? preUsers : usersInfo);
    };
    return socket.on("SERVER:GAME:PLAY_A_MOVE" /* SERVER_CLIENT_PLAY */, handleUpdateBoard), socket.on("SERVER:GAME:UPDATE_CLIENT" /* SERVER_UPDATE_CLIENT */, handleUpdateClientInfo), socket.on("SERVER:GAME:UPDATE_CLIENT_STATUS" /* SERVER_UPDATE_CLIENT_STATUS */, handleUpdateStatus), socket.on("SERVER:GAME:REMOVE_CLIENT" /* SERVER_REMOVE_CLIENT */, handleRemoveClient), socket.on("SERVER:GAME:ADD_CLIENT" /* SERVER_ADD_CLIENT */, handleAddClient), () => {
      socket.off("SERVER:GAME:PLAY_A_MOVE" /* SERVER_CLIENT_PLAY */, handleUpdateBoard), socket.off("SERVER:GAME:UPDATE_CLIENT" /* SERVER_UPDATE_CLIENT */, handleUpdateClientInfo), socket.off("SERVER:GAME:UPDATE_CLIENT_STATUS" /* SERVER_UPDATE_CLIENT_STATUS */, handleUpdateStatus), socket.off("SERVER:GAME:REMOVE_CLIENT" /* SERVER_REMOVE_CLIENT */, handleRemoveClient), socket.off("SERVER:GAME:ADD_CLIENT" /* SERVER_ADD_CLIENT */, handleAddClient);
    };
  }, [socket, boardSend, send]);
  let curUser = usersInRoom.find((v) => v.userId === userId), isPlay = (0, import_react11.useMemo)(() => usersInRoom.filter((v) => v.status === "READY").length === usersInRoom.length, [usersInRoom]), onFinish = () => {
    let formData = new FormData();
    formData.append("intent", "updateGameStatus"), formData.append("roomId", roomId), formData.append("gameStatus", "START");
    let readyUsers = JSON.parse(
      JSON.stringify(usersInRoom.filter((v) => v.status === "READY"))
    );
    formData.append(
      "readyUsers",
      JSON.stringify(readyUsers.map((v) => v.userId))
    );
    for (let user of readyUsers)
      user.userId === userId && (socket == null || socket.emit("CLIENT:GAME:UPDATE_CLIENT_STATUS" /* CLIENT_UPDATE_CLIENT_STATUS */, {
        userInfo: {
          userId: user.userId,
          status: "PLAYING"
        },
        roomId
      }));
    submit(formData, {
      method: "post",
      action: `/solo/${roomId}`,
      replace: !0
    }), send({
      type: "GAME.UPDATE.ALL",
      usersInfo: readyUsers.map((v) => ({ ...v, status: "PLAYING" }))
    });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "sudoku-wrapper", tabIndex: -1, onKeyDown: handleKeyDown, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "score-wrapper", children: usersInRoom.map((userInRoom) => /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
      Score,
      {
        userId: userInRoom.userId,
        isUser: userInRoom.userId == userId,
        score: userInRoom.score,
        plusPoint: userInRoom.plus || 0,
        status: userInRoom.status
      },
      userInRoom.userId,
      !1,
      {
        fileName: "app/comps/BoardGame/index.tsx",
        lineNumber: 286,
        columnNumber: 11
      },
      this
    )) }, void 0, !1, {
      fileName: "app/comps/BoardGame/index.tsx",
      lineNumber: 284,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "game-info", children: [
      initGameStatus === "READY" && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "start-button-c", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
        "button",
        {
          className: "start-button",
          type: "button",
          onClick: () => {
            socket == null || socket.emit("CLIENT:GAME:UPDATE_CLIENT_STATUS" /* CLIENT_UPDATE_CLIENT_STATUS */, {
              userInfo: {
                userId,
                status: (curUser == null ? void 0 : curUser.status) === "READY" ? "NOT_READY" : "READY"
              },
              roomId
            });
          },
          disabled: usersInRoom.length < 2,
          children: usersInRoom.length < 2 ? "Wait for another player to start.." : (curUser == null ? void 0 : curUser.status) === "READY" ? "Remove ready" : "Ready"
        },
        void 0,
        !1,
        {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 300,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/comps/BoardGame/index.tsx",
        lineNumber: 299,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "game-flex-wrapper", children: [
        isPlay && usersInRoom.length >= 2 && initGameStatus === "READY" && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(CountDown_default, { onFinish }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 324,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "game-wrapper", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "game", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("table", { className: "game-table", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tbody", { children: boardState.context.board.map((row, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("tr", { className: "game-row", children: row.map((val, idx2) => /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(
          Cell_default,
          {
            userId: getCellUserId(gameState.context.players, {
              row: idx,
              col: idx2
            }),
            isEnemy: isEnemyCell(
              gameState.context.players,
              userId,
              {
                row: idx,
                col: idx2
              }
            ),
            isMatchCell: isMatchCell(
              solveBoard,
              boardState.context.board,
              {
                row: idx,
                col: idx2
              }
            ),
            isUser: isUserCell(
              gameState.context.players,
              userId,
              {
                row: idx,
                col: idx2
              }
            ),
            selectCell: boardState.context.selectCell,
            setSelectCell: (pair) => {
              boardSend({ type: "MOVE", pair });
            },
            cellIdx: { row: idx, col: idx2 },
            cellVal: initGameStatus === "START" ? val : 0,
            isConflictRow: boardState.context.canRowXNumberY[idx][val] > 1,
            isConflictCol: boardState.context.canColXNumberY[idx2][val] > 1,
            isConflictSquare: boardState.context.canSquareXYNumberZ[idx / 3 >> 0][idx2 / 3 >> 0][val] > 1,
            isDefault: initBoard[idx][idx2] !== 0,
            isSameValue: !!boardState.context.board[boardState.context.selectCell.row][boardState.context.selectCell.col] && boardState.context.board[boardState.context.selectCell.row][boardState.context.selectCell.col] === val
          },
          idx * 10 + idx2,
          !1,
          {
            fileName: "app/comps/BoardGame/index.tsx",
            lineNumber: 334,
            columnNumber: 27
          },
          this
        )) }, idx, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 331,
          columnNumber: 21
        }, this)) }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 329,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 328,
          columnNumber: 15
        }, this) }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 327,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 326,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "game-intro", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("p", { children: "\u{1F579}\uFE0F Play with arrow and number keys" }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 400,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/comps/BoardGame/index.tsx",
          lineNumber: 399,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/comps/BoardGame/index.tsx",
        lineNumber: 322,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/comps/BoardGame/index.tsx",
      lineNumber: 297,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/comps/BoardGame/index.tsx",
    lineNumber: 283,
    columnNumber: 5
  }, this);
}, BoardGame_default = BoardGame;

// app/routes/solo/$roomId.tsx
var import_react13 = require("react");

// app/helper/merge.ts
function mergeMovesWithBoard(moves, board) {
  return moves.forEach((move) => {
    move.moves.forEach((userMove) => {
      board[userMove[0]][userMove[1]] = userMove[2];
    });
  }), board;
}

// app/helper/solve.ts
var SOLVE = (boardValue) => new Promise((resolve, reject) => {
  let canRowXNumberY = new Array(9).fill(0).map(() => new Array(10).fill(!0)), canColXNumberY = new Array(9).fill(0).map(() => new Array(9 + 1).fill(!0)), canSquareXYNumberZ = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(9 + 1).fill(!0)));
  for (let i = 0; i < 9; ++i)
    for (let j = 0; j < 9; ++j)
      if (boardValue[i][j] !== 0) {
        if (!canRowXNumberY[i][boardValue[i][j]] || !canColXNumberY[j][boardValue[i][j]] || !canSquareXYNumberZ[i / 3 >> 0][j / 3 >> 0][boardValue[i][j]]) {
          reject(!1);
          return;
        }
        canRowXNumberY[i][boardValue[i][j]] = !1, canColXNumberY[j][boardValue[i][j]] = !1, canSquareXYNumberZ[i / 3 >> 0][j / 3 >> 0][boardValue[i][j]] = !1;
      }
  let checkValidIndex = (pair, number) => pair.row >= 0 && pair.row < 9 && pair.col >= 0 && pair.col < 9 && canColXNumberY[pair.col][number] && canRowXNumberY[pair.row][number] && canSquareXYNumberZ[Math.floor(pair.row / 3)][Math.floor(pair.col / 3)][number], markIndex = (pair, number, value) => {
    canColXNumberY[pair.col][number] = canRowXNumberY[pair.row][number] = canSquareXYNumberZ[Math.floor(pair.row / 3)][Math.floor(pair.col / 3)][number] = value;
  }, solveSudoku = (sudokuBoard, x, y) => {
    if (sudokuBoard[x][y] !== 0)
      return y + 1 === 9 ? x + 1 === 9 ? !0 : solveSudoku(sudokuBoard, x + 1, 0) : solveSudoku(sudokuBoard, x, y + 1);
    {
      let c = sudokuBoard[x][y];
      for (let i = 1; i <= 9; ++i)
        if (checkValidIndex({ row: x, col: y }, i)) {
          if (sudokuBoard[x][y] = i, markIndex({ row: x, col: y }, i, !1), y + 1 === 9) {
            if (x + 1 === 9 || solveSudoku(sudokuBoard, x + 1, 0))
              return !0;
          } else if (solveSudoku(sudokuBoard, x, y + 1))
            return !0;
          markIndex({ row: x, col: y }, i, !0);
        }
      return sudokuBoard[x][y] = c, !1;
    }
  }, boardSolve = JSON.parse(JSON.stringify(boardValue));
  solveSudoku(boardSolve, 0, 0), resolve(boardSolve);
}), solve_default = SOLVE;

// app/utils/session.server.ts
var import_bcryptjs = __toESM(require("bcryptjs")), import_node3 = require("@remix-run/node");
async function login({
  username,
  password
}) {
  let user = await db.user.findUnique({
    where: { username }
  });
  return !user || !await import_bcryptjs.default.compare(
    password,
    user.passwordHash
  ) ? null : { id: user.id, username };
}
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set");
var storage = (0, import_node3.createCookieSessionStorage)({
  cookie: {
    name: "RJ_session",
    secure: !1,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: !0
  }
});
function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}
async function getUserId(request) {
  let userId = (await getUserSession(request)).get("userId");
  return !userId || typeof userId != "string" ? null : userId;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = (await getUserSession(request)).get("userId");
  if (!userId || typeof userId != "string") {
    let searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw (0, import_node3.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession(userId, redirectTo) {
  let session = await storage.getSession();
  return session.set("userId", userId), (0, import_node3.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (typeof userId != "string")
    return null;
  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: { id: !0, username: !0 }
    });
  } catch {
    throw logout(request);
  }
}
async function logout(request) {
  let session = await getUserSession(request);
  return (0, import_node3.redirect)("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}
async function register({
  username,
  password
}) {
  let passwordHash = await import_bcryptjs.default.hash(password, 10);
  return { id: (await db.user.create({
    data: { username, passwordHash }
  })).id, username };
}

// app/routes/solo/$roomId.tsx
var import_jsx_dev_runtime10 = require("react/jsx-dev-runtime"), links2 = () => [{ rel: "stylesheet", href: styles_default }], action2 = async ({ request }) => {
  if (request.method == "POST") {
    let form = await request.formData(), intent = form.get("intent") + "";
    if (intent === "updateGameMoves") {
      let userId = form.get("userId") + "", roomId = form.get("roomId") + "", newCurUserMoves = form.get("newCurUserMoves") + "", newScore = Number(form.get("newScore"));
      await updateMoves({
        roomId,
        userId,
        moves: newCurUserMoves,
        score: newScore
      });
    }
    if (intent === "updateGameStatus") {
      let roomId = form.get("roomId") + "", gameStatus = form.get("gameStatus") + "", readyUsers = JSON.parse(form.get("readyUsers") + "");
      await updateGameStatus({ gameStatus, id: roomId, readyUsers });
    }
  }
  return "";
}, loader = async ({ params, request }) => {
  if (!params.roomId)
    throw (0, import_node4.json)("Not Found", { status: 404 });
  let userId = await requireUserId(request), room = await getRoom(params.roomId);
  if (!room)
    throw (0, import_node4.json)("Not Found", { status: 404 });
  let moveData = await getMoves({ roomId: params.roomId }), moves = moveData == null ? void 0 : moveData.map((v) => ({
    userId: v.userId,
    moves: JSON.parse((v == null ? void 0 : v.moves) || "[]"),
    score: v.score,
    status: v.role === "PLAYER" ? "PLAYING" : "NOT_READY"
  })), userMoves = moves == null ? void 0 : moves.find((v) => v.userId == userId), board = mergeMovesWithBoard(
    moves,
    JSON.parse(room.board || JSON.stringify(baseBoard))
  ), solveBoard = await solve_default(
    JSON.parse(room.board || JSON.stringify(baseBoard))
  );
  return (0, import_node4.json)({
    solveBoard,
    roomId: room.id,
    gameStatus: room.gameStatus,
    board,
    userId,
    moves,
    curUserStatus: (userMoves == null ? void 0 : userMoves.status) || "NOT_READY",
    curUserMoves: (userMoves == null ? void 0 : userMoves.moves) || [],
    curScore: (userMoves == null ? void 0 : userMoves.score) || 0
  });
};
function SoloRoom() {
  let data = (0, import_react12.useLoaderData)(), socket = useSocket();
  return (0, import_react13.useEffect)(() => {
    !socket || !data || socket.emit("CLIENT:GAME:JOIN_ROOM" /* CLIENT_JOIN_ROOM */, {
      userId: data.userId,
      roomId: data.roomId,
      score: data.curScore,
      moves: data.curUserMoves,
      plus: 0,
      status: data.curUserStatus
    });
  }, [socket, data]), /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(
    BoardGame_default,
    {
      initGameStatus: data.gameStatus,
      solveBoard: data.solveBoard,
      initGameMoves: data.moves,
      userId: data.userId,
      socket,
      roomId: data.roomId,
      initBoard: data.board
    },
    void 0,
    !1,
    {
      fileName: "app/routes/solo/$roomId.tsx",
      lineNumber: 114,
      columnNumber: 5
    },
    this
  );
}

// app/routes/__index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader2
});
var import_node5 = require("@remix-run/node"), import_react17 = require("@remix-run/react");

// app/comps/BoardGame/BotPlay.tsx
var import_react14 = require("react");
var import_jsx_dev_runtime11 = require("react/jsx-dev-runtime"), BoardGame2 = ({
  solveBoard,
  initBoard,
  userId,
  initGameMoves
}) => {
  let sudokuWrapperRef = (0, import_react14.useRef)(null), [isGameStart, setIsGameStart] = (0, import_react14.useState)(!1), [gameMoves, setGameMoves] = (0, import_react14.useState)(initGameMoves), [selectCell, setSelectCell] = (0, import_react14.useState)({ row: 4, col: 4 }), [curBoard, setCurBoard] = (0, import_react14.useState)(initBoard), [firstBoard] = (0, import_react14.useState)(initBoard), [canRowXNumberY, setCanRowXNumberY] = (0, import_react14.useState)(
    new Array(9).fill(0).map(() => new Array(10).fill(0))
  ), [canColXNumberY, setCanColXNumberY] = (0, import_react14.useState)(
    new Array(9).fill(0).map(() => new Array(10).fill(0))
  ), [canSquareXYNumberZ, setCanSquareXYNumberZ] = (0, import_react14.useState)(
    new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)))
  );
  return (0, import_react14.useEffect)(() => {
    if (!isGameStart || sudokuWrapperRef === null)
      return;
    let currentSudokuRef = sudokuWrapperRef.current, makeMove = (pair, value, userPlayId) => {
      setCurBoard((preState) => {
        let newBoardValue = JSON.parse(JSON.stringify(preState));
        return newBoardValue[pair.row][pair.col] = value, newBoardValue;
      }), setGameMoves((preState) => {
        let curInfo = preState.find((v) => v.userId == userPlayId);
        if (curInfo) {
          value ? solveBoard[pair.row][pair.col] == value ? (curInfo.plus = 50, curInfo.score += 50) : (curInfo.plus = -100, curInfo.score += -100) : curInfo.plus = 0;
          let isExistCell = curInfo.moves.findIndex((v) => v[0] == pair.row && v[1] == pair.col);
          return isExistCell != -1 ? curInfo.moves[isExistCell] = [pair.row, pair.col, value] : curInfo.moves.push([pair.row, pair.col, value]), JSON.parse(JSON.stringify(preState));
        }
        return preState;
      });
    }, handleKeyDown = (e) => {
      e.preventDefault();
      let value = -1;
      "1234567890".includes(e.key) ? value = Number.parseInt(e.key, 10) : e.key === "Backspace" ? value = 0 : e.key === "ArrowUp" ? setSelectCell((preState) => ({
        row: (preState.row - 1 + 9) % 9,
        col: preState.col
      })) : e.key === "ArrowLeft" ? setSelectCell((preState) => ({
        row: preState.row,
        col: (preState.col - 1 + 9) % 9
      })) : e.key === "ArrowRight" ? setSelectCell((preState) => ({
        row: preState.row,
        col: (preState.col + 1) % 9
      })) : e.key === "ArrowDown" && setSelectCell((preState) => ({
        row: (preState.row + 1) % 9,
        col: preState.col
      })), !e.repeat && checkValid(
        value,
        gameMoves,
        userId,
        initBoard,
        solveBoard,
        curBoard,
        selectCell
      ) && value !== -1 && makeMove(selectCell, value, userId);
    };
    return currentSudokuRef == null || currentSudokuRef.addEventListener("keydown", handleKeyDown), function() {
      currentSudokuRef && (currentSudokuRef == null || currentSudokuRef.removeEventListener("keydown", handleKeyDown));
    };
  }, [
    isGameStart,
    gameMoves,
    initBoard,
    curBoard,
    solveBoard,
    userId,
    sudokuWrapperRef,
    selectCell
  ]), (0, import_react14.useEffect)(() => {
    (() => {
      let newCanRowXNumberY = new Array(9).fill(0).map(() => new Array(10).fill(0)), newCanColXNumberY = new Array(9).fill(0).map(() => new Array(10).fill(0)), newCanSquareXYNumberZ = new Array(3).fill(0).map(() => new Array(3).fill(0).map(() => new Array(10).fill(0)));
      for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
          curBoard[i][j] !== 0 && (newCanRowXNumberY[i][curBoard[i][j]] += 1, newCanColXNumberY[j][curBoard[i][j]] += 1, newCanSquareXYNumberZ[i / 3 >> 0][j / 3 >> 0][curBoard[i][j]] += 1);
      setCanRowXNumberY(newCanRowXNumberY), setCanColXNumberY(newCanColXNumberY), setCanSquareXYNumberZ(newCanSquareXYNumberZ);
    })();
  }, [curBoard]), (0, import_react14.useEffect)(() => {
    if (!isGameStart)
      return;
    let makeMove = (pair, value, userPlayId) => {
      setCurBoard((preState) => {
        let newBoardValue = JSON.parse(JSON.stringify(preState));
        return newBoardValue[pair.row][pair.col] = value, newBoardValue;
      }), setGameMoves((preState) => {
        let curInfo = preState.find((v) => v.userId == userPlayId);
        if (curInfo) {
          value ? solveBoard[pair.row][pair.col] == value ? (curInfo.plus = 50, curInfo.score += 50) : (curInfo.plus = -100, curInfo.score += -100) : curInfo.plus = 0;
          let isExistCell = curInfo.moves.findIndex((v) => v[0] == pair.row && v[1] == pair.col);
          return isExistCell != -1 ? curInfo.moves[isExistCell] = [pair.row, pair.col, value] : curInfo.moves.push([pair.row, pair.col, value]), JSON.parse(JSON.stringify(preState));
        }
        return preState;
      });
    }, xyz = setInterval(() => {
      let row = randBetween(0, 8), col = randBetween(0, 8), value = randBetween(1, 10) <= 5 ? solveBoard[row][col] : randBetween(1, 9);
      checkValid(
        value,
        gameMoves,
        "BOT_LOCAL_ID",
        initBoard,
        solveBoard,
        curBoard,
        { row, col }
      ) && makeMove({ row, col }, value, "BOT_LOCAL_ID");
    }, 2e3);
    return () => {
      clearInterval(xyz);
    };
  }, [isGameStart, curBoard, gameMoves, initBoard, solveBoard]), (0, import_react14.useEffect)(() => {
  }, []), /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "sudoku-wrapper", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "score-wrapper", children: [
      gameMoves.map((userInRoom) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
        Score,
        {
          userId: userInRoom.userId,
          isUser: userInRoom.userId == userId,
          score: userInRoom.score,
          plusPoint: userInRoom.plus || 0,
          status: ""
        },
        userInRoom.userId,
        !1,
        {
          fileName: "app/comps/BoardGame/BotPlay.tsx",
          lineNumber: 258,
          columnNumber: 11
        },
        this
      )),
      !isGameStart && /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "start-button-c", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
        "button",
        {
          className: "start-button",
          type: "button",
          onClick: () => {
            setIsGameStart(!0);
          },
          children: "Play with bot"
        },
        void 0,
        !1,
        {
          fileName: "app/comps/BoardGame/BotPlay.tsx",
          lineNumber: 269,
          columnNumber: 13
        },
        this
      ) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 268,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/comps/BoardGame/BotPlay.tsx",
      lineNumber: 256,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "game-flex-wrapper", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "game-wrapper", ref: sudokuWrapperRef, tabIndex: -1, children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "game", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("table", { className: "game-table", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("tbody", { children: curBoard.map((row, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("tr", { className: "game-row", children: row.map((val, idx2) => /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(
        Cell_default,
        {
          userId: getCellUserId(gameMoves, {
            row: idx,
            col: idx2
          }),
          isEnemy: isEnemyCell(gameMoves, userId, {
            row: idx,
            col: idx2
          }),
          isMatchCell: isMatchCell(solveBoard, curBoard, {
            row: idx,
            col: idx2
          }),
          isUser: isUserCell(gameMoves, userId, {
            row: idx,
            col: idx2
          }),
          selectCell,
          setSelectCell,
          cellIdx: { row: idx, col: idx2 },
          cellVal: isGameStart ? val : 0,
          isConflictRow: canRowXNumberY[idx][val] > 1,
          isConflictCol: canColXNumberY[idx2][val] > 1,
          isConflictSquare: canSquareXYNumberZ[idx / 3 >> 0][idx2 / 3 >> 0][val] > 1,
          isDefault: firstBoard[idx][idx2] !== 0,
          isSameValue: !!curBoard[selectCell.row][selectCell.col] && curBoard[selectCell.row][selectCell.col] === val
        },
        idx2,
        !1,
        {
          fileName: "app/comps/BoardGame/BotPlay.tsx",
          lineNumber: 291,
          columnNumber: 25
        },
        this
      )) }, idx, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 288,
        columnNumber: 19
      }, this)) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 286,
        columnNumber: 15
      }, this) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 285,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 284,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 283,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "game-intro", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("p", { children: "\u{1F579}\uFE0F Play with arrow and number keys" }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 336,
        columnNumber: 11
      }, this) }, void 0, !1, {
        fileName: "app/comps/BoardGame/BotPlay.tsx",
        lineNumber: 335,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/comps/BoardGame/BotPlay.tsx",
      lineNumber: 282,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/comps/BoardGame/BotPlay.tsx",
    lineNumber: 255,
    columnNumber: 5
  }, this);
}, BotPlay_default = BoardGame2;

// app/comps/Header/index.tsx
var import_react15 = require("@remix-run/react"), import_jsx_dev_runtime12 = require("react/jsx-dev-runtime");
function Header({ user }) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "app-header", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("nav", { children: user ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("form", { action: "/logout", method: "post", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { type: "submit", className: "button", children: "Sign out" }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 16,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 15,
      columnNumber: 11
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(import_react15.Link, { to: "/login", children: "Sign in" }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 21,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 13,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "app-header__slogan", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "slogan--highlight", children: "Competitive sudoku" }, void 0, !1, {
        fileName: "app/comps/Header/index.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: "slogan", children: "Where we can train our mind. Play with friends. May the force be with you!" }, void 0, !1, {
        fileName: "app/comps/Header/index.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: (user == null ? void 0 : user.username) == "kody" ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("form", { method: "post", action: "/", children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { type: "submit", children: "Create game" }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 36,
      columnNumber: 13
    }, this) }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 35,
      columnNumber: 11
    }, this) : "" }, void 0, !1, {
      fileName: "app/comps/Header/index.tsx",
      lineNumber: 33,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/comps/Header/index.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}

// app/routes/__index.tsx
var import_react18 = require("@remix-run/react");

// app/comps/UsersOnline/UsersOnline.tsx
var import_react16 = require("react");

// app/assets/empty-users.jpeg
var empty_users_default = "/build/_assets/empty-users-4AYPMDE5.jpeg";

// app/comps/UsersOnline/UsersOnline.tsx
var import_jsx_dev_runtime13 = require("react/jsx-dev-runtime");
function UsersOnline({ user }) {
  let [show, setShow] = (0, import_react16.useState)(!1), [users, setUsers] = (0, import_react16.useState)([]), socket = useSocket();
  return (0, import_react16.useEffect)(() => {
    !socket || socket.on("connect", () => {
      socket.emit("CLIENT:CONNECTED" /* CLIENT_CONNECTED */, { user, socketId: socket.id });
    });
  }, [socket, user]), (0, import_react16.useEffect)(() => {
    !socket || socket.on("SERVER:CLIENT:CONNECTED" /* SERVER_CLIENT_CONNECTED */, (listUserOnline) => {
      setUsers(listUserOnline);
    });
  }, [socket]), /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `list-user-c ${show ? "" : "show"}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "list-user", children: users.length > 0 ? users.map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "user-info", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
        "img",
        {
          className: "user-info__avatar",
          src: hashToAvatar(v != null && v.userId ? v.userId : v.socketId),
          alt: "avatar",
          width: 48,
          height: 48
        },
        void 0,
        !1,
        {
          fileName: "app/comps/UsersOnline/UsersOnline.tsx",
          lineNumber: 43,
          columnNumber: 15
        },
        this
      ),
      v != null && v.userId ? v.username : "Guest"
    ] }, v.socketId, !0, {
      fileName: "app/comps/UsersOnline/UsersOnline.tsx",
      lineNumber: 42,
      columnNumber: 13
    }, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "empty-info empty-user", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("img", { src: empty_users_default, alt: "empty user" }, void 0, !1, {
        fileName: "app/comps/UsersOnline/UsersOnline.tsx",
        lineNumber: 55,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "empty-text", children: "People not join the game yet." }, void 0, !1, {
        fileName: "app/comps/UsersOnline/UsersOnline.tsx",
        lineNumber: 56,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/comps/UsersOnline/UsersOnline.tsx",
      lineNumber: 54,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/comps/UsersOnline/UsersOnline.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(
      "div",
      {
        className: "list-user-tag",
        onClick: () => {
          setShow((pre) => !pre);
        },
        children: "Users Online"
      },
      void 0,
      !1,
      {
        fileName: "app/comps/UsersOnline/UsersOnline.tsx",
        lineNumber: 60,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/comps/UsersOnline/UsersOnline.tsx",
    lineNumber: 38,
    columnNumber: 5
  }, this);
}

// app/routes/__index.tsx
var import_jsx_dev_runtime14 = require("react/jsx-dev-runtime"), loader2 = async ({ request }) => {
  let user = await getUser(request), board = await random_default(), solveBoard = await solve_default(board), rooms = await getRooms();
  return (0, import_node5.json)({
    user,
    solveBoard,
    board,
    rooms
  });
};
function Index() {
  let data = (0, import_react17.useLoaderData)(), user = data.user;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Header, { user }, void 0, !1, {
      fileName: "app/routes/__index.tsx",
      lineNumber: 39,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "lobby-c", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(import_react18.Outlet, {}, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(
        BotPlay_default,
        {
          solveBoard: data.solveBoard,
          initGameMoves: [
            {
              moves: [],
              userId: "USER_LOCAL_ID",
              score: 0,
              plus: 0
            },
            {
              moves: [],
              userId: "BOT_LOCAL_ID",
              score: 0,
              plus: 0
            }
          ],
          userId: "USER_LOCAL_ID",
          initBoard: data.board
        },
        void 0,
        !1,
        {
          fileName: "app/routes/__index.tsx",
          lineNumber: 43,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(UsersOnline, { rooms: data.rooms, user: data.user }, void 0, !1, {
        fileName: "app/routes/__index.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/__index.tsx",
    lineNumber: 38,
    columnNumber: 5
  }, this);
}

// app/routes/__index/index.tsx
var index_exports2 = {};
__export(index_exports2, {
  default: () => Lobby,
  loader: () => loader3
});
var import_node6 = require("@remix-run/node"), import_react19 = require("@remix-run/react"), import_date_fns = require("date-fns"), import_react20 = require("react");

// app/assets/svg/LookUp.tsx
var import_jsx_dev_runtime15 = require("react/jsx-dev-runtime"), SvgComponent = () => /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("svg", { width: 16, height: 16, fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(
  "path",
  {
    d: "M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12ZM15 15l-3-3",
    stroke: "#4A5568",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  void 0,
  !1,
  {
    fileName: "app/assets/svg/LookUp.tsx",
    lineNumber: 4,
    columnNumber: 5
  },
  this
) }, void 0, !1, {
  fileName: "app/assets/svg/LookUp.tsx",
  lineNumber: 3,
  columnNumber: 3
}, this), LookUp_default = SvgComponent;

// app/assets/empty-rooms.jpeg
var empty_rooms_default = "/build/_assets/empty-rooms-JSBYN5KD.jpeg";

// app/routes/__index/index.tsx
var import_jsx_dev_runtime16 = require("react/jsx-dev-runtime"), loader3 = async ({ request }) => {
  let rooms = await getRooms();
  return (0, import_node6.json)({
    rooms
  });
};
function Lobby() {
  let data = (0, import_react19.useLoaderData)(), [show, setShow] = (0, import_react20.useState)(!1), navigate = (0, import_react19.useNavigate)(), getRoomFormRef = (0, import_react20.useRef)(null);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `list-room-c ${show ? "" : "show"}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "list-room", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: "app-header__findroom", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(LookUp_default, {}, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 38,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 37,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("form", { onSubmit: (e) => {
          if (e.preventDefault(), getRoomFormRef.current) {
            let idRoom = new FormData(getRoomFormRef.current).get("idRoom");
            navigate(`/solo/${idRoom}`);
          }
        }, ref: getRoomFormRef, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("input", { name: "idRoom", placeholder: "Type the room id.." }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 41,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 40,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      data.rooms.length > 0 ? data.rooms.map((v, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "room-info", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_react19.Link, { to: `/solo/${v.id}`, children: [
        "Room ",
        idx + 1,
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "room-info__time", children: (0, import_date_fns.formatDistanceToNowStrict)(new Date(v.createdAt)) }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 49,
          columnNumber: 17
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 47,
        columnNumber: 15
      }, this) }, v.id, !1, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 46,
        columnNumber: 13
      }, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "empty-info empty-room", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("img", { src: empty_rooms_default, alt: "empty room" }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 57,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "empty-text", children: "Admin will create a room soon." }, void 0, !1, {
          fileName: "app/routes/__index/index.tsx",
          lineNumber: 58,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/__index/index.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(
      "div",
      {
        className: "list-room-tag",
        onClick: () => {
          setShow((pre) => !pre);
        },
        children: "Room Name"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/__index/index.tsx",
        lineNumber: 62,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, !0, {
    fileName: "app/routes/__index/index.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader4
});
var import_node7 = require("@remix-run/node");
var action3 = async ({ request }) => logout(request), loader4 = async () => (0, import_node7.redirect)("/");

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action4,
  default: () => Login,
  links: () => links3
});
var import_react21 = require("@remix-run/react");

// app/styles/login.css
var login_default = "/build/_assets/login-33ZAKSOR.css";

// app/utils/request.server.ts
var import_node8 = require("@remix-run/node"), badRequest = (data) => (0, import_node8.json)(data, { status: 400 });

// app/routes/login.tsx
var import_jsx_dev_runtime17 = require("react/jsx-dev-runtime"), links3 = () => [
  { rel: "stylesheet", href: login_default }
];
function validateUsername(username) {
  if (typeof username != "string" || username.length < 3)
    return "Usernames must be at least 3 characters long";
}
function validatePassword(password) {
  if (typeof password != "string" || password.length < 6)
    return "Passwords must be at least 6 characters long";
}
function validateUrl(url) {
  return ["/solo"].findIndex((v) => (url + "").startsWith(v)) != -1 ? url : "/";
}
var action4 = async ({ request }) => {
  let form = await request.formData(), loginType = form.get("loginType"), username = form.get("username"), password = form.get("password"), redirectTo = validateUrl(form.get("redirectTo") || "/");
  if (typeof loginType != "string" || typeof username != "string" || typeof password != "string" || typeof redirectTo != "string")
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly."
    });
  let fields = { loginType, username, password }, fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({
      fieldErrors,
      fields,
      formError: null
    });
  switch (loginType) {
    case "login": {
      let user = await login({ username, password });
      return user ? createUserSession(user.id, redirectTo) : badRequest({
        fieldErrors: null,
        fields,
        formError: "Username/Password combination is incorrect"
      });
    }
    case "register": {
      if (await db.user.findFirst({
        where: { username }
      }))
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`
        });
      let user = await register({ username, password });
      return user ? createUserSession(user.id, redirectTo) : badRequest({
        fieldErrors: null,
        fields,
        formError: "Something went wrong trying to create a new user."
      });
    }
    default:
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid"
      });
  }
};
function Login() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  let actionData = (0, import_react21.useActionData)(), [searchParams] = (0, import_react21.useSearchParams)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "background-wrapper", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("section", { className: "container login-content", children: /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "content", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("h1", { children: "Sign in to Your Account" }, void 0, !1, {
        fileName: "app/routes/login.tsx",
        lineNumber: 125,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("form", { method: "post", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("input", { type: "hidden", name: "loginType", value: "login" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
          "input",
          {
            type: "hidden",
            name: "redirectTo",
            value: searchParams.get("redirectTo") ?? void 0
          },
          void 0,
          !1,
          {
            fileName: "app/routes/login.tsx",
            lineNumber: 128,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "login-field username", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("label", { htmlFor: "username-input", children: "Username" }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 134,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            "input",
            {
              type: "text",
              autoFocus: !0,
              id: "username-input",
              name: "username",
              defaultValue: (_a = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _a.username,
              "aria-invalid": Boolean((_b = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _b.username),
              "aria-errormessage": (_c = actionData == null ? void 0 : actionData.fieldErrors) != null && _c.username ? "username-error" : void 0
            },
            void 0,
            !1,
            {
              fileName: "app/routes/login.tsx",
              lineNumber: 135,
              columnNumber: 15
            },
            this
          ),
          (_d = actionData == null ? void 0 : actionData.fieldErrors) != null && _d.username ? /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            "p",
            {
              className: "form-validation-error",
              role: "alert",
              id: "username-error",
              children: actionData.fieldErrors.username
            },
            void 0,
            !1,
            {
              fileName: "app/routes/login.tsx",
              lineNumber: 149,
              columnNumber: 17
            },
            this
          ) : null
        ] }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 133,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { className: "login-field password", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("label", { htmlFor: "password-input", children: "Password" }, void 0, !1, {
            fileName: "app/routes/login.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            "input",
            {
              id: "password-input",
              name: "password",
              type: "password",
              defaultValue: (_e = actionData == null ? void 0 : actionData.fields) == null ? void 0 : _e.password,
              "aria-invalid": Boolean((_f = actionData == null ? void 0 : actionData.fieldErrors) == null ? void 0 : _f.password),
              "aria-errormessage": (_g = actionData == null ? void 0 : actionData.fieldErrors) != null && _g.password ? "password-error" : void 0
            },
            void 0,
            !1,
            {
              fileName: "app/routes/login.tsx",
              lineNumber: 160,
              columnNumber: 15
            },
            this
          ),
          (_h = actionData == null ? void 0 : actionData.fieldErrors) != null && _h.password ? /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)(
            "p",
            {
              className: "form-validation-error",
              role: "alert",
              id: "password-error",
              children: actionData.fieldErrors.password
            },
            void 0,
            !1,
            {
              fileName: "app/routes/login.tsx",
              lineNumber: 173,
              columnNumber: 17
            },
            this
          ) : null
        ] }, void 0, !0, {
          fileName: "app/routes/login.tsx",
          lineNumber: 158,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("div", { id: "form-error-message", children: actionData != null && actionData.formError ? /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("p", { className: "form-validation-error", role: "alert", children: actionData.formError }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 184,
          columnNumber: 17
        }, this) : null }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 182,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("button", { type: "submit", className: "button", children: "Submit" }, void 0, !1, {
          fileName: "app/routes/login.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/login.tsx",
        lineNumber: 126,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/login.tsx",
      lineNumber: 124,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime17.jsxDEV)("aside", { className: "login-aside" }, void 0, !1, {
      fileName: "app/routes/login.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/login.tsx",
    lineNumber: 122,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "0c943597", entry: { module: "/build/entry.client-QC3RJXW4.js", imports: ["/build/_shared/chunk-SZTH422T.js", "/build/_shared/chunk-DF3EUDCN.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-5AJCBSGT.js", imports: ["/build/_shared/chunk-JNKTGLQ6.js", "/build/_shared/chunk-JCRALK6Z.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !0, hasErrorBoundary: !1 }, "routes/__index": { id: "routes/__index", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/__index-3DNUT5A4.js", imports: ["/build/_shared/chunk-N4GJFGYA.js", "/build/_shared/chunk-XCSNGQWA.js", "/build/_shared/chunk-UEO7475F.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/__index/index": { id: "routes/__index/index", parentId: "routes/__index", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/__index/index-BLCKDDH7.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-TZI7TBBN.js", imports: ["/build/_shared/chunk-UEO7475F.js"], hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-CG5UQZAS.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/solo/$roomId": { id: "routes/solo/$roomId", parentId: "root", path: "solo/:roomId", index: void 0, caseSensitive: void 0, module: "/build/routes/solo/$roomId-P3URMZ4B.js", imports: ["/build/_shared/chunk-N4GJFGYA.js", "/build/_shared/chunk-XCSNGQWA.js", "/build/_shared/chunk-UEO7475F.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-0C943597.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_meta: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/solo/$roomId": {
    id: "routes/solo/$roomId",
    parentId: "root",
    path: "solo/:roomId",
    index: void 0,
    caseSensitive: void 0,
    module: roomId_exports
  },
  "routes/__index": {
    id: "routes/__index",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/__index/index": {
    id: "routes/__index/index",
    parentId: "routes/__index",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports2
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
