"use server";

import { db } from "@/db";
import { SelectUser, userTable } from "@/db/schemas/user";
import { redis } from "@/lib/redis";
import { Action } from "@/types/Action";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const auth = async (): Promise<Action<SelectUser | null>> => {
  const cookieValue = cookies().get("session");
  console.log(cookieValue);

  if (!cookieValue) return { success: false, message: "No session" };

  const session = await redis.get(cookieValue.value);
  if (!session) return { success: false, message: "Session not found" };

  console.log(session);

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, parseInt(session)),
  });

  console.log(user);

  if (!user) return { success: false, message: "User not found" };

  return { success: true, message: "Valid session", data: user };
};
