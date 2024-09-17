"use server";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { Action } from "@/types/Action";

export const getUsersCount = async (): Promise<Action<number>> => {
  const users = await db.select().from(userTable);

  return {
    success: true,
    message: "fetched users count",
    data: users.length,
  };
};
