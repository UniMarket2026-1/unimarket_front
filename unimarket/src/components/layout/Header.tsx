"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Globe } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useLang } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { userRole, setUserRole, setNotifPanelOpen, notifPanelOpen, unreadCount } = useApp();
  const { t, lang, setLang } = useLang();

  // Hide on immersive pages (they have their own header)
  if (pathname.startsWith("/publish") || pathname.startsWith("/product")) return null;

  return (
    <header
      className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold"
          aria-hidden="true"
        >
          U
        </div>
        <span className="font-black text-indigo-900 tracking-tight">{t.appName}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
          aria-label={`Cambiar idioma a ${lang === "es" ? "English" : "Español"}`}
          title={`Switch to ${lang === "es" ? "English" : "Español"}`}
        >
          <Globe size={14} aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase">{lang === "es" ? "EN" : "ES"}</span>
        </button>

        {/* Role Toggle */}
        <div
          className="flex bg-slate-100 p-1 rounded-lg"
          role="group"
          aria-label="Cambiar rol de usuario"
        >
          <button
            onClick={() => setUserRole("student")}
            aria-pressed={userRole === "student"}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-bold transition-all",
              userRole === "student"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500"
            )}
          >
            {t.roles.student}
          </button>
          <button
            onClick={() => setUserRole("admin")}
            aria-pressed={userRole === "admin"}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-bold transition-all",
              userRole === "admin"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500"
            )}
          >
            {t.roles.admin}
          </button>
        </div>

        {/* Bell */}
        <button
          onClick={() => setNotifPanelOpen(!notifPanelOpen)}
          className="relative text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          aria-label={`${t.notifications.title}${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
          aria-expanded={notifPanelOpen}
          aria-haspopup="dialog"
        >
          <Bell size={22} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold"
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
