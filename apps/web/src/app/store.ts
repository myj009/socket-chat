import { atom, createStore } from "jotai";
import { atomFamily, loadable } from "jotai/utils";
import { INTERNAL_DevStoreRev4, INTERNAL_PrdStore } from "jotai/vanilla/store";
import { Socket } from "socket.io-client";
import { Message } from "@prisma/client";
import deepEqual from "fast-deep-equal";
import { IChat } from "@/types/chat";
import { getUserChat } from "@/actions/get-user-chats";
import { getChatMessages } from "@/actions/get-chat-messages";

export const chatStore:
  | INTERNAL_PrdStore
  | (INTERNAL_PrdStore & INTERNAL_DevStoreRev4) = createStore();

export const socket = atom<Socket | null>(null);

export const messageAtom = atomFamily((channelId: string) =>
  atom<Message[]>([])
);

export const syncMessagesAtom = atomFamily(
  (channelId: string) =>
    atom(null, async (get, set) => {
      const messages = await getChatMessages(channelId);
      // console.log(messages);
      set(messageAtom(channelId), messages);
      return messages;
    }),
  deepEqual
);

export const updateMessageAtom = (newMessage: Message) => {
  // console.log(newMessage);
  chatStore.set(messageAtom(newMessage.channelId), (prev) => {
    // console.log("Previous messages:", prev); // Debugging line
    if (typeof newMessage.createdAt == "string") {
      newMessage.createdAt = new Date(newMessage.createdAt);
    }
    const updatedMessages = [...prev, newMessage];
    // console.log("Updated messages:", updatedMessages); // Debugging line
    return updatedMessages;
  });
};

const chatAsyncAtom = atomFamily(
  (userId: string | null) =>
    atom(async () => {
      if (!userId) {
        return null;
      }

      const chat: IChat | null = await getUserChat(userId);
      // console.log(chat);
      return chat;
    }),
  deepEqual
);

export const chatAtom = atomFamily((userId: string | null) =>
  loadable(chatAsyncAtom(userId))
);
