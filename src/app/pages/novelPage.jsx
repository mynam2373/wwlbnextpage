import { useState, useEffect } from 'react';
import { sanityClient } from '../../../../wwlb/src/sanityClient';

export const NovelPage = () => {
  const [tab, setTab] = useState('general');
  const [novelSettings, setNovelSettings] = useState(null);
  const [volumes, setVolumes] = useState([]);
  const [selectedVolId, setSelectedVolId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `{
      "settings": *[_type == "novelSettings"][0],
      "volumes": *[_type == "volume"] | order(number asc)
    }`;

    sanityClient.fetch(query)
      .then((data) => {
        if (data?.volumes) {
          setVolumes(data.volumes);
          if (data.volumes.length > 0) {
            setSelectedVolId(data.volumes[0]._id);
          }
        }
        if (data?.settings) {
          setNovelSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error cargando Sanity:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center font-bold">Cargando novela desde Sanity...</div>;

  const currentVolume = volumes.find((v) => v._id === selectedVolId);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 font-serif text-[#2a2118]">
      {/* HEADER DE LA SECCIÓN */}
      <div className="text-center mb-8 border-b border-[#553c2a] pb-4">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-[#3d291a]">
          {novelSettings?.title || 'What We Left Behind'}
        </h1>
        <p className="text-sm sm:text-base italic text-[#6e523b] mt-1">
          {novelSettings?.subtitle}
        </p>
        
        {/* NAVEGACIÓN PRINCIPAL */}
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setTab('general')}
            className={`px-4 py-2 font-sans font-bold text-sm uppercase transition-colors rounded ${
              tab === 'general' ? 'bg-[#553c2a] text-[#fdf6e3]' : 'bg-[#e0d3be] text-[#553c2a]'
            }`}
          >
            Sinopsis General & Lore
          </button>
          <button 
            onClick={() => setTab('volumes')}
            className={`px-4 py-2 font-sans font-bold text-sm uppercase transition-colors rounded ${
              tab === 'volumes' ? 'bg-[#553c2a] text-[#fdf6e3]' : 'bg-[#e0d3be] text-[#553c2a]'
            }`}
          >
            Volúmenes ({volumes.length})
          </button>
        </div>
      </div>

      {/* VISTA 1: SINOPSIS GENERAL Y ESCENARIO */}
      {tab === 'general' && (
        <div className="space-y-6">
          {novelSettings?.aboutContent && (
            <section className="bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm">
              <h2 className="text-xl font-bold uppercase text-[#3d291a] mb-3 flex items-center gap-2">
                🌟 {novelSettings.aboutTitle || 'Acerca de la Novela'}
              </h2>
              <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#2a2118]">
                {novelSettings.aboutContent}
              </p>
            </section>
          )}

          {novelSettings?.settingContent && (
            <section className="bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm">
              <h2 className="text-xl font-bold uppercase text-[#3d291a] mb-3 flex items-center gap-2">
                🗺️ {novelSettings.settingTitle || 'El Escenario'}
              </h2>
              <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[#2a2118]">
                {novelSettings.settingContent}
              </p>
            </section>
          )}
        </div>
      )}

      {/* VISTA 2: NAVEGADOR DE VOLÚMENES */}
      {tab === 'volumes' && volumes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* LISTA LATERAL */}
          <div className="flex flex-col gap-2 md:col-span-1">
            {volumes.map((vol) => (
              <button
                key={vol._id}
                onClick={() => setSelectedVolId(vol._id)}
                className={`p-3 text-left rounded text-sm font-sans font-bold transition-all border ${
                  selectedVolId === vol._id
                    ? 'bg-[#3d291a] text-[#fdf6e3] border-[#3d291a] shadow'
                    : 'bg-[#f5ebd7] text-[#3d291a] border-[#c2b299] hover:bg-[#e8dc2]'
                }`}
              >
                <span className="block text-[10px] opacity-80 uppercase">{vol.number}</span>
                {vol.title}
              </button>
            ))}
          </div>

          {/* FICHA DETALLADA DEL VOLUMEN */}
          {currentVolume && (
            <div className="md:col-span-3 bg-[#f5ebd7] p-6 rounded border border-[#c2b299] shadow-sm space-y-4">
              <div className="border-b border-[#c2b299] pb-3">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#8c4843]">
                  {currentVolume.tag}
                </span>
                <h2 className="text-2xl font-bold text-[#3d291a]">
                  {currentVolume.title}
                </h2>
              </div>

              {currentVolume.premise && (
                <div>
                  <h3 className="text-xs font-sans font-black uppercase text-[#553c2a] mb-1">
                    La Premisa
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{currentVolume.premise}</p>
                </div>
              )}

              {currentVolume.conflict && (
                <div>
                  <h3 className="text-xs font-sans font-black uppercase text-[#553c2a] mb-1">
                    El Conflicto
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{currentVolume.conflict}</p>
                </div>
              )}

              {currentVolume.climax && (
                <div>
                  <h3 className="text-xs font-sans font-black uppercase text-[#8c4843] mb-1">
                    El Clímax / Desenlace
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{currentVolume.climax}</p>
                </div>
              )}

              {/* CONTENIDO EXTENSO DEL VOLUMEN DESDE SANITY */}
              {currentVolume.content && (
                <div className="pt-4 border-t border-[#c2b299]">
                  <h3 className="text-xs font-sans font-black uppercase text-[#553c2a] mb-2">
                    Contenido Completo
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-[#2a2118]">
                    {currentVolume.content}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};