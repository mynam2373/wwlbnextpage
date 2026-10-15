'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HomeView } from '../view/HomeView';
import { VesteriaMap } from '../comp/map/VesteriaMap';
import { FinaleOverlay } from './FinaleOverlay';
import { SyncedPoem } from './SyncedPoem';

const CHARACTER_RAILS = [
  { side: 'left', top: '24%', characters: [{ name: 'Kiran', role: 'Paladín' }] },
  { side: 'left', top: '47%', characters: [{ name: 'Caleb', role: 'Berserker' }] },
  { side: 'left', top: '70%', characters: [{ name: 'Lin', role: 'Druida' }] },
  { side: 'right', top: '24%', characters: [{ name: 'Isabel', role: 'Comodín' }] },
  { side: 'right', top: '47%', characters: [{ name: 'Dahya', role: 'Bárbara' }] },
  { side: 'right', top: '70%', characters: [{ name: 'Zora', role: 'Encantadora' }] },
];

function FixedCharacterMasks() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-dvh w-screen overflow-hidden">
      {CHARACTER_RAILS.map(({ side, top, characters }) => (
        <div
          key={characters[0].name}
          className={`absolute flex -translate-y-1/2 flex-col items-center ${side === 'left' ? 'left-2 sm:left-6' : 'right-2 sm:right-6'}`}
          style={{ top }}
        >
          <span className="h-12 w-12 rounded-full border-[5px] border-[#b51258] bg-black shadow-[0_0_12px_rgba(181,18,88,0.5)] sm:h-16 sm:w-16" />
          <span className="mt-1 min-w-14 rounded-sm border border-[#3d291a] bg-[#fdf6e3] px-1.5 py-1 text-center text-[9px] font-black uppercase leading-tight text-[#3d291a] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] sm:min-w-20 sm:text-[10px]">
            {characters[0].name}
            <span className="block text-[7px] font-semibold normal-case opacity-75 sm:text-[8px]">
              {characters[0].role}
            </span>
          </span>
        </div>
      ))}
    </div>,
    document.body,
  );
}

function FragmentSection({ shard, index, poem, onPlaybackChange }) {
  const title = poem?.titulo || shard.title;

  return (
    <section
      id={`alternate-fragment-${index + 1}`}
      className="flex min-h-[115vh] scroll-mt-8 items-center justify-center px-5 py-16"
    >
      <SyncedPoem
        poem={poem}
        title={title}
        fragmentNumber={index + 1}
        onPlaybackChange={onPlaybackChange}
      />
    </section>
  );
}

export function AlternateModeExperience({ shards, firstPoem, audioTracks = [], onFinish }) {
  const [isFinaleOpen, setIsFinaleOpen] = useState(false);
  const audioRef = useRef({
    background: null,
    heartbeat: null,
    click: null,
    heartbeatTimeout: null,
    heartbeatInterval: null,
    resumeTimeout: null,
    lastClickAt: 0,
    suspended: false,
    startAmbient: null,
  });

  const setPoemPlayback = useCallback((isPlaying) => {
    const audio = audioRef.current;
    window.clearTimeout(audio.resumeTimeout);

    if (isPlaying) {
      audio.suspended = true;
      window.clearTimeout(audio.heartbeatTimeout);
      window.clearInterval(audio.heartbeatInterval);
      audio.heartbeatTimeout = null;
      audio.heartbeatInterval = null;
      audio.background?.pause();
      audio.heartbeat?.pause();
      audio.click?.pause();
      return;
    }

    audio.resumeTimeout = window.setTimeout(() => {
      audio.suspended = false;
      audio.startAmbient?.();
    }, 3000);
  }, []);

  const playClickEffect = useCallback(() => {
    const audio = audioRef.current;
    if (audio.suspended || !audio.click) return;

    const now = Date.now();
    if (now - audio.lastClickAt < 1000) return;
    audio.lastClickAt = now;
    audio.click.currentTime = 0;
    audio.click.play().catch((error) => {
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
        console.error('No se pudo reproducir el efecto de clic del modo alternativo:', error);
      }
    });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const backgroundTrack = audioTracks.find((track) =>
      track.eventos?.includes('ambienteModoAlternativo'),
    );
    const heartbeatTrack = audioTracks.find((track) =>
      track.eventos?.includes('latidoAlternativo'),
    );
    const clickTrack = audioTracks.find((track) =>
      track.eventos?.includes('clicAlternativo'),
    );

    if (backgroundTrack?.url) {
      audio.background = new Audio(backgroundTrack.url);
      audio.background.volume = Math.min(1, Math.max(0, (backgroundTrack.volumen ?? 100) / 100));
      audio.background.loop = true;
    } else {
      console.warn('No hay música configurada para el modo alternativo.');
    }

    if (heartbeatTrack?.url) {
      audio.heartbeat = new Audio(heartbeatTrack.url);
      audio.heartbeat.volume = Math.min(1, Math.max(0, (heartbeatTrack.volumen ?? 100) / 100));
    } else {
      console.warn('No hay efecto de latido configurado para el modo alternativo.');
    }

    if (clickTrack?.url) {
      audio.click = new Audio(clickTrack.url);
      audio.click.volume = Math.min(1, Math.max(0, (clickTrack.volumen ?? 100) / 100));
    } else {
      console.warn('No hay efecto de clic configurado para el modo alternativo.');
    }

    const playHeartbeat = () => {
      if (audio.suspended || !audio.heartbeat) return;
      audio.heartbeat.currentTime = 0;
      audio.heartbeat.play().catch((error) => {
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
          console.error('No se pudo reproducir el latido del modo alternativo:', error);
        }
      });
    };

    const startAmbient = () => {
      if (audio.suspended) return;
      if (audio.background?.paused) {
        audio.background.play().catch((error) => {
            if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
            console.error('No se pudo reproducir el ambiente del modo alternativo:', error);
          }
        });
      }
      if (audio.heartbeat && audio.heartbeatInterval === null && audio.heartbeatTimeout === null) {
        audio.heartbeatTimeout = window.setTimeout(() => {
          audio.heartbeatTimeout = null;
          playHeartbeat();
          audio.heartbeatInterval = window.setInterval(playHeartbeat, 1800);
        }, 2000);
      }
    };
    audio.startAmbient = startAmbient;

    const retryAfterInteraction = () => {
      startAmbient();
    };
    window.addEventListener('pointerdown', retryAfterInteraction);
    window.addEventListener('keydown', retryAfterInteraction);
    startAmbient();

    return () => {
      window.removeEventListener('pointerdown', retryAfterInteraction);
      window.removeEventListener('keydown', retryAfterInteraction);
      window.clearTimeout(audio.heartbeatTimeout);
      window.clearInterval(audio.heartbeatInterval);
      window.clearTimeout(audio.resumeTimeout);
      audio.background?.pause();
      audio.heartbeat?.pause();
      audio.click?.pause();
      audio.background = null;
      audio.heartbeat = null;
      audio.click = null;
      audio.heartbeatTimeout = null;
      audio.heartbeatInterval = null;
      audio.resumeTimeout = null;
      audio.startAmbient = null;
      audio.suspended = false;
    };
  }, [audioTracks]);

  return (
    <div
      onClickCapture={(event) => {
        if (event.target instanceof Element && event.target.closest('[data-alternate-poem-toggle]')) {
          return;
        }
        playClickEffect();
      }}
      className="relative min-h-screen animate-[alternate-fade-in_900ms_ease-out] overflow-x-clip bg-[#1c1917] text-white"
    >
      <section className="relative flex min-h-screen flex-col items-center px-4 pb-20 pt-20">
        <header aria-label="Navegación censurada" className="absolute left-0 right-0 top-5 z-40 flex justify-center gap-2 px-3 sm:gap-5">
          {['Inicio', 'Novela', 'Personajes', 'Minijuegos', 'Correo'].map((label, index) => (
            <div key={label} aria-label={`${label}, bloqueado`} className="h-8 w-14 rounded border-2 border-[#b07b4d] bg-black shadow-[3px_3px_0_#382417] sm:h-10 sm:w-24" style={{ opacity: 0.55 + ((index % 2) * 0.25) }} />
          ))}
        </header>

        <div className="relative z-20 flex min-h-36 w-full items-center justify-center">
          <HomeView alternateMode />
        </div>

        <div className="relative z-10 mt-4 w-full max-w-4xl">
          <VesteriaMap alternateMode />
        </div>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-[#72535c]">
          Sigue descendiendo
        </p>
      </section>
      <FixedCharacterMasks />

      <div aria-hidden="true" className="relative h-20 bg-black [clip-path:polygon(0_25%,6%_25%,6%_38%,12%_38%,12%_15%,19%_15%,19%_45%,26%_45%,26%_22%,34%_22%,34%_52%,42%_52%,42%_18%,49%_18%,49%_40%,56%_40%,56%_12%,64%_12%,64%_48%,71%_48%,71%_20%,79%_20%,79%_43%,86%_43%,86%_16%,94%_16%,94%_34%,100%_34%,100%_100%,0_100%)]" />

      <div className="bg-black">
        {shards.map((shard, index) => (
          <FragmentSection
            key={shard.id}
            shard={shard}
            index={index}
            poem={index === 0 ? firstPoem : null}
            onPlaybackChange={setPoemPlayback}
          />
        ))}

        <section className="flex min-h-screen items-center justify-center px-6 py-20">
          <button
            type="button"
            onClick={() => setIsFinaleOpen(true)}
            aria-label="Abrir la silueta final"
            className="h-64 w-64 border-2 border-[#281b21] bg-black shadow-[0_0_50px_rgba(113,8,38,0.25)] transition-shadow hover:shadow-[0_0_70px_rgba(193,20,60,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d21d42]"
          />
        </section>
      </div>

      {isFinaleOpen && <FinaleOverlay onFinish={onFinish} />}
    </div>
  );
}
