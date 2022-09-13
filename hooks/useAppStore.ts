import create from "zustand";
import { combine } from "zustand/middleware";

export const useAppStore = create(
  combine(
    {
      initializing: true,
      initialized: false,
      //
      wordAmount: 5,
      //
      idle: true,
      started: false,
      finished: false,
      //
      time: 0,
      wpm: 0,
      //
      currWordIndex: 0,
      currCharIndex: 0,
      //
      sentence: "",
      words: [] as string[][],
      //
      inputText: "",
    },
    (set) => ({
      setInitializing: (initializing: boolean) => set({ initializing }),
      setInitialized: (initialized: boolean) => set({ initialized }),
      ////
      setWordAmount: (wordAmount: number) => set({ wordAmount }),
      ////
      startTest: () => {
        console.log("starting!");
        set({ idle: false, started: true });
      },
      finishTest: () => {
        console.log("finished!");
        set({ started: false, finished: true });
      },
      abortTest: () => {
        console.log("aborting!");
        set({ idle: true, started: false, finished: false });
      },
      ////
      setTimeAndWPM: (time: number, wpm: number) => {
        set({ time, wpm });
      },
      ////
      incrementWordIndex: () => set((state) => ({ currWordIndex: state.currWordIndex + 1 })), // prettier-ignore
      decrementWordIndex: () => set((state) => ({ currWordIndex: state.currWordIndex - 1 })), // prettier-ignore
      resetWordIndex: () => set({ currWordIndex: 0 }),
      setWordIndex: (currWordIndex: number) => set({ currWordIndex }),
      incrementCharIndex: () => set((state) => ({ currCharIndex: state.currCharIndex + 1 })), // prettier-ignore
      decrementCharIndex: () => set((state) => ({ currCharIndex: state.currCharIndex - 1 })), // prettier-ignore
      resetCharIndex: () => set({ currCharIndex: 0 }),
      setCharIndex: (currCharIndex: number) => set({ currCharIndex }),
      resetGame: () =>
        set({
          initialized: false,
          initializing: true,
          idle: true,
          started: false,
          finished: false,
          time: 0,
          wpm: 0,
          currWordIndex: 0,
          currCharIndex: 0,
          sentence: "",
          words: [],
          inputText: "",
        }),
      ////
      setSentence: (sentence: string) => set({ sentence }),
      setWords: (sentence: string) => {
        const words = sentence.split(" ").map((word) => word.split(""));
        set({ words });
      },
      setInputText: (inputText: string) => set({ inputText }),
      setNewSentence: (sentence: string) => {
        const newSentence = sentence.slice(20, sentence.length - 1);
        set({ sentence: newSentence });
      },
    })
  )
);
