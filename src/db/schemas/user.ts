import { relations, sql } from "drizzle-orm";
import { boolean, date, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { emailVerify } from "./emailVerify";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  avatar: varchar("avatar", { length: 255 }),
  password: varchar("password", { length: 255 }),
  emailVerified: boolean("email_verified").default(false),
  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const userRelations = relations(userTable, ({ many }) => ({
  emailVerify: many(emailVerify),
}));

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;
