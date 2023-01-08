import { json } from "@remix-run/node";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";

import LookUp from "~/assets/svg/LookUp";

import Header from "~/comps/Header";
import stylesUrl from "~/styles/index.css";

import { useLoaderData } from "@remix-run/react";
import BoardGame from "~/comps/BoardGame";
import zeroBoard, { baseBoard } from "~/const/board";
import { getUser } from "~/utils/session.server";

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
          gap: 8,
          padding: "1rem 1rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "rgb(0 0 0 / 8%) 0 1px",
        }}
      >
        <Header user={data.user} />
        <div
          style={{
            maxWidth: 300,
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              marginRight: 8,
            }}
          >
            Competitive sudoku
          </span>
          <span
            style={{
              color: "#636369",
            }}
          >
            Where we can train our mind. Play with friends. May the force be
            with you!
          </span>
        </div>
        <div
          style={{
            borderRadius: 8,
            padding: "0.5rem 1rem",
            background: "#f2f2f3",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <LookUp /> Find room...
        </div>
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
