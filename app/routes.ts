import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("auth", [
    layout("routes/auth/auth-layout.tsx", [
      route("signin", "routes/auth/signin.tsx"),
      route("signup", "routes/auth/signup.tsx"),
    ]),
  ]),
  layout("routes/main/main-layout.tsx", [
    route("dashboard", "routes/main/dashboard.tsx"),
    route("profile", "routes/main/profile.tsx"),
  ]),
  route("/.well-known/appspecific/com.chrome.devtools.json", "routes/[com.chrome.devtools.json].tsx"),
] satisfies RouteConfig;
