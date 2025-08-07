# Task Manager

A Next.js task management application with Drizzle ORM and Neon PostgreSQL database.

## Database Setup

This project uses [Drizzle ORM](https://orm.drizzle.team/) with a [Neon PostgreSQL](https://neon.tech/) database.

### 1. Set up Neon Database

1. Create a free account at [Neon](https://neon.tech/)
2. Create a new project
3. Copy your database connection string from the dashboard

### 2. Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Neon database URL:
   ```
   DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
   ```

### 3. Initialize Database

Run the following commands to set up your database:

```bash
# Generate and push the schema to your database
npm run db:push

# Or if you prefer migrations:
npm run db:generate
npm run db:migrate
```

### 4. Database Management Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio to view/edit data

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TanStack Query Hooks

This project uses TanStack Query for efficient data fetching and caching. All database operations are available as React hooks.

### Available Hooks

#### Bucket Hooks

- `useBuckets()` - Fetch all buckets
- `useBucket(id)` - Fetch a single bucket by ID
- `useCreateBucket()` - Create a new bucket
- `useUpdateBucket()` - Update an existing bucket
- `useDeleteBucket()` - Delete a bucket

#### Task Hooks

- `useTasks()` - Fetch all tasks
- `useTasksByBucket(bucketId)` - Fetch tasks for a specific bucket
- `useTask(id)` - Fetch a single task by ID
- `useCreateTask()` - Create a new task
- `useUpdateTask()` - Update an existing task
- `useDeleteTask()` - Delete a task
- `useToggleTaskCompletion()` - Toggle task completion status

### Usage Example

```tsx
import { useBuckets, useCreateBucket } from "@/lib/hooks/use-queries";

function MyComponent() {
  // Query hook
  const { data: buckets, isLoading } = useBuckets();

  // Mutation hook
  const createBucket = useCreateBucket();

  const handleCreateBucket = async () => {
    try {
      await createBucket.mutateAsync({
        name: "Work",
        color: "#3b82f6",
      });
    } catch (error) {
      console.error("Failed to create bucket:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {buckets?.map((bucket) => (
        <div key={bucket.id}>{bucket.name}</div>
      ))}
      <button onClick={handleCreateBucket}>Create Bucket</button>
    </div>
  );
}
```

### Features

- **Automatic Caching**: Queries are cached and automatically revalidated
- **Optimistic Updates**: Mutations can update the cache immediately
- **Error Handling**: Built-in error states and retry logic
- **Loading States**: Automatic loading indicators
- **Background Refetching**: Data stays fresh with background updates
- **DevTools**: React Query DevTools included for debugging

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
