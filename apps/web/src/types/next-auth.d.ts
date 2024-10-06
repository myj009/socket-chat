// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      id: string;
      image: string;
      email: string;
      token: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    id: string;
    image: string;
    email: string;
    token: string;
  }
}
