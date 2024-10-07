"use server";

import { authOptions } from "@/lib/auth";
import { IChat } from "@/types/chat";
import { ChannelWithUsers } from "@/types/prisma";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

const flattenChat = (chat: ChannelWithUsers, userId: string): IChat | null => {
  if (chat.UserChannels.length < 2) {
    console.error("Invalid chat");
    return null;
  }

  const toUser =
    chat.UserChannels[0]!.userId === userId
      ? chat.UserChannels[1]!.user
      : chat.UserChannels[0]!.user;
  return {
    id: chat.id,
    toUser: toUser,
  };
};

const flattenChats = (chats: ChannelWithUsers[], userId: string): IChat[] => {
  return chats
    .map((chat) => {
      return flattenChat(chat, userId);
    })
    .filter((chat): chat is IChat => chat !== undefined);
};

// const flattenChatsWithMessages = (
//   chats: ChannelWithUsersAndMessages[],
//   userId: string
// ): IChatWithMessages[] => {
//   return chats.map((chat) => {
//     const toUser =
//       chat.UserChannels[0].userId == userId
//         ? chat.UserChannels[1].user
//         : chat.UserChannels[0].user;
//     return {
//       id: chat.id,
//       toUser: toUser,
//       messages: chat.Messages,
//     };
//   });
// };

export async function getUserChat(toUserId: string): Promise<IChat | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }

  const chat: ChannelWithUsers | null = await prisma.channel.findFirst({
    where: {
      AND: [
        {
          UserChannels: {
            some: {
              userId: session.user.id,
            },
          },
        },
        {
          UserChannels: {
            some: {
              userId: toUserId,
            },
          },
        },
      ],
    },
    include: {
      UserChannels: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!chat) {
    return null;
  }

  return flattenChat(chat, session.user.id);
}

export async function getUserChats() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }

  const chats: ChannelWithUsers[] = await prisma.channel.findMany({
    where: {
      UserChannels: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      UserChannels: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return flattenChats(chats, session.user.id);
}
