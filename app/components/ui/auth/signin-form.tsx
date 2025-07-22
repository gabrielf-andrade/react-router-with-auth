import { CheckCircle2, CircleAlert } from "lucide-react";

import { Link, useFetcher } from "react-router";
import type { SignInActionResponse } from "schemas/signin";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const initialState: SignInActionResponse = {
  success: false,
  message: "",
};

export default function SignInForm() {
  let fetcher = useFetcher();
  let state = (fetcher.data as SignInActionResponse | undefined) || initialState;
  let isSubmitting = fetcher.state !== "idle";

  return (
    <Card className="w-full max-w-sm gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form method="post" action="/auth/signin">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                defaultValue={state?.inputs?.email}
                required
              />
              {state?.errors?.fieldErrors?.email &&
                state?.errors?.fieldErrors?.email?.map((error, index) => (
                  <p key={"email-error-" + index} id="email-error" className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" defaultValue={state?.inputs?.password} required />
              {state?.errors?.fieldErrors?.password &&
                state?.errors?.fieldErrors?.password?.map((error, index) => (
                  <p key={"password-error-" + index} id="password-error" className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
            <Link to="#" className="underline text-sm -mt-2">
              Forgot your password?
            </Link>
          </div>

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"} className="mt-2">
              {state.success ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}
              <AlertDescription>{state.message}</AlertDescription>
              {state.errors?.formErrors && <AlertDescription>{state.errors?.formErrors[0]}</AlertDescription>}
            </Alert>
          )}

          <Button type="submit" aria-disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? "Submitting..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="flex justify-between text-sm gap-2">
          <p>Don&apos;t have an account?</p>
          <Link to="/auth/signup" className="underline text-sm">
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
