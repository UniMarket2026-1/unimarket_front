"use client";

import { useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageContext";

/**
 * Custom hook for managing product favorites — HU-01
 * Handles add/remove from favorites with toast feedback
 * Favorites are persisted to localStorage via AppContext
 */
export function useFavorites() {
  const { user, toggleFavorite } = useApp();
  const { t } = useLang();

  const isFavorite = useCallback(
    (productId: string) => user.favorites.includes(productId),
    [user.favorites]
  );

  const toggle = useCallback(
    (productId: string) => {
      const wasFavorite = user.favorites.includes(productId);
      toggleFavorite(productId);
      toast.success(wasFavorite ? "Eliminado de favoritos" : "Guardado en favoritos ❤️");
    },
    [user.favorites, toggleFavorite]
  );

  return {
    favorites: user.favorites,
    isFavorite,
    toggle,
  };
}
