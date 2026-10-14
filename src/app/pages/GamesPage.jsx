import { useState } from 'react';
import { RhythmGameView } from '../view/minijuegos/RhythmGameView';

export function GamesPage({ collectedShardIds = [], onCollectShard }) {
  const [activeGame, setActiveGame] = useState(null); // null = menú principal de juegos

  // Si seleccionó el juego de ritmo, mostramos RhythmGameView
  if (activeGame === 'rhythm') {
    return (
      <RhythmGameView
        onBack={() => setActiveGame(null)}
        collectedShardIds={collectedShardIds}
        onCollectShard={onCollectShard}
      />
    );
  }

  // Menú de Selección de Minijuegos
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 z-10">
      <h1 className="text-2xl font-black text-[#3d291a] uppercase mb-6">
        Minijuegos de Vesteria
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* TARJETA DEL JUEGO DE RITMO */}
        <button
          onClick={() => setActiveGame('rhythm')}
          className="bg-[#fdf6e3] border-4 border-[#3d291a] p-6 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,0.4)] hover:scale-105 hover:bg-[#d4a373]/20 transition-all text-left flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#a36a3e] tracking-wider">
              Zora & Isabel
            </span>
            <h2 className="text-xl font-black text-[#3d291a] uppercase mt-1">
              Lección de Batuta
            </h2>
            <p className="text-xs text-[#6b4f38] mt-2">
              Juego de ritmo. Sigue el compás marcando las flechas en el momento exacto.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-[#3d291a] underline">
            ¡Jugar ahora →
          </span>
        </button>

        {/* PROXIMO MINIJUEGO (KIRAN RUNNER) */}
        <div className="bg-[#fdf6e3]/50 border-4 border-[#3d291a]/40 p-6 rounded-2xl opacity-60 text-left flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#6b4f38]">
              Kiran
            </span>
            <h2 className="text-xl font-black text-[#3d291a] uppercase mt-1">
              La Carrera de Kiran
            </h2>
            <p className="text-xs text-[#6b4f38] mt-2">
              Próximamente...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}