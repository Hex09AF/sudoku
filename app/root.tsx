import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import globalStyles from "~/styles/global.css";
import Rubik from "./comps/Rubik";
import { SocketProvider } from "./context";
import { createRoom } from "./utils/room.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: globalStyles }];
};

export const action = async ({ request }: ActionArgs) => {
  return createRoom();
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {caught.status == 404 ? (
          <Rubik />
        ) : (
          <div>
            Something went wrong: {caught.status} {caught.statusText}
          </div>
        )}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io();
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
