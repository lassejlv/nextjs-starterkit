"use server";

import { db } from "@/db";
import { SelectUser, userTable } from "@/db/schemas/user";
import { redis } from "@/lib/redis";
import { Action } from "@/types/Action";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const auth = async (): Promise<Action<SelectUser | null>> => {
  const cookieValue = cookies().get("session");
  if (!cookieValue) return { success: false, message: "No session" };

  const session = await redis.get(cookieValue.value);
  if (!session) return { success: false, message: "Session not found" };

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, parseInt(session)),
  });

  if (!user) return { success: false, message: "User not found" };

  return { success: true, message: "Valid session", data: user };
};
