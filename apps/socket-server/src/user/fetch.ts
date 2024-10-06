import prisma from "@repo/db/client";

export const fetchUserChannels = async (userId: string) => {
  return await prisma.userChannel.findMany({
    where: {
      userId,
    },
    select: {
      channelId: true,
    },
  });
};
