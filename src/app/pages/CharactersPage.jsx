import { useState } from 'react';
import { charactersData, secondaryCharactersData } from '../data/charactersData';
import { FIRST_SHARD_ID } from '../data/heartShards';

const allCharacters = [...charactersData, ...secondaryCharactersData];
const emptyImageSlots = [null, null, null, null];

export function CharactersPage({ collectedShardIds = [], onCollectShard }) {
  const [activeCategory, setActiveCategory] = useState('principal');
  const [selectedFichas, setSelectedFichas] = useState({});
  const [failedImages, setFailedImages] = useState({});

  const filteredCharacters = allCharacters.filter(
    (char) => char.category === activeCategory
  );

  const handleFichaChange = (charId, index) => {
    setSelectedFichas((prev) => ({
      ...prev,
      [charId]: index,
    }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-[#fdf6e3] space-y-6 pb-24">
      
      {/* 1. FILTRO SUPERIOR: PRINCIPALES / SECUNDARIOS */}
      <div className="flex justify-center gap-4 border-b-2 border-[#3d291a] pb-4">
        <button
          type="button"
          aria-pressed={activeCategory === 'principal'}
          onClick={() => setActiveCategory('principal')}
          className={`px-6 py-2 rounded-lg font-black uppercase text-xs md:text-sm border-2 border-[#3d291a] transition-all shadow-[3px_3px_0px_#1a1412] ${
            activeCategory === 'principal'
              ? 'bg-[#d4a373] text-[#3d291a] scale-105'
              : 'bg-[#2a2118] text-[#c2a68c] hover:bg-[#3d291a]'
          }`}
        >
          ⭐ Personajes Principales
        </button>
        <button
          type="button"
          aria-pressed={activeCategory === 'secundario'}
          onClick={() => setActiveCategory('secundario')}
          className={`px-6 py-2 rounded-lg font-black uppercase text-xs md:text-sm border-2 border-[#3d291a] transition-all shadow-[3px_3px_0px_#1a1412] ${
            activeCategory === 'secundario'
              ? 'bg-[#d4a373] text-[#3d291a] scale-105'
              : 'bg-[#2a2118] text-[#c2a68c] hover:bg-[#3d291a]'
          }`}
        >
          📜 Personajes Secundarios
        </button>
      </div>

      {/* 2. LISTA DE PERSONAJES APILADOS */}
      <div className="flex flex-col gap-8">
        {filteredCharacters.length === 0 ? (
          <p className="text-center text-[#c2a68c] py-8 italic">
            No hay personajes registrados en esta categoría aún.
          </p>
        ) : (
          filteredCharacters.map((char) => {
            const currentFichaIndex = selectedFichas[char.id] ?? 0;
            const currentFicha = char.fichas[currentFichaIndex] || char.fichas[0];
            const images = currentFicha.images?.length ? currentFicha.images : emptyImageSlots;

            return (
              <div
                key={char.id}
                className="grid grid-cols-1 gap-5 rounded-lg border-2 border-[#553c2a] bg-[#2a2118] p-4 shadow-[4px_4px_0px_#1a1412] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:p-5"
              >
                <header className="col-span-full flex flex-col gap-3 border-b border-[#553c2a] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="break-words text-xl font-black uppercase text-[#e5be82]">
                        {char.name}
                      </h2>
                      {char.id === 'isabel' && !collectedShardIds.includes(FIRST_SHARD_ID) && (
                        <button
                          type="button"
                          aria-label="Recoger fragmento del corazón junto a Isabel"
                          title="Recoger fragmento"
                          onClick={() => onCollectShard?.(FIRST_SHARD_ID)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fdf6e3]"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 drop-shadow-[0_0_5px_rgba(204,24,48,0.8)]">
                            <path d="M12 1.5 20 6l2.5 8-10.5 8.5L1.5 14 4 6z" fill="#b51227" stroke="#e5be82" strokeWidth="1.2" />
                            <path d="m4 6 8 2.3L20 6M12 8.3v14.2M4 6l4 8 4-5.7 4 5.7 4-8" fill="none" stroke="#f16b75" strokeWidth="0.8" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] font-bold uppercase text-[#c2a68c]">
                      {currentFicha.versionLabel}
                    </p>
                  </div>

                  {char.fichas.length > 1 && (
                    <div className="flex flex-wrap gap-1.5" aria-label={`Versiones de ${char.name}`}>
                      {char.fichas.map((ficha, index) => (
                        <button
                          key={ficha.versionLabel}
                          type="button"
                          aria-pressed={currentFichaIndex === index}
                          onClick={() => handleFichaChange(char.id, index)}
                          className={`rounded border px-2.5 py-1.5 text-[10px] font-extrabold uppercase transition-colors ${
                            currentFichaIndex === index
                              ? 'border-[#e5be82] bg-[#e5be82] text-[#3d291a]'
                              : 'border-[#553c2a] text-[#c2a68c] hover:border-[#e5be82] hover:text-[#fdf6e3]'
                          }`}
                        >
                          {ficha.versionLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </header>

                <section aria-label={`Imágenes de ${char.name}`}>
                  <h3 className="mb-2 text-[10px] font-black uppercase text-[#d4a373]">Imágenes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((image, imageIndex) => {
                      const imageSrc = typeof image === 'string' ? image : image?.src;
                      const imageKey = `${char.id}-${currentFichaIndex}-${imageIndex}`;
                      const imageFailed = failedImages[imageKey];

                      return (
                        <figure key={imageKey} className="relative aspect-[4/5] overflow-hidden rounded border border-[#553c2a] bg-[#33271e]">
                          {imageSrc && !imageFailed ? (
                            <img
                              src={imageSrc}
                              alt={typeof image === 'object' ? image.alt || `${char.name} ${imageIndex + 1}` : `${char.name} ${imageIndex + 1}`}
                              onError={() => setFailedImages((previous) => ({ ...previous, [imageKey]: true }))}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-[#9a704c]/70 text-[#d4a373]"
                              style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 12px, rgba(212, 163, 115, 0.06) 12px 13px)' }}
                            >
                              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-[#d4a373]/70 text-2xl font-light">+</span>
                              <span className="text-[9px] font-bold uppercase">Imagen {String(imageIndex + 1).padStart(2, '0')}</span>
                            </div>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </section>

                <section className="min-w-0 space-y-4" aria-label={`Información de ${char.name}`}>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-xs sm:grid-cols-2">
                    {[
                      ['Rol / Clase', currentFicha.role],
                      ['Edad', currentFicha.age],
                      ['Altura', currentFicha.height],
                      ['Cabello / Rasgos', currentFicha.hair],
                      ['Armamento', currentFicha.weapon],
                    ].map(([label, value]) => (
                      <div key={label} className="border-b border-[#553c2a] pb-2">
                        <dt className="mb-1 text-[9px] font-black uppercase text-[#e5be82]">{label}</dt>
                        <dd className="text-[#fdf6e3]">{value || 'Sin datos'}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-1 text-[9px] font-black uppercase text-[#e5be82]">Gustos</h3>
                      <p className="text-xs leading-relaxed text-[#d8c3b0]">{currentFicha.likes || 'Sin datos'}</p>
                    </div>
                    <div>
                      <h3 className="mb-1 text-[9px] font-black uppercase text-[#c77a6d]">Disgustos</h3>
                      <p className="text-xs leading-relaxed text-[#d8c3b0]">{currentFicha.dislikes || 'Sin datos'}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#553c2a] pt-3">
                    <h3 className="mb-1 text-[9px] font-black uppercase text-[#e5be82]">Descripción</h3>
                    <p className="text-xs leading-relaxed text-[#d8c3b0]">{currentFicha.desc || 'Sin descripción.'}</p>
                  </div>
                </section>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}