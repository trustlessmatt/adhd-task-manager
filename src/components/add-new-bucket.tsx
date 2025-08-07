import { UseFormReturn } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";
import { BucketFormData } from "@/lib/schemas";
import type { Bucket } from "@/lib/db/schema";

interface AddNewBucketProps {
  setShowAddBucket: (show: boolean) => void;
  bucketForm: UseFormReturn<BucketFormData>;
  onSubmitBucket: (data: BucketFormData) => Promise<void>;
  createBucketMutation: UseMutationResult<
    Bucket,
    Error,
    BucketFormData,
    unknown
  >;
}

export function AddNewBucket({
  setShowAddBucket,
  bucketForm,
  onSubmitBucket,
  createBucketMutation,
}: AddNewBucketProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-100 font-heading">
        Add New Bucket
      </h3>
      <form
        onSubmit={bucketForm.handleSubmit(onSubmitBucket)}
        className="space-y-4"
      >
        <div>
          <input
            {...bucketForm.register("name")}
            type="text"
            placeholder="Bucket name"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
          />
          {bucketForm.formState.errors.name && (
            <p className="text-red-400 text-sm mt-1">
              {bucketForm.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...bucketForm.register("color")}
            type="color"
            className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {bucketForm.formState.errors.color && (
            <p className="text-red-400 text-sm mt-1">
              {bucketForm.formState.errors.color.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createBucketMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {createBucketMutation.isPending ? "Adding..." : "Add Bucket"}
          </button>
          <button
            type="button"
            onClick={() => setShowAddBucket(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
