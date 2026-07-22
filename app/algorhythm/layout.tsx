"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { LockKey } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AlgorhythmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[60vh]"></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary">
          <LockKey size={64} weight="duotone" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Master AlgoRhythm</h1>
        <p className="text-default-500 mb-8 max-w-md">
          Log in to access your personalized spaced repetition tracker and start mastering algorithms efficiently.
        </p>
        <div className="flex gap-4">
          <Button onPress={() => router.push("/login")} color="primary" size="lg">
            Log In
          </Button>
          <Button onPress={() => router.push("/signup")} variant="bordered" size="lg">
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
