import UserChatSkeleton from "./user-chat";
import UserTopbarSkeleton from "./user-topbar";

export default function ChatListSkeleton() {
  return (
    <div className="min-h-[90vh] w-full grid grid-cols-1">
      <div className="col-span-1 min-h-full">
        <div className="border-b border-border">
          <UserTopbarSkeleton />
        </div>
        <UserChatSkeleton />
      </div>
    </div>
  );
}
