"use client";

import { IChat } from "@/types/chat";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { connectSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./chat-sidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  chats: IChat[] | null;
}

export function ChatLayout({
  children,
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  chats,
}: ChatLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  useEffect(() => {
    async function reachUserSocket() {
      if (session && session.user) {
        const socket = connectSocket(session.user.token);
        const res = await socket.emitWithAck("user:reach", { userId });
        // console.log(res);
        if (res.status == "NEW") {
          router.refresh();
        }
      }
    }

    if (!userId && chats && chats.length > 0) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("userId", chats[0]!.toUser.id);

      router.replace(`/chat?${newSearchParams.toString()}`);
    }

    if (userId) {
      reachUserSocket();
    }
  }, [chats, router, searchParams, session, userId]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed &&
            "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          chats={chats?.map((chat) => ({
            id: chat.id,
            userId: chat.toUser.id,
            name: chat.toUser.name || chat.toUser.email,
            avatar: chat.toUser.image,
            variant: userId === chat.toUser.id ? "secondary" : "ghost",
          }))}
          isMobile={isMobile}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultLayout[1]}
        minSize={30}
        className="h-[90vh] max-h-[90vh] overflow-y-auto"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
