import { useLoaderData, useParams } from "@remix-run/react";
import {
  LoaderFunction,
  ActionFunction,
  LinksFunction,
  json,
} from "@remix-run/node"; // or cloudflare/deno
import BoardGame from "~/comps/BoardGame";

import stylesUrl from "~/styles/index.css";
import { getRoom } from "~/utils/room.server";
import { baseBoard } from "~/const/board";
import { requireUserId } from "~/utils/session.server";
import { useSocket } from "~/context";
import { useEffect } from "react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async ({
  params,
  request
}) => {
  const userId = await requireUserId(request);
  const room = await getRoom(params.roomId);
  return json({
    room,
    userId
  });
};

export default function SoloRoom() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  console.log(data);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    if (!data) return;


    socket.on("event", (data) => {
      console.log(data);
    });

    socket.emit('joinRoom', { username: data.userId, roomId: data.room.id });
  }, [socket, data]);

  return (
    <BoardGame userId={data.userId} socket={socket} roomId={data.room.id} boardData={JSON.parse(data.room.board) || baseBoard} />
  )
}