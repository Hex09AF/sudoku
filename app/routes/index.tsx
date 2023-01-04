import BoardGame from "~/comps/BoardGame";

import type { LinksFunction } from "@remix-run/node";

import Header from "~/comps/Header";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Header />
      <BoardGame />
    </div>
  );
}
