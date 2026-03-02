"use client";

import { useState, useCallback, useMemo } from "react";
import { Product, Category, ProductCondition } from "@/lib/types";

/**
 * Custom hook for filtering products — HU-02
 * Handles search, category, condition, and price filters
 */
export function useFilters(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "Todos">("Todos");
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | "Todos">("Todos");
  const [maxPrice, setMaxPrice] = useState<number>(1_000_000);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (!p.active) return false;
        if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (selectedCategory !== "Todos" && p.category !== selectedCategory) return false;
        if (selectedCondition !== "Todos" && p.condition !== selectedCondition) return false;
        if (p.price > maxPrice) return false;
        return true;
      }),
    [products, searchTerm, selectedCategory, selectedCondition, maxPrice]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedCondition("Todos");
    setMaxPrice(1_000_000);
  }, []);

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "Todos" ||
    selectedCondition !== "Todos" ||
    maxPrice < 1_000_000;

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
    maxPrice,
    setMaxPrice,
    filteredProducts,
    clearFilters,
    hasActiveFilters,
  };
}
