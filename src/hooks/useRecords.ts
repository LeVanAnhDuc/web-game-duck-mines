"use client";

import { useCallback, useEffect, useState } from "react";
import { DIFFICULTY_ORDER } from "@/game/core/constants";
import type { Difficulty } from "@/game/core/types";
import { localScoreRepository } from "@/game/score/localScoreRepository";
import type { BestTimes } from "@/game/score/ScoreRepository";
import { isAvailable } from "@/game/storage/safeStorage";

const NO_RECORDS = Object.fromEntries(
  DIFFICULTY_ORDER.map((difficulty) => [difficulty, null]),
) as BestTimes;

/**
 * Best times, and the two things that change them.
 *
 * Reading happens in an effect, not in the initial state, so the server-rendered
 * markup and the first client render agree.
 */
export function useRecords() {
  const [bestTimes, setBestTimes] = useState<BestTimes>(NO_RECORDS);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    setBestTimes(localScoreRepository.load());
    setStorageAvailable(isAvailable());
  }, []);

  /** Returns true when this run became the new best. */
  const record = useCallback((difficulty: Difficulty, seconds: number) => {
    const isBest = localScoreRepository.saveIfBest(difficulty, seconds);
    if (isBest) setBestTimes(localScoreRepository.load());
    return isBest;
  }, []);

  const clear = useCallback(() => {
    localScoreRepository.clear();
    setBestTimes(localScoreRepository.load());
  }, []);

  return { bestTimes, record, clear, storageAvailable };
}
