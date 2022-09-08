import create from "zustand";

interface AppStore {
  initialized: boolean;
  initializing: boolean;
  idle: boolean;
  finished: boolean;
  sentence: string;
  initializeApp: (amount: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  initialized: false,
  initializing: true,
  idle: true,
  finished: false,
  sentence: "",
  initializeApp: async (amount) => {
    try {
      const res = await fetch(`/api/words?amount=${amount}`);
      const sentence = await res.json();
      set({ sentence, initializing: false });
    } catch (err) {
      console.error(err);
    }
  },
}));
