import create from "zustand";

interface AppStore {
  initialized: boolean;
  initializing: boolean;
  idle: boolean;
  finished: boolean;
}

export const useAppStore = create<AppStore>((set) => ({
  initialized: false,
  initializing: false,
  idle: false,
  finished: false,
}));
