import { redirect } from "react-router";
import { secureFetch } from "~/lib/api.server";
import { destroySession, getSession } from "~/lib/session.server";
import type { Route } from "./+types/signout";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const { response } = await secureFetch(request, "/auth/signout", {
      method: "POST",
    });

    if (!response.ok) {
      console.error("Backend signout failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Signout network error:", error);
  } finally {
    return redirect("/auth/signin", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
