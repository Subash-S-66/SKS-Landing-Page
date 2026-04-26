import { create } from 'zustand';

interface AppState {
  settings: Record<string, any>;
  setSettings: (settings: Record<string, any>) => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  settings: {},
  setSettings: (settings) => set({ settings }),
  adminModalOpen: false,
  setAdminModalOpen: (open) => set({ adminModalOpen: open }),
  user: null,
  setUser: (user) => set({ user }),
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  }
}));
