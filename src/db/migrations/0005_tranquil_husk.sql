ALTER TABLE "email_verify" ALTER COLUMN "expire_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "email_verify" ALTER COLUMN "expire_at" SET DEFAULT now();