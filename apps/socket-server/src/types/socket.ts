import { Socket } from "socket.io";

export interface ISocket extends Socket {
  userId: string;
  // other additional attributes here, example:
  // surname?: string;
}
