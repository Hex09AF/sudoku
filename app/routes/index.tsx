import { json, LinksFunction, LoaderArgs } from "@remix-run/node";

import Header from "~/comps/Header";
import stylesUrl from "~/styles/index.css";

import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import BoardGame from "~/comps/BoardGame";
import zeroBoard, { baseBoard } from "~/const/board";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return json({
    user,
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div
        style={{
          padding: "1rem 1rem",
          height: 64,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Header user={data.user} />
        Competitive sudoku
        <div>12312312312312312 Vào trận </div>
        <div>
          {data.user?.username == "kody" ? (
            <form method="post" action="/">
              <button type="submit">Tạo trận</button>
            </form>
          ) : (
            ""
          )}
        </div>
      </div>
      <BoardGame
        userId={1}
        boardData={zeroBoard}
        solveBoard={baseBoard}
        initMoves={[]}
        initCurUserMoves={[]}
      />
    </div>
  );
}
