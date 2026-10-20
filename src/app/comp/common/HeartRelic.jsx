import { useEffect, useRef, useState } from 'react';
import { HEART_SHARDS } from '../../data/heartShards';

const HEART_SHAPE = 'M 100 184 C 76 163 8 119 5 70 C 2 34 31 13 60 17 C 79 20 93 35 100 51 C 107 35 121 20 140 17 C 169 13 198 34 195 70 C 192 119 124 163 100 184 Z';

const SHARD_FACETS = [
  'M 0 12 L 55 12 L 78 31 L 87 47 L 65 72 L 25 72 L 4 58 Z',
  'M 55 12 L 84 17 L 100 51 L 87 73 L 65 72 L 87 47 L 78 31 Z',
  'M 116 17 L 145 12 L 122 31 L 113 47 L 135 72 L 113 73 L 100 51 Z',
  'M 145 12 L 200 12 L 196 58 L 175 72 L 135 72 L 113 47 L 122 31 Z',
  'M 4 58 L 25 72 L 65 72 L 76 101 L 38 113 L 8 92 Z',
  'M 65 72 L 87 73 L 100 51 L 100 96 L 76 101 Z',
  'M 100 51 L 113 73 L 135 72 L 124 101 L 100 96 Z',
  'M 135 72 L 175 72 L 196 58 L 192 92 L 162 113 L 124 101 Z',
  'M 8 92 L 38 113 L 76 101 L 100 96 L 100 143 L 78 174 L 55 145 Z',
  'M 192 92 L 162 113 L 124 101 L 100 96 L 100 143 L 122 174 L 145 145 Z',
];

export function HeartRelic({
  collectedShardIds = [],
  isUnlocked = false,
  onUnlockClick,
}) {
  const [activeShardId, setActiveShardId] = useState(null);
  const collectedIds = new Set(collectedShardIds);
  const hasStarted = collectedIds.size > 0;
  const isComplete = collectedIds.size === HEART_SHARDS.length;
  const activeShard = HEART_SHARDS.find((shard) => shard.id === activeShardId);
  const wasComplete = useRef(isComplete);
  const [isFillingComplete, setIsFillingComplete] = useState(false);

  useEffect(() => {
    if (!isComplete) {
      wasComplete.current = false;
      setIsFillingComplete(false);
      return undefined;
    }

    if (wasComplete.current) return undefined;

    wasComplete.current = true;
    setIsFillingComplete(true);
    const timeoutId = window.setTimeout(() => setIsFillingComplete(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [isComplete]);

  const showHint = (shard) => setActiveShardId(shard.id);

  return (
    <div className="fixed top-1 left-1/2 z-[45] flex -translate-x-1/2 items-center justify-center">
      {activeShard && !isUnlocked && (
        <aside
          role="status"
          className="absolute left-1/2 top-full mt-2 w-60 -translate-x-1/2 rounded border-2 border-[#d4a373] bg-[#2a2118] p-3 text-[#fdf6e3] shadow-[3px_3px_0px_#1a1412]"
        >
          <div className="mb-1 flex items-center justify-between gap-3">
            <h2 className="text-[10px] font-black uppercase text-[#e5be82]">
              {collectedIds.has(activeShard.id) ? activeShard.title : 'Pista'}
            </h2>
            <button
              type="button"
              aria-label="Cerrar pista"
              onClick={() => setActiveShardId(null)}
              className="text-sm leading-none text-[#d4a373] hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="text-xs leading-relaxed text-[#d8c3b0]">
            {collectedIds.has(activeShard.id) ? 'Fragmento recuperado.' : activeShard.hint}
          </p>
        </aside>
      )}
      <svg
        aria-hidden="true"
        viewBox="0 0 56 12"
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-3 w-14 -translate-x-1/2 overflow-visible"
      >
        <path d="M 1 0 C 5 5 13 7 22 8 M 55 0 C 51 5 43 7 34 8" fill="none" stroke="#211713" strokeLinecap="round" strokeWidth="4" />
        <path d="M 1 0 C 5 5 13 7 22 8 M 55 0 C 51 5 43 7 34 8" fill="none" stroke="#a36a3e" strokeLinecap="round" strokeWidth="2.5" />
        <path d="M 1 0 C 5 5 13 7 22 8 M 55 0 C 51 5 43 7 34 8" fill="none" stroke="#f0c982" strokeDasharray="1 4" strokeLinecap="round" strokeWidth="1.2" />
        <circle cx="22" cy="8" r="1.5" fill="#e5be82" />
        <circle cx="34" cy="8" r="1.5" fill="#e5be82" />
      </svg>

      <div className="relative z-10 flex flex-col items-center drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
        <svg
          viewBox="0 0 200 190"
          role="group"
          aria-label={`Corazón: ${collectedIds.size} de ${HEART_SHARDS.length} fragmentos recuperados`}
          className="h-11 w-11 overflow-visible md:h-8 md:w-8"
        >
          <defs>
            <clipPath id="heart-relic-shape">
              <path d={HEART_SHAPE} />
            </clipPath>
            <linearGradient id="heart-relic-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f04452" />
              <stop offset="48%" stopColor="#b51227" />
              <stop offset="100%" stopColor="#690b1b" />
            </linearGradient>
            <linearGradient id="heart-relic-black" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#353033" />
              <stop offset="100%" stopColor="#100e11" />
            </linearGradient>
          </defs>
          <style>{`@keyframes heart-relic-fill { 0% { fill: #100e11; filter: brightness(0.55); } 65% { fill: #f04452; filter: brightness(1.5); } 100% { fill: #b51227; filter: brightness(1); } }`}</style>

          <path d={HEART_SHAPE} fill="#21080d" />
          <g clipPath="url(#heart-relic-shape)">
            {HEART_SHARDS.map((shard, index) => {
              const isCollected = collectedIds.has(shard.id);
              const isLocked = hasStarted && !isCollected;
              const isInteractive = hasStarted && !isUnlocked;

              return (
                <path
                  key={shard.id}
                  d={SHARD_FACETS[index]}
                  fill={isLocked ? 'url(#heart-relic-black)' : 'url(#heart-relic-red)'}
                  stroke={isLocked ? '#625a5c' : '#e5be82'}
                  strokeWidth="1.5"
                  role={isInteractive ? 'button' : 'img'}
                  tabIndex={isInteractive ? 0 : -1}
                  aria-label={isCollected ? `${shard.title}, recuperado` : `Pista: ${shard.title}`}
                  className={isInteractive ? 'cursor-pointer transition-colors duration-300 focus:outline-none' : ''}
                  style={isFillingComplete ? {
                    animation: 'heart-relic-fill 450ms ease-out both',
                    animationDelay: `${index * 95}ms`,
                  } : undefined}
                  onClick={isInteractive ? () => showHint(shard) : undefined}
                  onKeyDown={isInteractive ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      showHint(shard);
                    }
                  } : undefined}
                />
              );
            })}
          </g>
          <path d={HEART_SHAPE} fill="none" stroke="#d4a373" strokeWidth="3" />
          <path d="M 28 45 Q 35 27 53 27" fill="none" stroke="#fff0d4" strokeLinecap="round" strokeWidth="3" opacity="0.55" />
        </svg>
        {isUnlocked && (
          <button
            type="button"
            onClick={onUnlockClick}
            aria-label="Abrir el Locket y continuar"
            title="El Locket está completo. Haz clic para ir a Inicio o entrar al modo alternativo."
            className="absolute inset-0 z-20 cursor-pointer touch-manipulation rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f04452]"
            style={{ animation: 'heart-relic-pulse 1.1s ease-in-out infinite' }}
          />
        )}
      </div>
      <style>{`@keyframes heart-relic-pulse { 0%, 100% { filter: drop-shadow(0 0 2px #f04452); } 50% { filter: drop-shadow(0 0 12px #f04452); } }`}</style>
    </div>
  );
}