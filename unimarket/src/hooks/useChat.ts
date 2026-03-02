"use client";

import { useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { Message } from "@/lib/types";
import { toast } from "sonner";

/**
 * Custom hook for chat actions — HU-06
 * Handles sending messages and managing the messages map
 */
export function useChat(chatId: string | null) {
  const { messages, setMessages, chats } = useApp();

  const chatMessages = chatId ? (messages[chatId] ?? []) : [];
  const chat = chats.find((c) => c.id === chatId) ?? null;

  const sendMessage = useCallback(
    (senderId: string, text: string) => {
      if (!chatId || !text.trim()) return;

      const newMessage: Message = {
        id: Date.now().toString(),
        chatId,
        senderId,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] ?? []), newMessage],
      }));
    },
    [chatId, setMessages]
  );

  return { chat, chatMessages, sendMessage };
}

/**
 * Custom hook for initiating a new chat from a product — HU-06
 */
export function useStartChat() {
  const { handleStartChat } = useApp();

  const startChat = useCallback(
    (product: import("@/lib/types").Product): string | null => {
      const chatId = handleStartChat(product);
      return chatId;
    },
    [handleStartChat]
  );

  return { startChat };
}
