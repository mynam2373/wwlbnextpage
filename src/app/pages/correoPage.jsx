'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Pencil } from 'lucide-react';
import {
  loginMailboxAdmin,
  logoutMailboxAdmin,
  responderComentario,
} from '../data/correoAction';

function formatDate(value) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function MailImage({ image, label }) {
  const url = image?.asset?.url;
  if (!url) return null;

  return (
    <a href={url} target="_blank" rel="noreferrer" data-image-zoom className="mt-3 block max-w-full overflow-hidden rounded-xl border border-[#3d291a]/20">
      <Image
        src={url}
        alt={image.alt || label}
        width={image.asset.metadata?.dimensions?.width || 1200}
        height={image.asset.metadata?.dimensions?.height || 800}
        sizes="(min-width: 768px) 600px, 100vw"
        className="max-h-48 w-full object-contain"
      />
    </a>
  );
}

export default function CorreoPage({ submissions = [], isAdmin: initialIsAdmin = false, adminConfigured = true }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [loginStatus, setLoginStatus] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [replyStatuses, setReplyStatuses] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsAdmin(initialIsAdmin);
  }, [initialIsAdmin]);

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setLoginStatus('');

    try {
      const result = await loginMailboxAdmin(new FormData(form));
      setLoginStatus(result.message);
      if (result.success) {
        setIsAdmin(true);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error('Mailbox admin login failed:', error);
      setLoginStatus('No se pudo iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    setAdminStatus('');
    try {
      const result = await logoutMailboxAdmin();
      if (!result.success) throw new Error('The mailbox admin session could not be closed.');
      setIsAdmin(false);
      router.refresh();
    } catch (error) {
      console.error('Mailbox admin logout failed:', error);
      setAdminStatus('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReply(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submissionId = new FormData(form).get('submissionId');
    setBusy(true);
    setReplyStatuses((current) => ({ ...current, [submissionId]: '' }));

    try {
      const result = await responderComentario(new FormData(form));
      setReplyStatuses((current) => ({ ...current, [submissionId]: result.message }));
      if (result.success) {
        setEditingReplyId(null);
        router.refresh();
      }
      if (!result.success && result.message.includes('Inicia sesión')) {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Mailbox reply failed:', error);
      setReplyStatuses((current) => ({
        ...current,
        [submissionId]: 'No se pudo publicar la respuesta. Inténtalo de nuevo.',
      }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 text-[#3d291a]">
      <header className="border-b-2 border-[#3d291a]/20 pb-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a36a3e]">Buzón de Vesteria</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black uppercase">Correo y preguntas</h1>
            <p className="mt-1 text-sm text-[#6b4f38]">
              Preguntas, comentarios e imágenes compartidos por la comunidad.
            </p>
          </div>
          {isAdmin ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={busy}
              aria-label="Cerrar sesión de administración"
              title="Cerrar sesión"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b5e22] bg-[#e6b94f] text-[#3d291a] shadow-[0_2px_0_#8b5e22] transition-colors hover:bg-[#f0cc70] disabled:opacity-50"
            >
              <KeyRound aria-hidden="true" size={17} strokeWidth={2.2} />
            </button>
          ) : (
            <details className="group relative ml-auto self-start">
              <summary
                aria-label="Acceso de administración"
                title="Acceso de administración"
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-[#6b4f38]/60 transition-colors hover:bg-[#ead5ad] hover:text-[#3d291a] [&::-webkit-details-marker]:hidden"
              >
                <KeyRound aria-hidden="true" size={17} strokeWidth={1.8} />
              </summary>
              <div className="absolute right-0 z-20 mt-2 w-[min(19rem,calc(100vw-3rem))] rounded-xl border border-[#3d291a]/20 bg-[#fdf6e3] p-4 shadow-xl">
                {adminConfigured ? (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-[#6b4f38]">
                      Acceso privado
                      <input
                        type="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="Contraseña"
                        className="mt-1 w-full rounded-lg border border-[#3d291a]/30 bg-white/70 p-2 text-sm normal-case text-[#3d291a]"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full rounded-lg bg-[#3d291a] px-4 py-2 text-xs font-black uppercase text-[#fdf6e3] disabled:opacity-50"
                    >
                      Iniciar sesión
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-[#6b4f38]">
                    La administración del buzón requiere configuración de servidor.
                  </p>
                )}
                {loginStatus && <p role="status" className="mt-2 text-xs font-bold">{loginStatus}</p>}
              </div>
            </details>
          )}
        </div>
        {adminStatus && <p role="alert" className="mt-2 text-sm font-bold text-red-700">{adminStatus}</p>}
      </header>

      <section aria-label="Mensajes del buzón" className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {submissions.length === 0 ? (
          <p className="col-span-full rounded-2xl border-2 border-[#3d291a]/20 bg-[#fdf6e3] p-6 text-center text-sm text-[#6b4f38]">
            Todavía no hay mensajes publicados. Puedes enviar el primero desde el botón del buzón.
          </p>
        ) : submissions.map((submission) => (
          <article key={submission._id} className="min-w-0 rounded-xl border-2 border-[#3d291a] bg-[#fdf6e3] p-4 shadow-[3px_3px_0px_rgba(61,41,26,0.16)]">
            <header className="border-b border-[#3d291a]/15 pb-2">
              <h2 className="break-words text-sm font-black uppercase">{submission.author || 'Anónimo'}</h2>
              <time className="mt-1 block text-[10px] text-[#6b4f38]">{formatDate(submission.submittedAt)}</time>
            </header>
            {submission.message && (
              <p className="mt-3 break-words whitespace-pre-line text-xs leading-5 text-[#4d3828]">
                {submission.message}
              </p>
            )}
            <MailImage image={submission.attachment} label="Imagen adjunta al mensaje" />

            {submission.reply || submission.replyImage || isAdmin ? (
              <section className="mt-4 rounded-lg border border-[#a36a3e]/40 bg-[#ead5ad]/50 p-3">
                {isAdmin && editingReplyId === submission._id ? (
                  <>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#8b2f20]">
                      {submission.reply || submission.replyImage ? 'Editar respuesta' : 'Responder'}
                    </h3>
                    <form onSubmit={handleReply} className="mt-3 space-y-3">
                      <input type="hidden" name="submissionId" value={submission._id} />
                      <label className="block text-[10px] font-bold uppercase text-[#6b4f38]">
                        Tu respuesta
                        <textarea
                          name="respuesta"
                          rows={3}
                          maxLength={2000}
                          defaultValue={submission.reply || ''}
                          placeholder="Escribe una respuesta..."
                          className="mt-1 w-full rounded-lg border border-[#3d291a]/30 bg-white/70 p-2 text-xs font-normal normal-case text-[#3d291a]"
                        />
                      </label>
                      <label className="block text-[10px] font-bold uppercase text-[#6b4f38]">
                        Imagen (opcional, máximo 5 MB)
                        <input
                          type="file"
                          name="imagenRespuesta"
                          accept="image/*"
                          className="mt-1 block w-full text-[10px] file:mr-2 file:rounded-lg file:border-0 file:bg-[#ead5ad] file:px-2 file:py-1 file:font-bold"
                        />
                      </label>
                      {submission.replyImage && (
                        <p className="text-[10px] text-[#6b4f38]">La imagen actual se conserva si no eliges otra.</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="rounded-lg bg-[#3d291a] px-3 py-2 text-[10px] font-black uppercase text-[#fdf6e3] disabled:opacity-50"
                        >
                          {submission.reply || submission.replyImage ? 'Guardar cambios' : 'Publicar respuesta'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReplyId(null)}
                          disabled={busy}
                          className="rounded-lg border border-[#3d291a]/40 px-3 py-2 text-[10px] font-black uppercase text-[#3d291a] hover:bg-[#fdf6e3] disabled:opacity-50"
                        >
                          Cerrar
                        </button>
                      </div>
                    </form>
                    {replyStatuses[submission._id] && (
                      <p role="status" className="mt-2 text-[10px] font-bold text-[#6b4f38]">
                        {replyStatuses[submission._id]}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#8b2f20]">Respuesta</h3>
                      <div className="flex items-center gap-2">
                        {(submission.reply || submission.replyImage) && (
                          <time className="text-[10px] text-[#6b4f38]">{formatDate(submission.repliedAt)}</time>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setEditingReplyId(submission._id)}
                            aria-label={submission.reply || submission.replyImage ? 'Editar respuesta' : 'Responder'}
                            title={submission.reply || submission.replyImage ? 'Editar respuesta' : 'Responder'}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#3d291a]/30 text-[#3d291a] transition-colors hover:bg-[#fdf6e3]"
                          >
                            <Pencil aria-hidden="true" size={14} strokeWidth={1.8} />
                          </button>
                        )}
                      </div>
                    </div>
                    {submission.reply && (
                      <p className="mt-2 break-words whitespace-pre-line text-xs leading-5 text-[#4d3828]">
                        {submission.reply}
                      </p>
                    )}
                    <MailImage image={submission.replyImage} label="Imagen de la respuesta" />
                    {!submission.reply && !submission.replyImage && (
                      <p className="mt-2 text-[10px] italic text-[#6b4f38]">Aún no hay respuesta.</p>
                    )}
                  </>
                )}
              </section>
            ) : (
              <p className="mt-3 text-[10px] italic text-[#6b4f38]">Aún no hay respuesta.</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
