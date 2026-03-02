"use client";

import { useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { AppNotification } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook for notification management — HU-05
 * Handles read state and click-through navigation to the correct view
 */
export function useNotifications() {
  const { notifications, handleMarkAllRead, handleMarkRead, setNotifPanelOpen } = useApp();
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Navigate to the appropriate view when a notification is clicked
   * Then mark it as read and close the panel
   */
  const handleNotificationClick = useCallback(
    (notif: AppNotification) => {
      handleMarkRead(notif.id);
      setNotifPanelOpen(false);

      switch (notif.type) {
        case "message":
          // Navigate to chat, optionally opening a specific chat
          if (notif.linkChatId) {
            router.push(`/chat?chatId=${notif.linkChatId}`);
          } else {
            router.push("/chat");
          }
          break;

        case "favorite_price":
          // Navigate to the product whose price dropped
          if (notif.linkProductId) {
            router.push(`/product/${notif.linkProductId}`);
          } else {
            router.push("/");
          }
          break;

        case "sale":
          // Navigate to seller dashboard to see sales
          router.push("/seller");
          break;

        case "report":
          // Navigate to admin dashboard moderation tab
          router.push("/admin");
          break;

        case "system":
          // Navigate to profile for system messages like "complete your profile"
          router.push("/profile");
          break;

        default:
          router.push("/");
      }
    },
    [handleMarkRead, setNotifPanelOpen, router]
  );

  const markAllRead = useCallback(() => {
    handleMarkAllRead();
    toast.success("Todas las notificaciones marcadas como leídas");
  }, [handleMarkAllRead]);

  return {
    notifications,
    unreadCount,
    handleNotificationClick,
    handleMarkRead,
    markAllRead,
  };
}
