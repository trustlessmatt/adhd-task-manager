"use client";

import { useDraggable } from "@dnd-kit/core";
import { Task as TaskType } from "@/lib/db/schema";
import { TaskFormData } from "@/lib/schemas";
import { Task } from "./task";

interface DraggableTaskProps {
  task: TaskType;
  priorityColors: Record<string, string>;
  priorityIcons: Record<string, React.ReactNode>;
  editingTask: TaskType | null;
  setEditingTask: (task: TaskType | null) => void;
  handleToggleTask: (id: number) => void;
  handleDeleteTask: (task: TaskType) => void;
  handleUpdateTask: (id: number, task: Partial<TaskFormData>) => void;
}

export function DraggableTask({
  task,
  priorityColors,
  priorityIcons,
  editingTask,
  setEditingTask,
  handleToggleTask,
  handleDeleteTask,
  handleUpdateTask,
}: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: {
      task,
      type: "task",
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <Task
        task={task}
        priorityColors={priorityColors}
        priorityIcons={priorityIcons}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        handleToggleTask={handleToggleTask}
        handleDeleteTask={handleDeleteTask}
        handleUpdateTask={handleUpdateTask}
        isDragging={isDragging}
      />
    </div>
  );
}
