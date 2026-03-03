import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationsPanel } from "@/components/shared/NotificationsPanel";
import { ReportModal } from "@/components/shared/ReportModal";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniMarket — Marketplace Universitario",
  description:
    "Compra y vende artículos dentro de tu comunidad universitaria de forma segura.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased bg-slate-50 min-h-screen`}>
        <a href="#main-content" className="skip-link">
          Ir al contenido principal
        </a>
        <LanguageProvider>
          <AppProvider>
            <Header />
            <main
              id="main-content"
              className="max-w-2xl mx-auto px-4 pt-20 pb-4"
              tabIndex={-1}
            >
              {children}
            </main>
            <BottomNav />
            <NotificationsPanel />
            <ReportModal />
            <Toaster position="top-center" richColors />
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
