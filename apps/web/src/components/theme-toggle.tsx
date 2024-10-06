"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        theme == "light" ? setTheme("dark") : setTheme("light");
      }}
    >
      {theme == "light" ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 ease-in-out transform rotate-0" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 ease-in-out transform rotate-180" />
      )}
    </Button>
  );
}
