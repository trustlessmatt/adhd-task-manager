import { eq, desc, and, asc } from 'drizzle-orm';
import { getDb } from './index';
import { tasks, buckets, type Task, type NewTask, type Bucket, type NewBucket } from './schema';

// Bucket queries
export async function getAllBuckets(userId: string): Promise<Bucket[]> {
  return await getDb().select().from(buckets).where(eq(buckets.userId, userId)).orderBy(asc(buckets.order), desc(buckets.createdAt));
}

export async function getBucketById(id: number, userId: string): Promise<Bucket | null> {
  const result = await getDb().select().from(buckets).where(and(eq(buckets.id, id), eq(buckets.userId, userId)));
  return result[0] || null;
}

export async function createBucket(bucket: Omit<NewBucket, 'order'>): Promise<Bucket> {
  // Get the highest order number for this user and add 1
  const existingBuckets = await getDb()
    .select({ order: buckets.order })
    .from(buckets)
    .where(eq(buckets.userId, bucket.userId))
    .orderBy(desc(buckets.order))
    .limit(1);
  
  const nextOrder = existingBuckets.length > 0 ? (existingBuckets[0].order + 1) : 0;
  
  const result = await getDb()
    .insert(buckets)
    .values({ ...bucket, order: nextOrder })
    .returning();
  return result[0];
}

export async function updateBucket(id: number, userId: string, updates: Partial<NewBucket>): Promise<Bucket | null> {
  const result = await getDb()
    .update(buckets)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(buckets.id, id), eq(buckets.userId, userId)))
    .returning();
  return result[0] || null;
}

export async function deleteBucket(id: number, userId: string): Promise<boolean> {
  try {
    // First delete all tasks in this bucket that belong to the user
    await getDb().delete(tasks).where(and(eq(tasks.bucketId, id), eq(tasks.userId, userId)));
    
    // Then delete the bucket
    const result = await getDb().delete(buckets).where(and(eq(buckets.id, id), eq(buckets.userId, userId))).returning();
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting bucket:', error);
    throw error;
  }
}

export async function updateBucketOrder(bucketId: number, userId: string, newOrder: number): Promise<Bucket | null> {
  const result = await getDb()
    .update(buckets)
    .set({ order: newOrder, updatedAt: new Date() })
    .where(and(eq(buckets.id, bucketId), eq(buckets.userId, userId)))
    .returning();
  return result[0] || null;
}

export async function reorderBuckets(bucketOrders: { id: number; order: number }[], userId: string): Promise<Bucket[]> {
  const db = getDb();
  const results: Bucket[] = [];
  
  for (const { id, order } of bucketOrders) {
    const result = await db
      .update(buckets)
      .set({ order, updatedAt: new Date() })
      .where(and(eq(buckets.id, id), eq(buckets.userId, userId)))
      .returning();
    if (result[0]) {
      results.push(result[0]);
    }
  }
  
  return results;
}

// Task queries
export async function getAllTasks(userId: string): Promise<Task[]> {
  return await getDb().select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function getTasksByBucket(bucketId: number, userId: string): Promise<Task[]> {
  return await getDb().select().from(tasks).where(and(eq(tasks.bucketId, bucketId), eq(tasks.userId, userId))).orderBy(desc(tasks.createdAt));
}

export async function getTaskById(id: number, userId: string): Promise<Task | null> {
  const result = await getDb().select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  return result[0] || null;
}

export async function createTask(task: NewTask): Promise<Task> {
  const result = await getDb().insert(tasks).values(task).returning();
  return result[0];
}

export async function updateTask(id: number, userId: string, updates: Partial<NewTask>): Promise<Task | null> {
  const result = await getDb()
    .update(tasks)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();
  return result[0] || null;
}

export async function deleteTask(id: number, userId: string): Promise<boolean> {
  const result = await getDb().delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId))).returning();
  return result.length > 0;
}

export async function toggleTaskCompletion(id: number, userId: string): Promise<Task | null> {
  const task = await getTaskById(id, userId);
  if (!task) return null;
  
  return await updateTask(id, userId, { completed: !task.completed });
} 