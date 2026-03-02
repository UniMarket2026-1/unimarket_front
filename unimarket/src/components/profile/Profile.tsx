"use client";

import React, { useState } from "react";
import {
  Bell,
  Heart,
  Shield,
  BookOpen,
  Laptop,
  Sofa,
  Shirt,
  Package,
  CheckCircle2,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Category } from "@/lib/types";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { useLang } from "@/i18n/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * User profile with favorites, notification settings, and interests — HU-01, HU-05
 */
export function Profile() {
  const { t } = useLang();
  const { user, handleToggleNotification, handleUpdateInterests } = useApp();
  const [activeTab, setActiveTab] = useState<"profile" | "favorites" | "settings">("profile");

  const categories: { id: Category; icon: React.ReactNode; label: string }[] = [
    { id: "Libros", icon: <BookOpen size={16} aria-hidden="true" />, label: "Libros" },
    { id: "Tecnología", icon: <Laptop size={16} aria-hidden="true" />, label: "Tecnología" },
    { id: "Muebles", icon: <Sofa size={16} aria-hidden="true" />, label: "Muebles" },
    { id: "Ropa", icon: <Shirt size={16} aria-hidden="true" />, label: "Ropa" },
    { id: "Otros", icon: <Package size={16} aria-hidden="true" />, label: "Otros" },
  ];

  const handleToggleInterest = (cat: Category) => {
    if (user.interests.includes(cat)) {
      handleUpdateInterests(user.interests.filter((i) => i !== cat));
    } else {
      handleUpdateInterests([...user.interests, cat]);
    }
  };

  // Products favorited by the user (from context products list)
  const { products } = useApp();
  const favoriteProducts = products.filter((p) => user.favorites.includes(p.id));

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* User Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-md"
          aria-hidden="true"
        >
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
          <span className="text-sm text-slate-500 font-medium">{user.email}</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 w-full mt-2" role="tablist" aria-label="Secciones del perfil">
          <button
            role="tab"
            aria-selected={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-slate-50 text-slate-500"
            )}
          >
            {t.profile.myProfile}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === "favorites"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-100"
                : "bg-slate-50 text-slate-500"
            )}
          >
            <Heart size={14} fill={activeTab === "favorites" ? "currentColor" : "none"} aria-hidden="true" />
            {t.profile.favorites}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeTab === "settings"
                ? "bg-slate-800 text-white shadow-lg shadow-slate-200"
                : "bg-slate-50 text-slate-500"
            )}
          >
            {t.profile.settings}
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-4" role="tabpanel" aria-label={t.profile.myProfile}>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" aria-hidden="true" />
              {t.profile.verification}
            </h3>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="text-emerald-600 shrink-0" size={24} aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-emerald-800">{t.profile.verified}</span>
                <span className="text-xs text-emerald-600 font-medium">{t.profile.verifiedDesc}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <LogOut size={18} className="text-slate-400" aria-hidden="true" />
              {t.profile.account}
            </h3>
            <button className="w-full text-left py-3 border-b border-slate-50 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex justify-between items-center">
              {t.profile.changePassword}
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            <button className="w-full text-left py-3 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors flex justify-between items-center">
              {t.profile.logOut}
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Favorites Tab — HU-01 */}
      {activeTab === "favorites" && (
        <div className="flex flex-col gap-3" role="tabpanel" aria-label={t.profile.favorites}>
          {favoriteProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-3 hover:border-indigo-200 transition-all"
              aria-label={`Ver ${item.name}, $${item.price.toLocaleString()}`}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h3>
                  <Heart size={16} className="text-rose-500 shrink-0 ml-1" fill="currentColor" aria-hidden="true" />
                </div>
                <span className="font-extrabold text-indigo-600 text-base">
                  ${item.price.toLocaleString()}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">{item.sellerName}</span>
                  <span
                    className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                      item.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    )}
                  >
                    {item.active ? t.profile.available : t.profile.outOfStock}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {favoriteProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Heart size={48} className="opacity-20 mb-4" aria-hidden="true" />
              <p className="font-bold">{t.profile.favEmpty}</p>
              <p className="text-sm text-center">{t.profile.favEmptyDesc}</p>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab — HU-05 */}
      {activeTab === "settings" && (
        <div className="flex flex-col gap-6" role="tabpanel" aria-label={t.profile.settings}>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-5">
            {/* Notification Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg" aria-hidden="true">
                  <Bell size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{t.profile.notifications}</span>
                  <span className="text-xs text-slate-500 font-medium">{t.profile.notifDesc}</span>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={user.notificationsEnabled}
                aria-label={`${t.profile.notifications}: ${user.notificationsEnabled ? "activadas" : "desactivadas"}`}
                onClick={handleToggleNotification}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  user.notificationsEnabled ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    user.notificationsEnabled ? "left-7" : "left-1"
                  )}
                />
              </button>
            </div>

            {/* Interests */}
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.profile.interests}
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Categorías de interés">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleToggleInterest(cat.id)}
                    aria-pressed={user.interests.includes(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                      user.interests.includes(cat.id)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    )}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic">
                {t.profile.interestsNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
