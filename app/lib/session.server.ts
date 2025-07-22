import { createCookieSessionStorage } from "react-router";

export interface SessionData {
  user: {
    id: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

type SessionFlashData = {
  error: string;
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
