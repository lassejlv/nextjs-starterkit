CREATE TABLE IF NOT EXISTS "email_verify" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expire_at" integer NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
