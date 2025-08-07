import { Task } from "@/lib/db/schema";
import { Trash2 } from "lucide-react";

interface DeleteTaskDialogProps {
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteTaskDialog({
  task,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteTaskDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100 font-heading">
            Delete Task
          </h3>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete &quot;{task.title}&quot;? This action
          cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
