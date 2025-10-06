"use client";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Bucket as BucketType, Task } from "@/lib/db/schema";
import { TaskFormData } from "@/lib/schemas";
import { Bucket } from "./bucket";
import { DraggableTask } from "./draggable-task";
import { useTaskViewStore } from "@/stores/task-view-store";

interface DroppableBucketProps {
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
}

export function DroppableBucket({
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
}: DroppableBucketProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `bucket-${bucket.id}`,
    data: {
      bucket,
      type: "bucket",
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `bucket-${bucket.id}`,
    data: {
      bucket,
      type: "bucket",
    },
  });

  const { view } = useTaskViewStore();

  const filteredTasks =
    view === "active"
      ? bucketTasks.filter((task) => !task.completed)
      : bucketTasks;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDragRef(node);
      }}
      className={`transition-all duration-200 group ${
        isOver ? "ring-2 ring-blue-400 ring-opacity-50 scale-105" : ""
      } ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <Bucket
        bucket={bucket}
        bucketTasks={filteredTasks}
        completedTasks={completedTasks}
        setDeletingBucketId={setDeletingBucketId}
        handleToggleTask={handleToggleTask}
        handleDeleteTask={handleDeleteTask}
        handleUpdateTask={handleUpdateTask}
        setEditingTask={setEditingTask}
        editingTask={editingTask}
        priorityColors={priorityColors}
        priorityIcons={priorityIcons}
        onEditBucket={onEditBucket}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        renderTask={(task) => (
          <DraggableTask
            key={task.id}
            task={task}
            priorityColors={priorityColors}
            priorityIcons={priorityIcons}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            handleToggleTask={handleToggleTask}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTask={handleUpdateTask}
          />
        )}
      />
    </div>
  );
}
