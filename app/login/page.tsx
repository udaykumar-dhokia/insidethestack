"use client";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Label,
  Link,
  Separator,
  TextField,
} from "@heroui/react";
import NextLink from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/lib/store/api/authApi";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted text-center">
            Sign in to your account to continue exploring
          </p>
        </div>

        {/* Main card */}
        <Card className="w-full shadow-sm border border-separator/50 backdrop-blur-sm">
          <Card.Content className="pt-8 pb-6 px-8">
            {/* Login form */}
            <Form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 w-full">
                
                {error && (
                  <div className="p-3 mb-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {(error as any)?.data?.message || "Invalid email or password"}
                  </div>
                )}

                <TextField
                  className="w-full"
                  name="email"
                  type="email"
                  isRequired
                >
                  <Label className="text-sm font-medium">Email address</Label>
                  <Input
                    placeholder="you@example.com"
                    variant="secondary"
                    className="mt-1.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TextField>

                <TextField
                  className="w-full"
                  name="password"
                  type="password"
                  isRequired
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Password</Label>
                    <Link
                      className="text-xs text-accent hover:text-accent/80 transition-colors no-underline"
                      href="#"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    placeholder="••••••••"
                    variant="secondary"
                    className="mt-1.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </TextField>

                <Button
                  className="w-full mt-2"
                  isPending={isLoading}
                  size="lg"
                  type="submit"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </Form>
          </Card.Content>

          {/* Footer */}
          <Card.Footer className="flex justify-center px-8 pb-8 pt-0">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{" "}
              <NextLink href="/signup">
                <Link
                  className="text-accent font-medium hover:text-accent/80 transition-colors"
                  href="/signup"
                >
                  Sign up for free
                </Link>
              </NextLink>
            </p>
          </Card.Footer>
        </Card>

        {/* Bottom trust signal */}
        <p className="mt-6 text-center text-xs text-muted/60">
          By signing in, you agree to our{" "}
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
