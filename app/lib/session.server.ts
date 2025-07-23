import { createCookieSessionStorage, redirect } from "react-router";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}

export interface SessionData {
  user: {
    id: string;
    name: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

type SessionFlashData = {
  error: string;
  success: string;
};

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET_KEY!],
    secure: process.env.NODE_ENV === "production",
  },
});

export { commitSession, destroySession, getSession };

export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("user")) {
    session.flash("error", "You must be logged in to access this page.");
    throw redirect("/auth/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return session;
}
