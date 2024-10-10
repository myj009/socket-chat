import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function UserListSkeleton({ n = 5 }: { n?: number }) {
  return (
    <div className="flex flex-col h-full w-full gap-2 p-2">
      {Array(n)
        .fill(Math.random() * 10)
        .map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
    </div>
  );
}
