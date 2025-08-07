import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const buckets = pgTable('buckets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('low').$type<"low" | "medium" | "high" | "urgent">(),
  bucketId: integer('bucket_id').notNull().references(() => buckets.id),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define the relationships
export const bucketsRelations = relations(buckets, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  bucket: one(buckets, {
    fields: [tasks.bucketId],
    references: [buckets.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Bucket = typeof buckets.$inferSelect;
export type NewBucket = typeof buckets.$inferInsert; 