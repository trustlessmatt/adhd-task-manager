-- Safe migration to add order column to buckets table
-- Step 1: Add the column with a default value
ALTER TABLE "buckets" ADD COLUMN "order" integer DEFAULT 0;

-- Step 2: Update existing buckets to have unique order values per user
-- This ensures no conflicts when we make it NOT NULL
WITH ordered_buckets AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 as new_order
  FROM buckets
)
UPDATE buckets 
SET "order" = ordered_buckets.new_order
FROM ordered_buckets
WHERE buckets.id = ordered_buckets.id;

-- Step 3: Make the column NOT NULL after setting proper values
ALTER TABLE "buckets" ALTER COLUMN "order" SET NOT NULL;