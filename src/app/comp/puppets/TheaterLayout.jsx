import { useState } from 'react';
import { HeartRelic } from '../common/HeartRelic';

export function TheaterLayout({
  children,
  activeTab,
  setActiveTab,
  collectedShardIds,
  isUnlocked = false,
  onLocketClick,
  puppetOverlay,
}) {
  const [isCurtainClosing, setIsCurtainClosing] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab || isCurtainClosing) return;
    
    setIsCurtainClosing(true);

    setTimeout(() => {
      setActiveTab(newTab);
    }, 600);

    setTimeout(() => {
      setIsCurtainClosing(false);
    }, 1200);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'novela', label: 'La Novela' },
    { id: 'personajes', label: 'Personajes' },
    { id: 'minijuegos', label: 'Minijuegos' },
    { id: 'correo', label: 'Correo' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1c1917] select-none">
      
      {/* TELÓN IZQUIERDO */}
      <div 
        className={`fixed top-0 left-0 w-[53%] h-full z-50 transition-transform duration-700 ease-in-out filter drop-shadow-[12px_0_15px_rgba(0,0,0,0.8)] ${
          isCurtainClosing 
            ? 'translate-x-0 pointer-events-auto' 
            : '-translate-x-full pointer-events-none'
        }`}
      >
        <div 
          className="w-full h-full"
          style={{
            background: 'repeating-linear-gradient(90deg, #580c0c 0px, #991b1b 25px, #7f1d1d 40px, #450a0a 65px, #991b1b 90px)',
          }}
        />
        <svg className="absolute top-0 right-0 h-full w-8 text-[#991b1b] translate-x-full" viewBox="0 0 30 1000" preserveAspectRatio="none">
          <path 
            d="M 0 0 C 25 50, 0 100, 20 150 C 0 200, 25 250, 0 300 C 25 350, 0 400, 20 450 C 0 500, 25 550, 0 600 C 25 650, 0 700, 20 750 C 0 800, 25 850, 0 900 C 25 950, 0 1000, 0 1000 L 0 0 Z" 
            fill="currentColor"
            stroke="#d4a373"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* TELÓN DERECHO */}
      <div 
        className={`fixed top-0 right-0 w-[53%] h-full z-50 transition-transform duration-700 ease-in-out filter drop-shadow-[-12px_0_15px_rgba(0,0,0,0.8)] ${
          isCurtainClosing 
            ? 'translate-x-0 pointer-events-auto' 
            : 'translate-x-full pointer-events-none'
        }`}
      >
        <div 
          className="w-full h-full"
          style={{
            background: 'repeating-linear-gradient(90deg, #991b1b 0px, #450a0a 25px, #7f1d1d 50px, #991b1b 75px, #580c0c 90px)',
          }}
        />
        <svg className="absolute top-0 left-0 h-full w-8 text-[#991b1b] -translate-x-full" viewBox="0 0 30 1000" preserveAspectRatio="none">
          <path 
            d="M 30 0 C 5 50, 30 100, 10 150 C 30 200, 5 250, 30 300 C 5 350, 30 400, 10 450 C 30 500, 5 550, 30 600 C 5 650, 30 700, 10 750 C 30 800, 5 850, 30 900 C 5 950, 30 1000, 30 1000 L 30 0 Z" 
            fill="currentColor"
            stroke="#d4a373"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* FALDÓN SUPERIOR DE ADORNO */}
      <div className="absolute top-0 left-0 right-0 h-16 z-30 pointer-events-none filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">
        <div 
          className="w-full h-10"
          style={{
            background: 'repeating-linear-gradient(180deg, #450a0a 0%, #991b1b 60%, #7f1d1d 100%)',
          }}
        />
        <svg className="w-full h-6 text-[#7f1d1d] -mt-1" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path 
            d="M 0 0 Q 75 35, 150 0 Q 225 35, 300 0 Q 375 35, 450 0 Q 525 35, 600 0 Q 675 35, 750 0 Q 825 35, 900 0 Q 975 35, 1050 0 Q 1125 35, 1200 0 L 1200 0 L 0 0 Z" 
            fill="currentColor"
            stroke="#d4a373"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* HEADER DE BOTONES */}
      <header className="route-navigation absolute top-10 left-0 right-0 z-40 flex justify-start md:justify-center gap-2 md:gap-6 pointer-events-auto overflow-x-auto md:overflow-visible px-2 md:px-0">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative flex shrink-0 flex-col items-center">
              {/* Cuerdita decorativa superior */}
              <div className="absolute -top-10 w-0.5 h-10 bg-[#a36a3e] border-r border-[#3d291a] pointer-events-none" />
              
              <button
                type="button"
                onClick={() => handleTabChange(item.id)}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={`relative z-50 px-3.5 py-1.5 md:px-5 md:py-2 font-black text-xs md:text-sm uppercase rounded-lg border-2 border-[#3d291a] transition-all duration-300 cursor-pointer ${
                  isCurtainClosing ? '-translate-y-28 opacity-0' : 'translate-y-0 opacity-100'
                } ${
                  isActive 
                    ? 'bg-[#fdf6e3] text-[#3d291a] shadow-[3px_4px_0px_#3d291a] -translate-y-0.5' 
                    : 'bg-[#d4a373] text-[#2c1a0e] opacity-90 hover:opacity-100 hover:-translate-y-0.5 shadow-[2px_2px_0px_#3d291a]'
                }`}
              >
                {item.label}
              </button>
            </div>
          );
        })}
      </header>

      <HeartRelic
        collectedShardIds={collectedShardIds}
        isUnlocked={isUnlocked}
        onUnlockClick={onLocketClick}
      />

      {/* VISTA CONTENIDO CON SCROLL FLUIDO */}
      <main className="w-full h-full pt-28 pb-8 px-2 md:px-6 overflow-y-auto box-border">
        {children}
      </main>

      {puppetOverlay}

    </div>
  );
}
export default TheaterLayout;