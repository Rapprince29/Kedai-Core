import { create } from 'zustand';

export interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  isBestSeller?: boolean;
  flavor?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  updateQuantity: (id, delta) => set((state) => ({
    items: state.items.map((i) => 
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ),
  })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },
}));
