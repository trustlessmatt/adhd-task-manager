import { Bucket as BucketType, Task } from "@/lib/db/schema";
import { TaskFormData } from "@/lib/schemas";
import { Trash2, Check, Circle, Edit } from "lucide-react";

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
}: {
  bucket: BucketType;
  bucketTasks: Task[];
  completedTasks: number;
  setDeletingBucketId: (id: number) => void;
  handleDeleteBucket: (id: number) => void;
  handleToggleTask: (id: number) => void;
  handleDeleteTask: (id: number) => void;
  handleUpdateTask: (id: number, task: Partial<TaskFormData>) => void;
  setEditingTask: (task: Task | null) => void;
  editingTask: Task | null;
  priorityColors: Record<string, string>;
  priorityIcons: Record<string, React.ReactNode>;
}) {
  return (
    <div
      key={bucket.id}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
    >
      {/* Bucket Header */}
      <div
        className="text-white p-4 flex items-center justify-between"
        style={{ backgroundColor: bucket.color }}
      >
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {bucket.name}
          </h3>
          <p className="text-sm opacity-90">
            {bucketTasks.length} tasks ({completedTasks} completed)
          </p>
        </div>
        <button
          onClick={() => setDeletingBucketId(bucket.id)}
          className="text-white hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {bucketTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No tasks in this bucket yet.
          </p>
        ) : (
          <div className="space-y-3">
            {bucketTasks.map((task) => (
              <div
                key={task.id}
                className={`border-l-4 ${
                  priorityColors[task.priority as keyof typeof priorityColors]
                } bg-gray-700 p-3 rounded-r-lg ${
                  task.completed ? "opacity-60" : ""
                }`}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateTask(task.id, {
                            title: editingTask.title,
                            description: editingTask.description || undefined,
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
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span>
                          {
                            priorityIcons[
                              task.priority as keyof typeof priorityIcons
                            ]
                          }
                        </span>
                        <h4
                          className={`font-medium text-gray-100 ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>
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
                          onClick={() => handleDeleteTask(task.id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
