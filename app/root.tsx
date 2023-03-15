import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";
import globalStyles from "~/styles/global.css";
import headerStyles from "~/styles/header/header.css";
import { links as buttonLinks } from "~/comps/Button";
import { links as inputLinks } from "~/comps/Input";
import { links as fieldLinks } from "~/comps/Field";

import Rubik from "./comps/Rubik";
import { SocketProvider } from "./context";
import { createRoom } from "./utils/room.server";
import favicon from "~/assets/favicon/apple-touch-icon.png";
import favicon16 from "~/assets/favicon/favicon-16x16.png";
import favicon32 from "~/assets/favicon/favicon-32x32.png";
import faviconManifest from "~/assets/favicon/site.webmanifest";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Competitive sudoku",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [
    ...buttonLinks(),
    ...inputLinks(),
    ...fieldLinks(),
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: headerStyles },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: favicon,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: favicon32,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: favicon16,
    },
    { rel: "manifest", href: faviconManifest },
  ];
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
