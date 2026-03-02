"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, BarChart3, Users, DollarSign, Package, Flag, Trash2, Ban, AlertOctagon,
} from "lucide-react";
import { Report, Product } from "@/lib/types";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminDashboardProps {
  reports: Report[];
  products: Product[];
  onResolveReport: (id: string, action: "warning" | "suspension" | "removal" | "dismiss") => void;
}

const CATEGORY_DATA = [
  { name: "Libros", value: 45, color: "#4f46e5" },
  { name: "Tecno", value: 30, color: "#06b6d4" },
  { name: "Muebles", value: 15, color: "#10b981" },
  { name: "Ropa", value: 10, color: "#f59e0b" },
];

const categoryIcons: Record<string, string> = {
  spam: "🛑",
  inappropriate: "⚠️",
  fraud: "🚨",
  other: "❓",
};

/**
 * Admin dashboard with metrics and moderation — HU-11, HU-12
 */
export function AdminDashboard({ reports, products, onResolveReport }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "moderation">("moderation");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">("pending");
  const [filterType, setFilterType] = useState<"all" | "product" | "user">("all");

  const filteredReports = reports.filter((r) => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesType = filterType === "all" || r.itemType === filterType;
    return matchesStatus && matchesType;
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedToday = reports.filter(
    (r) =>
      r.status === "resolved" &&
      new Date(r.resolvedAt || "").toDateString() === new Date().toDateString()
  ).length;

  const handleAction = (
    reportId: string,
    action: "warning" | "suspension" | "removal" | "dismiss"
  ) => {
    onResolveReport(reportId, action);
    const messages: Record<string, string> = {
      removal: "Producto eliminado correctamente",
      suspension: "Usuario suspendido (simulado)",
      warning: "Advertencia enviada al usuario",
      dismiss: "Reporte descartado",
    };
    if (action === "dismiss") toast.info(messages.dismiss);
    else if (action === "warning") toast.info(messages.warning);
    else toast.success(messages[action]);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white">
            <Shield size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-xs text-slate-500">Gestión y moderación de la comunidad</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "moderation"}
            onClick={() => setActiveTab("moderation")}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "moderation" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"
            )}
          >
            <Flag size={16} aria-hidden="true" />
            Moderación
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "metrics"}
            onClick={() => setActiveTab("metrics")}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "metrics" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
            )}
          >
            Métricas
          </button>
        </div>
      </div>

      {activeTab === "metrics" ? (
        /* Metrics — HU-11 */
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign size={20} />} label="Volumen Total" value="$1.2M" subValue="+12% vs mes pasado" color="indigo" />
            <StatCard icon={<Users size={20} />} label="Nuevos Estudiantes" value="245" subValue="+85 este mes" color="cyan" />
            <StatCard icon={<Package size={20} />} label="Productos Activos" value={products.filter((p) => p.active).length.toString()} subValue="92% verificado" color="emerald" />
            <StatCard icon={<Flag size={20} />} label="Reportes Pend." value={pendingCount.toString()} subValue={resolvedToday > 0 ? `${resolvedToday} resueltos hoy` : "Atención requerida"} color="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-600" aria-hidden="true" />
                Ventas por Categoría
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users size={18} className="text-cyan-600" aria-hidden="true" />
                Distribución de Categorías
              </h3>
              <div className="h-64 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-bold">100</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Moderation — HU-12 */
        <div className="flex flex-col gap-4">
          {pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-200 p-4 rounded-2xl flex gap-3"
              role="alert"
              aria-live="assertive"
            >
              <AlertTriangle className="shrink-0 text-rose-600" size={24} aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-900 mb-1">
                  {pendingCount} {pendingCount === 1 ? "reporte pendiente" : "reportes pendientes"} de revisión
                </p>
                <p className="text-xs text-rose-700">
                  Actúa con objetividad según las normas de la comunidad universitaria.
                </p>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Estado:</span>
              {(["all", "pending", "resolved"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  aria-pressed={filterStatus === status}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    filterStatus === status
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  )}
                >
                  {status === "all" ? "Todos" : status === "pending" ? "Pendientes" : "Resueltos"}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Tipo:</span>
              {(["all", "product", "user"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  aria-pressed={filterType === type}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    filterType === type
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  )}
                >
                  {type === "all" ? "Todos" : type === "product" ? "Productos" : "Usuarios"}
                </button>
              ))}
            </div>
          </div>

          {/* Reports List */}
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredReports.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-slate-400"
                >
                  <Shield size={48} className="opacity-20 mb-4 text-emerald-500" aria-hidden="true" />
                  <p className="font-bold text-slate-600">
                    {filterStatus === "pending"
                      ? "No hay reportes pendientes"
                      : "No se encontraron reportes"}
                  </p>
                  <p className="text-sm mt-1">
                    {filterStatus === "pending"
                      ? "La comunidad está segura y limpia."
                      : "Ajusta los filtros para ver más resultados."}
                  </p>
                </motion.div>
              ) : (
                filteredReports.map((report) => {
                  const reportedProduct =
                    report.itemType === "product"
                      ? products.find((p) => p.id === report.itemId)
                      : null;

                  return (
                    <motion.div
                      key={report.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "bg-white p-5 rounded-2xl border-2 shadow-sm transition-all",
                        report.status === "pending" ? "border-rose-200" : "border-slate-100 opacity-60"
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                              report.itemType === "product" ? "bg-indigo-50" : "bg-cyan-50"
                            )}
                            aria-hidden="true"
                          >
                            {report.itemType === "product" ? "📦" : "👤"}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-slate-900">
                                {report.itemType === "product" ? "Producto:" : "Usuario:"}
                                {reportedProduct
                                  ? ` ${reportedProduct.name}`
                                  : ` ID ${report.itemId}`}
                              </span>
                              <span className="text-lg" aria-hidden="true">
                                {categoryIcons[report.category]}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              Reportado por {report.reporterName} •{" "}
                              {new Date(report.date).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                            report.status === "pending"
                              ? "bg-rose-100 text-rose-700"
                              : report.status === "resolved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {report.status === "pending"
                            ? "⏱ Pendiente"
                            : report.status === "resolved"
                            ? "✓ Resuelto"
                            : "✕ Descartado"}
                        </span>
                      </div>

                      {reportedProduct && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={reportedProduct.imageUrl}
                              alt={reportedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">
                              {reportedProduct.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {reportedProduct.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-indigo-600">
                                ${reportedProduct.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">
                                por {reportedProduct.sellerName}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                          <p className="text-xs font-bold text-rose-900 mb-1 uppercase tracking-wider">
                            Motivo
                          </p>
                          <p className="text-sm font-bold text-rose-800">{report.reason}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                          <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Descripción Detallada
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {report.description}
                          </p>
                        </div>
                        {report.resolution && (
                          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                            <p className="text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wider">
                              Resolución
                            </p>
                            <p className="text-sm text-emerald-800">
                              Acción:{" "}
                              <span className="font-bold">{report.resolution}</span>
                              {report.resolvedBy && ` por ${report.resolvedBy}`}
                            </p>
                          </div>
                        )}
                      </div>

                      {report.status === "pending" && (
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleAction(report.id, "removal")}
                            className="bg-rose-600 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            Eliminar
                          </button>
                          <button
                            onClick={() => handleAction(report.id, "suspension")}
                            className="bg-amber-600 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Ban size={16} aria-hidden="true" />
                            Suspender
                          </button>
                          <button
                            onClick={() => handleAction(report.id, "warning")}
                            className="bg-yellow-500 text-white text-xs font-bold py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <AlertOctagon size={16} aria-hidden="true" />
                            Advertir
                          </button>
                          <button
                            onClick={() => handleAction(report.id, "dismiss")}
                            className="bg-white text-slate-600 border-2 border-slate-200 text-xs font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} aria-hidden="true" />
                            Descartar
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: "indigo" | "cyan" | "emerald" | "rose";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", colors[color])}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-xl font-extrabold text-slate-900">{value}</span>
        <span className="text-[10px] font-medium text-slate-500 mt-1">{subValue}</span>
      </div>
    </div>
  );
}
