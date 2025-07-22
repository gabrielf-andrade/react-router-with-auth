import { Outlet } from "react-router";
import NavBar from "~/components/layout/navbar";
import { getSession } from "~/lib/session.server";
import type { Route } from "./+types/main-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  return { user: user || null };
}

export default function MainLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <NavBar user={loaderData.user} />
      <Outlet />
    </div>
  );
}
