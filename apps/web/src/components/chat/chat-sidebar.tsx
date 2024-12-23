"use client";

import CreateGroupForm from "@/components/create-group-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { EllipsisVertical, PenBox } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SearchUsers from "../search-users";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import UserAvatar from "../user-avatar";

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

export function Sidebar({ chats, isCollapsed }: SidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div
        className={
          isCollapsed
            ? "justify-center w-full flex p-2 items-center"
            : "justify-between w-full flex p-2 items-center"
        }
      >
        {!isCollapsed && (
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="">({chats ? chats.length : 0})</span>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <PenBox className="h-6 w-6 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <SearchUsers setIsSearchOpen={setIsSearchOpen} />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <EllipsisVertical className="h-6 w-6 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      setIsDialogOpen(true);
                    }}
                  >
                    Create Group
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-3xl min-h-[50vh] max-h-[90vh] overflow-y-auto flex flex-col gap-4 justify-start">
                  <DialogTitle>Create new group</DialogTitle>
                  <CreateGroupForm />
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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
                    <UserAvatar
                      image={chat.avatar}
                      id={chat.userId}
                      name={chat.name}
                    />
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
              <UserAvatar
                image={chat.avatar}
                id={chat.userId}
                name={chat.name}
              />
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
