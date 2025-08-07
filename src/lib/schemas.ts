import { z } from 'zod';

export const bucketSchema = z.object({
  name: z.string().min(1, 'Bucket name is required').max(50, 'Bucket name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Task title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  bucketId: z.number().min(1, 'Bucket is required'),
});

export type BucketFormData = z.infer<typeof bucketSchema>;
export type TaskFormData = z.infer<typeof taskSchema>; 