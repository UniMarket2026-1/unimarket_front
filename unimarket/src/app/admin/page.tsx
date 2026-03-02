"use client";
import { useApp } from "@/contexts/AppContext";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { products, reports, handleResolveReport, userRole } = useApp();

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-bold text-lg">Acceso restringido a administradores</p>
      </div>
    );
  }

  return (
    <AdminDashboard
      products={products}
      reports={reports}
      onResolveReport={handleResolveReport}
    />
  );
}
