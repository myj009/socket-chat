"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function AuthButton() {
  return (
    <Button
      variant="default"
      onClick={() => {
        signOut();
      }}
    >
      Sign out
    </Button>
  );
}
