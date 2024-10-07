import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";
import { UserMin } from "@/types/prisma";
import BoringAvatar from "boring-avatars";
import UserAvatar from "../user-avatar";

interface ChatTopbarProps {
  selectedUser: UserMin;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-3">
        <UserAvatar image={selectedUser.image} id={selectedUser.id} />
        <div className="flex flex-col justify-center">
          <span className="font-medium text-lg">
            {selectedUser.name || selectedUser.email}
          </span>
          {/* <span className="text-xs">Active 2 mins ago</span> */}
        </div>
      </div>
    </ExpandableChatHeader>
  );
}
