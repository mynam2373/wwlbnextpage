
export function PuppetCharacter({ imageSrc, name, role, height = "h-36", onClick }) {
  return (
    <div 
      onClick={onClick}
      className="relative flex flex-col items-center group cursor-pointer select-none origin-bottom"
    >
      {/* TÍTERE CON ANIMACIÓN DE VAIVÉN */}
      <div className="relative z-10 animate-puppet-sway flex flex-col items-center">
        
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={name} 
            className={`${height} object-contain filter drop-shadow-[0_6px_4px_rgba(0,0,0,0.6)]`}
          />
        ) : (
          /* PEANA HEXAGONAL COMPACTA */
          <div 
            className="relative p-0.5 bg-[#3d291a] shadow-[3px_4px_0px_rgba(0,0,0,0.5)]"
            style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }}
          >
            <div 
              className="w-16 h-20 bg-[#d7a15c] border border-[#8a5a36]/40 flex flex-col items-center justify-center p-1 text-center relative overflow-hidden"
              style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' }}
            >
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#4a3728,#4a3728_2px,transparent_2px,transparent_6px)] pointer-events-none" />

              <span className="font-black text-[#3d291a] text-[10px] uppercase tracking-wider z-10 drop-shadow-sm leading-tight">
                {name}
              </span>
            </div>
          </div>
        )}

        {/* ETIQUETA CHICA */}
        {name && (
          <div className="mt-1 px-2 py-0.5 bg-[#f5e6c8] border border-[#3d291a] rounded-sm text-[#3d291a] font-black text-[9px] text-center shadow-[1px_2px_0px_#3d291a] z-20">
            {name}
            {role && <span className="block text-[7px] opacity-75 font-semibold tracking-tight">{role}</span>}
          </div>
        )}
      </div>

      {/* VARILLA / PALO DE TAMAÑO CONTROLADO */}
      <div className="w-1.5 bg-gradient-to-r from-[#734423] via-[#a36a3e] to-[#4d2d15] h-44 -mt-8 border-x border-[#3d291a] shadow-md z-0" />
    </div>
  );
}