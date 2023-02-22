import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getRooms } from "~/utils/room.server";

export const loader = async ({ request }: LoaderArgs) => {
  const rooms = await getRooms();

  return json({
    rooms,
  });
};

export default function Lobby() {
  const data = useLoaderData<typeof loader>();
  const [show, setShow] = useState(false);
  return (
    <div className={`list-room-c ${show ? "show" : ""}`}>
      <div className="list-room">
        {data.rooms.map((v, idx) => (
          <div className="room-info" key={v.id}>
            <Link to={`/solo/${v.id}`}>Room {idx + 1}</Link>
          </div>
        ))}
      </div>
      <div
        className="list-room-tag"
        onClick={() => {
          setShow((pre) => !pre);
        }}
      >
        Room Name
      </div>
    </div>
  );
}
