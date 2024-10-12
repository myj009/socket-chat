import { usersAtom } from "@/app/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserMin } from "@/types/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CreateGroupSkeleton from "./skeletons/create-group";

// Define the schema for form validation
const membersSchema = z.map(
  z.string(),
  z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    image: z.string().nullable(),
  })
);
const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  members: membersSchema,
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateGroupForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserMin[]>([]);
  const users = useAtomValue(usersAtom);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      members: new Map(),
    },
  });

  if (users.state === "loading" || users.state === "hasError") {
    <CreateGroupSkeleton />;
  }

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (users.state != "hasData") {
      return;
    }
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    const mockUsers = users.data.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(mockUsers.slice(0, 5));
  };

  const addMember = (member: UserMin) => {
    const currentMembers = form.getValues("members");
    // Ensure currentMembers is a Map
    const membersMap =
      currentMembers instanceof Map ? currentMembers : new Map();

    if (!membersMap.has(member.id)) {
      membersMap.set(member.id, member);
      form.setValue("members", membersMap);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeMember = (member: UserMin) => {
    const currentMembers = form.getValues("members");
    currentMembers.delete(member.id);
    form.setValue("members", currentMembers);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-1 flex-col justify-between"
      >
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="groupName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter group name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="members"
            render={() => (
              <FormItem>
                <FormLabel>Members</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {Array.from(form.watch("members").values()).map((member) => (
                    <Badge key={member.id} variant="secondary">
                      {member.name || member.email}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-auto"
                        onClick={() => removeMember(member)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search for users to add (Enter atleast 2 characters)"
                    />
                    {searchResults.length > 0 && (
                      <ul className="border rounded-md p-2">
                        {searchResults.map((user) => (
                          <li
                            key={user.id}
                            className="cursor-pointer hover:bg-muted p-1 rounded-md"
                            onClick={() => addMember(user)}
                          >
                            <div className="flex flex-row gap-2 items-center text-sm">
                              {form.getValues("members") instanceof Map &&
                                form.getValues("members").has(user.id) && (
                                  <Check className="h-4 w-4" />
                                )}
                              {user.name
                                ? user.name + " (" + user.email + ")"
                                : "(" + user.email + ")"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit" type="submit">
          Create Group
        </Button>
      </form>
    </Form>
  );
}
