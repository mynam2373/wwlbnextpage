import { useState } from 'react';

export function VesteriaMap({ onSelectPoint, alternateMode = false }) {
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [showAllLore, setShowAllLore] = useState(false);

  if (alternateMode) {
    return (
      <div className="mb-28 w-full rounded-xl border-4 border-[#3d291a] bg-black p-3 shadow-[8px_8px_0px_#1a1412]">
        <div
          aria-label="Mapa censurado de Vesteria"
          className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg border-2 border-[#3d291a] bg-black"
        >
          <div
            aria-hidden="true"
            className="h-36 w-36 rounded-full"
            style={{
              background: 'repeating-radial-gradient(circle, transparent 0 10px, #cf123c 11px 16px, transparent 17px 23px)',
              animation: 'alternate-heartbeat 1.8s ease-in-out 2s infinite',
              filter: 'drop-shadow(0 0 18px rgba(207,18,60,0.75))',
            }}
          />
        </div>
      </div>
    );
  }

  // Regiones meet at a small center to form an X across the mainland.
  const regions = [
    {
      id: 'centro',
      name: 'El Núcleo Oscuro',
      label: 'Núcleo',
      labelX: 310,
      labelY: 152,
      labelSize: 5,
      color: '#2a2421',
      strokeColor: '#5c4d44',
      path: 'M 310 132 A 18 18 0 1 1 310 168 A 18 18 0 1 1 310 132 Z',
      points: [
        { id: 'black_lake', name: 'The Black Lake (El Lago Negro)', desc: 'Vertedero de desechos pesados y sitio de solemnes rituales funerarios.' },
        { id: 'orbe_negro', name: 'El Orbe Negro', desc: 'Masa colosal suspendida en el aire sobre el lago, eje de navegación visual.' }
      ]
    },
    {
      id: 'norte',
      name: 'Grimefield (Riscos e Islas)',
      label: 'Grimefield',
      labelX: 310,
      labelY: 91,
      color: '#4d612c',
      strokeColor: '#6c873f',
      path: 'M 232 55 C 244 45, 254 41, 269 43 C 283 34, 297 41, 311 38 C 326 35, 339 42, 353 39 C 370 37, 386 45, 397 54 L 323 137 Q 310 124 297 137 Z',
      points: [
        { id: 'ratsnest', name: 'Ratsnest', desc: 'Red amurallada de mercenarios y aventureros orgullosos de sobrevivir en el fango.' },
        { id: 'islas_flotantes', name: 'Las Islas Flotantes', desc: 'Santuarios aéreos para fauna alada elevados por corrientes térmicas.' },
        { id: 'vesta_surcacielos', name: 'Gremio de los Surcacielos', desc: 'Patrullas aéreas con mini-zepelines y arpones pesados.' },
        { id: 'el_vasto', name: 'The Vast (El Vasto)', desc: 'Zonas no cartografiadas ni exploradas de la frontera norte.' }
      ]
    },
    {
      id: 'sur',
      name: 'Shiftinghale (Mar Dorado)',
      label: 'Shiftinghale',
      labelX: 310,
      labelY: 220,
      color: '#c2935b',
      strokeColor: '#e0b077',
      path: 'M 406 243 L 395 248 L 387 242 L 376 252 L 364 248 L 354 259 L 342 253 L 332 265 L 318 259 L 306 272 L 292 264 L 279 274 L 265 266 L 252 273 L 239 264 L 226 268 L 220 258 L 210 246 L 297 163 Q 310 176 323 163 Z',
      points: [
        { id: 'whispermouth', name: 'Whispermouth', desc: 'Puerto principal y astillero oculto dentro de cavernas costeras.' },
        { id: 'naves_de_arena', name: 'Naves de Arena', desc: 'Navíos de chatarra diseñados para "navegar" las dunas profundas.' },
        { id: 'cultura_marinera', name: 'Cultura Marinera y Contrabando', desc: 'Navegantes y chatarreros que operan el mercado clandestino.' }
      ]
    },
    {
      id: 'oeste',
      name: 'Claymoore (Arcilla)',
      label: 'Claymoore',
      labelX: 231,
      labelY: 153,
      color: '#8c4843',
      strokeColor: '#b85e56',
      path: 'M 210 246 C 196 235, 191 222, 182 211 C 176 197, 187 188, 180 174 C 173 160, 184 151, 177 137 C 171 122, 186 111, 188 94 C 191 77, 215 72, 232 55 L 297 137 Q 284 150 297 163 Z',
      points: [
        { id: 'dawnveil', name: 'Dawnveil (La Ciudad de Kiran)', desc: 'Metrópolis rústica de arcilla y terracota inspirada en el Héroe del Sol.' },
        { id: 'autopista_fluvial', name: 'La Autopista Fluvial', desc: 'Canales navegables que conectan el interior con el mar exterior.' },
        { id: 'periferia_comunidades', name: 'Comunidades de la Periferia', desc: 'Refugios en montes de ingenieros, mecánicos y químicos de élite.' },
        { id: 'pantano_recluido', name: 'El Pantano Recluido', desc: 'Hogar denso y ancestral de los antiguos druidas.' }
      ]
    },
    {
      id: 'este',
      name: 'Rimepeak (Frontera Helada)',
      label: 'Rimepeak',
      labelX: 382,
      labelY: 153,
      color: '#4a6fa5',
      strokeColor: '#7097d1',
      path: 'M 397 54 C 410 63, 412 74, 423 81 C 437 92, 426 106, 438 119 C 449 133, 435 146, 443 159 C 451 175, 435 187, 439 200 C 444 217, 426 230, 406 243 L 323 163 Q 336 150 323 137 Z',
      points: [
        { id: 'rios_salvajes', name: 'Los Ríos Salvajes', desc: 'Torrenciales de agua helada que actúan como barrera natural.' },
        { id: 'condiciones_extremas', name: 'Refugios Subterráneos', desc: 'Valles y grutas donde las comunidades se protegen del viento helado.' }
      ]
    },
    {
      id: 'marblerest',
      name: 'Marblerest (Isla Exterior)',
      label: 'Marblerest',
      labelX: 55,
      labelY: 152,
      labelSize: 5,
      color: '#a3b18a',
      strokeColor: '#c2d4a8',
      path: 'M 55 128 A 24 24 0 1 1 55 176 A 24 24 0 1 1 55 128 Z',
      points: [
        { id: 'santuario_marmol', name: 'El Santuario de Mármol', desc: 'Comunidad pacífica de arquitectura clásica con tecnología disimulada.' }
      ]
    }
  ];

  const handleSelectRegion = (region) => {
    setSelectedRegionId(selectedRegionId === region.id ? null : region.id);
  };

  const selectedRegion = regions.find(r => r.id === selectedRegionId);

  return (
    <div className="w-full flex flex-col items-center max-w-3xl bg-[#2a2118] p-3 rounded-xl border-4 border-[#3d291a] shadow-[8px_8px_0px_#1a1412] text-[#fdf6e3] mb-28">
      
      {/* MAPA CONTINUO SVG */}
      <div
        className="relative w-full aspect-[16/9] rounded-lg border-2 border-[#3d291a] overflow-hidden flex items-center justify-center p-2 shadow-inner"
        style={{
          backgroundColor: '#5b99ad',
          backgroundImage: 'radial-gradient(ellipse at 20% 18%, rgba(213, 239, 235, 0.27), transparent 45%), radial-gradient(ellipse at 83% 80%, rgba(12, 66, 91, 0.22), transparent 48%), repeating-linear-gradient(168deg, transparent 0 16px, rgba(231, 247, 240, 0.11) 17px 18px, transparent 19px 34px)',
        }}
      >
        <svg viewBox="0 0 520 300" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)]">
          {regions.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <g key={reg.id} className="cursor-pointer group" onClick={() => handleSelectRegion(reg)}>
                <path
                  d={reg.path}
                  fill={reg.color}
                  stroke={isSelected ? '#fdf6e3' : reg.strokeColor}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  className={`transition-all duration-300 ${
                    isSelected ? 'opacity-100 filter brightness-125' : 'opacity-90 hover:opacity-100 hover:brightness-110'
                  }`}
                />
                <text
                  x={reg.labelX}
                  y={reg.labelY}
                  textAnchor="middle"
                  fill="#fdf6e3"
                  fontSize={reg.labelSize ?? '9'}
                  fontWeight="bold"
                  className="pointer-events-none uppercase tracking-wider"
                  style={{ textShadow: '1px 1px 3px #000' }}
                >
                  {reg.label}
                </text>
              </g>
            );
          })}
        </svg>

        {!selectedRegion && (
          <div className="absolute top-3 left-3 bg-[#3d291a]/90 text-[#fdf6e3] text-[10px] px-2.5 py-1 rounded border border-[#d4a373]">
            Haz clic en una región del continente para explorar
          </div>
        )}
      </div>

      {/* DETALLES DE LA REGIÓN SELECCIONADA */}
      {selectedRegion && !showAllLore && (
        <div className="w-full mt-3 bg-[#3d291a] p-3 rounded-lg border-2 border-[#d4a373] animate-fade-in">
          <div className="flex justify-between items-center mb-2 border-b border-[#6b4f38] pb-1">
            <h3 className="text-xs font-black uppercase text-[#e5be82] tracking-wider">
              📍 {selectedRegion.name}
            </h3>
            <button 
              onClick={() => setSelectedRegionId(null)}
              className="text-[10px] bg-[#2a2118] px-2 py-0.5 rounded text-[#d4a373] hover:text-white"
            >
              Cerrar ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedRegion.points.map((pt) => (
              <div 
                key={pt.id} 
                onClick={() => onSelectPoint && onSelectPoint(pt)}
                className="bg-[#2a2118] p-2 rounded border border-[#553c2a] hover:border-[#e5be82] cursor-pointer transition-colors"
              >
                <p className="text-xs font-bold text-[#fdf6e3]">{pt.name}</p>
                <p className="text-[10px] text-[#c2a68c] mt-0.5">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTÓN VESTERIA */}
      <button
        onClick={() => setShowAllLore(!showAllLore)}
        className="mt-3 bg-[#d4a373] hover:bg-[#e5be82] text-[#3d291a] font-black text-xs uppercase px-5 py-1.5 rounded-lg border-2 border-[#3d291a] shadow-[2px_2px_0px_#1a1412] transition-all"
      >
        🏰 {showAllLore ? 'Ocultar Detalle' : 'Vesteria (Desplegar Todo)'}
      </button>

      {/* GLOSARIO COMPLETO */}
      {showAllLore && (
        <div className="w-full mt-3 bg-[#3d291a] p-4 rounded-lg border-2 border-[#d4a373] text-left text-xs leading-relaxed space-y-3">
          <section>
            <h4 className="text-xs font-black text-[#e5be82] uppercase mb-1">🗺️ El Mundo de Vesteria</h4>
            <p className="text-[#d8c3b0] text-[11px]">
              Vesteria es un continente cerrado con estructura de Pangea donde biomas drásticamente opuestos coexisten en parches definidos sin superponerse.
            </p>
          </section>

          {regions.map((reg) => (
            <section key={reg.id} className="border-t border-[#553c2a] pt-2">
              <h5 className="font-bold text-[#fdf6e3] uppercase text-[11px] mb-0.5">
                • {reg.name}
              </h5>
              <ul className="list-disc list-inside space-y-0.5 text-[#c2a68c] text-[10px]">
                {reg.points.map((pt) => (
                  <li key={pt.id}>
                    <strong className="text-[#e5be82]">{pt.name}:</strong> {pt.desc}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}