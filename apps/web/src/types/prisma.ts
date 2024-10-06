import { Prisma } from "@prisma/client";

export type UserMin = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
  };
}>;

export type ChannelWithUsers = Prisma.ChannelGetPayload<{
  include: {
    UserChannels: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;
