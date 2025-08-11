"use client";

import { useEffect, useState } from "react";
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
  useUpdateBucket,
} from "@/lib/hooks/use-queries";
import {
  bucketSchema,
  taskSchema,
  type BucketFormData,
  type TaskFormData,
} from "@/lib/schemas";
import { Loader2, Plus } from "lucide-react";
import { priorityColors, priorityIcons } from "@/lib/config";
import { Hero } from "./hero";
import { DeleteButtonDialog } from "./delete-button-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { EditBucketDialog } from "./edit-bucket-dialog";
import { DroppableBucket } from "./droppable-bucket";
import { AddNewBucket } from "./add-new-bucket";
import { DragAndDropProvider } from "./drag-and-drop-provider";
import type { Task, Bucket as BucketType } from "@/lib/db/schema";

export function TaskManagerView() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddBucket, setShowAddBucket] = useState(false);
  const [deletingBucketId, setDeletingBucketId] = useState<number | null>(null);
  const [editingBucket, setEditingBucket] = useState<BucketType | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

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
  const updateBucketMutation = useUpdateBucket();

  // Task form
  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      bucketId: 3,
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
    console.log(data);
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

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTaskMutation.mutateAsync(deletingTask.id);
      setDeletingTask(null);
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

  const handleEditBucket = (bucket: BucketType) => {
    setEditingBucket(bucket);
  };

  const handleUpdateBucket = async (data: BucketFormData) => {
    if (!editingBucket) return;
    try {
      await updateBucketMutation.mutateAsync({
        id: editingBucket.id,
        updates: data,
      });
      setEditingBucket(null);
    } catch (error) {
      console.error("Failed to update bucket:", error);
    }
  };

  const handleTaskDrop = (taskId: number, newBucketId: number) => {
    // check if the task is already in the bucket
    const task = tasks.find((task) => task.id === taskId);
    if (task?.bucketId === newBucketId) {
      return;
    }

    // Use mutate instead of mutateAsync for immediate optimistic update
    updateTaskMutation.mutate({
      id: taskId,
      updates: { bucketId: newBucketId },
    });
  };

  const getTasksByBucket = (bucketId: number) => {
    return tasks.filter((task) => task.bucketId === bucketId);
  };

  // listen for cmd enter to add task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey || e.shiftKey) &&
        e.key === "Enter" &&
        editingTask
      ) {
        taskForm.handleSubmit(onSubmitTask)();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [taskForm, editingTask]);

  if (bucketsLoading || tasksLoading) {
    return (
      <div className="p-4 text-gray-100 flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <DragAndDropProvider onTaskDrop={handleTaskDrop}>
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <Hero />

          {/* Quick Add Task Section */}
          <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100 font-heading">
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

                {/* <div>
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
                </div> */}

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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buckets
              .filter((bucket) => bucket.name.toLowerCase() === "inbox")
              .map((bucket) => {
                const bucketTasks = getTasksByBucket(bucket.id);
                const completedTasks = bucketTasks.filter(
                  (task) => task.completed
                ).length;

                return (
                  <DroppableBucket
                    key={bucket.id}
                    bucket={bucket}
                    bucketTasks={bucketTasks}
                    completedTasks={completedTasks}
                    setDeletingBucketId={setDeletingBucketId}
                    handleToggleTask={handleToggleTask}
                    handleDeleteTask={handleDeleteTask}
                    handleUpdateTask={handleUpdateTask}
                    setEditingTask={setEditingTask}
                    editingTask={editingTask}
                    priorityColors={priorityColors}
                    priorityIcons={priorityIcons}
                    onEditBucket={handleEditBucket}
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
                  <DroppableBucket
                    key={bucket.id}
                    bucket={bucket}
                    bucketTasks={bucketTasks}
                    completedTasks={completedTasks}
                    setDeletingBucketId={setDeletingBucketId}
                    handleToggleTask={handleToggleTask}
                    handleDeleteTask={handleDeleteTask}
                    handleUpdateTask={handleUpdateTask}
                    setEditingTask={setEditingTask}
                    editingTask={editingTask}
                    priorityColors={priorityColors}
                    priorityIcons={priorityIcons}
                    onEditBucket={handleEditBucket}
                  />
                );
              })}

            {/* Add New Bucket */}
            <div className="min-h-[250px] bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
              {showAddBucket ? (
                <AddNewBucket
                  setShowAddBucket={setShowAddBucket}
                  bucketForm={bucketForm}
                  onSubmitBucket={onSubmitBucket}
                  createBucketMutation={createBucketMutation}
                />
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

          {/* Edit Bucket Dialog */}
          {editingBucket && (
            <EditBucketDialog
              bucket={editingBucket}
              onClose={() => setEditingBucket(null)}
              onSave={handleUpdateBucket}
              isLoading={updateBucketMutation.isPending}
            />
          )}

          {/* Delete Task Dialog */}
          {deletingTask && (
            <DeleteTaskDialog
              task={deletingTask}
              onClose={() => setDeletingTask(null)}
              onConfirm={confirmDeleteTask}
              isLoading={deleteTaskMutation.isPending}
            />
          )}
        </div>
      </div>
    </DragAndDropProvider>
  );
}
