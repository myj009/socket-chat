"use server";

import { authOptions } from "@/lib/auth";
import { UserMin } from "@/types/prisma";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";

export async function GetUsers(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return [];
  }

  const users: UserMin[] = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: slug,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: slug,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    take: 6,
  });

  return users.filter((user) => user.id !== session.user.id);
}
