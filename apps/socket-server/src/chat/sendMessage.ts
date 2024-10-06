import { Server } from "socket.io";
import { ISocket } from "../types/socket";
import * as z from "zod";
import prisma from "@repo/db/client";
import { channelRoom } from "../util";

const PayloadType = z.object({
  content: z.string().min(1),
  channelId: z.string().cuid(),
});

export function sendMessage(io: Server, socket: ISocket) {
  return async (payload: z.infer<typeof PayloadType>, callback: any) => {
    console.log("sendMessage");
    console.log(payload, callback);
    if (typeof callback !== "function") {
      return;
    }

    try {
      const message = await prisma.message.create({
        data: {
          content: payload.content,
          channelId: payload.channelId,
          fromUserId: socket.userId,
        },
      });

      socket
        .to(channelRoom(payload.channelId))
        .emit("message:created", message);

      callback({
        status: "OK",
        message,
      });
    } catch (e) {
      console.log(e);
      callback({
        status: "ERROR",
        message: null,
      });
    }
  };
}
