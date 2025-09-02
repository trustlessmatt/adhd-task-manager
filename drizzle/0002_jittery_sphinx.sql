-- Drop the existing unique constraint on bucket names
ALTER TABLE "buckets" DROP CONSTRAINT "buckets_name_unique";--> statement-breakpoint

-- Add user_id columns with default values first (to handle existing data)
ALTER TABLE "buckets" ADD COLUMN "user_id" text DEFAULT 'default_user';--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" text DEFAULT 'default_user';--> statement-breakpoint

-- Make the columns NOT NULL after setting defaults
ALTER TABLE "buckets" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint

-- Add the new unique constraint for user_id + name combination
ALTER TABLE "buckets" ADD CONSTRAINT "unique_user_bucket_name" UNIQUE("user_id","name");