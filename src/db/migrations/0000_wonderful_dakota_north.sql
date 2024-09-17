CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"password" varchar(255),
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
