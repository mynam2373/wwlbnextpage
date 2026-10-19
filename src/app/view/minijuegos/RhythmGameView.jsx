import { useState, useEffect, useRef } from 'react';
import { RHYTHM_LEVELS } from '../../data/levelRhythmData';
import { RHYTHM_LEVEL_SHARD_IDS } from '../../data/heartShards';

// Configuración de los 4 carriles
const LANES = [
  { id: 0, label: '←', code: 'ArrowLeft', altCode: 'KeyA' },
  { id: 1, label: '↑', code: 'ArrowUp', altCode: 'KeyW' },
  { id: 2, label: '↓', code: 'ArrowDown', altCode: 'KeyS' },
  { id: 3, label: '→', code: 'ArrowRight', altCode: 'KeyD' },
];

const CHARACTER_ZONES = [
  { name: 'Zora', image: new URL('../../assets/zora.png', import.meta.url).href, side: 'left' },
  { name: 'Isabel', image: new URL('../../assets/isabel.png', import.meta.url).href, side: 'right' },
];

export function RhythmGameView({ onBack, collectedShardIds = [], onCollectShard }) {
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Notas activas en pantalla
  const [activeNotes, setActiveNotes] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pressedLanes, setPressedLanes] = useState([false, false, false, false]);
  
  const startTimeRef = useRef(null);
  const requestRef = useRef(null);
  const activeNotesRef = useRef([]);
  const selectedLevel = RHYTHM_LEVELS.find((level) => level.id === selectedLevelId);
  const rewardShardId = RHYTHM_LEVEL_SHARD_IDS[selectedLevelId];
  const isPlaying = hasStarted && activeNotes.length > 0 && activeNotes.some((note) => !note.hit && !note.missed);
  const isComplete = hasStarted && activeNotes.length > 0 && activeNotes.every((note) => note.hit || note.missed);
  const canCollectReward = isComplete && rewardShardId && !collectedShardIds.includes(rewardShardId);
  const displayFeedback = isComplete ? '¡COMPÁS COMPLETO!' : feedback;
  const [orientationNotice, setOrientationNotice] = useState('');

  const enterLandscapeMode = () => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    setOrientationNotice('');
    const orientation = window.screen.orientation;
    const lockOrientation = () => {
      if (typeof orientation?.lock !== 'function') {
        setOrientationNotice('Gira el teléfono para jugar en horizontal.');
        return;
      }

      orientation.lock('landscape').catch(() => {
        setOrientationNotice('Gira el teléfono manualmente para jugar en horizontal.');
      });
    };

    if (document.fullscreenElement) {
      lockOrientation();
      return;
    }

    if (typeof document.documentElement.requestFullscreen !== 'function') {
      setOrientationNotice('Gira el teléfono manualmente para jugar en horizontal.');
      lockOrientation();
      return;
    }

    document.documentElement.requestFullscreen()
      .then(lockOrientation)
      .catch(() => {
        setOrientationNotice('No se pudo activar la pantalla completa. Gira el teléfono para continuar.');
      });
  };

  const hitLane = (laneIndex) => {
    if (!isPlaying || startTimeRef.current === null) return;

    const elapsed = performance.now() - startTimeRef.current;
    const candidate = activeNotesRef.current
      .filter((note) => note.lane === laneIndex && !note.hit && !note.missed)
      .map((note) => ({ note, diff: Math.abs(elapsed - note.time) }))
      .filter(({ diff }) => diff < 150)
      .sort((first, second) => first.diff - second.diff)[0];

    if (!candidate) return;

    const updatedNotes = activeNotesRef.current.map((note) => (
      note.id === candidate.note.id ? { ...note, hit: true } : note
    ));
    activeNotesRef.current = updatedNotes;
    setActiveNotes(updatedNotes);

    if (candidate.diff < 60) {
      setScore((current) => current + 300);
      setFeedback('PERFECT!');
    } else {
      setScore((current) => current + 100);
      setFeedback('GOOD');
    }
    setCombo((current) => current + 1);
  };

  // Iniciar / Reiniciar juego
  const startGame = (level = selectedLevel) => {
    if (!level) return;

    enterLandscapeMode();
    setSelectedLevelId(level.id);
    const startingNotes = level.beatmap.map((note) => ({ ...note, hit: false, missed: false }));
    activeNotesRef.current = startingNotes;
    setActiveNotes(startingNotes);
    setScore(0);
    setCombo(0);
    setFeedback('');
    setElapsedTime(0);
    setPressedLanes([false, false, false, false]);
    setHasStarted(true);
    startTimeRef.current = null;
  };

  const returnToLevels = () => {
    activeNotesRef.current = [];
    setActiveNotes([]);
    setHasStarted(false);
    setFeedback('');
    setOrientationNotice('');
    setPressedLanes([false, false, false, false]);
    setSelectedLevelId(null);
    window.screen.orientation?.unlock?.();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.warn('Could not exit fullscreen after leaving the rhythm game.', error);
      });
    }
  };

  useEffect(() => () => {
    window.screen.orientation?.unlock?.();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.warn('Could not exit fullscreen after leaving the rhythm game.', error);
      });
    }
  }, []);

  // Main game loop; notes travel from right to left across the track.
  useEffect(() => {
    if (!isPlaying) return;

    const updateGame = (timestamp) => {
      startTimeRef.current ??= timestamp;
      const elapsed = timestamp - startTimeRef.current;
      setElapsedTime(elapsed);

      let missedNote = false;
      const updatedNotes = activeNotesRef.current.map((note) => {
        if (note.hit || note.missed || elapsed <= note.time + 200) return note;

        missedNote = true;
        return { ...note, missed: true };
      });

      if (missedNote) {
        activeNotesRef.current = updatedNotes;
        setActiveNotes(updatedNotes);
        setCombo(0);
        setFeedback('MISS');
      }

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // Manejador de teclado
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      const laneIndex = LANES.findIndex(
        (l) => l.code === e.code || l.altCode === e.code
      );

      if (laneIndex === -1) return;
      e.preventDefault();
      if (e.repeat) return;

      setPressedLanes((current) => current.map((pressed, index) => index === laneIndex || pressed));
      hitLane(laneIndex);
    };

    const handleKeyUp = (e) => {
      const laneIndex = LANES.findIndex(
        (l) => l.code === e.code || l.altCode === e.code
      );
      if (laneIndex !== -1) {
        setPressedLanes((current) => current.map((pressed, index) => index === laneIndex ? false : pressed));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  if (!selectedLevel) {
    return (
      <div className="relative z-10 mx-auto flex min-h-[58vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-8">
        <div className="flex w-full items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded border-2 border-[#3d291a] bg-[#3d291a] px-3 py-2 text-xs font-bold text-[#fdf6e3] transition-colors hover:bg-[#d4a373] hover:text-[#3d291a]"
            >
              ← Minijuegos
            </button>
          ) : <span />}
          <p className="text-xs font-black uppercase text-[#e5be82]">Selección de nivel</p>
        </div>

        <div className="w-full text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d4a373]">Zora & Isabel</p>
          <h1 className="mt-1 text-2xl font-black uppercase text-[#fdf6e3]">Lección de Batuta</h1>
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {RHYTHM_LEVELS.map((level, index) => (
            <article key={level.id} className="flex min-h-40 flex-col justify-between rounded-lg border-2 border-[#3d291a] bg-[#fdf6e3] p-4 text-[#3d291a] shadow-[4px_4px_0px_rgba(0,0,0,0.35)]">
              <div>
                <p className="text-[10px] font-black uppercase text-[#a36a3e]">Nivel {index + 1}</p>
                <h2 className="mt-1 text-base font-black uppercase">{level.title}</h2>
                <p className="mt-2 text-xs text-[#6b4f38]">{level.description}</p>
              </div>
              <button
                type="button"
                onClick={() => startGame(level)}
                className="mt-4 self-start rounded border-2 border-[#3d291a] bg-[#d4a373] px-3 py-1.5 text-xs font-black uppercase transition-colors hover:bg-[#e5be82]"
              >
                Jugar nivel
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rhythm-game-shell relative z-10 mx-auto flex h-[min(68vh,540px)] min-h-[320px] w-full max-w-4xl flex-col items-center">
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border-4 border-[#3d291a] bg-[#fefae0] p-2 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] sm:rounded-3xl sm:border-8 sm:p-3">
        <div className="flex h-9 shrink-0 items-center justify-between gap-2 px-1 text-[#3d291a] sm:h-10 sm:px-2">
          {onBack ? (
            <button
              type="button"
              onClick={returnToLevels}
              className="shrink-0 rounded border-2 border-[#3d291a] bg-[#3d291a] px-2 py-1 text-[10px] font-bold text-[#fdf6e3] transition-colors hover:bg-[#d4a373] hover:text-[#3d291a] sm:px-3 sm:text-xs"
            >
              ← Niveles
            </button>
          ) : <span />}

          <div className="flex gap-3 text-[10px] font-extrabold uppercase sm:gap-6 sm:text-sm">
            <div>Score: <span className="text-[#a36a3e]">{score}</span></div>
            <div>Combo: <span className="text-[#a36a3e]">{combo}</span></div>
          </div>

          {!isPlaying ? (
            <button
              type="button"
              onClick={startGame}
              className="shrink-0 rounded border-2 border-[#3d291a] bg-[#d4a373] px-2 py-1 text-[10px] font-black text-[#3d291a] shadow transition-colors hover:bg-[#e5be82] sm:px-4 sm:text-xs"
            >
              {isComplete ? 'Jugar otra vez' : '¡Empezar!'}
            </button>
          ) : <span className="w-[62px] sm:w-[88px]" />}
        </div>

        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-[#3d291a] bg-gradient-to-b from-[#b9d8c5] via-[#e5d8a9] to-[#c58a5d] sm:rounded-2xl"
          style={{ backgroundImage: 'linear-gradient(to bottom, #b9d8c5 0%, #e5d8a9 68%, #c58a5d 100%)' }}
        >
          <div className="pointer-events-none absolute right-8 top-24 h-16 w-16 rounded-full bg-[#fdf6e3]/70 shadow-[0_0_35px_rgba(253,246,227,0.6)] sm:right-16 sm:top-28 sm:h-20 sm:w-20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-t-[50%] bg-[#718d5c]/70" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-3/5 rounded-[50%] bg-[#55724b]/75" />
          <div className="pointer-events-none absolute -bottom-10 -right-8 h-28 w-3/5 rounded-[50%] bg-[#8d7650]/75" />

          {displayFeedback && (
            <div className="pointer-events-none absolute left-1/2 top-[38%] z-30 -translate-x-1/2 rounded-lg border-2 border-[#3d291a] bg-[#fdf6e3]/90 px-4 py-2 text-center text-sm font-black tracking-widest text-[#3d291a] shadow-md sm:text-xl">
              {displayFeedback}
            </div>
          )}

          {/* One shared note track runs across the top of the stage. */}
          <div className="absolute inset-x-2 top-2 h-20 overflow-hidden rounded-lg border-2 border-[#3d291a] bg-[#fdf6e3]/75 shadow-inner sm:inset-x-4 sm:top-4 sm:h-24">
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-[#a36a3e]/60" />

            <div className="absolute left-[10%] top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] shadow-[0_0_0_3px_rgba(61,41,26,0.12)] transition-colors sm:h-12 sm:w-12 ${
                pressedLanes.some(Boolean)
                  ? 'border-[#3d291a] bg-[#3d291a] text-[#fdf6e3]'
                  : 'border-[#a36a3e] bg-[#d4a373] text-[#3d291a]'
              }`}>
                <span className="text-base font-black sm:text-lg">♪</span>
              </div>
              <span className="rounded bg-[#3d291a] px-1.5 text-[8px] font-black uppercase tracking-wide text-[#fdf6e3] sm:text-[9px]">
                Input
              </span>
            </div>

            {isPlaying && activeNotes
              .filter((note) => !note.hit && !note.missed)
              .map((note) => {
                const timeDiff = note.time - elapsedTime;
                if (timeDiff > 2000) return null;

                const leftPosition = 98 - ((2000 - timeDiff) / 2000) * 88;
                const lane = LANES[note.lane];

                return (
                  <div
                    key={note.id}
                    className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border-2 border-[#fdf6e3] bg-[#3d291a] text-lg font-black text-[#fdf6e3] shadow-md sm:h-10 sm:w-10"
                    style={{ left: `${leftPosition}%` }}
                  >
                    {lane.label}
                  </div>
                );
              })}
          </div>

          {CHARACTER_ZONES.map((character) => (
            <div
              key={character.name}
              className={`absolute bottom-3 z-10 flex w-24 flex-col items-center rounded-xl border-2 border-[#3d291a]/70 bg-[#fdf6e3]/70 px-2 pt-1 shadow-md sm:bottom-5 sm:w-32 sm:px-3 ${
                character.side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
              }`}
            >
              <img
                src={character.image}
                alt={character.name}
                className="h-20 w-full object-contain drop-shadow-[2px_3px_0px_rgba(61,41,26,0.35)] sm:h-28"
              />
              <span className="pb-1 text-[10px] font-black uppercase tracking-wider text-[#3d291a] sm:text-xs">
                {character.name}
              </span>
            </div>
          ))}

          {canCollectReward && (
            <button
              type="button"
              aria-label={`Recoger fragmento de ${rewardShardId === 'kiran' ? 'Kiran' : 'Zora'}`}
              title="Recoger fragmento"
              onClick={() => onCollectShard?.(rewardShardId)}
              className="absolute bottom-2 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fdf6e3] sm:bottom-4 sm:h-12 sm:w-12"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full drop-shadow-[0_0_8px_rgba(204,24,48,0.9)]">
                <path d="M12 1.5 20 6l2.5 8-10.5 8.5L1.5 14 4 6z" fill="#b51227" stroke="#e5be82" strokeWidth="1.2" />
                <path d="m4 6 8 2.3L20 6M12 8.3v14.2M4 6l4 8 4-5.7 4 5.7 4-8" fill="none" stroke="#f16b75" strokeWidth="0.8" />
              </svg>
            </button>
          )}
        </div>

        <div className="rhythm-mobile-controls" aria-label="Controles táctiles">
          {LANES.map((lane, index) => (
            <button
              key={lane.code}
              type="button"
              aria-label={`Dirección ${lane.label}`}
              disabled={!isPlaying}
              onClick={() => hitLane(index)}
              onPointerDown={() => setPressedLanes((current) => current.map((pressed, laneIndex) => laneIndex === index || pressed))}
              onPointerUp={() => setPressedLanes((current) => current.map((pressed, laneIndex) => laneIndex === index ? false : pressed))}
              onPointerCancel={() => setPressedLanes((current) => current.map((pressed, laneIndex) => laneIndex === index ? false : pressed))}
              className={`flex h-14 flex-1 touch-manipulation items-center justify-center rounded-xl border-2 border-[#3d291a] text-2xl font-black shadow-[3px_3px_0px_#3d291a] disabled:opacity-50 ${
                pressedLanes[index] ? 'bg-[#3d291a] text-[#fdf6e3]' : 'bg-[#d4a373] text-[#3d291a]'
              }`}
            >
              {lane.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rhythm-rotation-gate" role="status">
        <div className="max-w-xs rounded-2xl border-4 border-[#3d291a] bg-[#fdf6e3] p-6 text-center text-[#3d291a] shadow-[6px_6px_0px_rgba(0,0,0,0.4)]">
          <p className="text-4xl" aria-hidden="true">↻</p>
          <h2 className="mt-3 text-lg font-black uppercase">Gira tu teléfono</h2>
          <p className="mt-2 text-sm">El juego está diseñado para jugarse en horizontal y a pantalla completa.</p>
          {orientationNotice && <p className="mt-3 text-xs font-bold text-[#8b3a24]">{orientationNotice}</p>}
        </div>
      </div>
    </div>
  );
}