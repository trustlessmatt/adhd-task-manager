import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Bucket, NewBucket, NewTask, Task } from '../db/schema';

// API functions
const api = {
  // Bucket APIs
  getBuckets: async () => {
    const response = await fetch('/api/buckets');
    if (!response.ok) throw new Error('Failed to fetch buckets');
    return response.json() as Promise<Bucket[]>;
  },
  
  getBucket: async (id: number) => {
    const response = await fetch(`/api/buckets/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bucket');
    return response.json() as Promise<Bucket>;
  },
  
  createBucket: async (bucket: NewBucket) => {
    const response = await fetch('/api/buckets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bucket),
    });
    if (!response.ok) throw new Error('Failed to create bucket');
    return response.json() as Promise<Bucket>;
  },
  
  updateBucket: async ({ id, updates }: { id: number; updates: Partial<NewBucket> }) => {
    const response = await fetch(`/api/buckets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update bucket');
    return response.json() as Promise<Bucket>;
  },
  
  deleteBucket: async (id: number) => {
    const response = await fetch(`/api/buckets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete bucket');
    return response.json() as Promise<Bucket>;
  },
  
  // Task APIs
  getTasks: async () => {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json() as Promise<Task[]>;
  },
  
  getTasksByBucket: async (bucketId: number) => {
    const response = await fetch(`/api/tasks?bucketId=${bucketId}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json() as Promise<Task[]>;
  },
  
  getTask: async (id: number) => {
    const response = await fetch(`/api/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json() as Promise<Task>;
  },
  
  createTask: async (task: NewTask) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json() as Promise<Task>;
  },
  
  updateTask: async ({ id, updates }: { id: number; updates: Partial<NewTask> }) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json() as Promise<Task>;
  },
  
  deleteTask: async (id: number) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json() as Promise<Task>;
  },
  
  toggleTaskCompletion: async (id: number) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle' }),
    });
    if (!response.ok) throw new Error('Failed to toggle task');
    return response.json() as Promise<Task>;
  },
};

// Query keys
export const queryKeys = {
  buckets: {
    all: ['buckets'] as const,
    byId: (id: number) => ['buckets', id] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    byId: (id: number) => ['tasks', id] as const,
    byBucket: (bucketId: number) => ['tasks', 'bucket', bucketId] as const,
  },
} as const;

// Bucket hooks
export function useBuckets() {
  return useQuery({
    queryKey: queryKeys.buckets.all,
    queryFn: api.getBuckets,
  });
}

export function useBucket(id: number) {
  return useQuery({
    queryKey: queryKeys.buckets.byId(id),
    queryFn: () => api.getBucket(id),
    enabled: !!id,
  });
}

export function useCreateBucket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createBucket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buckets.all });
      toast.success('Bucket created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create bucket. Please try again.');
      console.error('Create bucket error:', error);
    },
  });
}

export function useUpdateBucket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateBucket,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buckets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.buckets.byId(id) });
      toast.success('Bucket updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update bucket. Please try again.');
      console.error('Update bucket error:', error);
    },
  });
}

export function useDeleteBucket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteBucket,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buckets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.buckets.byId(deletedId) });
      // Also invalidate tasks since they might be affected
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      toast.success('Bucket deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete bucket. Please try again.');
      console.error('Delete bucket error:', error);
    },
  });
}

// Task hooks
export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.all,
    queryFn: api.getTasks,
  });
}

export function useTasksByBucket(bucketId: number) {
  return useQuery({
    queryKey: queryKeys.tasks.byBucket(bucketId),
    queryFn: () => api.getTasksByBucket(bucketId),
    enabled: !!bucketId,
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: queryKeys.tasks.byId(id),
    queryFn: () => api.getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBucket(data.bucketId) });
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create task. Please try again.');
      console.error('Create task error:', error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateTask,
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      
      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.all);
      
      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map(task => 
            task.id === id ? { ...task, ...updates } : task
          );
        });
      }
      
      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousTasks);
      }
      toast.error('Failed to update task. Please try again.');
      console.error('Update task error:', err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
    onSuccess: (data, variables) => {
      // Invalidate specific queries after successful update
      if (variables) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byId(variables.id) });
        if (data) {
          queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBucket(data.bucketId) });
        }
      }
      toast.success('Task updated successfully!');
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byId(deletedId) });
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete task. Please try again.');
      console.error('Delete task error:', error);
    },
  });
}

export function useToggleTaskCompletion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.toggleTaskCompletion,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byId(id) });
      if (data) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.byBucket(data.bucketId) });
      }
      const status = data?.completed ? 'completed' : 'uncompleted';
      toast.success(`Task marked as ${status}!`);
    },
    onError: (error) => {
      toast.error('Failed to update task status. Please try again.');
      console.error('Toggle task error:', error);
    },
  });
} 