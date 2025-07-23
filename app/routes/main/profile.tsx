import { redirect } from "react-router";
import { getSession } from "~/lib/session.server";
import type { Route } from "./+types/profile";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user || user.role !== "ADMIN") throw redirect("/");
  return null;
}

export default function ProfilePage() {
  return <div>ProfilePage</div>;
}
