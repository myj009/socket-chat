import { Separator } from "@/components/ui/separator";
import {
  MessageCircleCode
} from "lucide-react";
import Link from "next/link";
import AuthButton from "./auth-button";
import { ModeToggle } from "./theme-toggle";

export default function Appbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex gap-4">
          <Link href="/" className="items-center gap-2 flex" prefetch={false}>
            <MessageCircleCode className="h-6 w-6 text-brand" />
            <span className="text-lg font-semibold text-brand">
              Socket-Chat
            </span>
          </Link>
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
      <Separator className="w-full" />
    </header>
  );
}
