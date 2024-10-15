"use client";

import { Chat } from "@/components/chat/chat";
import ChatListSkeleton from "@/components/skeletons/chat-list";
import { useAtomValue, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { chatAtom, syncChatAtom } from "../store";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const { data } = useSession();
  const chat = useAtomValue(chatAtom(userId));
  const syncChat = useSetAtom(syncChatAtom(userId));

  useEffect(() => {
    async function syncFn() {
      await syncChat();
    }
    syncFn();
  }, [syncChat]);

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

  if (!chat) {
    return <ChatListSkeleton />;
  }

  return (
    <Chat selectedUser={chat.toUser} isMobile={false} channelId={chat.id} />
  );
}
