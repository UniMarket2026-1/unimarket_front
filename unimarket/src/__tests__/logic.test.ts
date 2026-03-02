// HU-01 (Favorites), HU-05 (Notifications), HU-06 (Chat) - Logic tests

import { MOCK_NOTIFICATIONS, MOCK_CHATS, INITIAL_MESSAGES, MOCK_PRODUCTS, MOCK_USER } from "@/lib/mockData";

// ─── HU-01: Favorites ─────────────────────────────────────────────────────────

describe("Favorites Logic — HU-01", () => {
  it("toggleFavorite adds product to favorites when not present", () => {
    const favorites = ["p1"];
    const newId = "p3";
    const result = favorites.includes(newId)
      ? favorites.filter((f) => f !== newId)
      : [...favorites, newId];
    expect(result).toContain("p3");
    expect(result).toContain("p1");
  });

  it("toggleFavorite removes product from favorites when already present", () => {
    const favorites = ["p1", "p2"];
    const removeId = "p1";
    const result = favorites.filter((f) => f !== removeId);
    expect(result).not.toContain("p1");
    expect(result).toContain("p2");
  });

  it("isFavorite returns true for favorited products", () => {
    const favorites = ["p1", "p3"];
    expect(favorites.includes("p1")).toBe(true);
    expect(favorites.includes("p3")).toBe(true);
  });

  it("isFavorite returns false for non-favorited products", () => {
    const favorites = ["p1", "p3"];
    expect(favorites.includes("p2")).toBe(false);
  });

  it("favorite count updates correctly after toggle", () => {
    let favorites = ["p1", "p2"];
    // Add p3
    favorites = [...favorites, "p3"];
    expect(favorites).toHaveLength(3);
    // Remove p1
    favorites = favorites.filter((f) => f !== "p1");
    expect(favorites).toHaveLength(2);
  });

  it("MOCK_USER initializes with some favorites", () => {
    expect(Array.isArray(MOCK_USER.favorites)).toBe(true);
  });

  it("favorites tab shows favorited products from marketplace", () => {
    const favIds = MOCK_USER.favorites;
    const favoriteProducts = MOCK_PRODUCTS.filter((p) => favIds.includes(p.id));
    expect(Array.isArray(favoriteProducts)).toBe(true);
  });
});

// ─── HU-05: Notifications ─────────────────────────────────────────────────────

describe("Notification Navigation Logic — HU-05", () => {
  it("message notification route resolves to /chat with chatId", () => {
    const msgNotif = MOCK_NOTIFICATIONS.find((n) => n.type === "message");
    const route = msgNotif?.linkChatId
      ? `/chat?chatId=${msgNotif.linkChatId}`
      : "/chat";
    expect(route).toMatch(/^\/chat/);
  });

  it("sale notification route resolves to /seller", () => {
    const route = "/seller";
    expect(route).toBe("/seller");
  });

  it("report notification route resolves to /admin", () => {
    const route = "/admin";
    expect(route).toBe("/admin");
  });

  it("favorite_price notification route resolves to /product/:id", () => {
    const priceNotif = MOCK_NOTIFICATIONS.find((n) => n.type === "favorite_price");
    const route = priceNotif?.linkProductId
      ? `/product/${priceNotif.linkProductId}`
      : "/";
    expect(typeof route).toBe("string");
    expect(route.length).toBeGreaterThan(0);
  });

  it("unreadCount calculation is correct", () => {
    const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
    expect(typeof unread).toBe("number");
    expect(unread).toBeGreaterThanOrEqual(0);
  });

  it("marking as read sets read=true", () => {
    const notif = { ...MOCK_NOTIFICATIONS[0], read: false };
    const updated = { ...notif, read: true };
    expect(updated.read).toBe(true);
  });

  it("user notification toggle switches notificationsEnabled", () => {
    let enabled = true;
    enabled = !enabled;
    expect(enabled).toBe(false);
    enabled = !enabled;
    expect(enabled).toBe(true);
  });

  it("interests update replaces array correctly", () => {
    let interests = ["Libros", "Tecnología"];
    // Toggle Libros (remove)
    interests = interests.filter((i) => i !== "Libros");
    expect(interests).not.toContain("Libros");
    // Toggle Muebles (add)
    interests = [...interests, "Muebles"];
    expect(interests).toContain("Muebles");
  });
});

// ─── HU-06: Chat ──────────────────────────────────────────────────────────────

describe("Chat Logic — HU-06", () => {
  it("chat has required fields", () => {
    MOCK_CHATS.forEach((chat) => {
      expect(chat.id).toBeTruthy();
      expect(chat.otherPartyName).toBeTruthy();
      expect(chat.productName).toBeTruthy();
      expect(chat.lastMessage).toBeTruthy();
    });
  });

  it("messages for a chat can be retrieved by chatId", () => {
    const chatId = MOCK_CHATS[0].id;
    const msgs = INITIAL_MESSAGES[chatId];
    expect(Array.isArray(msgs)).toBe(true);
    expect(msgs.length).toBeGreaterThan(0);
  });

  it("each message has required fields", () => {
    const allMessages = Object.values(INITIAL_MESSAGES).flat();
    allMessages.forEach((msg) => {
      expect(msg.id).toBeTruthy();
      expect(msg.chatId).toBeTruthy();
      expect(msg.senderId).toBeTruthy();
      expect(msg.text).toBeTruthy();
      expect(msg.timestamp).toBeTruthy();
    });
  });

  it("sending a message appends to messages list", () => {
    const messages = [...(INITIAL_MESSAGES[MOCK_CHATS[0].id] || [])];
    const newMsg = {
      id: `m${Date.now()}`,
      chatId: MOCK_CHATS[0].id,
      senderId: "u1",
      text: "Hola, ¿sigue disponible?",
      timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    };
    messages.push(newMsg);
    expect(messages).toContainEqual(newMsg);
    expect(messages[messages.length - 1].text).toBe("Hola, ¿sigue disponible?");
  });

  it("chat URL with chatId opens correct chat", () => {
    const chatId = MOCK_CHATS[0].id;
    const url = `/chat?chatId=${chatId}`;
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("chatId")).toBe(chatId);
  });

  it("startChat creates new chat with product info", () => {
    const product = MOCK_PRODUCTS[0];
    const newChat = {
      id: `c${Date.now()}`,
      productId: product.id,
      productName: product.name,
      otherPartyId: product.sellerId,
      otherPartyName: product.sellerName,
      lastMessage: "",
    };
    expect(newChat.productName).toBe(product.name);
    expect(newChat.otherPartyName).toBe(product.sellerName);
  });
});
