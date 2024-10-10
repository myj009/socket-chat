import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function UserChatSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {Array(n)
        .fill(Math.random())
        .map((_, i) => {
          const randNum = Math.floor(Math.random() * 2);
          return (
            <div
              key={i}
              className={
                randNum == 0
                  ? "flex w-full gap-2 flex-row items-start"
                  : "flex w-full gap-2 items-end flex-row-reverse"
              }
            >
              <div
                className={
                  "flex flex-col justify-end gap-2 " +
                  (randNum == 0 ? "items-start" : "items-end")
                }
              >
                <Skeleton className="h-16 w-36 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          );
        })}
    </div>
  );
}
