import React, { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { UserMin } from "@/types/prisma";
import { GetUsers } from "@/actions/get-users";
import UserAvatar from "./user-avatar";
import { useAtomValue } from "jotai";
import { socket } from "@/app/store";
import { useRouter } from "next/navigation";

export default function SearchUsers({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (open: boolean) => void;
}) {
  const [users, setUsers] = React.useState<UserMin[]>([]);
  const sock = useAtomValue(socket);
  const router = useRouter();

  useEffect(() => {
    handleValueChange("");
  }, []);

  const handleValueChange = async (value: string) => {
    const u = await GetUsers(value);
    setUsers(u);
  };

  const handleUserSelect = async (user: UserMin) => {
    if (sock == null) {
      console.error("Socket not connected");
    }

    const res = await sock!.emitWithAck("user:reach", { userId: user.id });
    const params = new URLSearchParams();
    params.set("userId", user.id);
    setIsSearchOpen(false);
    router.push("/chat?" + params.toString());
    if (res.status == "NEW") {
      router.refresh();
    }
  };

  return (
    <Command>
      <CommandInput
        placeholder="Search users..."
        onValueChange={handleValueChange}
      />
      <CommandList>
        <CommandEmpty>No users found.</CommandEmpty>
        <CommandGroup className="flex flex-col gap-1">
          {users.map((user) => (
            <CommandItem
              className="w-full cursor-pointer"
              key={user.id}
              onSelect={() => {
                handleUserSelect(user);
              }}
            >
              <div className="flex gap-3 items-center">
                <div className="">
                  <UserAvatar image={user.image} id={user.id} />
                </div>
                <div className="">{user.name}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
