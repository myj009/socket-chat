import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";
import { UserMin } from "@/types/prisma-types";
import BoringAvatar from "boring-avatars";

interface ChatTopbarProps {
  selectedUser: UserMin;
}

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-3">
        {selectedUser.image ? (
          <Avatar className="flex justify-center items-center">
            <AvatarImage
              src={selectedUser.image}
              alt={selectedUser.name || ""}
              width={6}
              height={6}
              className="w-10 h-10 "
            />
          </Avatar>
        ) : (
          <BoringAvatar
            name={selectedUser.id}
            variant="beam"
            className="w-9 h-9"
          />
        )}

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
