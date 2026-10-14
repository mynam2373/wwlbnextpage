import { useState } from 'react';

export function CharacterView({ initialCharacterId = 'kiran' }) {
  const characters = [
    {
      id: 'kiran',
      name: 'Kiran',
      role: 'Paladín',
      archetype: 'Speedster / Espadachín',
      weapon: 'Manejo de energía propia y espada',
      description: 'Ágil y veloz. Canaliza su propia energía vital para potenciar sus ataques en combate.',
      imageName: 'kiran'
    },
    {
      id: 'caleb',
      name: 'Caleb',
      role: 'Berserker',
      archetype: 'Tanque',
      weapon: 'Hacha pesada',
      description: 'Fuerza bruta y contención en la primera línea de batalla.',
      imageName: 'caleb'
    },
    {
      id: 'lin',
      name: 'Lin',
      role: 'Druida',
      archetype: 'Control de Naturaleza',
      weapon: 'Espadas luna, cuchillos y creaciones naturales',
      description: 'Utiliza elementos de la naturaleza como una extensión directa de sí misma.',
      imageName: 'lin'
    },
    {
      id: 'isabel',
      name: 'Isabel',
      role: 'Comodín',
      archetype: 'Agilista táctica',
      weapon: 'Armas largas y maniobrables',
      description: 'Se destaca por su agilidad versátil en combate y rápida adaptación.',
      imageName: 'isabel'
    },
    {
      id: 'dahya',
      name: 'Dahya',
      role: 'Bárbara',
      archetype: 'Control / Rogue',
      weapon: 'Fuerza física pura (Rara vez usa armas)',
      description: 'Su desbordante fuerza bruta es más que suficiente para dominar a sus oponentes.',
      imageName: 'dahya'
    },
    {
      id: 'zora',
      name: 'Zora',
      role: 'Encantadora',
      archetype: 'Barda / Encantamientos',
      weapon: 'Plumas de acero afiladas',
      description: 'Especialista en encantamientos representados a través de plumas afiladas.',
      imageName: 'zora'
    }
  ];

  const [activeId, setActiveId] = useState(initialCharacterId);
  const selectedChar = characters.find((c) => c.id === activeId) || characters[0];

  return (
    <div className="relative w-full h-full max-w-5xl mx-auto p-4 flex flex-col items-center z-10 overflow-y-auto">
      
      {/* NAVEGADOR SUPERIOR DE PERSONAJES */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {characters.map((char) => {
          const isSelected = char.id === activeId;
          return (
            <button
              key={char.id}
              onClick={() => setActiveId(char.id)}
              className={`px-3 py-1.5 rounded-md font-bold text-xs uppercase transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-[#3d291a] text-[#fdf6e3] border-[#3d291a] scale-105 shadow-md'
                  : 'bg-[#fdf6e3] text-[#3d291a] border-[#3d291a] hover:bg-[#d4a373]'
              }`}
            >
              {char.name}
            </button>
          );
        })}
      </div>

      {/* FICHA TIPO RETABLO / CARTÓN DE TEATRO */}
      <div className="w-full bg-[#fdf6e3] border-4 border-[#3d291a] rounded-xl p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-6 items-center md:items-start">
        
        {/* RETRATO Y MARCO DEL TÍTERE */}
        <div className="flex flex-col items-center">
          <div 
            className="relative bg-[#d4a373] p-4 border-2 border-[#3d291a] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex items-center justify-center w-48 h-48"
            style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 90%, 90% 100%, 10% 98%, 0% 90%)',
            }}
          >
            <div className="absolute inset-0 bg-[#c29263] opacity-25 mix-blend-multiply pointer-events-none" />
            <img
              src={`/assets/puppets/${selectedChar.imageName}.png`}
              alt={selectedChar.name}
              className="w-36 h-36 object-contain relative z-10 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.3)]"
            />
          </div>

          <span className="mt-3 bg-[#3d291a] text-[#fdf6e3] font-black text-sm uppercase px-3 py-0.5 rounded shadow">
            {selectedChar.role}
          </span>
        </div>

        {/* DETALLES DEL PERSONAJE */}
        <div className="flex-1 flex flex-col justify-between text-[#3d291a]">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wide border-b-2 border-[#3d291a] pb-1 mb-3">
              {selectedChar.name}
            </h2>
            
            <p className="text-sm font-semibold text-[#6b4f38] leading-relaxed mb-4">
              {selectedChar.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#e6ccb2]/40 p-3 rounded-lg border border-[#3d291a]/30 mb-4">
              <div>
                <span className="font-extrabold uppercase text-[#3d291a] block">Rol / Arquetipo:</span>
                <span className="font-bold text-[#6b4f38]">{selectedChar.archetype}</span>
              </div>
              <div>
                <span className="font-extrabold uppercase text-[#3d291a] block">Arma preferida:</span>
                <span className="font-bold text-[#6b4f38]">{selectedChar.weapon}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] italic text-[#6b4f38] text-right font-medium">
            Mundo de Vesteria — What We Left Behind
          </div>
        </div>

      </div>
    </div>
  );
}