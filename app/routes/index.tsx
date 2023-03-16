import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import BoardGame from "~/features/sudoku/BotVersion";
import Header from "~/comps/Header";

import RANDOMBOARD from "~/utils/helper/random";
import SOLVE from "~/utils/helper/solve";
import { getUser } from "~/utils/session.server";

import { Outlet } from "@remix-run/react";
import UsersOnline from "~/features/home/UsersOnline";
import { getRooms } from "~/utils/room.server";

import stylesUrl from "~/styles/home/home.css";
import stylesSudokuUrl from "~/styles/sudoku/index.css";
import AvailableRoom from "~/features/home/AvailableRoom";
import { useSocket } from "~/context";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: stylesSudokuUrl },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  const board = await RANDOMBOARD();

  const solveBoard = await SOLVE(board);

  const rooms = await getRooms();

  return json({
    user,
    solveBoard,
    board,
    rooms,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = data.user as { id: string; username: string };

  return (
    <div>
      <Header user={user} />

      <div className="lobby-c">
        <AvailableRoom rooms={data.rooms} />
        <BoardGame
          solveBoard={data.solveBoard}
          initGameMoves={[
            {
              moves: [],
              userId: "USER_LOCAL_ID",
              score: 0,
              plus: 0,
              status: "READY",
              socketStatus: "ONLINE",
            },
            {
              moves: [],
              userId: "BOT_LOCAL_ID",
              score: 0,
              plus: 0,
              status: "READY",
              socketStatus: "ONLINE",
            },
          ]}
          userId={"USER_LOCAL_ID"}
          initBoard={data.board}
        />
        <UsersOnline user={data.user} />
      </div>
    </div>
  );
}
