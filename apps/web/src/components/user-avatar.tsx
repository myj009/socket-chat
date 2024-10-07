"use client";

import { UserMin } from "@/types/prisma";
import BoringAvatar from "boring-avatars";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({
  image,
  id,
  size = "10",
}: {
  image: string | null;
  id: string;
  size?: string;
}) {
  if (image) {
    return (
      <Avatar className={`h-${size} w-${size}`}>
        <AvatarImage
          src={image}
          alt={"image"}
          className={`h-${size} w-${size}`}
        />
        <AvatarFallback>MJ</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <BoringAvatar variant="beam" className={`h-${size} w-${size}`} name={id} />
  );
}