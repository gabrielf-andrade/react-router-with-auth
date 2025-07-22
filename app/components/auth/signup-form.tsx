import { CheckCircle2, CircleAlert } from "lucide-react";

import { Link, useFetcher } from "react-router";
import type { SignUpActionResponse } from "schemas/signup";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const initialState: SignUpActionResponse = {
  success: false,
  message: "",
};

export default function SignUpForm() {
  let fetcher = useFetcher();
  let state = (fetcher.data as SignUpActionResponse | undefined) || initialState;
  let isSubmitting = fetcher.state !== "idle";

  return (
    <Card className="w-full max-w-sm gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" action="/auth/signup">
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                defaultValue={state?.inputs?.name}
                required
              />
              {state?.errors?.fieldErrors?.name &&
                state?.errors?.fieldErrors?.name?.map((error: string, index: number) => (
                  <p key={"name-error-" + index} id="name-error" className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
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
                state?.errors?.fieldErrors?.email?.map((error: string, index: number) => (
                  <p key={"email-error-" + index} id="email-error" className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" defaultValue={state?.inputs?.password} required />
              {state?.errors?.fieldErrors?.password &&
                state?.errors?.fieldErrors?.password?.map((error: string, index: number) => (
                  <p key={"password-error-" + index} id="password-error" className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"} className="mt-2">
              {state.success ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}
              <AlertDescription>{state.message}</AlertDescription>
              {state.errors?.formErrors && <AlertDescription>{state.errors?.formErrors[0]}</AlertDescription>}
            </Alert>
          )}

          <Button type="submit" aria-disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
        </fetcher.Form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="flex justify-between text-sm gap-2">
          <p>Already have an account?</p>
          <Link to="/auth/signin" className="underline text-sm">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
