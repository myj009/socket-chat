"use client";

import { messageAtom, socketAtom, syncMessagesAtom } from "@/app/store";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { UserMin } from "@/types/prisma";
import { Message } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { EllipsisVertical, Forward, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useRef } from "react";
import UserAvatar from "../user-avatar";
import ChatBottombar from "./chat-bottombar";

interface ChatListProps {
  selectedUser: UserMin;
  isMobile: boolean;
  channelId: string;
}

const getMessageVariant = (messageName: string, selectedUserName: string) =>
  messageName === selectedUserName ? "received" : "sent";

export function ChatList({ selectedUser, isMobile, channelId }: ChatListProps) {
  const { data } = useSession();
  const [messages, setMessages] = useAtom(messageAtom(channelId));
  const syncMessages = useSetAtom(syncMessagesAtom(channelId));
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socket = useAtomValue(socketAtom);

  useEffect(() => {
    async function syncMessagesFn() {
      await syncMessages();
    }
    if (messages.length === 0) {
      syncMessagesFn();
    }
  }, [syncMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!data || !data.user || !socket) {
    return <div>Unauthenticated</div>;
  }

  const sendMessage = async (newMessage: string) => {
    const res = await socket?.emitWithAck("message:send", {
      channelId: channelId,
      content: newMessage,
    });
    const message = res.message as Message;
    if (typeof message.createdAt === "string") {
      message.createdAt = new Date(message.createdAt);
    }
    setMessages((prev) => [...prev, message]);
  };

  const actionIcons = [
    { icon: EllipsisVertical, type: "More" },
    { icon: Forward, type: "Like" },
    { icon: Heart, type: "Share" },
  ];

  return (
    <div className="w-full overflow-y-auto h-full flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <ChatMessageList ref={messagesContainerRef}>
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = getMessageVariant(
                message.fromUserId,
                selectedUser.id
              );
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-2 p-2"
                >
                  {/* Usage of ChatBubble component */}
                  <ChatBubble variant={variant}>
                    <UserAvatar
                      image={
                        variant === "sent"
                          ? data.user.image
                          : selectedUser.image
                      }
                      id={variant === "sent" ? data.user.id : selectedUser.id}
                      size="9"
                      name={
                        variant === "sent"
                          ? data.user.name || data.user.email
                          : selectedUser.name || selectedUser.email
                      }
                    />
                    <ChatBubbleMessage
                      variant={variant}
                      // isLoading={message.isLoading}
                    >
                      {message.content}
                      {message.createdAt && (
                        <ChatBubbleTimestamp
                          timestamp={message.createdAt.toDateString()}
                        />
                      )}
                    </ChatBubbleMessage>
                    <ChatBubbleActionWrapper variant={variant}>
                      {actionIcons.map(({ icon: Icon, type }) => (
                        <ChatBubbleAction
                          className="size-7"
                          key={type}
                          icon={<Icon className="size-4" />}
                          onClick={() =>
                            console.log(
                              "Action " + type + " clicked for message " + index
                            )
                          }
                        />
                      ))}
                    </ChatBubbleActionWrapper>
                  </ChatBubble>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ChatMessageList>
        <ChatBottombar isMobile={isMobile} sendMessage={sendMessage} />
      </Suspense>
    </div>
  );
}
