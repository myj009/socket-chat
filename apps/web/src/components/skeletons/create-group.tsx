import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function CreateGroupSkeleton() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
