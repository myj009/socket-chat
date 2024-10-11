import { atom, createStore } from "jotai";
import { atomFamily, loadable } from "jotai/utils";
import { INTERNAL_DevStoreRev4, INTERNAL_PrdStore } from "jotai/vanilla/store";
import { Socket } from "socket.io-client";
import { Message } from "@prisma/client";
import deepEqual from "fast-deep-equal";
import { IChat } from "@/types/chat";
import { getUserChat } from "@/actions/get-user-chats";
import { getChatMessages } from "@/actions/get-chat-messages";
import { GetUsers } from "@/actions/get-users";

export const chatStore:
  | INTERNAL_PrdStore
  | (INTERNAL_PrdStore & INTERNAL_DevStoreRev4) = createStore();

export const socket = atom<Socket | null>(null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const messageAtom = atomFamily((_channelId: string) =>
  atom<Message[]>([])
);

export const syncMessagesAtom = atomFamily(
  (channelId: string) =>
    atom(null, async (get, set) => {
      const messages = await getChatMessages(channelId);
      set(messageAtom(channelId), messages);
      return messages;
    }),
  deepEqual
);

export const updateMessageAtom = (newMessage: Message) => {
  chatStore.set(messageAtom(newMessage.channelId), (prev) => {
    if (typeof newMessage.createdAt == "string") {
      newMessage.createdAt = new Date(newMessage.createdAt);
    }
    const updatedMessages = [...prev, newMessage];
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
      return chat;
    }),
  deepEqual
);

export const chatAtom = atomFamily((userId: string | null) =>
  loadable(chatAsyncAtom(userId))
);

export const usersAsyncAtom = atom(async () => {
  const users = await GetUsers("");
  return users;
});

export const usersAtom = loadable(usersAsyncAtom);
