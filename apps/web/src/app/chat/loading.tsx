import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function loading() {
  return (
    <div className="mt-16 pt-4">
      <div className="container max-h-[90vh] px-0 mx-auto border rounded-lg border-border grid grid-cols-6">
        <div className="col-span-2 border-r border-border">
          {/* Sidebar */}
          {Array(5).map((_, i) => {
            return <Skeleton key={i} className="h-12 w-full" />;
          })}
        </div>
      </div>
    </div>
  );
}
