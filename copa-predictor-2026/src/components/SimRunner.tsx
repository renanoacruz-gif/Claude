"use client";
import { useEffect } from "react";
import { useSimStore } from "@/lib/stores/simulation";

export function SimRunner() {
  const { results, isRunning, runSimulation } = useSimStore();

  useEffect(() => {
    if (!results && !isRunning) {
      runSimulation(10000);
    }
  }, []);

  return null;
}
