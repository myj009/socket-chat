import { Server } from "socket.io";
import * as z from "zod";
import { ISocket } from "../types/socket";
import prisma from "@repo/db/client";
import { channelRoom, userRoom } from "../util";

const membersSchema = z.map(
  z.string(),
  z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    image: z.string().nullable(),
  })
);

const PayloadType = z.object({
  groupName: z.string().min(1, "Group name is required"),
  members: membersSchema,
});

export function createGroup(io: Server, socket: ISocket) {
  return async (payload: z.infer<typeof PayloadType>, callback: any) => {
    if (typeof callback !== "function") {
      return;
    }

    let status = "OK";
    const userIds = Array.from(payload.members.keys());

    const channel = await prisma.channel.create({
      data: {
        name: payload.groupName,
        UserChannels: {
          create: [
            { userId: socket.userId },
            ...userIds.map((userId) => ({ userId })),
          ],
        },
      },
    });

    socket.to(userRoom(socket.userId)).emit("channel:created", channel);
    // Join the socket for the current user
    io.in(userRoom(socket.userId)).socketsJoin(channelRoom(channel.id));

    // Join the sockets for all members in the payload
    userIds.forEach((userId) => {
      io.in(userRoom(userId)).socketsJoin(channelRoom(channel.id));
    });
    console.log("Group created", channel);

    try {
      callback({
        status,
        data: "abc",
      });
    } catch (e) {
      console.error(e);
      return callback({
        status: "ERROR",
      });
    }
  };
}
