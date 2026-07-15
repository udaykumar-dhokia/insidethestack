"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Label,
  Link,
  TextField,
} from "@heroui/react";
import NextLink from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    // Simulate async signup
    setTimeout(() => setIsPending(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted text-center">
            Join InsideTheStack and start exploring
          </p>
        </div>

        {/* Main card */}
        <Card className="w-full shadow-sm border border-separator/50 backdrop-blur-sm">
          <Card.Content className="pt-8 pb-6 px-8">
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 w-full">
                {/* First name + Last name row */}
                <div className="grid grid-cols-2 gap-3">
                  <TextField className="w-full" name="first_name" type="text" isRequired>
                    <Label className="text-sm font-medium">First name</Label>
                    <Input
                      placeholder="John"
                      variant="secondary"
                      className="mt-1.5"
                    />
                  </TextField>

                  <TextField className="w-full" name="last_name" type="text">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-sm font-medium">Last name</Label>
                      <span className="text-xs text-muted">(optional)</span>
                    </div>
                    <Input
                      placeholder="Doe"
                      variant="secondary"
                      className="mt-1.5"
                    />
                  </TextField>
                </div>

                {/* Username */}
                <TextField className="w-full" name="username" type="text" isRequired>
                  <Label className="text-sm font-medium">Username</Label>
                  <Input
                    placeholder="johndoe"
                    variant="secondary"
                    className="mt-1.5"
                  />
                </TextField>

                {/* Email */}
                <TextField className="w-full" name="email" type="email" isRequired>
                  <Label className="text-sm font-medium">Email address</Label>
                  <Input
                    placeholder="you@example.com"
                    variant="secondary"
                    className="mt-1.5"
                  />
                </TextField>

                {/* Password */}
                <TextField className="w-full" name="password" type="password" isRequired>
                  <Label className="text-sm font-medium">Password</Label>
                  <Input
                    placeholder="••••••••"
                    variant="secondary"
                    className="mt-1.5"
                  />
                </TextField>

                <Button
                  className="w-full mt-2"
                  isPending={isPending}
                  size="lg"
                  type="submit"
                >
                  {isPending ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </Form>
          </Card.Content>

          {/* Footer */}
          <Card.Footer className="flex justify-center px-8 pb-8 pt-0">
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <NextLink href="/login">
                <Link
                  className="text-accent font-medium hover:text-accent/80 transition-colors"
                  href="/login"
                >
                  Sign in
                </Link>
              </NextLink>
            </p>
          </Card.Footer>
        </Card>

        {/* Bottom trust signal */}
        <p className="mt-6 text-center text-xs text-muted/60">
          By creating an account, you agree to our{" "}
          <Link
            className="text-muted hover:text-foreground transition-colors"
            href="#"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="text-muted hover:text-foreground transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
