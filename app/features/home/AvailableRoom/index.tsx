import type { Room, UsersOnRooms } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRef, useState } from "react";
import EmptyRoom from "~/assets/empty-rooms.jpeg";
import LookUp from "~/assets/svg/LookUp";
import { Button } from "~/comps/Button";
import { Input } from "~/comps/Input";

interface AvailableRoomProps {
  rooms: SerializeFrom<
    Room & {
      users: UsersOnRooms[];
    }
  >[];
}

export default function AvailableRoom({ rooms }: AvailableRoomProps) {
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
      <div className="list-room-w">
        <div className="list-room">
          <label className="app-header__findroom">
            <div style={{ flexShrink: 0 }}>
              <LookUp />
            </div>
            <form onSubmit={getRoom} ref={getRoomFormRef}>
              <Input name="idRoom" placeholder="Type the room id.." />
            </form>
          </label>
          {rooms.length > 0 ? (
            <div className="room-info-c">
              {rooms.map((v, idx) => (
                <div className="room-info" key={v.id}>
                  <Link to={`/solo/${v.id}`}>
                    <span>Room {idx + 1}</span>
                    <span className="room-info__door">🚪</span>
                    <span className="room-info__time">
                      {formatDistanceToNowStrict(new Date(v.createdAt))}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-info empty-room">
              <img src={EmptyRoom} alt="empty room" />
              <span className="empty-text">Admin will create a room soon.</span>
            </div>
          )}
        </div>
        <Button
          className="list-room-tag"
          onClick={() => {
            setShow((pre) => !pre);
          }}
        >
          <span>Rooms</span>
        </Button>
      </div>
    </div>
  );
}
