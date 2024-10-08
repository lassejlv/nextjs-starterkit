"use client";
import { RegisterUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterUserSchema } from "@/lib/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function Page() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: z.infer<typeof RegisterUserSchema>) => {
      return await RegisterUser(data);
    },

    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Account created!");
        return router.push("/login");
      } else {
        return toast.error(data.message);
      }
    },
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await registerMutation.mutateAsync({ email, password });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={submit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" required />
      </div>

      <Button
        variant="secondary"
        type="submit"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
