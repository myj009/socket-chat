import { getUserChats } from "@/actions/get-user-chats";
import Appbar from "@/components/appbar";
import { ChatLayout } from "@/components/chat/chat-layout";
import { authOptions } from "@/lib/auth";
import { IChat } from "@/types/chat";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function ChatPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return redirect("/auth/signin");
  }

  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const chats: IChat[] | null = await getUserChats();

  return (
    <>
      <Appbar />
      <div className="mt-16 pt-4">
        <div className="container max-h-[90vh] px-0 mx-auto border rounded-lg border-border">
          <ChatLayout
            defaultLayout={defaultLayout}
            navCollapsedSize={8}
            chats={chats}
          >
            {children}
          </ChatLayout>
        </div>
      </div>
    </>
  );
}
