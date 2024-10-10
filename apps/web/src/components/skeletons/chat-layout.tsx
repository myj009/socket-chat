import React from "react";
import UserListSkeleton from "./user-list";
import UserTopbarSkeleton from "./user-topbar";
import UserChatSkeleton from "./user-chat";
import { Skeleton } from "../ui/skeleton";

export default function ChatLayoutSkeleton() {
  return (
    <div className="min-h-[90vh] w-full grid grid-cols-7">
      <div className="col-span-2 min-h-full border-r border-border">
        <div className="flex justify-between gap-1 items-center p-2">
          <Skeleton className="w-20 h-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <UserListSkeleton />
      </div>
      <div className="col-span-5 min-h-full">
        <div className="border-b border-border">
          <UserTopbarSkeleton />
        </div>
        <UserChatSkeleton />
      </div>
    </div>
  );
}
