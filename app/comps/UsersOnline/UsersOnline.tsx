import type { Room, UsersOnRooms } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useSocket } from "~/context";
import hashToAvatar from "~/helper/hash";

type UsersOnlineProps = {
  rooms: SerializeFrom<
    (Room & {
      users: UsersOnRooms[];
    })[]
  >;
};

export default function UsersOnline({ rooms }: UsersOnlineProps) {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("connected clients", (listUserOnline) => {
      setUsers(listUserOnline);
    });
  }, [socket]);

  return (
    <div className={`list-user-c ${!show ? "show" : ""}`}>
      <div className="list-user">
        {users.map((v) => (
          <div className="user-info" key={v}>
            <img
              className="user-info__avatar"
              src={hashToAvatar(v)}
              alt="avatar"
              width={48}
              height={48}
            />
            {v}
          </div>
        ))}
      </div>
      <div
        className="list-user-tag"
        onClick={() => {
          setShow((pre) => !pre);
        }}
      >
        Users Online
      </div>
    </div>
  );
}
