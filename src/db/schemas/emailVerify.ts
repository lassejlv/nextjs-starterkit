import { relations, sql } from "drizzle-orm";
import { date, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import crypto from "crypto";

export const emailVerify = pgTable("email_verify", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token")
    .notNull()
    .$defaultFn(() => crypto.randomBytes(32).toString("hex")),
  expireAt: date("expire_at").notNull().defaultNow(),
  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const emailVerifyRelations = relations(emailVerify, ({ one }) => ({
  user: one(userTable, {
    fields: [emailVerify.userId],
    references: [userTable.id],
  }),
}));

export type InsertEmailVerify = typeof emailVerify.$inferInsert;
export type SelectEmailVerify = typeof emailVerify.$inferSelect;
