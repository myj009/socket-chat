import { getChatMessages } from "@/actions/get-chat-messages";
import { getUserChat } from "@/actions/get-user-chats";
import { GetUsers } from "@/actions/get-users";
import { IChat } from "@/types/chat";
import { UserMin } from "@/types/prisma";
import { Message } from "@prisma/client";
import deepEqual from "fast-deep-equal";
import { atom, createStore } from "jotai";
import { atomFamily } from "jotai/utils";
import { INTERNAL_DevStoreRev4, INTERNAL_PrdStore } from "jotai/vanilla/store";
import { Socket } from "socket.io-client";

export const chatStore:
  | INTERNAL_PrdStore
  | (INTERNAL_PrdStore & INTERNAL_DevStoreRev4) = createStore();

export const socketAtom = atom<Socket | null>(null);

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

// const chatAsyncAtom = atomFamily(
//   (userId: string | null) =>
//     atom(async () => {
//       if (!userId) {
//         return null;
//       }

//       const chat: IChat | null = await getUserChat(userId);
//       return chat;
//     }),
//   deepEqual
// );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const chatAtom = atomFamily((_userId: string | null) =>
  atom<IChat | null>(null)
);

export const syncChatAtom = atomFamily(
  (userId: string | null) =>
    atom(null, async (get, set) => {
      if (userId == null) {
        set(chatAtom(userId), null);
        return null;
      }
      const chat: IChat | null = await getUserChat(userId);
      set(chatAtom(userId), chat);
      return chat;
    }),
  deepEqual
);

export const usersAtom = atom<UserMin[]>([]);

export const syncUsersAtom = atom(null, async (get, set) => {
  const users = await GetUsers("");
  set(usersAtom, users);
  return users;
});
