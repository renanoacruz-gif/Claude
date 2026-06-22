"use client";
import { create } from "zustand";
import { SimulationResults } from "@/lib/models/montecarlo";
import { TEAMS } from "@/lib/data/teams";

export interface SimStore {
  results: SimulationResults | null;
  isRunning: boolean;
  progress: number;
  lastRun: Date | null;
  runSimulation: (n?: number) => void;
}

const EMPTY_RESULTS: SimulationResults = {
  championProbability: {},
  finalistProbability: {},
  semifinalistProbability: {},
  quarterfinalistProbability: {},
  roundOf16Probability: {},
  groupAdvanceProbability: {},
  totalSimulations: 0,
};

export const useSimStore = create<SimStore>((set, get) => ({
  results: null,
  isRunning: false,
  progress: 0,
  lastRun: null,

  runSimulation: async (n = 10000) => {
    if (get().isRunning) return;
    set({ isRunning: true, progress: 0 });

    // Run in chunks to not block UI
    const { runSimulations } = await import("@/lib/models/montecarlo");

    // Use setTimeout to yield to UI
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const results = runSimulations(TEAMS, n, (pct) => {
          set({ progress: pct });
        });
        set({ results, isRunning: false, progress: 1, lastRun: new Date() });
        resolve();
      }, 50);
    });
  },
}));
