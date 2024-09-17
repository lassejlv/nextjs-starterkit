import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export default async function Page() {
  const submit = async (form: FormData) => {
    "use server";

    const data = Object.fromEntries(form.entries()) as {
      email: string;
      password: string;
    };

    try {
      const { email, password } = schema.parse(data);

      const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });

      console.log(user);

      if (user) throw new Error("User already exists");
    } catch (error: any) {
      redirect(`/register?error=${error.message}`);
    }
  };

  return (
    <form className="flex flex-col gap-5" action={submit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" required />
      </div>

      <Button variant="secondary" type="submit">
        Register
      </Button>
    </form>
  );
}
