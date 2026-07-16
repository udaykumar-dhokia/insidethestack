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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useSignupMutation,
  useVerifyOtpMutation,
  useLazyCheckUsernameQuery,
} from "@/lib/store/api/authApi";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "otp">("signup");

  const [signup, { isLoading: isSigningUp, error: signupError }] =
    useSignupMutation();
  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [checkUsername, { isFetching: isCheckingUsername }] =
    useLazyCheckUsernameQuery();

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!formData.username) {
      setUsernameAvailable(null);
      return;
    }

    if (formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await checkUsername(formData.username).unwrap();
        setUsernameAvailable(res.available);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.username, checkUsername]);

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      setStep("otp");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyOtp({
        email: formData.email,
        otp: formData.otp,
      }).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            {step === "signup" ? "Create an account" : "Check your email"}
          </h1>
          <p className="mt-2 text-sm text-muted text-center">
            {step === "signup"
              ? "Join InsideTheStack and start exploring"
              : `We sent a 6-digit code to ${formData.email}`}
          </p>
        </div>

        {/* Main card */}
        <Card className="w-full shadow-sm border border-separator/50 backdrop-blur-sm">
          <Card.Content className="pt-8 pb-6 px-8">
            {step === "signup" ? (
              <Form onSubmit={handleSignupSubmit}>
                <div className="flex flex-col gap-4 w-full">
                  {signupError && (
                    <div className="p-3 mb-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                      {(signupError as any)?.data?.message ||
                        "An error occurred during signup"}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      className="w-full"
                      name="first_name"
                      type="text"
                      isRequired
                    >
                      <Label className="text-sm font-medium">First name</Label>
                      <Input
                        placeholder="John"
                        variant="secondary"
                        className="mt-1.5"
                        value={formData.first_name}
                        onChange={handleChange}
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
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </TextField>
                  </div>

                  <TextField
                    className="w-full"
                    name="username"
                    type="text"
                    isRequired
                    isInvalid={usernameAvailable === false}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Label className="text-sm font-medium">Username</Label>
                      {isCheckingUsername && (
                        <span className="text-xs text-muted">Checking...</span>
                      )}
                      {!isCheckingUsername && usernameAvailable === true && (
                        <span className="text-xs text-success">Available</span>
                      )}
                      {!isCheckingUsername && usernameAvailable === false && (
                        <span className="text-xs text-danger">Taken</span>
                      )}
                    </div>
                    <Input
                      placeholder="johndoe"
                      variant="secondary"
                      className="mt-1.5"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </TextField>

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
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    name="password"
                    type="password"
                    isRequired
                  >
                    <Label className="text-sm font-medium">Password</Label>
                    <Input
                      placeholder="••••••••"
                      variant="secondary"
                      className="mt-1.5"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </TextField>

                  <Button
                    className="w-full mt-2"
                    isPending={isSigningUp}
                    size="lg"
                    type="submit"
                  >
                    {isSigningUp ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleOtpSubmit}>
                <div className="flex flex-col gap-4 w-full">
                  {verifyError && (
                    <div className="p-3 mb-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                      {(verifyError as any)?.data?.message ||
                        "Invalid or expired OTP"}
                    </div>
                  )}

                  <TextField
                    className="w-full"
                    name="otp"
                    type="text"
                    isRequired
                  >
                    <Label className="text-sm font-medium">6-Digit Code</Label>
                    <Input
                      placeholder="123456"
                      variant="secondary"
                      className="mt-1.5 tracking-widest text-center"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleChange}
                    />
                  </TextField>

                  <Button
                    className="w-full mt-2"
                    isPending={isVerifying}
                    size="lg"
                    type="submit"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <Button
                    className="w-full mt-2 text-muted"
                    variant="outline"
                    onPress={() => setStep("signup")}
                  >
                    Back to signup
                  </Button>
                </div>
              </Form>
            )}
          </Card.Content>

          {/* Footer */}
          {step === "signup" && (
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
          )}
        </Card>

        {/* Bottom trust signal */}
        {step === "signup" && (
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
        )}
      </div>
    </div>
  );
}
