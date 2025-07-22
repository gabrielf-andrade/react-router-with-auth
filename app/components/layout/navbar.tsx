import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
interface AuthButtonsClientProps {
  user: { name: string; id: string } | null;
}
export default function NavBar({ user }: AuthButtonsClientProps) {
  return (
    <nav className="p-4 shadow-md flex gap-6 bg-foreground text-background">
      <Link to="/">Home</Link>
      {user && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
        </>
      )}
      <div className="flex items-center gap-6 ml-auto">
        {!user ? (
          <>
            <Link to="/auth/signin">Sign In</Link>
            <Link to="/auth/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <p>{user.name}</p>
            <Form method="post" action="/auth/signout">
              <Button type="submit" variant="link" className="text-background">
                Sign Out
              </Button>
            </Form>
          </>
        )}
      </div>
    </nav>
  );
}
