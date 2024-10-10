import UserChatSkeleton from "./user-chat";
import UserTopbarSkeleton from "./user-topbar";

export default function ChatListSkeleton() {
  return (
    <div className="min-h-[90vh] w-full grid grid-cols-7">
      <div className="col-span-5 min-h-full">
        <div className="border-b border-border">
          <UserTopbarSkeleton />
        </div>
        <UserChatSkeleton />
      </div>
    </div>
  );
}
