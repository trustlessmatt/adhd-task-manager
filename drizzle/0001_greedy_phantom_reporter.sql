ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'low';--> statement-breakpoint
ALTER TABLE "buckets" ADD CONSTRAINT "buckets_name_unique" UNIQUE("name");