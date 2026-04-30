import { create } from 'zustand';
import axios from 'axios';

export interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt?: string;
}

interface MenuStore {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  addItem: (data: Omit<MenuItem, 'id'>) => Promise<void>;
  updateItem: (id: string | number, data: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  
  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/api/menu');
      set({ items: res.data, loading: false });
    } catch (err: any) {
      console.error('Failed to fetch menu:', err);
      set({ error: 'Failed to fetch menu items', loading: false });
    }
  },

  addItem: async (data) => {
    try {
      const res = await axios.post('/api/menu', data);
      set({ items: [res.data, ...get().items] });
    } catch (err: any) {
      console.error('Failed to add item:', err);
      throw err;
    }
  },

  updateItem: async (id, data) => {
    try {
      const res = await axios.put(`/api/menu/${id}`, data);
      set({ items: get().items.map(item => item.id === id ? res.data : item) });
    } catch (err: any) {
      console.error('Failed to update item:', err);
      throw err;
    }
  },

  deleteItem: async (id) => {
    try {
      await axios.delete(`/api/menu/${id}`);
      set({ items: get().items.filter(item => item.id !== id) });
    } catch (err: any) {
      console.error('Failed to delete item:', err);
      throw err;
    }
  },
}));
