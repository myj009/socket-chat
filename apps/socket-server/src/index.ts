import dotenv from "dotenv";
import { createServer } from "./server";
import { reachUser } from "./user/reach";
import jwt from "jsonwebtoken";
import { JwtUser } from "./types/user";
import { Server } from "socket.io";
import { ISocket } from "./types/socket";
import { channelRoom, userRoom } from "./util";
import { fetchUserChannels } from "./user/fetch";
import { sendMessage } from "./chat/sendMessage";

dotenv.config();

const io = createServer();

initEventHandlers({ io });

function initEventHandlers({ io }: { io: Server }) {
  io.use((socket, next) => {
    const sock = socket as ISocket;
    const token = sock.handshake.auth.token;
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_TOKEN || "password"
      ) as JwtUser;
      sock.userId = user.userId;
      next();
    } catch (e) {
      console.error(e);
      const err = new Error("Not authorized: " + e);
      next(err);
    }
  });

  io.use(async (socket, next) => {
    const sock = socket as ISocket;
    if (!sock.userId) {
      return next(new Error("Not authorized"));
    }
    sock.join(userRoom(sock.userId));

    const channels = await fetchUserChannels(sock.userId);
    channels.forEach((c) => {
      sock.join(channelRoom(c.channelId));
    });

    next();
  });

  io.on("connection", (socket) => {
    const sock = socket as ISocket;
    console.log("user connected:", sock.userId);
    sock.on("disconnect", () => {
      console.log("user disconnected");
    });

    sock.on("user:reach", reachUser(io, sock));
    sock.on("message:send", sendMessage(io, sock));
  });
}
