import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("routes/main/main-layout.tsx", [
    index("routes/home.tsx"),
    layout("routes/main/protected-layout.tsx", [
      route("dashboard", "routes/main/dashboard.tsx"),
      route("profile", "routes/main/profile.tsx"),
      ...prefix("posts", [index("routes/posts/posts.tsx"), route("new", "routes/posts/new-post.tsx")]),
    ]),
  ]),

  ...prefix("auth", [
    layout("routes/auth/auth-layout.tsx", [
      route("signin", "routes/auth/signin.tsx"),
      route("signup", "routes/auth/signup.tsx"),
      route("signout", "routes/auth/signout.tsx"),
    ]),
  ]),

  route("/.well-known/appspecific/com.chrome.devtools.json", "routes/[com.chrome.devtools.json].tsx"),
] satisfies RouteConfig;
