"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Task as TaskType } from "@/lib/db/schema";

interface DragAndDropProviderProps {
  children: React.ReactNode;
  onTaskDrop?: (taskId: number, newBucketId: number) => void;
}

export function DragAndDropProvider({
  children,
  onTaskDrop,
}: DragAndDropProviderProps) {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.data.current?.type === "task") {
      const taskId = parseInt(active.id.toString().replace("task-", ""));
      const bucketId = parseInt(over.id.toString().replace("bucket-", ""));

      if (onTaskDrop && !isNaN(taskId) && !isNaN(bucketId)) {
        onTaskDrop(taskId, bucketId);
      }
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="border-l-4 border-blue-500 bg-gray-700 p-3 rounded-r-lg shadow-2xl transform rotate-2 scale-105">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-500" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-100">
                  {activeTask.title}
                </h4>
                {activeTask.description && (
                  <p className="text-sm text-gray-300">
                    {activeTask.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
