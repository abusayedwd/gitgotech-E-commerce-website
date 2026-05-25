"use client";

export interface GuestCartItem {
  _id: string;
  product: any;
  quantity: number;
  size?: string;
}

const STORAGE_KEY = "guestCart";
export const GUEST_CART_EVENT = "guestCartChanged";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(GUEST_CART_EVENT));
  }
}

export function getGuestCart(): GuestCartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitChange();
}

export function addToGuestCart(product: any, options?: { quantity?: number; size?: string }) {
  if (!product?._id) return;
  const quantity = options?.quantity ?? 1;
  const size = options?.size;
  const items = getGuestCart();
  const existingIndex = items.findIndex(
    (i) => i.product?._id === product._id && (i.size || "") === (size || ""),
  );
  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + quantity,
    };
  } else {
    items.push({
      _id: `${product._id}-${size || "default"}-${Date.now()}`,
      product,
      quantity,
      size,
    });
  }
  saveGuestCart(items);
}

export function removeFromGuestCart(itemId: string) {
  const items = getGuestCart().filter(
    (i) => i._id !== itemId && i.product?._id !== itemId,
  );
  saveGuestCart(items);
}

export function updateGuestCartItem(
  itemId: string,
  patch: Partial<Pick<GuestCartItem, "quantity" | "size">>,
) {
  const items = getGuestCart().map((i) =>
    i._id === itemId ? { ...i, ...patch } : i,
  );
  saveGuestCart(items);
}

export function clearGuestCart() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  emitChange();
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + (i.quantity || 0), 0);
}
