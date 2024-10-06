import { EmojiPicker } from "@/components/emoji-picker";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal, ThumbsUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ChatBottombarProps {
  isMobile: boolean;
  sendMessage: (newMessage: string) => void;
}

export default function ChatBottombar({ sendMessage }: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  // const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // const [isLoading, setisLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    sendMessage("👍");
    setMessage("");
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setFile(event.target.files[0]);
  //     console.log(event.target.files[0]);
  //   }
  // };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // const formattedTime = new Date().toLocaleTimeString("en-US", {
  //   hour: "numeric",
  //   minute: "2-digit",
  //   hour12: true,
  // });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-3 py-4 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="rounded-full"
          />
          <div className="absolute right-4 bottom-2  ">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleSend}
            variant="ghost"
            size="icon"
          >
            <SendHorizontal size={22} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 shrink-0"
            onClick={handleThumbsUp}
            variant="ghost"
            size="icon"
          >
            <ThumbsUp size={22} className="text-muted-foreground" />
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
