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
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { Task as TaskType, Bucket as BucketType } from "@/lib/db/schema";

interface DragAndDropProviderProps {
  children: React.ReactNode;
  buckets?: BucketType[];
  onTaskDrop?: (taskId: number, newBucketId: number) => void;
  onBucketReorder?: (bucketOrders: { id: number; order: number }[]) => void;
}

export function DragAndDropProvider({
  children,
  buckets = [],
  onTaskDrop,
  onBucketReorder,
}: DragAndDropProviderProps) {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [activeBucket, setActiveBucket] = useState<BucketType | null>(null);

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
    } else if (active.data.current?.type === "bucket") {
      setActiveBucket(active.data.current.bucket);
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
    } else if (active && over && active.data.current?.type === "bucket") {
      const activeBucketId = parseInt(
        active.id.toString().replace("bucket-", "")
      );
      const overBucketId = parseInt(over.id.toString().replace("bucket-", ""));

      if (
        onBucketReorder &&
        !isNaN(activeBucketId) &&
        !isNaN(overBucketId) &&
        activeBucketId !== overBucketId
      ) {
        // Find the current order of buckets
        const sortedBuckets = [...buckets].sort((a, b) => a.order - b.order);
        const activeIndex = sortedBuckets.findIndex(
          (b) => b.id === activeBucketId
        );
        const overIndex = sortedBuckets.findIndex((b) => b.id === overBucketId);

        if (activeIndex !== -1 && overIndex !== -1) {
          // Use arrayMove to calculate new order
          const reorderedBuckets = arrayMove(
            sortedBuckets,
            activeIndex,
            overIndex
          );

          // Create bucket orders array
          const bucketOrders = reorderedBuckets.map(
            (bucket: BucketType, index: number) => ({
              id: bucket.id,
              order: index,
            })
          );

          onBucketReorder(bucketOrders);
        }
      }
    }

    setActiveTask(null);
    setActiveBucket(null);
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
        ) : activeBucket ? (
          <div className="bg-gray-800 rounded-lg shadow-2xl transform rotate-2 scale-105 border border-gray-700">
            <div
              className="p-4 flex items-center justify-between"
              style={{
                backgroundColor: activeBucket.color,
                color: activeBucket.color === "#1f2937" ? "#ffffff" : "#000000",
              }}
            >
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 font-heading">
                  {activeBucket.name}
                </h3>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
