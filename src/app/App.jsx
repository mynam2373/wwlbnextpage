'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TheaterLayout } from './comp/puppets/TheaterLayout';
import { HomeView } from './view/HomeView';
import { PuppetStage } from './comp/puppets/PuppetStage';
import { VesteriaMap } from './comp/map/VesteriaMap';

import { CharactersPage } from './pages/CharactersPage';
import { GamesPage } from './pages/GamesPage';
import { NovelView } from './view/NovelView';
import CorreoPage from './pages/correoPage';
import { BuzonFlotante } from './comp/common/Buzon';
import { HEART_SHARDS } from './data/heartShards';
import { useAlternateMode } from './providers/AlternateModeProvider';

const SECRET_WORD = 'elizabeth';
const ALTERNATE_MODE_ENTRY_KEY = 'wwlb-alternate-mode-entry';

export default function App({
  initialTab = 'inicio',
  novelSettings,
  volumes = [],
  globalAudio,
  imageLibrary = [],
  mailboxSubmissions = [],
  isMailboxAdmin = false,
  mailboxAdminConfigured = false,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const typedWord = useRef('');
  const pathname = usePathname();
  const router = useRouter();
  const {
    collectedShardIds,
    collectShard,
    collectAllShards,
    isUnlocked,
  } = useAlternateMode();

  const playAudioEvent = useCallback((eventName) => {
    const track = globalAudio?.pistas?.find(
      (item) => item.tipo === 'efecto' && item.eventos?.includes(eventName),
    );
    if (!track) {
      console.warn(`No hay ningún efecto de audio configurado para el evento "${eventName}".`);
      return;
    }
    if (!track.url) {
      console.error(`El efecto de audio para el evento "${eventName}" no tiene un archivo cargado.`);
      return;
    }

    const audio = new Audio(track.url);
    audio.volume = Math.min(1, Math.max(0, (track.volumen ?? 100) / 100));
    audio.play().catch((error) => {
      console.error(`No se pudo reproducir el efecto de audio "${eventName}":`, error);
    });
  }, [globalAudio]);

  useEffect(() => {
    if (pathname === '/alternate') return undefined;

    const musicTrack = globalAudio?.pistas?.find(
      (item) => item.tipo === 'musica'
        && item.eventos?.includes('musicaFondoGeneral')
        && item.url,
    );
    if (!musicTrack) return undefined;

    const audio = new Audio(musicTrack.url);
    audio.volume = Math.min(1, Math.max(0, (musicTrack.volumen ?? 100) / 100));
    audio.loop = true;
    const startPlayback = () => {
      audio.play()
        .then(() => {
          window.removeEventListener('pointerdown', startPlayback);
          window.removeEventListener('keydown', startPlayback);
        })
        .catch((error) => {
          if (error.name !== 'NotAllowedError') {
            console.error('No se pudo reproducir la música de fondo:', error);
          }
        });
    };

    window.addEventListener('pointerdown', startPlayback, { once: true });
    window.addEventListener('keydown', startPlayback, { once: true });
    startPlayback();

    return () => {
      window.removeEventListener('pointerdown', startPlayback);
      window.removeEventListener('keydown', startPlayback);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [globalAudio, pathname]);

  const handleCollectShard = useCallback((shardId) => {
    const isKnownShard = HEART_SHARDS.some((shard) => shard.id === shardId);
    if (!isKnownShard || collectedShardIds.includes(shardId)) {
      collectShard(shardId);
      return;
    }

    const completesLocket = collectedShardIds.length === HEART_SHARDS.length - 1;
    collectShard(shardId);
    playAudioEvent(completesLocket ? 'completarLocket' : 'recogerFragmento');
  }, [collectedShardIds, collectShard, playAudioEvent]);

  const handleCollectAllShards = useCallback(() => {
    if (!isUnlocked) playAudioEvent('completarLocket');
    collectAllShards();
  }, [collectAllShards, isUnlocked, playAudioEvent]);

  useEffect(() => {
    if (activeTab !== 'inicio') {
      typedWord.current = '';
      return undefined;
    }

    const handleSecretWord = (event) => {
      const target = event.target;
      const isTextEntry = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );

      if (isTextEntry || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || !/[a-z]/i.test(event.key)) {
        typedWord.current = '';
        return;
      }

      typedWord.current = `${typedWord.current}${event.key.toLowerCase()}`.slice(-SECRET_WORD.length);

      if (typedWord.current === SECRET_WORD) {
        handleCollectAllShards();
        typedWord.current = '';
      }
    };

    window.addEventListener('keydown', handleSecretWord);
    return () => {
      window.removeEventListener('keydown', handleSecretWord);
      typedWord.current = '';
    };
  }, [activeTab, handleCollectAllShards]);

  const handleLocketClick = () => {
    if (!isUnlocked) return;

    if (pathname !== '/') {
      router.push('/');
      return;
    }

    if (activeTab !== 'inicio') {
      setActiveTab('inicio');
      return;
    }

    window.sessionStorage.setItem(ALTERNATE_MODE_ENTRY_KEY, 'true');
    router.push('/alternate');
  };

  return (
    <TheaterLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      collectedShardIds={collectedShardIds}
      isUnlocked={isUnlocked}
      onLocketClick={handleLocketClick}
      puppetOverlay={activeTab === 'inicio' ? <PuppetStage /> : null}
    >
      {/* 1. INICIO */}
      {activeTab === 'inicio' && (
        <div className="flex flex-col items-center justify-start min-h-[85vh] w-full px-1 sm:px-4 py-2">
          
          {/* Cartel principal / Título */}
          <HomeView />

          {/* Un solo Mapa en el centro */}
          <div className="w-full flex justify-center my-2">
            <VesteriaMap
              imageLibrary={imageLibrary}
            />
          </div>

        </div>
      )}

      {/* 2. NOVELA */}
      {activeTab === 'novela' && (
        <div className="w-full px-4 py-6">
          <NovelView settings={novelSettings} volumes={volumes} />
        </div>
      )}

      {/* 3. PERSONAJES */}
      {activeTab === 'personajes' && (
        <div className="w-full px-4 py-6">
          <CharactersPage
            collectedShardIds={collectedShardIds}
            onCollectShard={handleCollectShard}
            imageLibrary={imageLibrary}
          />
        </div>
      )}

      {/* 4. MINIJUEGOS */}
      {activeTab === 'minijuegos' && (
        <div className="w-full px-4 py-6">
          <GamesPage
            collectedShardIds={collectedShardIds}
            onCollectShard={handleCollectShard}
          />
        </div>
      )}
      {activeTab === 'correo' && (
        <div className="w-full px-4 py-6">
          <CorreoPage
            submissions={mailboxSubmissions}
            isAdmin={isMailboxAdmin}
            adminConfigured={mailboxAdminConfigured}
          />
        </div>
      )}

      <BuzonFlotante />
    </TheaterLayout>
  );
}