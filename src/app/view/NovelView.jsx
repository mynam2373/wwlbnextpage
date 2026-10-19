'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const getVolumeNumber = (volume) => {
  const identifier = volume.number || volume.volumeId || volume.tag || volume.title || '';
  const match = String(identifier).match(/\d+/);
  return match ? Number(match[0]) : null;
};

const compareVolumes = (first, second) => {
  const firstNumber = getVolumeNumber(first);
  const secondNumber = getVolumeNumber(second);

  if (firstNumber !== null && secondNumber !== null && firstNumber !== secondNumber) {
    return firstNumber - secondNumber;
  }
  if (firstNumber !== null && secondNumber === null) return -1;
  if (firstNumber === null && secondNumber !== null) return 1;

  const firstLabel = first.number || first.volumeId || first.title || '';
  const secondLabel = second.number || second.volumeId || second.title || '';
  return String(firstLabel).localeCompare(String(secondLabel), 'es', {
    numeric: true,
    sensitivity: 'base',
  });
};

function VisualPanel({ document, label }) {
  const images = [
    document?.image,
    ...(Array.isArray(document?.images) ? document.images : []),
  ].filter((image) => image?.asset?.url);

  return (
    <div className="flex min-h-64 flex-col overflow-hidden rounded-xl border-2 border-dashed border-[#a36a3e]/60 bg-[#ead5ad]/50 p-3">
      {images.length > 0 ? (
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <figure key={image._key || image.asset._id || `${label}-${index}`} className="relative min-h-52 overflow-hidden rounded-lg bg-[#ead5ad]">
              <Image
                src={image.asset.url}
                alt={image.alt || image.caption || label}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              {image.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-[#3d291a]/75 px-3 py-2 text-xs font-semibold text-[#fdf6e3]">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <div className="relative flex min-h-56 flex-1 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#d4a373]/50 via-[#ead5ad] to-[#6b4f38]/30">
          <span aria-hidden="true" className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[18px] border-[#fdf6e3]/40" />
          <span aria-hidden="true" className="absolute -bottom-10 -left-5 h-32 w-3/4 -skew-x-12 rounded-t-full bg-[#6b4f38]/20" />
          <div className="relative px-5 text-center">
            <span aria-hidden="true" className="text-4xl text-[#6b4f38]/70">✧</span>
            <p className="mt-2 text-xs font-black uppercase tracking-wider text-[#3d291a]">
              Espacio para ilustraciones
            </p>
            <p className="mt-1 text-xs text-[#6b4f38]">{label}</p>
          </div>
        </div>
      )}
      <p className="pt-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#6b4f38]">
        Archivo visual
      </p>
    </div>
  );
}

export function NovelView({ settings: novelSettings, volumes = [] }) {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(null);
  const sidebarRef = useRef(null);
  const orderedVolumes = [...volumes].sort(compareVolumes);
  const selectedVolume = orderedVolumes.find((volume) => volume._id === selectedSection);
  const selectedSectionLabel = selectedSection === 'overview'
    ? 'Mundo e historia'
    : selectedVolume?.title || (selectedVolume ? `Volumen ${getVolumeNumber(selectedVolume) ?? ''}` : 'Secciones');

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return undefined;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateHeight = () => {
      setSidebarHeight(desktopQuery.matches ? sidebar.offsetHeight : null);
    };
    const observer = new ResizeObserver(updateHeight);

    observer.observe(sidebar);
    desktopQuery.addEventListener('change', updateHeight);
    updateHeight();

    return () => {
      observer.disconnect();
      desktopQuery.removeEventListener('change', updateHeight);
    };
  }, [orderedVolumes.length]);
  const overviewSections = [
    {
      title: novelSettings?.aboutTitle || 'Acerca de la novela',
      content: novelSettings?.aboutContent,
      fallback: 'La información general de la novela todavía no está publicada.',
    },
    {
      title: novelSettings?.settingTitle || 'El escenario',
      content: novelSettings?.settingContent,
      fallback: 'La información sobre el mundo todavía no está publicada.',
    },
  ];
  const selectedVolumeSections = selectedVolume ? [
    ['Premisa', selectedVolume.premise],
    ['Conflicto', selectedVolume.conflict],
    ['Clímax', selectedVolume.climax],
    ['Resumen', selectedVolume.summary],
    ['Contenido', selectedVolume.content],
  ].filter(([, content]) => content) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-2 py-5 text-[#3d291a] sm:px-4 sm:py-8">
      <header className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#a36a3e]">
          Archivo de Vesteria
        </p>
        {novelSettings?.title ? (
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide sm:text-4xl">
            {novelSettings.title}
          </h1>
        ) : (
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide sm:text-4xl">
            La novela
          </h1>
        )}
        {novelSettings?.subtitle && (
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-[#a36a3e] sm:text-base">
            {novelSettings.subtitle}
          </p>
        )}
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#a36a3e]" />
      </header>

      <button
        type="button"
        aria-expanded={isMobileMenuOpen}
        aria-controls="novel-sections-menu"
        onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        className="flex w-full items-center justify-between rounded-xl border-2 border-[#3d291a] bg-[#ead5ad] p-3 text-left shadow-[3px_3px_0px_rgba(61,41,26,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a36a3e] lg:hidden"
      >
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#a36a3e]">
            Sección actual
          </span>
          <span className="mt-0.5 block truncate text-sm font-black uppercase">
            {selectedSectionLabel}
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="ml-3 h-6 w-6 shrink-0 text-[#3d291a]"
        >
          {isMobileMenuOpen ? (
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(230px,0.8fr)_minmax(0,2.2fr)]">
        <aside
          id="novel-sections-menu"
          ref={sidebarRef}
          aria-label="Secciones de la novela"
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} rounded-2xl border-2 border-[#3d291a] bg-[#ead5ad] p-4 shadow-[5px_5px_0px_rgba(61,41,26,0.24)] sm:p-5 lg:block`}
        >
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a36a3e]">
              Explorar
            </p>
            <h2 className="mt-1 text-lg font-black uppercase">La historia</h2>
          </div>

          <nav aria-label="Contenido de la novela" className="space-y-2">
            <button
              type="button"
              aria-current={selectedSection === 'overview' ? 'page' : undefined}
              onClick={() => {
                setSelectedSection('overview');
                setIsMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a36a3e] ${
                selectedSection === 'overview'
                  ? 'border-[#3d291a] bg-[#3d291a] text-[#fdf6e3] shadow-[3px_3px_0px_rgba(61,41,26,0.2)]'
                  : 'border-transparent text-[#3d291a] hover:border-[#a36a3e]/50 hover:bg-[#fdf6e3]/60'
              }`}
            >
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current text-lg">✦</span>
              <span className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-wider opacity-75">Introducción</span>
                <span className="mt-0.5 block text-sm font-black">Mundo e historia</span>
              </span>
            </button>

            <div className="px-1 pt-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b4f38]">
                  Volúmenes y otros títulos
                </h3>
                {orderedVolumes.length > 0 && (
                  <span className="text-[10px] font-bold text-[#6b4f38]">
                    {orderedVolumes.length} {orderedVolumes.length === 1 ? 'título' : 'títulos'}
                  </span>
                )}
              </div>
            </div>

            {orderedVolumes.length === 0 ? (
              <p className="rounded-xl border border-[#3d291a]/20 bg-[#fdf6e3]/60 p-3 text-sm font-semibold">
                Aún no hay volúmenes publicados.
              </p>
            ) : orderedVolumes.map((volume, index) => {
              const isSelected = selectedSection === volume._id;
              const volumeNumber = getVolumeNumber(volume);

              return (
                <button
                  key={volume._id}
                  type="button"
                  aria-current={isSelected ? 'page' : undefined}
                  onClick={() => {
                    setSelectedSection(volume._id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a36a3e] ${
                    isSelected
                      ? 'border-[#3d291a] bg-[#3d291a] text-[#fdf6e3] shadow-[3px_3px_0px_rgba(61,41,26,0.2)]'
                      : 'border-transparent text-[#3d291a] hover:border-[#a36a3e]/50 hover:bg-[#fdf6e3]/60'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current text-xs font-black">
                    {volumeNumber ?? '✧'}
                  </span>
                  <span className="min-w-0">
                    {(volume.number || volume.tag) && (
                      <span className="block truncate text-[9px] font-black uppercase tracking-wider opacity-75">
                        {[volume.number, volume.tag].filter(Boolean).join(' · ')}
                      </span>
                    )}
                    <span className="mt-0.5 block text-sm font-black">
                      {volume.title || `Volumen ${volumeNumber ?? index + 1}`}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section aria-live="polite" style={sidebarHeight ? { height: sidebarHeight, maxHeight: sidebarHeight } : undefined} className="h-full min-w-0 overflow-x-hidden rounded-2xl border-2 border-[#3d291a] bg-[#fdf6e3] shadow-[5px_5px_0px_rgba(61,41,26,0.24)] lg:overflow-y-auto lg:overscroll-contain">
          {selectedSection === 'overview' ? (
            <div>
              <div className="border-b-2 border-[#3d291a]/15 bg-[#f4e6c9] px-5 py-5 sm:px-7">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a36a3e]">
                  Introducción al universo
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase sm:text-3xl">Mundo e historia</h2>
                <p className="mt-2 text-sm text-[#6b4f38]">
                  Una mirada general al universo de la novela.
                </p>
              </div>
              <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(230px,0.8fr)]">
                <div className="space-y-4">
                  {overviewSections.map((section) => (
                    <article key={section.title} className="rounded-xl border border-[#3d291a]/20 bg-white/40 p-4 sm:p-5">
                      <h3 className="text-sm font-black uppercase tracking-wide text-[#a36a3e]">
                        {section.title}
                      </h3>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#4d3828]">
                        {section.content || section.fallback}
                      </p>
                    </article>
                  ))}
                </div>
                <VisualPanel document={novelSettings} label="Mundo e historia" />
              </div>
            </div>
          ) : selectedVolume ? (
            <div>
              <div className="border-b-2 border-[#3d291a]/15 bg-[#f4e6c9] px-5 py-5 sm:px-7">
                {(selectedVolume.number || selectedVolume.tag) && (
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a36a3e]">
                    {[selectedVolume.number, selectedVolume.tag].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h2 className="mt-1 text-2xl font-black uppercase sm:text-3xl">
                  {selectedVolume.title || `Volumen ${getVolumeNumber(selectedVolume) ?? ''}`}
                </h2>
              </div>
              <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(230px,0.8fr)]">
                <div className="space-y-4">
                  {selectedVolumeSections.length > 0 ? (
                    selectedVolumeSections.map(([label, content], index) => (
                      <article key={label} className="flex gap-3 rounded-xl border border-[#3d291a]/20 bg-white/40 p-4 sm:p-5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d4a373]/40 text-xs font-black">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-xs font-black uppercase tracking-widest text-[#a36a3e]">
                            {label}
                          </h3>
                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#4d3828]">
                            {content}
                          </p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-xl border border-[#3d291a]/20 bg-white/40 p-4 text-sm font-semibold text-[#6b4f38]">
                      Este volumen aún no tiene contenido publicado.
                    </p>
                  )}
                </div>
                <VisualPanel document={selectedVolume} label={selectedVolume.title || 'Este volumen'} />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-xl font-black uppercase">Selecciona una sección</h2>
              <p className="mt-2 text-sm text-[#6b4f38]">
                Elige un volumen de la lista para ver su contenido.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}