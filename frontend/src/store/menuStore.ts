import { create } from 'zustand';
import { MenuItem } from '@/store/cartStore';
import { MENU_DATA } from '@/data/menuData';

const STORAGE_KEY = 'kedai_custom_menu';

interface MenuStore {
  items: MenuItem[];
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, data: Partial<Omit<MenuItem, 'id'>>) => void;
  deleteItem: (id: string) => void;
  isDefault: (id: string) => boolean;
}

function loadFromStorage(): MenuItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveToStorage(custom: MenuItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export const useMenuStore = create<MenuStore>((set, get) => {
  const custom = loadFromStorage();
  // Gabungkan default + custom, override default jika id sama
  const merged = mergeMenus(MENU_DATA, custom);

  return {
    items: merged,

    addItem: (data) => {
      const id = `custom_${Date.now()}`;
      const newItem: MenuItem = { id, ...data };
      const custom = [...loadFromStorage(), newItem];
      saveToStorage(custom);
      set({ items: mergeMenus(MENU_DATA, custom) });
    },

    updateItem: (id, data) => {
      // Update di custom storage (baik item default yang dioverride, maupun custom)
      let custom = loadFromStorage();
      if (custom.find(i => i.id === id)) {
        custom = custom.map(i => i.id === id ? { ...i, ...data } : i);
      } else {
        // Kalau item default, tambahkan override-nya ke custom
        const base = MENU_DATA.find(i => i.id === id);
        if (base) custom = [...custom, { ...base, ...data }];
      }
      saveToStorage(custom);
      set({ items: mergeMenus(MENU_DATA, custom) });
    },

    deleteItem: (id) => {
      let custom = loadFromStorage();
      if (custom.find(i => i.id === id)) {
        // Item custom → hapus dari custom
        custom = custom.filter(i => i.id !== id);
      } else {
        // Item default → tandai deleted dengan flag khusus
        const base = MENU_DATA.find(i => i.id === id);
        if (base) custom = [...custom, { ...base, _deleted: true } as MenuItem & { _deleted: boolean }];
      }
      saveToStorage(custom);
      set({ items: mergeMenus(MENU_DATA, custom) });
    },

    isDefault: (id) => MENU_DATA.some(i => i.id === id),
  };
});

function mergeMenus(defaults: MenuItem[], custom: MenuItem[]): MenuItem[] {
  const deletedIds = new Set(
    custom.filter((i: MenuItem & { _deleted?: boolean }) => i._deleted).map(i => i.id)
  );
  const overrides = new Map(
    custom.filter((i: MenuItem & { _deleted?: boolean }) => !i._deleted).map(i => [i.id, i])
  );

  const result: MenuItem[] = [];
  for (const item of defaults) {
    if (deletedIds.has(item.id)) continue;
    result.push(overrides.has(item.id) ? overrides.get(item.id)! : item);
    overrides.delete(item.id);
  }
  // Sisanya adalah custom item baru
  for (const item of overrides.values()) {
    result.push(item);
  }
  return result;
}
