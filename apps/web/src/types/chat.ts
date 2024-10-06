import { Message } from "@prisma/client";

export interface IChat {
  id: string;
  toUser: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface IChatWithMessages {
  id: string;
  toUser: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  messages: Message[];
}
