import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRooms } from "~/utils/room.server";

export const loader = async ({ request }: LoaderArgs) => {
  const rooms = await getRooms();

  return json({
    rooms,
  });
};

export default function Lobby() {
  const data = useLoaderData<typeof loader>();

  console.log(data);

  return (
    <div>
      <div>
        <div>Room Name</div>
      </div>
      <div className="list-room">
        {data.rooms.map((v, idx) => (
          <div className="room-info" key={v.id}>
            <Link to={`/solo/${v.id}`}>Room {idx + 1}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
