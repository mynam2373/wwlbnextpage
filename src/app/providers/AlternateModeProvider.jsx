'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HEART_PROGRESS_STORAGE_KEY, HEART_SHARDS } from '../data/heartShards';

const AlternateModeContext = createContext(null);
const validShardIds = new Set(HEART_SHARDS.map((shard) => shard.id));

function readCollectedShardIds() {
  try {
    const savedIds = JSON.parse(window.localStorage.getItem(HEART_PROGRESS_STORAGE_KEY) || '[]');
    return Array.isArray(savedIds)
      ? [...new Set(savedIds.filter((id) => validShardIds.has(id)))]
      : [];
  } catch {
    return [];
  }
}

export function AlternateModeProvider({ children }) {
  const router = useRouter();
  const [collectedShardIds, setCollectedShardIds] = useState([]);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  useEffect(() => {
    setCollectedShardIds(readCollectedShardIds());
    setHasLoadedProgress(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) return;

    try {
      if (collectedShardIds.length === 0) {
        window.localStorage.removeItem(HEART_PROGRESS_STORAGE_KEY);
      } else {
        window.localStorage.setItem(HEART_PROGRESS_STORAGE_KEY, JSON.stringify(collectedShardIds));
      }
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [collectedShardIds, hasLoadedProgress]);

  const collectShard = useCallback((shardId) => {
    if (!validShardIds.has(shardId)) return;
    setCollectedShardIds((currentIds) => (
      currentIds.includes(shardId) ? currentIds : [...currentIds, shardId]
    ));
  }, []);

  const collectAllShards = useCallback(() => {
    setCollectedShardIds(HEART_SHARDS.map((shard) => shard.id));
  }, []);

  const finishAlternateMode = useCallback(() => {
    try {
      window.localStorage.removeItem(HEART_PROGRESS_STORAGE_KEY);
    } catch {
      // The in-memory reset still restores the page for this session.
    }

    setCollectedShardIds([]);
    router.replace('/');
  }, [router]);

  const value = useMemo(() => ({
    collectedShardIds,
    hasLoadedProgress,
    collectShard,
    collectAllShards,
    isUnlocked: hasLoadedProgress && collectedShardIds.length === HEART_SHARDS.length,
    finishAlternateMode,
  }), [
    collectedShardIds,
    hasLoadedProgress,
    collectShard,
    collectAllShards,
    finishAlternateMode,
  ]);

  return (
    <AlternateModeContext.Provider value={value}>
      {children}
    </AlternateModeContext.Provider>
  );
}

export function useAlternateMode() {
  const context = useContext(AlternateModeContext);
  if (!context) {
    throw new Error('useAlternateMode must be used within AlternateModeProvider');
  }
  return context;
}
