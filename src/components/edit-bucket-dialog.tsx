import { Bucket } from "@/lib/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bucketSchema, type BucketFormData } from "@/lib/schemas";

interface EditBucketDialogProps {
  bucket: Bucket | null;
  onClose: () => void;
  onSave: (data: BucketFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EditBucketDialog({
  bucket,
  onClose,
  onSave,
  isLoading = false,
}: EditBucketDialogProps) {
  const form = useForm<BucketFormData>({
    resolver: zodResolver(bucketSchema),
    defaultValues: {
      name: bucket?.name || "",
      color: bucket?.color || "#3b82f6",
    },
  });

  const handleSubmit = async (data: BucketFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Failed to update bucket:", error);
    }
  };

  if (!bucket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 font-heading">
          Edit Bucket
        </h3>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Bucket Name
            </label>
            <input
              {...form.register("name")}
              id="name"
              type="text"
              placeholder="Bucket name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
            />
            {form.formState.errors.name && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Bucket Color
            </label>
            <input
              {...form.register("color")}
              id="color"
              type="color"
              className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.color && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.color.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
