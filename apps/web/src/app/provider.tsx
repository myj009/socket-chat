"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Provider as JotaiProvider, useSetAtom } from "jotai";
import { chatStore, socketAtom } from "./store";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { usePathname, useRouter } from "next/navigation";

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
  const setSocket = useSetAtom(socketAtom);

  useEffect(() => {
    if (session && session.data?.user) {
      const socket = connectSocket(session.data.user.token);
      setSocket(socket);
      socket.connect();

      socket.on("connect", () => {
        const transport = socket.io.engine.transport.name;
        console.log("Socket connnected - ", socket.id, transport);
        socket.io.engine.on("upgrade", () => {
          const upgradedTransport = socket.io.engine.transport.name;
          console.log(upgradedTransport);
        });
      });

      socket.on("disconnect", (reason) =>
        console.log("Disconnected: ", reason)
      );

      socket.on("reconnect_attempt", () =>
        console.log("Attempting to reconnect...")
      );

      return () => {
        disconnectSocket();
      };
    }
  }, [session, setSocket]);

  return <>{children}</>;
}

function PathProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const path = usePathname();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || session.status === "unauthenticated") {
      if (path !== "/auth/signin" && path !== "/auth/signup") {
        router.replace("/auth/signin");
      }
    }

    if (session && session.status === "authenticated") {
      if (
        path === "/auth/signin" ||
        path === "/auth/signup" ||
        path === "" ||
        path === "/"
      ) {
        router.replace("/chat");
      }
    }
  }, [path, router, session]);
  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <SessionProvider>
      <PathProvider>
        <ThemeProvider>
          <JotaiProvider store={chatStore}>
            <SocketProvider>{children}</SocketProvider>
          </JotaiProvider>
        </ThemeProvider>
      </PathProvider>
    </SessionProvider>
  );
}
