import { GetUsers } from "@/actions/get-users";
import { socket } from "@/app/store";
import { UserMin } from "@/types/prisma";
import { CommandLoading } from "cmdk";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "./ui/command";
import { Skeleton } from "./ui/skeleton";
import UserAvatar from "./user-avatar";

let debounceTimer: NodeJS.Timeout;

export default function SearchUsers({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (open: boolean) => void;
}) {
  console.log("rendering search users");
  const [users, setUsers] = React.useState<UserMin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const sock = useAtomValue(socket);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const u = await GetUsers("");
      console.log(u);
      setUsers(u);
      setLoading(false);
    }
    init();
  }, []);

  const handleValueChange = async (value: string) => {
    setLoading(true);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      const u = await GetUsers(value);
      console.log(u);
      setUsers(u);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    console.log(users);
  }, [users]);

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
        {!loading && users.length === 0 && (
          <CommandEmpty>No users found</CommandEmpty>
        )}
        {loading && (
          <CommandLoading className="flex flex-col w-full">
            <div className="w-full relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 backdrop:w-full cursor-pointer">
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
          </CommandLoading>
        )}
        {!loading && users.length !== 0 && (
          <>
            <CommandGroup className="flex flex-col gap-1">
              {users.map((user) => (
                <div
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 backdrop:w-full cursor-pointer"
                  key={user.id}
                  onSelect={() => {
                    handleUserSelect(user);
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="">
                      <UserAvatar
                        image={user.image}
                        id={user.id}
                        name={user.name || user.email}
                      />
                    </div>
                    <div className="">{user.name}</div>
                  </div>
                </div>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
