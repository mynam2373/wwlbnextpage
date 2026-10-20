'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlternateModeExperience } from '../alternate-mode/AlternateModeExperience';
import { HEART_SHARDS } from '../data/heartShards';
import { useAlternateMode } from '../providers/AlternateModeProvider';

const ALTERNATE_MODE_ENTRY_KEY = 'wwlb-alternate-mode-entry';

export default function AlternatePageClient({ firstPoem, audioTracks = [] }) {
  const router = useRouter();
  const { hasLoadedProgress, isUnlocked, finishAlternateMode } = useAlternateMode();
  const entryCheckComplete = useRef(false);
  const [hasValidEntry, setHasValidEntry] = useState(false);

  useEffect(() => {
    if (entryCheckComplete.current) return;
    entryCheckComplete.current = true;

    if (window.sessionStorage.getItem(ALTERNATE_MODE_ENTRY_KEY) === 'true') {
      window.sessionStorage.removeItem(ALTERNATE_MODE_ENTRY_KEY);
      setHasValidEntry(true);
    } else {
      router.replace('/');
    }
  }, [router]);

  if (!hasValidEntry || !hasLoadedProgress || !isUnlocked) {
    return <main className="min-h-screen bg-[#1c1917]" aria-label="Cargando modo alternativo" />;
  }

  return (
    <AlternateModeExperience
      shards={HEART_SHARDS}
      firstPoem={firstPoem}
      audioTracks={audioTracks}
      onFinish={finishAlternateMode}
    />
  );
}
