import type { ActionArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { useEffect, useState } from "react";

import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import { SocketProvider } from "./context";
import { createRoom } from "./utils/room.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const action = async ({ request }: ActionArgs) => {
  return createRoom();
}

export default function App() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = io();;
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <SocketProvider socket={socket}>
          <Outlet />
        </SocketProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
