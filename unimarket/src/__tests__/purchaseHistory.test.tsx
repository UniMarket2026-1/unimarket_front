import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PurchaseHistory } from "@/components/purchases/PurchaseHistory";
import { PurchaseItem } from "@/lib/types";

// HU-03 (Rating), HU-04 (Resell)

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn() }),
}));

// Mock motion/react
jest.mock("motion/react", () => {
  const mockReact = require("react");
  return {
    motion: {
      div: ({ children, ...props }) => mockReact.createElement("div", props, children),
    },
    AnimatePresence: ({ children }) => children,
  };
});

jest.mock("@/components/shared/ImageWithFallback", () => {
  const mockReact = require("react");
  return {
    ImageWithFallback: ({ alt }) => mockReact.createElement("img", { alt }),
  };
});

const mockHandleRate = jest.fn();
const mockHandleResell = jest.fn();

const MOCK_HISTORY: PurchaseItem[] = [
  {
    id: "p1",
    name: "Libro Álgebra Lineal",
    description: "Grossman 8va edición",
    price: 45000,
    category: "Libros",
    condition: "Poco usado",
    conditionDetail: "Con algunos subrayados",
    imageUrl: "/alg.jpg",
    sellerId: "u2",
    sellerName: "Pedro Ramírez",
    sellerRating: 4.6,
    active: true,
    purchaseId: "pur1",
    date: "2024-02-10",
    rated: false,
  },
  {
    id: "p2",
    name: "Física para Ingeniería",
    description: "Hayt & Kemmerly",
    price: 55000,
    category: "Libros",
    condition: "Usado",
    conditionDetail: "Subrayado extensivo",
    imageUrl: "/fis.jpg",
    sellerId: "u3",
    sellerName: "Laura Gómez",
    sellerRating: 4.8,
    active: true,
    purchaseId: "pur2",
    date: "2024-01-20",
    rated: true,
  },
];

jest.mock("@/contexts/AppContext", () => ({
  useApp: () => ({
    purchaseHistory: MOCK_HISTORY,
    handleRate: mockHandleRate,
    handleResell: mockHandleResell,
  }),
}));

jest.mock("@/i18n/LanguageContext", () => ({
  useLang: () => ({
    t: {
      purchases: {
        title: "Mis Compras",
        completed: "Completado",
        seller: "Vendedor",
        resell: "Revender",
        rate: "Calificar",
        rated: "Calificado",
        empty: "Sin historial de compras",
        emptyDesc: "Tus compras aparecerán aquí.",
        rateTitle: "Calificar Vendedor",
        rateDesc: "¿Cómo fue tu experiencia con",
        rating1: "😞 Muy malo",
        rating2: "😕 Malo",
        rating3: "😐 Aceptable",
        rating4: "😊 Bueno",
        rating5: "😍 Excelente",
        commentLabel: "Comentario (opcional)",
        commentPlaceholder: "Escribe algo...",
        submitRating: "Enviar Calificación",
      },
    },
  }),
}));

describe("PurchaseHistory — HU-03 (rating), HU-04 (resell)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders purchase history title", () => {
    render(<PurchaseHistory />);
    expect(screen.getByText("Mis Compras")).toBeInTheDocument();
  });

  it("renders purchased items", () => {
    render(<PurchaseHistory />);
    expect(screen.getByText("Libro Álgebra Lineal")).toBeInTheDocument();
    expect(screen.getByText("Física para Ingeniería")).toBeInTheDocument();
  });

  it("shows Calificar button for unrated items — HU-03", () => {
    render(<PurchaseHistory />);
    expect(screen.getByText("Calificar")).toBeInTheDocument();
  });

  it("shows Calificado for already rated items — HU-03", () => {
    render(<PurchaseHistory />);
    expect(screen.getByText("Calificado")).toBeInTheDocument();
  });

  it("opens rating modal when Calificar is clicked — HU-03", () => {
    render(<PurchaseHistory />);
    fireEvent.click(screen.getByText("Calificar"));
    expect(screen.getByText("Calificar Vendedor")).toBeInTheDocument();
  });

  it("renders star buttons in rating modal — HU-03", () => {
    render(<PurchaseHistory />);
    fireEvent.click(screen.getByText("Calificar"));
    const starButtons = screen.getAllByRole("button", { name: /estrellas?/i });
    expect(starButtons).toHaveLength(5);
  });

  it("submit button is disabled when no stars selected — HU-03", () => {
    render(<PurchaseHistory />);
    fireEvent.click(screen.getByText("Calificar"));
    const submitBtn = screen.getByText("Enviar Calificación");
    expect(submitBtn).toBeDisabled();
  });

  it("shows Revender button for each purchase — HU-04", () => {
    render(<PurchaseHistory />);
    const revenderBtns = screen.getAllByText("Revender");
    expect(revenderBtns).toHaveLength(2);
  });

  it("calls handleResell and navigates to /publish on Revender click — HU-04", () => {
    render(<PurchaseHistory />);
    fireEvent.click(screen.getAllByText("Revender")[0]);
    expect(mockHandleResell).toHaveBeenCalledWith(MOCK_HISTORY[0]);
    expect(mockPush).toHaveBeenCalledWith("/publish");
  });

  it("shows purchase count equal to history length", () => {
    render(<PurchaseHistory />);
    const resellBtns = screen.getAllByText("Revender");
    // 2 items in MOCK_HISTORY → 2 Revender buttons
    expect(resellBtns.length).toBe(MOCK_HISTORY.length);
  });
});
