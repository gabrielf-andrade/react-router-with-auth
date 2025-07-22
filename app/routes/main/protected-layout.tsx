import { Outlet, redirect } from "react-router";
import { getSession } from "~/lib/session.server";
import type { Route } from "./+types/protected-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const hasUser = session.has("user");

  if (!hasUser) {
    throw redirect("/auth/signin");
  }

  return null;
}

export default function MainLayout() {
  return <Outlet />;
}
