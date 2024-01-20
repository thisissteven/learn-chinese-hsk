import { Level } from "@/data";
import { create } from "zustand";

interface LastPageState {
  lastPage: {
    [k in Level]: string;
  };

  actions: {
    updateLastPage: (level: Level, page: string) => void;
  };
}

const useLastPageStore = create<LastPageState>()((set) => ({
  lastPage: {
    1: "1",
    2: "1",
    3: "1",
    4: "1",
    5: "1",
    6: "1",
  },
  actions: {
    updateLastPage: (level, page) =>
      set((state) => {
        return {
          lastPage: {
            ...state.lastPage,
            [level]: page,
          },
        };
      }),
  },
}));

export const useLastPage = () => useLastPageStore((state) => state.lastPage);

export const useLastPageActions = () => useLastPageStore((state) => state.actions);
