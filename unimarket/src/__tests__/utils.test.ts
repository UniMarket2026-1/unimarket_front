import { cn, formatCurrency, timeAgo } from "@/lib/utils";

// HU-09, general utilities

describe("cn()", () => {
  it("merges class names correctly", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves Tailwind conflicts — last wins", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null as unknown as string, "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    const active = true;
    expect(cn("base", active && "active")).toBe("base active");
  });

  it("handles array inputs", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });
});

describe("formatCurrency()", () => {
  it("formats a number as currency string", () => {
    const result = formatCurrency(1500);
    expect(result).toContain("$");
    expect(result).toContain("1");
  });

  it("handles zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("$");
  });

  it("handles large numbers", () => {
    const result = formatCurrency(1200000);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("timeAgo()", () => {
  it("returns minutes for recent timestamps", () => {
    const ts = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = timeAgo(ts);
    expect(result).toMatch(/\dm/);
  });

  it("returns hours for timestamps a few hours ago", () => {
    const ts = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = timeAgo(ts);
    expect(result).toMatch(/\dh/);
  });

  it("returns days for old timestamps", () => {
    const ts = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const result = timeAgo(ts);
    expect(result).toMatch(/\dd/);
  });
});
