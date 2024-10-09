"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { chatAtom } from "../store";
import { useAtom } from "jotai";
import { Chat } from "@/components/chat/chat";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { data } = useSession();
  const [chat] = useAtom(chatAtom(userId));

  if (!data || !data.user) {
    return <div>Unauthenticated</div>;
  }

  if (!userId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        No conversations yet. Start by searching for a user.
      </div>
    );
  }

  if (chat.state === "hasError") {
    console.error(chat.error);
    return (
      <div className="w-full h-full flex items-center justify-center">
        User not found
      </div>
    );
  }

  if (chat.state === "loading" || !chat.data) {
    return <div>Loading...</div>;
  }

  return (
    <Chat
      selectedUser={chat.data.toUser}
      isMobile={false}
      channelId={chat.data.id}
    />
  );
}
