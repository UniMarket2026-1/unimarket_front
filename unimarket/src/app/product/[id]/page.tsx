"use client";
import { useApp } from "@/contexts/AppContext";
import { ProductDetail } from "@/components/product/ProductDetail";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { products, user, allRatings } = useApp();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-bold text-lg">Producto no encontrado</p>
      </div>
    );
  }
  const sellerRatings = allRatings.filter((r) => r.sellerId === product.sellerId);
  return (
    <ProductDetail
      product={product}
      sellerRatings={sellerRatings}
      currentUserId={user.id}
    />
  );
}
