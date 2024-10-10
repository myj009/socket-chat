import { getUserChats } from "@/actions/get-user-chats";
import Appbar from "@/components/appbar";
import { ChatLayout } from "@/components/chat/chat-layout";
import ChatLayoutSkeleton from "@/components/skeletons/chat-layout";
import { authOptions } from "@/lib/auth";
import { IChat } from "@/types/chat";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

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

  const pause = new Promise((resolve) => setTimeout(resolve, 5000));
  await pause;

  const chats: IChat[] | null = await getUserChats();
  console.log(chats?.length);

  return (
    <>
      <Appbar />
      <div className="mt-16 pt-4">
        <div className="container min-h-[90vh] max-h-[90vh] px-0 mx-auto border rounded-lg border-border">
          <Suspense fallback={<ChatLayoutSkeleton />}>
            <ChatLayout
              defaultLayout={defaultLayout}
              navCollapsedSize={8}
              chats={chats}
            >
              {children}
            </ChatLayout>
          </Suspense>
        </div>
      </div>
    </>
  );
}
