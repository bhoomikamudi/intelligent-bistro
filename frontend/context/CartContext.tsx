import { MenuItem } from "@/data/menu";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

type CartState = Record<string, CartLine>;

type CartAction =
  | { type: "ADD"; item: MenuItem }
  | { type: "INCREMENT"; itemId: string }
  | { type: "DECREMENT"; itemId: string }
  | { type: "REMOVE"; itemId: string };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const line = state[action.item.id];
      return {
        ...state,
        [action.item.id]: {
          item: action.item,
          quantity: (line?.quantity ?? 0) + 1,
        },
      };
    }
    case "INCREMENT": {
      const line = state[action.itemId];
      if (!line) return state;
      return {
        ...state,
        [action.itemId]: { ...line, quantity: line.quantity + 1 },
      };
    }
    case "DECREMENT": {
      const line = state[action.itemId];
      if (!line) return state;
      if (line.quantity <= 1) {
        const next = { ...state };
        delete next[action.itemId];
        return next;
      }
      return {
        ...state,
        [action.itemId]: { ...line, quantity: line.quantity - 1 },
      };
    }
    case "REMOVE": {
      const next = { ...state };
      delete next[action.itemId];
      return next;
    }
    default:
      return state;
  }
}

let cartState: CartState = {};
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cartState;
}

function dispatch(action: CartAction) {
  cartState = cartReducer(cartState, action);
  listeners.forEach((listener) => listener());
}

const TAX_RATE = 0.08;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  getQuantity: (itemId: string) => number;
  addItem: (item: MenuItem) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  removeItem: (itemId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const lines = useMemo(
    () => Object.values(state).sort((a, b) => a.item.name.localeCompare(b.item.name)),
    [state],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
    [lines],
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const getQuantity = useCallback((itemId: string) => state[itemId]?.quantity ?? 0, [state]);

  const addItem = useCallback((item: MenuItem) => {
    dispatch({ type: "ADD", item });
  }, []);

  const increment = useCallback((itemId: string) => {
    dispatch({ type: "INCREMENT", itemId });
  }, []);

  const decrement = useCallback((itemId: string) => {
    dispatch({ type: "DECREMENT", itemId });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE", itemId });
  }, []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      tax,
      total,
      getQuantity,
      addItem,
      increment,
      decrement,
      removeItem,
    }),
    [lines, itemCount, subtotal, tax, total, getQuantity, addItem, increment, decrement, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
