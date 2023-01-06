import {
  ActionArgs,
  json, LinksFunction, LoaderFunction
} from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import BoardGame from "~/comps/BoardGame";

import { useEffect } from "react";
import { baseBoard } from "~/const/board";
import { useSocket } from "~/context";
import stylesUrl from "~/styles/index.css";
import { getMoves, getRoom, joinRoom, updateMoves } from "~/utils/room.server";
import { requireUserId } from "~/utils/session.server";
import mergeMovesWithBoard from "~/helper/merge";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method == "POST") {
    const form = await request.formData();
    const userId = form.get("userId");
    const roomId = form.get("roomId");
    const newCurUserMoves = form.get("newCurUserMoves");
    await updateMoves({ roomId, userId, moves: newCurUserMoves });
  }
  return "";
}

export const loader: LoaderFunction = async ({
  params,
  request
}) => {
  const userId = await requireUserId(request);
  const room = await getRoom(params.roomId);
  await joinRoom({ userId, roomId: params.roomId });
  const moveData = await getMoves({ roomId: params.roomId });
  const moves = moveData?.map((v => {
    return {
      userId: v.userId,
      moves: JSON.parse(v?.moves || '[]')
    }
  }))
  const userMoves = moves?.find(v => v.userId == userId);
  const board = mergeMovesWithBoard(moves, JSON.parse(room?.board || JSON.stringify(baseBoard)));
  return json({
    roomId: room?.id,
    board,
    userId,
    moves,
    curUserMoves: userMoves?.moves || []
  });
};

export default function SoloRoom() {
  const data = useLoaderData<typeof loader>();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    if (!data) return;

    socket.emit('joinRoom', { username: data.userId, roomId: data.roomId });
  }, [socket, data]);

  return (
    <BoardGame initMoves={data.moves} initCurUserMoves={data.curUserMoves} userId={data.userId} socket={socket} roomId={data.roomId} boardData={data.board} />
  )
}