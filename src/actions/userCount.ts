"use server";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { Action } from "@/types/Action";
import { count } from "drizzle-orm";

export const getUsersCount = async (): Promise<Action<number>> => {
  const users = await db.select({ count: count() }).from(userTable);

  return {
    success: true,
    message: "fetched users count",
    data: users[0].count,
  };
};
