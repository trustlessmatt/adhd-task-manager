import { eq, desc } from 'drizzle-orm';
import { db } from './index';
import { tasks, buckets, type Task, type NewTask, type Bucket, type NewBucket } from './schema';

// Bucket queries
export async function getAllBuckets(): Promise<Bucket[]> {
  return await db.select().from(buckets).orderBy(desc(buckets.createdAt));
}

export async function getBucketById(id: number): Promise<Bucket | null> {
  const result = await db.select().from(buckets).where(eq(buckets.id, id));
  return result[0] || null;
}

export async function createBucket(bucket: NewBucket): Promise<Bucket> {
  const result = await db.insert(buckets).values(bucket).returning();
  return result[0];
}

export async function updateBucket(id: number, updates: Partial<NewBucket>): Promise<Bucket | null> {
  const result = await db
    .update(buckets)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(buckets.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteBucket(id: number): Promise<boolean> {
  try {
    // First delete all tasks in this bucket
    await db.delete(tasks).where(eq(tasks.bucketId, id));
    
    // Then delete the bucket
    const result = await db.delete(buckets).where(eq(buckets.id, id)).returning();
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting bucket:', error);
    throw error;
  }
}

// Task queries
export async function getAllTasks(): Promise<Task[]> {
  return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function getTasksByBucket(bucketId: number): Promise<Task[]> {
  return await db.select().from(tasks).where(eq(tasks.bucketId, bucketId)).orderBy(desc(tasks.createdAt));
}

export async function getTaskById(id: number): Promise<Task | null> {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  return result[0] || null;
}

export async function createTask(task: NewTask): Promise<Task> {
  const result = await db.insert(tasks).values(task).returning();
  return result[0];
}

export async function updateTask(id: number, updates: Partial<NewTask>): Promise<Task | null> {
  const result = await db
    .update(tasks)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return result.length > 0;
}

export async function toggleTaskCompletion(id: number): Promise<Task | null> {
  const task = await getTaskById(id);
  if (!task) return null;
  
  return await updateTask(id, { completed: !task.completed });
} 