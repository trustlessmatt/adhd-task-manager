import { Bucket } from "@/lib/db/schema";

interface DeleteButtonDialogProps {
  buckets: Bucket[];
  deletingBucketId: number | null;
  setDeletingBucketId: (id: number | null) => void;
  handleDeleteBucket: (id: number) => void;
}

export function DeleteButtonDialog({
  buckets,
  deletingBucketId,
  setDeletingBucketId,
  handleDeleteBucket,
}: DeleteButtonDialogProps) {
  if (!deletingBucketId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Delete Bucket
        </h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the &quot;
          {buckets.find((b) => b.id === deletingBucketId)?.name}&quot; bucket?
          <strong className="text-red-400">Warning:</strong> This will permanently delete all tasks in this bucket.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setDeletingBucketId(null)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteBucket(deletingBucketId)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete Bucket
          </button>
        </div>
      </div>
    </div>
  );
}
