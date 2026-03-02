import { renderHook, act } from "@testing-library/react";
import { useFilters } from "@/hooks/useFilters";
import { Product } from "@/lib/types";

// HU-02: Búsqueda y filtrado de productos

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Cálculo Diferencial",
    description: "Libro universitario de Cálculo",
    price: 40000,
    category: "Libros",
    condition: "Usado",
    conditionDetail: "Con subrayados",
    imageUrl: "/img1.jpg",
    sellerId: "u1",
    sellerName: "Ana",
    sellerRating: 4.5,
    active: true,
  },
  {
    id: "p2",
    name: "Laptop Dell Inspiron",
    description: "Laptop en buen estado",
    price: 800000,
    category: "Tecnología",
    condition: "Nuevo",
    conditionDetail: "Sin uso",
    imageUrl: "/img2.jpg",
    sellerId: "u2",
    sellerName: "Bob",
    sellerRating: 4.8,
    active: true,
  },
  {
    id: "p3",
    name: "Escritorio de Madera",
    description: "Mueble resistente",
    price: 250000,
    category: "Muebles",
    condition: "Poco usado",
    conditionDetail: "Rasguño leve",
    imageUrl: "/img3.jpg",
    sellerId: "u3",
    sellerName: "Carlos",
    sellerRating: 4.2,
    active: true,
  },
  {
    id: "p4",
    name: "Producto Inactivo",
    description: "No debería aparecer",
    price: 5000,
    category: "Otros",
    condition: "Usado",
    conditionDetail: "Mal estado",
    imageUrl: "/img4.jpg",
    sellerId: "u4",
    sellerName: "Diana",
    sellerRating: 3.0,
    active: false,
  },
];

describe("useFilters — HU-02", () => {
  it("returns only active products with no filters", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it("excludes inactive products", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    const ids = result.current.filteredProducts.map((p) => p.id);
    expect(ids).not.toContain("p4");
  });

  it("filters by search term — name match", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSearchTerm("laptop"); });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].id).toBe("p2");
  });

  it("search is case-insensitive", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSearchTerm("CÁLCULO"); });
    expect(result.current.filteredProducts).toHaveLength(1);
  });

  it("filters by category", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSelectedCategory("Libros"); });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].category).toBe("Libros");
  });

  it("filters by condition", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSelectedCondition("Nuevo"); });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].condition).toBe("Nuevo");
  });

  it("filters by max price", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setMaxPrice(100000); });
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].price).toBeLessThanOrEqual(100000);
  });

  it("clearFilters resets to all active products", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSearchTerm("laptop"); });
    expect(result.current.filteredProducts).toHaveLength(1);
    act(() => { result.current.clearFilters(); });
    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it("hasActiveFilters is false by default", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("hasActiveFilters is true when search is set", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSearchTerm("cálculo"); });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("hasActiveFilters is true when price is reduced", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setMaxPrice(500000); });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("returns empty array when no products match", () => {
    const { result } = renderHook(() => useFilters(MOCK_PRODUCTS));
    act(() => { result.current.setSearchTerm("xyznotfound"); });
    expect(result.current.filteredProducts).toHaveLength(0);
  });
});
