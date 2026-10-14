'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enviarComentario } from '../../data/correoAction';

export function BuzonFlotante() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [estadoRespuesta, setEstadoRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setCargando(true);
    setEstadoRespuesta(null);

    try {
      const resultado = await enviarComentario(new FormData(form));
      setEstadoRespuesta(resultado);

      if (resultado.success) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error('Mailbox submission failed:', error);
      setEstadoRespuesta({
        success: false,
        message: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir el buzón para enviar una pregunta o comentario"
          title="Abrir buzón de correo"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3d291a] text-[#fdf6e3] shadow-lg transition-transform hover:scale-105 focus:outline-none"
        >
          ✉️
        </button>
      )}

      {abierto && (
        <div className="max-h-[calc(100dvh-3rem)] w-[min(22rem,calc(100vw-3rem))] overflow-y-auto rounded-2xl border-2 border-[#3d291a] bg-[#fdf6e3] p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#3d291a]/20 pb-3 mb-3">
            <h3 className="font-black uppercase text-sm text-[#3d291a]">Buzón de Correo</h3>
            <button
              type="button"
              aria-label="Cerrar buzón"
              onClick={() => setAbierto(false)}
              className="text-sm font-bold text-[#6b4f38] hover:text-[#3d291a]"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6b4f38] mb-1">
                Tu Nombre o Alias
              </label>
              <input
                type="text"
                name="autor"
                maxLength={80}
                placeholder="Ej. Viajero"
                className="w-full rounded-lg border border-[#3d291a]/30 bg-white/60 p-2 text-sm text-[#3d291a] focus:outline-none focus:ring-2 focus:ring-[#a36a3e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6b4f38] mb-1">
                Pregunta o Comentario
              </label>
              <textarea
                name="mensaje"
                rows={3}
                maxLength={1000}
                placeholder="Escribe tu duda sobre la novela..."
                className="w-full rounded-lg border border-[#3d291a]/30 bg-white/60 p-2 text-sm text-[#3d291a] focus:outline-none focus:ring-2 focus:ring-[#a36a3e]"
              />
            </div>

            <div>
              <label htmlFor="buzon-imagen" className="mb-1 block text-xs font-bold uppercase text-[#6b4f38]">
                Imagen (opcional, máximo 5 MB)
              </label>
              <input
                id="buzon-imagen"
                type="file"
                name="imagen"
                accept="image/*"
                className="w-full text-xs text-[#6b4f38] file:mr-3 file:rounded-lg file:border-0 file:bg-[#ead5ad] file:px-3 file:py-2 file:font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-xl bg-[#3d291a] py-2 text-center text-xs font-black uppercase tracking-wider text-[#fdf6e3] transition-colors hover:bg-[#553c2a] disabled:opacity-50"
            >
              {cargando ? 'Enviando...' : 'Enviar Mensaje'}
            </button>

            {estadoRespuesta && (
              <p
                role="status"
                className={`mt-2 text-center text-xs font-bold ${
                  estadoRespuesta.success ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {estadoRespuesta.message}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}