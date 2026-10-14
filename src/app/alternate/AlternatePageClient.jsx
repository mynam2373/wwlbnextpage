'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlternateModeExperience } from '../alternate-mode/AlternateModeExperience';
import { HEART_SHARDS } from '../data/heartShards';
import { useAlternateMode } from '../providers/AlternateModeProvider';

export default function AlternatePageClient({ firstPoem }) {
  const router = useRouter();
  const { hasLoadedProgress, isUnlocked, finishAlternateMode } = useAlternateMode();

  useEffect(() => {
    if (hasLoadedProgress && !isUnlocked) {
      router.replace('/');
    }
  }, [hasLoadedProgress, isUnlocked, router]);

  if (!hasLoadedProgress || !isUnlocked) {
    return <main className="min-h-screen bg-[#1c1917]" aria-label="Cargando modo alternativo" />;
  }

  return (
    <AlternateModeExperience
      shards={HEART_SHARDS}
      firstPoem={firstPoem}
      onFinish={finishAlternateMode}
    />
  );
}
