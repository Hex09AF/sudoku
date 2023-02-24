import type { Room, UsersOnRooms } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useSocket } from "~/context";
import hashToAvatar from "~/helper/hash";
import EmptyUser from "~/assets/empty-users.jpeg";

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
    socket.emit("get connected clients");
    socket.on("connected clients", (listUserOnline) => {
      setUsers(listUserOnline);
    });
  }, [socket]);

  return (
    <div className={`list-user-c ${!show ? "show" : ""}`}>
      <div className="list-user">
        {users.length > 0 ? (
          users.map((v) => (
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
          ))
        ) : (
          <div className="empty-info empty-user">
            <img src={EmptyUser} alt="empty user" />
            <span className="empty-text">People not join the game yet.</span>
          </div>
        )}
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
