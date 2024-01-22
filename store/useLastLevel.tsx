import { Level } from "@/data";
import { create } from "zustand";

interface LastLevelState {
  lastLevel: Level | null;

  actions: {
    updateLastLevel: (level: Level) => void;
  };
}

const useLastLevelStore = create<LastLevelState>()((set) => ({
  lastLevel: null,
  actions: {
    updateLastLevel: (level) =>
      set((_) => {
        return {
          lastLevel: level,
        };
      }),
  },
}));

export const useLastLevel = () => useLastLevelStore((state) => state.lastLevel);

export const useLastLevelActions = () => useLastLevelStore((state) => state.actions);
