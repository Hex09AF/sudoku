
import { json, LinksFunction, LoaderArgs } from "@remix-run/node";

import Header from "~/comps/Header";
import stylesUrl from "~/styles/index.css";

import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return json({
    user,
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div>
        {data.user?.username == 'kody' ?
          <form method="post" action="/">
            <button type="submit">
              Tạo trận
            </button>
          </form>
          : ""}
      </div>
      <Header user={data.user} />
    </div>
  );
}
