import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  loading: {
    vehicles: boolean;
    reports: boolean;
    users: boolean;
  };
}

interface UIActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setLoading: (key: keyof UIState["loading"], loading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, _get) => ({
  // State
  sidebarOpen: true,
  theme: "light",
  loading: {
    vehicles: false,
    reports: false,
    users: false,
  },

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => set({ theme }),

  setLoading: (key, loading) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: loading,
      },
    })),
}));
