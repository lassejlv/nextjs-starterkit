"use server";

import { db } from "@/db";
import { userTable } from "@/db/schemas/user";
import { Action } from "@/types/Action";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { RegisterUserSchema } from "@/lib/zod";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { auth } from "./auth";

type Data = z.infer<typeof RegisterUserSchema>;

export const RegisterUser = async (data: Data): Promise<Action<null>> => {
  try {
    const { email, password } = RegisterUserSchema.parse(data);

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (user) throw new Error("User already exists");

    // create new user and hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(userTable)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();

    console.log("New user", newUser);

    return { success: true, message: "User created" };
  } catch (error: any) {
    const isZodError = error.errors !== undefined;

    return {
      isZodError,
      success: false,
      message: isZodError ? "Invalid data" : error.message,
    };
  }
};

export const LoginUser = async (data: Data): Promise<Action<null>> => {
  try {
    const { email, password } = RegisterUserSchema.parse(data);

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) throw new Error("User not found");

    const passwordMatch = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!passwordMatch) throw new Error("Invalid password");

    const token = crypto.randomBytes(32).toString("hex");
    const expires = 1000 * 60 * 60 * 24 * 7;
    await redis.set(token, user.id, "EX", expires);

    cookies().set("session", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expires,
    });

    return { success: true, message: "User logged in" };
  } catch (error: any) {
    const isZodError = error.errors !== undefined;

    return {
      isZodError,
      success: false,
      message: isZodError ? "Invalid data" : error.message,
    };
  }
};


export const Updateuser = async (data: any): Promise<Action<null>> => {
  try {
  
    const parsedData = z.object({ name: z.string().min(1).max(255) }).parse(data);
    
    const session = await auth();
    if (!session.success || !session.data) throw new Error("Not authenticated");

    await db.update(userTable).set(parsedData).where(eq(userTable.id, session.data.id))


    return { success: true, message: "User updated" };
  } catch (error: any) {
    const isZodError = error.errors !== undefined;

    return {
      isZodError,
      success: false,
      message: isZodError ? "Invalid data" : error.message,
    };
  }
}