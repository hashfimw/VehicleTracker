import React from "react";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusBadgeColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: "trip" | "idle" | "stopped";
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border",
        getStatusColor(status),
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-2 h-2 rounded-full", getStatusBadgeColor(status))}
        />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
