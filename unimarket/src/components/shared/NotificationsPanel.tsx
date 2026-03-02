"use client";

import React from "react";
import { Bell, MessageCircle, Heart, DollarSign, ShieldAlert, Info, Check, X } from "lucide-react";
import { AppNotification } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "@/i18n/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useApp } from "@/contexts/AppContext";
import { cn, timeAgo } from "@/lib/utils";

const typeIcon: Record<AppNotification["type"], React.ReactNode> = {
  message: <MessageCircle size={16} />,
  favorite_price: <Heart size={16} />,
  sale: <DollarSign size={16} />,
  report: <ShieldAlert size={16} />,
  system: <Info size={16} />,
};

const typeBg: Record<AppNotification["type"], string> = {
  message: "bg-indigo-100 text-indigo-600",
  favorite_price: "bg-rose-100 text-rose-600",
  sale: "bg-emerald-100 text-emerald-600",
  report: "bg-amber-100 text-amber-600",
  system: "bg-slate-100 text-slate-600",
};

/**
 * Notifications dropdown panel — HU-05
 * Clicking a notification navigates to the relevant view via useNotifications hook
 */
export function NotificationsPanel() {
  const { t } = useLang();
  const { notifPanelOpen, setNotifPanelOpen } = useApp();
  const { notifications, handleNotificationClick, markAllRead } = useNotifications();

  const unread = notifications.filter((n) => !n.read).length;

  const handleClose = () => setNotifPanelOpen(false);

  return (
    <AnimatePresence>
      {notifPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-16 right-4 z-50 w-80 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t.notifications.title}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" aria-hidden="true" />
                <span className="font-bold text-slate-900">{t.notifications.title}</span>
                {unread > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    aria-label={t.notifications.markAllRead}
                  >
                    <Check size={12} aria-hidden="true" />
                    {t.notifications.markAllRead}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  aria-label="Cerrar notificaciones"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* List */}
            <div
              className="overflow-y-auto flex-1"
              role="list"
              aria-label="Lista de notificaciones"
              aria-live="polite"
            >
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 px-4 text-center">
                  <Bell size={36} className="opacity-20" aria-hidden="true" />
                  <p className="font-bold text-sm">{t.notifications.empty}</p>
                  <p className="text-xs">{t.notifications.emptyDesc}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    role="listitem"
                    className={cn(
                      "w-full text-left flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors",
                      !notif.read && "bg-indigo-50/50"
                    )}
                    onClick={() => handleNotificationClick(notif)}
                    aria-label={`${notif.title}: ${notif.body}${!notif.read ? " (no leída)" : ""}`}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        typeBg[notif.type]
                      )}
                      aria-hidden="true"
                    >
                      {typeIcon[notif.type]}
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm leading-snug",
                            notif.read
                              ? "font-medium text-slate-700"
                              : "font-bold text-slate-900"
                          )}
                        >
                          {notif.title}
                        </span>
                        <span
                          className="text-[10px] text-slate-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          {timeAgo(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                        {notif.body}
                      </p>
                    </div>
                    {!notif.read && (
                      <div
                        className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
