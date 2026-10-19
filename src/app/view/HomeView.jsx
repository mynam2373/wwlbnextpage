// HomeView.jsx
import { useState } from 'react';

export function HomeView({ alternateMode = false }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* MARQUESINA DEL TÍTULO */}
      <div className={`relative flex flex-col items-center z-20 mt-2 ${alternateMode ? '' : 'animate-sign-swing'}`}>
        <div className="absolute -top-32 left-12 w-0.5 h-32 bg-[#a36a3e] border-r border-[#3d291a] z-0" />
        <div className="absolute -top-32 right-12 w-0.5 h-32 bg-[#a36a3e] border-r border-[#3d291a] z-0" />

        <div className={`relative border-4 p-4 rounded-xl max-w-xl text-center z-10 ${
          alternateMode
            ? 'border-[#7b1932] bg-black shadow-[6px_8px_0px_rgba(0,0,0,0.8)]'
            : 'border-[#3d291a] bg-[#fdf6e3] shadow-[6px_8px_0px_rgba(0,0,0,0.5)]'
        }`}>
          <div className="absolute -top-3 left-10 w-3 h-3 border-2 border-[#3d291a] bg-[#d4a373] rounded-full" />
          <div className="absolute -top-3 right-10 w-3 h-3 border-2 border-[#3d291a] bg-[#d4a373] rounded-full" />

          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-wider uppercase ${
            alternateMode ? 'text-black' : 'text-[#3d291a]'
          }`}>
            What We Left Behind
          </h1>
          <p className={`text-xs font-semibold mt-0.5 ${alternateMode ? 'text-black' : 'text-[#6b4f38]'}`}>
            Mundo de Vesteria
          </p>
        </div>
      </div>

      {selectedLocation && (
        <div className="w-full max-w-2xl bg-[#fdf6e3] border-4 border-[#3d291a] p-4 rounded-xl shadow-[6px_8px_0px_rgba(0,0,0,0.5)] my-2 z-10">
          <h3 className="font-extrabold text-[#3d291a] text-lg uppercase mb-1">
            {selectedLocation.title}
          </h3>
          <p className="text-xs text-[#6b4f38] font-medium italic">
            Espacio reservado para la información e imágenes de esta ubicación.
          </p>
        </div>
      )}
    </div>
  );
}