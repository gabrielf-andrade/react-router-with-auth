import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Home() {
  return (
    <div className="flex gap-4 items-center justify-center mt-24">
      Home <Button>Click me</Button>
    </div>
  );
}
