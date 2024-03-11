"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function AuthForm() {
  const form = useForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await signIn("email", { email: data.email, redirect: false });

      toast({
        title: "Magic Link Sent",
        description: "Check your email for the magic link to login",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again",
      });
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-10 text-center">
        <div className="mx-auto max-w-3xl space-y-2">
          <h1 className="text-4xl font-bold">Welcome to the Example App</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email to sign in or create an account
          </p>
        </div>
      </header>
      <form className="flex-1" onSubmit={handleSubmit}>
        <div className="mx-auto max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              {...form.register("email")}
            />
          </div>
          <Button className="w-full">Send Magic Link</Button>
        </div>
      </form>
      <footer className="mt-auto pb-10 text-center space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <Link className="underline" href={"/app"}>
            Sign up
          </Link>
        </p>
      </footer>
    </div>
  );
}
