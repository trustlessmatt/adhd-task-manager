"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useBuckets,
  useTasks,
  useCreateBucket,
  useCreateTask,
  useToggleTaskCompletion,
  useDeleteTask,
  useUpdateTask,
  useDeleteBucket,
} from "@/lib/hooks/use-queries";
import {
  bucketSchema,
  taskSchema,
  type BucketFormData,
  type TaskFormData,
} from "@/lib/schemas";
import { Plus } from "lucide-react";
import { priorityColors, priorityIcons } from "@/lib/config";
import { DeleteButtonDialog } from "./delete-button-dialog";
import { Bucket } from "./bucket";
import type { Task } from "@/lib/db/schema";

export function TaskManagerExample() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [deletingBucketId, setDeletingBucketId] = useState<number | null>(null);

  // Query hooks
  const { data: buckets = [], isLoading: bucketsLoading } = useBuckets();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();

  // Mutation hooks
  const createBucketMutation = useCreateBucket();
  const createTaskMutation = useCreateTask();
  const toggleTaskMutation = useToggleTaskCompletion();
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const deleteBucketMutation = useDeleteBucket();

  // Task form
  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      bucketId: 0,
    },
  });

  // Bucket form
  const bucketForm = useForm<BucketFormData>({
    resolver: zodResolver(bucketSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  const onSubmitTask = async (data: TaskFormData) => {
    try {
      await createTaskMutation.mutateAsync(data);
      taskForm.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const onSubmitBucket = async (data: BucketFormData) => {
    try {
      await createBucketMutation.mutateAsync(data);
      bucketForm.reset();
      setShowAddBucket(false);
    } catch (error) {
      console.error("Failed to create bucket:", error);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      await toggleTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    data: Partial<TaskFormData>
  ) => {
    try {
      await updateTaskMutation.mutateAsync({ id: taskId, updates: data });
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteBucket = async (bucketId: number) => {
    try {
      await deleteBucketMutation.mutateAsync(bucketId);
      setDeletingBucketId(null);
    } catch (error) {
      console.error("Failed to delete bucket:", error);
    }
  };

  const getTasksByBucket = (bucketId: number) => {
    return tasks.filter((task) => task.bucketId === bucketId);
  };

  if (bucketsLoading || tasksLoading) {
    return <div className="p-4 text-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Task Manager
        </h1>

        {/* Quick Add Task Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Quick Add Task
          </h2>
          <form
            onSubmit={taskForm.handleSubmit(onSubmitTask)}
            className="space-y-4"
          >
            <div>
              <input
                {...taskForm.register("title")}
                type="text"
                placeholder="What needs to be done?"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 text-lg"
              />
              {taskForm.formState.errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {taskForm.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  {...taskForm.register("description")}
                  type="text"
                  placeholder="Additional details (optional)"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />
                {taskForm.formState.errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {taskForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <select
                  {...taskForm.register("priority")}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                {taskForm.formState.errors.priority && (
                  <p className="text-red-400 text-sm mt-1">
                    {taskForm.formState.errors.priority.message}
                  </p>
                )}
              </div>

              <div>
                <select
                  {...taskForm.register("bucketId", { valueAsNumber: true })}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                >
                  <option value="">Select Bucket</option>
                  {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </option>
                  ))}
                </select>
                {taskForm.formState.errors.bucketId && (
                  <p className="text-red-400 text-sm mt-1">
                    {taskForm.formState.errors.bucketId.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                {createTaskMutation.isPending ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </div>

        {/* Buckets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buckets
            .filter((bucket) => bucket.name.toLowerCase() === "inbox")
            .map((bucket) => {
              const bucketTasks = getTasksByBucket(bucket.id);
              const completedTasks = bucketTasks.filter(
                (task) => task.completed
              ).length;

              return (
                <Bucket
                  key={bucket.id}
                  bucket={bucket}
                  bucketTasks={bucketTasks}
                  completedTasks={completedTasks}
                  setDeletingBucketId={setDeletingBucketId}
                  handleDeleteBucket={handleDeleteBucket}
                  handleToggleTask={handleToggleTask}
                  handleDeleteTask={handleDeleteTask}
                  handleUpdateTask={handleUpdateTask}
                  setEditingTask={setEditingTask}
                  editingTask={editingTask}
                  priorityColors={priorityColors}
                  priorityIcons={priorityIcons}
                />
              );
            })}

          {/* now everything else */}
          {buckets
            .filter((bucket) => bucket.name.toLowerCase() !== "inbox")
            .map((bucket) => {
              const bucketTasks = getTasksByBucket(bucket.id);
              const completedTasks = bucketTasks.filter(
                (task) => task.completed
              ).length;

              return (
                <Bucket
                  key={bucket.id}
                  bucket={bucket}
                  bucketTasks={bucketTasks}
                  completedTasks={completedTasks}
                  setDeletingBucketId={setDeletingBucketId}
                  handleDeleteBucket={handleDeleteBucket}
                  handleToggleTask={handleToggleTask}
                  handleDeleteTask={handleDeleteTask}
                  handleUpdateTask={handleUpdateTask}
                  setEditingTask={setEditingTask}
                  editingTask={editingTask}
                  priorityColors={priorityColors}
                  priorityIcons={priorityIcons}
                />
              );
            })}

          {/* Add New Bucket */}
          <div className="bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
            {showAddBucket ? (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-100">
                  Add New Bucket
                </h3>
                <form
                  onSubmit={bucketForm.handleSubmit(onSubmitBucket)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      {...bucketForm.register("name")}
                      type="text"
                      placeholder="Bucket name"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                    />
                    {bucketForm.formState.errors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {bucketForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...bucketForm.register("color")}
                      type="color"
                      className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {bucketForm.formState.errors.color && (
                      <p className="text-red-400 text-sm mt-1">
                        {bucketForm.formState.errors.color.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={createBucketMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {createBucketMutation.isPending
                        ? "Adding..."
                        : "Add Bucket"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddBucket(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowAddBucket(true)}
                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                <Plus className="w-12 h-12 mb-2" />
                <span className="text-lg font-medium">Add New Bucket</span>
              </button>
            )}
          </div>
        </div>

        {/* Delete Bucket Confirmation Dialog */}
        {deletingBucketId && (
          <DeleteButtonDialog
            buckets={buckets}
            deletingBucketId={deletingBucketId}
            setDeletingBucketId={setDeletingBucketId}
            handleDeleteBucket={handleDeleteBucket}
          />
        )}
      </div>
    </div>
  );
}
