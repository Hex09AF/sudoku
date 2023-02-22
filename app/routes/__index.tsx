import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import BoardGame from "~/comps/BoardGame/BotPlay";
import Header from "~/comps/Header";

import RANDOMBOARD from "~/helper/random";
import SOLVE from "~/helper/solve";
import { getUser } from "~/utils/session.server";

import { Outlet } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  const board = await RANDOMBOARD();

  const solveBoard = await SOLVE(board);

  return json({
    user,
    solveBoard,
    board,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = data.user as { id: string; username: string };

  return (
    <div>
      <Header user={user} />

      <div className="lobby-c">
        <Outlet />
        <BoardGame
          solveBoard={data.solveBoard}
          initGameMoves={[
            {
              moves: [],
              userId: "USER_LOCAL_ID",
              score: 0,
              plus: 0,
            },
            {
              moves: [],
              userId: "BOT_LOCAL_ID",
              score: 0,
              plus: 0,
            },
          ]}
          userId={"USER_LOCAL_ID"}
          initBoard={data.board}
        />
      </div>
    </div>
  );
}
