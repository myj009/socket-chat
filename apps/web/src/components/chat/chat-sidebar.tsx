"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import Link from "next/link";

interface SidebarProps {
  isCollapsed: boolean;
  chats?: {
    id: string;
    userId: string;
    name: string;
    avatar: string | null;
    variant: "secondary" | "ghost";
  }[];
  onClick?: () => void;
  isMobile: boolean;
}

export function Sidebar({ chats, isCollapsed, isMobile }: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="">({chats ? chats.length : 0})</span>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {chats?.map((chat, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={`?userId=${chat.userId}`}
                    className={cn(
                      buttonVariants({ variant: chat.variant, size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                      chat.variant === "secondary" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    {chat.avatar ? (
                      <Avatar className="flex justify-center items-center">
                        <AvatarImage
                          src={chat.avatar ?? undefined}
                          alt={chat.avatar ?? undefined}
                          width={6}
                          height={6}
                          className="w-10 h-10 "
                        />
                      </Avatar>
                    ) : (
                      <BoringAvatar
                        size={35}
                        name={chat.userId}
                        variant="beam"
                      />
                    )}

                    <span className="sr-only">{chat.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {chat.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={`?userId=${chat.userId}`}
              className={cn(
                buttonVariants({ variant: chat.variant, size: "lg" }),
                chat.variant === "secondary" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                "justify-start gap-4"
              )}
            >
              {chat.avatar ? (
                <Avatar className="flex justify-center items-center">
                  <AvatarImage
                    src={chat.avatar ?? undefined}
                    alt={chat.avatar ?? undefined}
                    width={6}
                    height={6}
                    className="w-10 h-10 "
                  />
                </Avatar>
              ) : (
                <BoringAvatar size={35} name={chat.userId} variant="beam" />
              )}

              <div className="flex flex-col max-w-28">
                <span>{chat.name}</span>
              </div>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
