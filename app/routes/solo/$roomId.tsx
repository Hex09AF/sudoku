import type {
  ActionArgs,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import type { ThrownResponse } from "@remix-run/react";
import BoardGame from "~/comps/BoardGame";

import { useEffect } from "react";
import { baseBoard } from "~/const/board";
import { useSocket } from "~/context";
import mergeMovesWithBoard from "~/helper/merge";
import SOLVE from "~/helper/solve";
import stylesUrl from "~/styles/index.css";
import { getMoves, getRoom, joinRoom, updateMoves } from "~/utils/room.server";
import { requireUserId } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method == "POST") {
    const form = await request.formData();
    const userId = form.get("userId") + "";
    const roomId = form.get("roomId") + "";
    const newCurUserMoves = form.get("newCurUserMoves") + "";
    const newScore = Number(form.get("newScore"));
    await updateMoves({
      roomId,
      userId,
      moves: newCurUserMoves,
      score: newScore,
    });
  }
  return "";
};

export type RoomNotFoundResponse = ThrownResponse<404, string>;

export type ThrownResponses = RoomNotFoundResponse;

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.roomId) {
    throw json("Not Found", { status: 404 });
  }
  const userId = await requireUserId(request);
  const room = await getRoom(params.roomId);
  if (!room) {
    throw json("Not Found", { status: 404 });
  }
  await joinRoom({ userId, roomId: params.roomId });
  const moveData = await getMoves({ roomId: params.roomId });
  const moves = moveData?.map((v) => {
    return {
      userId: v.userId,
      moves: JSON.parse(v?.moves || "[]"),
      score: v.score,
    };
  });
  const userMoves = moves?.find((v) => v.userId == userId);
  const board = mergeMovesWithBoard(
    moves,
    JSON.parse(room.board || JSON.stringify(baseBoard))
  );
  const solveBoard = await SOLVE(
    JSON.parse(room.board || JSON.stringify(baseBoard))
  );
  return json({
    solveBoard,
    roomId: room.id,
    board,
    userId,
    moves,
    curUserMoves: userMoves?.moves || [],
    curScore: userMoves?.score || 0,
  });
};

export default function SoloRoom() {
  const data = useLoaderData<typeof loader>();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    if (!data) return;
    socket.emit("joinRoom", {
      userId: data.userId,
      roomId: data.roomId,
      score: data.curScore,
      moves: data.curUserMoves,
      plus: 0,
    });
  }, [socket, data]);

  return (
    <BoardGame
      solveBoard={data.solveBoard}
      initMoves={data.moves}
      userId={data.userId}
      socket={socket}
      roomId={data.roomId}
      boardData={data.board}
    />
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponses>();

  switch (caught.status) {
    case 404:
      return <div>Room not found!</div>;
    default:
  }

  return (
    <div>
      Something went wrong: {caught.status} {caught.statusText}
    </div>
  );
}
