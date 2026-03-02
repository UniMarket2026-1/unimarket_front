"use client";
import { useApp } from "@/contexts/AppContext";
import { Marketplace } from "@/components/marketplace/Marketplace";

export default function MarketplacePage() {
  const { products, user } = useApp();
  return <Marketplace products={products} currentUserId={user.id} />;
}
