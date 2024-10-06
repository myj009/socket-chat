"use client";

import { UserMin } from "@/types/prisma";
import { ChatList } from "./chat-list";
import ChatTopbar from "./chat-topbar";

interface ChatProps {
  selectedUser: UserMin;
  isMobile: boolean;
  channelId: string;
}

export function Chat({ selectedUser, isMobile, channelId }: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        selectedUser={selectedUser}
        isMobile={isMobile}
        channelId={channelId}
      />
    </div>
  );
}
