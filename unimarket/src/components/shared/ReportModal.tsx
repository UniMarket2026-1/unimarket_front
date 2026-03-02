"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Flag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

/**
 * Report modal for products and users — HU-12
 */
export function ReportModal() {
  const { reportModalOpen, setReportModalOpen, reportingItemType, reportingItemName, handleSubmitReport } = useApp();

  const [category, setCategory] = useState<"spam" | "inappropriate" | "fraud" | "other">("fraud");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const categories = [
    { value: "fraud" as const, label: "Fraude o estafa", icon: "🚨" },
    { value: "inappropriate" as const, label: "Comportamiento inadecuado", icon: "⚠️" },
    { value: "spam" as const, label: "Spam o falsificación", icon: "🛑" },
    { value: "other" as const, label: "Otro motivo", icon: "❓" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || description.length < 20) return;
    handleSubmitReport(category, reason, description);
    // Reset form
    setCategory("fraud");
    setReason("");
    setDescription("");
  };

  const handleClose = () => {
    setReportModalOpen(false);
    setCategory("fraud");
    setReason("");
    setDescription("");
  };

  return (
    <AnimatePresence>
      {reportModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Flag size={20} aria-hidden="true" />
                  </div>
                  <h2 id="report-modal-title" className="text-xl font-bold">
                    Reportar {reportingItemType === "product" ? "Publicación" : "Usuario"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <p className="text-sm text-rose-100">
                {reportingItemType === "product"
                  ? `Producto: ${reportingItemName}`
                  : `Usuario: ${reportingItemName}`}
              </p>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            >
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                <AlertTriangle
                  size={20}
                  className="text-amber-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Los reportes son revisados por administradores. Solo reporta si hay una
                  violación real de las normas de la comunidad.
                </p>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-bold text-slate-700">
                  Categoría del reporte *
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      aria-pressed={category === cat.value}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-left",
                        category === cat.value
                          ? "border-rose-500 bg-rose-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="text-xl mb-1" aria-hidden="true">
                        {cat.icon}
                      </div>
                      <div className="text-xs font-bold text-slate-700">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="report-reason" className="text-sm font-bold text-slate-700">
                  Motivo breve *
                </label>
                <input
                  id="report-reason"
                  type="text"
                  placeholder="Ej: Precio excesivo para el estado real"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  maxLength={100}
                />
                <p className="text-xs text-slate-500">{reason.length}/100 caracteres</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="report-description" className="text-sm font-bold text-slate-700">
                  Descripción detallada *
                </label>
                <textarea
                  id="report-description"
                  placeholder="Describe con detalle lo que sucedió..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={20}
                />
                <p className="text-xs">
                  {description.length < 20 ? (
                    <span className="text-amber-600">
                      Mínimo 20 caracteres ({20 - description.length} restantes)
                    </span>
                  ) : (
                    <span className="text-emerald-600">✓ Descripción completa</span>
                  )}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim() || description.length < 20}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Flag size={18} aria-hidden="true" />
                  Enviar Reporte
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
