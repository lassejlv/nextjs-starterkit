import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;
