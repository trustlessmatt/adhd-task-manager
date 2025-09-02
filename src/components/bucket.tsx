"use client";

import { Bucket as BucketType, Task } from "@/lib/db/schema";
import { TaskFormData } from "@/lib/schemas";
import { Trash2, Check, Circle, Edit } from "lucide-react";
import { getTextColor } from "@/lib/utils";
import { isInboxBucket } from "@/lib/utils/inbox-bucket";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect } from "react";
import { useBuckets } from "@/lib/hooks/use-queries";

export function Bucket({
  bucket,
  bucketTasks,
  completedTasks,
  setDeletingBucketId,
  handleToggleTask,
  handleDeleteTask,
  handleUpdateTask,
  setEditingTask,
  editingTask,
  priorityColors,
  priorityIcons,
  onEditBucket,
  renderTask,
}: {
  bucket: BucketType;
  bucketTasks: Task[];
  completedTasks: number;
  setDeletingBucketId: (id: number) => void;
  handleToggleTask: (id: number) => void;
  handleDeleteTask: (task: Task) => void;
  handleUpdateTask: (id: number, task: Partial<TaskFormData>) => void;
  setEditingTask: (task: Task | null) => void;
  editingTask: Task | null;
  priorityColors: Record<string, string>;
  priorityIcons: Record<string, React.ReactNode>;
  onEditBucket?: (bucket: BucketType) => void;
  renderTask?: (task: Task) => React.ReactNode;
}) {
  const { data: buckets = [] } = useBuckets();

  // when in edit mode, listen for cmd enter to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editingTask) return;
      if ((e.metaKey || e.ctrlKey || e.shiftKey) && e.key === "Enter") {
        handleUpdateTask(editingTask?.id, {
          title: editingTask?.title,
          description: editingTask?.description || undefined,
          priority: editingTask?.priority,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingTask, handleUpdateTask]);

  return (
    <div
      key={bucket.id}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
    >
      {/* Bucket Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{
          backgroundColor: bucket.color,
          color: getTextColor(bucket.color),
        }}
      >
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 font-heading">
            {bucket.name}
          </h3>
          <p className="text-sm opacity-90">
            {bucketTasks.length} tasks ({completedTasks} completed)
          </p>
        </div>
        {!isInboxBucket(bucket.name) && onEditBucket && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditBucket(bucket)}
              className="transition-colors hover:opacity-70"
              style={{
                color: getTextColor(bucket.color),
              }}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeletingBucketId(bucket.id)}
              className="transition-colors hover:opacity-70"
              style={{
                color: getTextColor(bucket.color),
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="p-4 h-72 overflow-y-auto">
        {bucketTasks.length === 0 && !isInboxBucket(bucket.name) ? (
          <p className="text-gray-400 text-center py-8">Wow, such empty.</p>
        ) : bucketTasks.length === 0 && isInboxBucket(bucket.name) ? (
          <p className="text-gray-400 text-center py-8">
            Empty inbox! Woohoo! 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {bucketTasks
              .filter((task) => task.completed === false)
              // sort by priority in descending order (urgent, high, medium, low)
              .sort((a, b) => {
                const priorityOrder = ["urgent", "high", "medium", "low"];
                return (
                  priorityOrder.indexOf(a.priority) -
                  priorityOrder.indexOf(b.priority)
                );
              })
              .map((task) =>
                renderTask ? (
                  renderTask(task)
                ) : (
                  <div
                    key={task.id}
                    className={`border-l-4 ${
                      priorityColors[
                        task.priority as keyof typeof priorityColors
                      ]
                    } bg-gray-700 p-3 rounded-r-lg`}
                  >
                    {editingTask?.id === task.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <textarea
                          value={editingTask.description || ""}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description..."
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                        />
                        <div className="w-full flex items-center justify-between gap-2">
                          <select
                            value={
                              buckets.find((b) => b.id === editingTask.bucketId)
                                ?.name
                            }
                            onChange={(e) => {
                              const bucket = buckets.find(
                                (b) => b.name === e.target.value
                              );
                              setEditingTask({
                                ...editingTask,
                                bucketId: bucket?.id ?? editingTask.bucketId,
                              });
                            }}
                            className="p-2 bg-gray-600 border border-gray-500 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {buckets.map((b) => (
                              <option key={b.id} value={b.name}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editingTask.priority}
                            onChange={(e) =>
                              setEditingTask({
                                ...editingTask,
                                priority: e.target.value as
                                  | "low"
                                  | "medium"
                                  | "high"
                                  | "urgent",
                              })
                            }
                            className="p-2 bg-gray-600 border border-gray-500 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleUpdateTask(task.id, {
                                title: editingTask.title,
                                description:
                                  editingTask.description || undefined,
                                priority: editingTask.priority,
                                bucketId: editingTask.bucketId,
                              })
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div
                                onClick={() => handleToggleTask(task.id)}
                                className="mt-1 flex-shrink-0 cursor-pointer"
                              >
                                {task.completed ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100">
                              {task.completed
                                ? "Mark as incomplete"
                                : "Mark as complete"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="min-w-0">
                          <h4
                            className={`font-medium text-gray-100 ${
                              task.completed ? "line-through" : ""
                            }`}
                          >
                            <span className="h-full mr-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-gray-100 h-full shrink-0">
                                      {
                                        priorityIcons[
                                          task.priority as keyof typeof priorityIcons
                                        ]
                                      }
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100">
                                    {task.priority.charAt(0).toUpperCase() +
                                      task.priority.slice(1)}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-300 mb-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            {bucketTasks
              .filter((task) => task.completed === true)
              .map((task) =>
                renderTask ? (
                  renderTask(task)
                ) : (
                  <div
                    key={task.id}
                    className="border-l-4 flex items-start gap-3 bg-gray-700 p-3 rounded-r-lg"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-1 flex-shrink-0 cursor-pointer"
                          >
                            {task.completed ? (
                              <Check className="w-5 h-5 text-green-400 hover:text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100">
                          {task.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="min-w-0">
                      <h4
                        className={`font-medium text-gray-100 ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        <span className="h-full mr-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-gray-100 h-full shrink-0">
                                  {
                                    priorityIcons[
                                      task.priority as keyof typeof priorityIcons
                                    ]
                                  }
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100">
                                {task.priority.charAt(0).toUpperCase() +
                                  task.priority.slice(1)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-300 mb-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteTask(task)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    </div>
  );
}
