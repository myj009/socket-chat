"use client";

import { io, Socket } from "socket.io-client";
import { bindEvents } from "./events";

let socket: Socket | null;

export const connectSocket = (token: string) => {
  if (!socket) {
    socket = io(process.env.WSURL || "http://localhost:8989", {
      autoConnect: false,
      withCredentials: true,
      path: "/socket.io/",
      auth: {
        token,
      },
    });

    bindEvents(socket);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
