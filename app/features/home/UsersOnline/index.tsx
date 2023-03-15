import type { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import EmptyUser from "~/assets/empty-users.jpeg";
import { useSocket } from "~/context";
import { SocketEvent } from "~/utils/declares/interfaces/Socket";
import hashToAvatar from "~/utils/helper/hash";

type UsersOnlineProps = {
  user: SerializeFrom<{ id: string; username: string }> | null;
};

export default function UsersOnline({ user }: UsersOnlineProps) {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState<
    {
      socketId: string;
      username?: string;
      userId?: string;
    }[]
  >([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      socket.emit(SocketEvent.CLIENT_CONNECTED, { user, socketId: socket.id });
    });
    return () => {
      socket.off("connect");
    };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEvent.SERVER_CLIENT_CONNECTED, (listUserOnline) => {
      setUsers(listUserOnline);
    });
    return () => {
      socket.off(SocketEvent.SERVER_CLIENT_CONNECTED);
    };
  }, [socket]);

  return (
    <div className={`list-user-c ${!show ? "show" : ""}`}>
      <div className="list-user">
        {users.length > 0 ? (
          users.map((v) => (
            <div className="user-info" key={v.socketId}>
              <img
                className="user-info__avatar"
                src={hashToAvatar(v?.userId ? v.userId : v.socketId)}
                alt="avatar"
                width={48}
                height={48}
              />
              {v?.userId ? v.username : "Guest"}
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
