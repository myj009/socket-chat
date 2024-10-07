"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Provider as JotaiProvider, useSetAtom } from "jotai";
import { chatStore, socket } from "./store";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const session = useSession();
  const setSocket = useSetAtom(socket);

  useEffect(() => {
    if (session && session.data?.user) {
      console.log(session.data.user);
      const socket = connectSocket(session.data.user.token);
      setSocket(socket);
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connnected", socket.id);
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [session, setSocket]);

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <SessionProvider>
      <ThemeProvider>
        <JotaiProvider store={chatStore}>
          <SocketProvider>{children}</SocketProvider>
        </JotaiProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
