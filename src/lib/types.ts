export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  bucket_id: string;
  completed: boolean;
  created_at: string;
}

export interface Bucket {
  id: string;
  name: string;
  color: string;
  created_at: string;
}