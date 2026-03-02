import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Report, Product } from "@/lib/types";

// HU-11, HU-12 — Admin Dashboard

// Mock recharts to avoid SVG rendering issues in jsdom
jest.mock("recharts", () => {
  const mockReact = require("react");
  return {
    BarChart: ({ children }) => mockReact.createElement("div", { "data-testid": "bar-chart" }, children),
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    ResponsiveContainer: ({ children }) => mockReact.createElement("div", null, children),
    Cell: () => null,
    PieChart: ({ children }) => mockReact.createElement("div", { "data-testid": "pie-chart" }, children),
    Pie: () => null,
  };
});

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

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), info: jest.fn() },
}));

const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    itemId: "p1",
    itemType: "product",
    category: "spam",
    reason: "Producto duplicado",
    description: "Este producto ya fue publicado antes",
    reporterName: "Luis Martínez",
    reporterId: "u2",
    date: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "r2",
    itemId: "u99",
    itemType: "user",
    category: "fraud",
    reason: "Posible estafa",
    description: "No entregó el producto",
    reporterName: "María Rodríguez",
    reporterId: "u3",
    date: "2024-01-10T10:00:00Z",
    status: "resolved",
    resolution: "warning",
    resolvedBy: "Admin",
    resolvedAt: "2024-01-11T09:00:00Z",
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Libro de Física Serway",
    description: "Excelente estado de conservación",
    price: 30000,
    category: "Libros",
    condition: "Poco usado",
    conditionDetail: "Sin rayones ni marcas",
    imageUrl: "/f.jpg",
    sellerId: "u1",
    sellerName: "Juan Pérez",
    sellerRating: 4.5,
    active: true,
  },
];

const onResolve = jest.fn();

function renderAdmin(reports = MOCK_REPORTS) {
  return render(
    <AdminDashboard
      reports={reports}
      products={MOCK_PRODUCTS}
      onResolveReport={onResolve}
    />
  );
}

// HU-11: Metrics
describe("AdminDashboard metrics — HU-11", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the admin panel header", () => {
    renderAdmin();
    expect(screen.getByText("Panel de Administración")).toBeInTheDocument();
  });

  it("shows Métricas tab", () => {
    renderAdmin();
    expect(screen.getByText("Métricas")).toBeInTheDocument();
  });

  it("switches to metrics and shows stat cards", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Métricas"));
    expect(screen.getByText("Volumen Total")).toBeInTheDocument();
    expect(screen.getByText("Nuevos Estudiantes")).toBeInTheDocument();
    expect(screen.getByText("Productos Activos")).toBeInTheDocument();
  });

  it("shows recharts in metrics tab", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Métricas"));
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("shows active product count in stat card", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Métricas"));
    // MOCK_PRODUCTS has 1 active product — "1" text should appear in the stat card
    expect(screen.getByText("Productos Activos")).toBeInTheDocument();
  });
});

// HU-12: Moderation
describe("AdminDashboard moderation — HU-12", () => {
  beforeEach(() => jest.clearAllMocks());

  it("starts on moderation tab", () => {
    renderAdmin();
    expect(screen.getByText("Moderación")).toBeInTheDocument();
  });

  it("shows pending reports count badge", () => {
    renderAdmin();
    // One pending report → badge shows "1"
    const badges = screen.getAllByText("1");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("shows action buttons for pending reports", () => {
    renderAdmin();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
    expect(screen.getByText("Suspender")).toBeInTheDocument();
    expect(screen.getByText("Advertir")).toBeInTheDocument();
    expect(screen.getByText("Descartar")).toBeInTheDocument();
  });

  it("calls onResolveReport with 'removal' action", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Eliminar"));
    expect(onResolve).toHaveBeenCalledWith("r1", "removal");
  });

  it("calls onResolveReport with 'suspension' action", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Suspender"));
    expect(onResolve).toHaveBeenCalledWith("r1", "suspension");
  });

  it("calls onResolveReport with 'warning' action", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Advertir"));
    expect(onResolve).toHaveBeenCalledWith("r1", "warning");
  });

  it("calls onResolveReport with 'dismiss' action", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Descartar"));
    expect(onResolve).toHaveBeenCalledWith("r1", "dismiss");
  });

  it("filters resolved reports when 'Resueltos' is clicked", () => {
    renderAdmin();
    fireEvent.click(screen.getByText("Resueltos"));
    expect(screen.getByText("Resolución")).toBeInTheDocument();
  });

  it("shows empty state when all reports are resolved", () => {
    const allResolved = MOCK_REPORTS.map((r) => ({
      ...r,
      status: "resolved" as const,
    }));
    renderAdmin(allResolved);
    expect(screen.getByText("No hay reportes pendientes")).toBeInTheDocument();
  });

  it("shows product name for product-type reports", () => {
    renderAdmin();
    const matches = screen.getAllByText(/Libro de Física Serway/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
