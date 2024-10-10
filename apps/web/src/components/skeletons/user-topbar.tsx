import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function UserTopbarSkeleton() {
  return (
    <div className="flex justify-between items-center p-3">
      <div className="flex gap-1 items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-3 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
