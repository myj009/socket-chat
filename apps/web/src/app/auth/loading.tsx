import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="w-full grid min-h-screen grid-cols-1">
      <div className="flex flex-col gap-6 items-center justify-center py-12 px-2 border border-border">
        <Skeleton className="h-12 w-28 rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
          <div className="flex flex-row gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
