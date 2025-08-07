import { Snail, Fish, AlertCircle, Zap } from "lucide-react";

export const priorityIcons = {
  low: <Snail className="w-4 h-4 text-gray-400" />,
  medium: <Fish className="w-4 h-4 text-yellow-500" />,
  high: <AlertCircle className="w-4 h-4 text-orange-500" />,
  urgent: <Zap className="w-4 h-4 text-red-500" />,
};

export const priorityColors = {
  low: "border-gray-300",
  medium: "border-yellow-300",
  high: "border-orange-300",
  urgent: "border-red-300",
};

export const colorOptions = [
  "bg-gray-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-amber-500",
];
