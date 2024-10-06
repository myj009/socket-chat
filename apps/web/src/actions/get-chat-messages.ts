"use server";

import prisma from "@repo/db/client";

export async function getChatMessages(channelId: string) {
  const messages = await prisma.message.findMany({
    where: {
      channelId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
}
