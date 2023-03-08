import type {
  ActionArgs,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BoardGame from "~/comps/BoardGame";

import { useEffect } from "react";
import { baseBoard } from "~/const/board";
import { useSocket } from "~/context";
import mergeMovesWithBoard from "~/helper/merge";
import SOLVE from "~/helper/solve";
import stylesUrl from "~/styles/index.css";
import {
  getMoves,
  getRoom,
  updateMoves,
  updateGameStatus,
} from "~/utils/room.server";
import { requireUserId } from "~/utils/session.server";
import { SocketEvent } from "~/declares/interfaces/Socket";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method == "POST") {
    const form = await request.formData();
    const intent = form.get("intent") + "";

    if (intent === "updateGameMoves") {
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
    if (intent === "updateGameStatus") {
      const roomId = form.get("roomId") + "";
      const gameStatus = form.get("gameStatus") + "";
      const readyUsers = JSON.parse(form.get("readyUsers") + "");
      await updateGameStatus({ gameStatus, id: roomId, readyUsers });
    }
  }
  return "";
};

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.roomId) {
    throw json("Not Found", { status: 404 });
  }
  const userId = await requireUserId(request);
  const room = await getRoom(params.roomId);
  if (!room) {
    throw json("Not Found", { status: 404 });
  }
  const moveData = await getMoves({ roomId: params.roomId });
  const moves = moveData?.map((v) => {
    return {
      userId: v.userId,
      moves: JSON.parse(v?.moves || "[]"),
      score: v.score,
      status: v.role === "PLAYER" ? "PLAYING" : "NOT_READY",
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
    gameStatus: room.gameStatus,
    board,
    userId,
    moves,
    curUserStatus: userMoves?.status || "NOT_READY",
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
    socket.emit(SocketEvent.CLIENT_JOIN_ROOM, {
      userId: data.userId,
      roomId: data.roomId,
      score: data.curScore,
      moves: data.curUserMoves,
      plus: 0,
      status: data.curUserStatus,
    });
  }, [socket, data]);

  return (
    <BoardGame
      initGameStatus={data.gameStatus}
      solveBoard={data.solveBoard}
      initGameMoves={data.moves}
      userId={data.userId}
      socket={socket}
      roomId={data.roomId}
      initBoard={data.board}
    />
  );
}
