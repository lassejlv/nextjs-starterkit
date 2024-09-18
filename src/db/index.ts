import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as user from "./schemas/user";
import * as emailVerify from "./schemas/emailVerify";

const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema: { ...user, ...emailVerify } });
