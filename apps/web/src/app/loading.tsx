import ChatLayoutSkeleton from "@/components/skeletons/chat-layout";
import React from "react";

export default function AppLoading() {
  return (
    <div className="mt-16 pt-4">
      <div className="container max-h-[90vh] px-0 mx-auto border rounded-lg border-border">
        <ChatLayoutSkeleton />
      </div>
    </div>
  );
}
