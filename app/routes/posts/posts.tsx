import type { Route } from "./+types/posts";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function PostsPage() {
  return <div>PostsPage</div>;
}
