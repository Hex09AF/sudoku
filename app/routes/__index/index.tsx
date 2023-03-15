import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRef, useState } from "react";
import LookUp from "~/assets/svg/LookUp";
import { getRooms } from "~/utils/room.server";
import EmptyRoom from "~/assets/empty-rooms.jpeg";
import { Input } from "~/comps/Input";

export const loader = async ({ request }: LoaderArgs) => {
  const rooms = await getRooms();

  return json({
    rooms,
  });
};

export default function Lobby() {
  const data = useLoaderData<typeof loader>();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const getRoomFormRef = useRef(null);

  const getRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (getRoomFormRef.current) {
      const data = new FormData(getRoomFormRef.current);
      const idRoom = data.get("idRoom");
      navigate(`/solo/${idRoom}`);
    }
  };

  return (
    <div className={`list-room-c ${!show ? "show" : ""}`}>
      <div className="list-room">
        <label className="app-header__findroom">
          <div style={{ flexShrink: 0 }}>
            <LookUp />
          </div>
          <form onSubmit={getRoom} ref={getRoomFormRef}>
            <Input name="idRoom" placeholder="Type the room id.." />
          </form>
        </label>
        {data.rooms.length > 0 ? (
          data.rooms.map((v, idx) => (
            <div className="room-info" key={v.id}>
              <Link to={`/solo/${v.id}`}>
                Room {idx + 1}
                <span className="room-info__time">
                  {formatDistanceToNowStrict(new Date(v.createdAt))}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <div className="empty-info empty-room">
            <img src={EmptyRoom} alt="empty room" />
            <span className="empty-text">Admin will create a room soon.</span>
          </div>
        )}
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
