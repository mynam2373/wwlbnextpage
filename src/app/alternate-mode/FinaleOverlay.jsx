'use client';

export function FinaleOverlay({ onFinish }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black px-6 text-center animate-[alternate-fade-in_700ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alternate-finale-title"
    >
      <div className="max-w-xl">
        <div aria-hidden="true" className="mx-auto mb-8 h-24 w-24 rounded-full border-4 border-[#bd173d] shadow-[0_0_45px_rgba(189,23,61,0.55)]" />
        <h2 id="alternate-finale-title" className="text-xl font-black uppercase tracking-[0.3em] text-[#d7cbd0]">
          Secuencia final
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#887b81]">
          El poema final aparecerá aquí. Haz clic para terminar en silencio.
        </p>
        <button
          type="button"
          onClick={onFinish}
          className="mt-8 border border-[#6d263c] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#d7cbd0] transition-colors hover:bg-[#40111f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d21d42]"
        >
          Terminar en silencio
        </button>
      </div>
    </div>
  );
}
