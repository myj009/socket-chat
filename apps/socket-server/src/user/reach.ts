import prisma from "@repo/db/client";
import * as z from "zod";
import { ISocket } from "../types/socket";
import { channelRoom, userRoom } from "../util";
import { Server } from "socket.io";

const PayloadType = z.object({
  userId: z.string().cuid(),
});

export function reachUser(io: Server, socket: ISocket) {
  return async (payload: z.infer<typeof PayloadType>, callback: any) => {
    console.log("reachuser");
    console.log(payload, callback);
    if (typeof callback !== "function") {
      return;
    }

    let status = "OK";

    try {
      let channel = await prisma.channel.findFirst({
        where: {
          AND: [
            {
              UserChannels: {
                some: {
                  userId: socket.userId,
                },
              },
            },
            {
              UserChannels: {
                some: {
                  userId: payload.userId,
                },
              },
            },
          ],
        },
        select: { id: true },
      });

      if (!channel) {
        channel = await prisma.channel.create({
          data: {
            UserChannels: {
              create: [{ userId: socket.userId }, { userId: payload.userId }],
            },
          },
          select: { id: true },
        });

        // broadcast to other tabs of the same user
        socket.to(userRoom(socket.userId)).emit("channel:created", channel);
        status = "NEW";
      }

      io.in(userRoom(socket.userId))
        .in(userRoom(payload.userId))
        .socketsJoin(channelRoom(channel.id));

      console.log("User reached", channel);
      callback({
        status: status,
        data: channel,
      });
    } catch (e) {
      console.error(e);
      return callback({
        status: "ERROR",
      });
    }
  };
}
