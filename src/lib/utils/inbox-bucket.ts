import { createBucket, getAllBuckets } from '../db/queries';

/**
 * Ensures a user has an "Inbox" bucket. Creates one if it doesn't exist.
 * @param userId - The user's ID from Clerk
 * @returns The Inbox bucket
 */
export async function ensureInboxBucket(userId: string) {
  // Check if user already has an Inbox bucket
  const buckets = await getAllBuckets(userId);
  const inboxBucket = buckets.find(bucket => bucket.name.toLowerCase() === 'inbox');
  
  if (inboxBucket) {
    return inboxBucket;
  }
  
  // Create Inbox bucket if it doesn't exist
  const newInboxBucket = await createBucket({
    name: 'Inbox',
    color: '#3b82f6', // Blue color
    userId: userId,
  });
  
  return newInboxBucket;
}

/**
 * Checks if a bucket is the Inbox bucket
 * @param bucketName - The name of the bucket
 * @returns true if it's the Inbox bucket
 */
export function isInboxBucket(bucketName: string): boolean {
  return bucketName.toLowerCase() === 'inbox';
}
