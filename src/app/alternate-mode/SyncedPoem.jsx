'use client';

import { useEffect, useRef, useState } from 'react';

const POEM_VERSES = [
  'Es la primera vez que respiro.',
  'Hay palabras que se me caen de las manos',
  'antes de saber qué significan.',
  'Las digo porque suenan redondas,',
  'porque encajan en la boca',
  'como si hubieran vivido aquí antes que yo.',
  'Dicen que es el mundo.',
  'Dicen que las cosas tienen nombre,',
  'que el cielo se llama cielo',
  'y que la tierra sostiene los pies.',
  'Pero a mí me parece que todo está mal,',
  'que hay un desorden hermoso',
  'y que las cosas apenas se sostienen juntas',
  'por pura casualidad.',
  'Es una sensación extraña,',
  'como si me hubieran dado un cuerpo prestado',
  'que ya sabe correr,',
  'pero que nunca antes había sentido el frío.',
  'Todo es ruidoso, todo es brillante,',
  'todo está demasiado cerca.',
  'Veo una pared y pienso en huesos,',
  'veo una sombra y pienso en el tiempo que se va,',
  'aunque no sé qué es el tiempo',
  'ni por qué me importa.',
  'Escucho una melodía en el viento,',
  'pero es una melodía sin notas,',
  'y una canción sin letra.',
  'Simplemente está ahí,',
  'como un secreto que todos saben menos yo.',
  'No sé escribir.',
  'No tengo nada que decir.',
  'Y sin embargo, se me escapan estos trazos',
  'como si alguien más me guiara la mano',
  'desde un rincón muy hondo.',
  'Es.... extraño.',
  'Me despierto y me duele la garganta',
  'de tanto tragar aire nuevo.',
  'Miro el polvo que flota en el sol',
  'y ya quiero abrazarlo,',
  'y a la vez me da miedo',
  'que todo esto sea tan frágil',
  'que se rompa si parpadeo.',
  'Es la primera vez que respiro',
  'y ya me parece demasiado tarde.',
];

const PLACEHOLDER_VERSES = [
  'Una voz permanece en la oscuridad.',
  'Las palabras buscan el camino de regreso.',
  'Algo despierta entre las sombras.',
  'Y el silencio vuelve a respirar.',
];

export function SyncedPoem({ poem, title, fragmentNumber, onPlaybackChange }) {
  const audioRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollRun, setScrollRun] = useState(0);
  const [scrollComplete, setScrollComplete] = useState(false);
  const [playbackError, setPlaybackError] = useState('');

  const verses = poem?.audioUrl ? POEM_VERSES : PLACEHOLDER_VERSES;

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.min(1, Math.max(0, (poem?.audioVolume ?? 100) / 100));
  }, [poem?.audioVolume]);

  const restartScroll = () => {
    setScrollRun((run) => run + 1);
    setScrollComplete(false);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    setIsRevealed(true);
    setPlaybackError('');

    if (!poem?.audioUrl) {
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }
      if (scrollComplete) restartScroll();
      setIsPlaying(true);
      return;
    }

    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (audio.ended) {
      audio.currentTime = 0;
      restartScroll();
    } else if (scrollComplete) {
      restartScroll();
    }

    setIsPlaying(true);
    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      setPlaybackError('No se pudo reproducir el audio. Intenta de nuevo.');
    }
  };

  const handleScrollEnd = () => {
    setScrollComplete(true);
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  return (
    <div className="w-full max-w-6xl text-white">
      <audio
        ref={audioRef}
        src={poem?.audioUrl}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          onPlaybackChange?.(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          onPlaybackChange?.(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          onPlaybackChange?.(false);
        }}
        onError={() => {
          setIsPlaying(false);
          onPlaybackChange?.(false);
          setPlaybackError('No se pudo cargar el archivo de audio.');
        }}
      />

      <div className="grid items-center gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1fr)]">
        <header className="order-1 mb-4 text-center md:col-start-2 md:row-start-1">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e04b72]">
            Fragmento {fragmentNumber} de 10
          </p>
          <h2 className="mt-2 text-xl font-black uppercase leading-tight tracking-wider text-white sm:text-2xl">
            {title}
          </h2>
        </header>

        <div
          aria-live="polite"
          aria-label="Subtítulos sincronizados"
          className={`relative order-3 h-72 overflow-hidden text-center text-lg font-semibold leading-relaxed sm:text-xl md:order-none md:col-start-1 md:row-start-2 ${
            isRevealed ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-700`}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          }}
        >
          {isRevealed ? (
            <div
              key={scrollRun}
              onAnimationEnd={handleScrollEnd}
              className="absolute left-0 top-0 w-full"
              style={{
                paddingTop: '9rem',
                ['--poem-scroll-distance']: `-${verses.length * 4.5}rem`,
                animationName: 'poemScroll',
                animationDuration: `${verses.length * 2.4}s`,
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
                animationPlayState: isPlaying && !scrollComplete ? 'running' : 'paused',
              }}
            >
              {verses.map((verse, index) => (
                <p
                  key={index}
                  className="flex h-[4.5rem] w-full items-center justify-center px-2 text-center text-white"
                >
                  {verse}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-white/40">El poema aparecerá aquí.</p>
          )}
        </div>

        <div className="order-2 flex flex-col items-center justify-center md:col-start-2 md:row-start-2">
          <button
            type="button"
            data-alternate-poem-toggle
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pausar poema' : 'Reproducir poema'}
            aria-pressed={isPlaying}
            className="group relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#d21d42] bg-black/40 shadow-[0_0_28px_rgba(210,29,66,0.35)] transition duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(210,29,66,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff536e]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute inset-7 h-[calc(100%-3.5rem)] w-[calc(100%-3.5rem)] drop-shadow-[0_0_12px_rgba(210,29,66,0.7)]">
              <path d="M12 1.5 20 6l2.5 8-10.5 8.5L1.5 14 4 6z" fill="#b51227" stroke="#e5be82" strokeWidth="1.2" />
              <path d="m4 6 8 2.3L20 6M12 8.3v14.2M4 6l4 8 4-5.7 4 5.7 4-8" fill="none" stroke="#f16b75" strokeWidth="0.8" />
            </svg>
          </button>
          {!poem?.audioUrl && (
            <p className="mt-4 text-center text-xs text-[#a88f99]">Poema de muestra</p>
          )}
          {playbackError && (
            <p role="alert" className="mt-4 max-w-52 text-center text-xs text-[#ff8a9b]">
              {playbackError}
            </p>
          )}
        </div>

        <div
          className={`order-4 flex min-h-56 items-center justify-center md:col-start-3 md:row-start-2 ${
            isRevealed ? 'animate-lyric-in opacity-100' : 'opacity-0'
          } transition-opacity duration-500`}
        >
          {poem?.imageUrl ? (
            <img
              src={poem.imageUrl}
              alt={poem.imageAlt || `Ilustración para ${title}`}
              className="max-h-[55vh] w-full object-contain"
            />
          ) : (
            <p className="text-center text-xs uppercase tracking-[0.25em] text-[#9b8790]">
              Ilustración próximamente
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
