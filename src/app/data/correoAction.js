'use server';

import { revalidatePath } from 'next/cache';
import {
  clearMailboxAdminSession,
  createMailboxAdminSession,
  getMailboxWriteClient,
  hasMailboxAdminSession,
  mailboxAdminIsConfigured,
  passwordsMatch,
  readAdminPassword,
  uploadMailboxImage,
} from './mailboxServer';

function readText(formData, fieldName) {
  const value = formData.get(fieldName);
  return typeof value === 'string' ? value.trim() : '';
}

function readFile(formData, fieldName) {
  const value = formData.get(fieldName);
  return typeof File !== 'undefined' && value instanceof File && value.size > 0
    ? value
    : null;
}

function revalidateMailboxPages() {
  revalidatePath('/');
  revalidatePath('/novela');
  revalidatePath('/correo');
}

function getErrorMessage(error, fallback) {
  console.error('Mailbox action failed:', error);
  if (error instanceof Error && error.message.includes('SANITY_API_TOKEN')) {
    return 'El buzón aún no está configurado en el servidor.';
  }
  return error instanceof Error ? error.message : fallback;
}

export async function enviarComentario(formData) {
  const autor = readText(formData, 'autor') || 'Anónimo';
  const mensaje = readText(formData, 'mensaje');
  const imageFile = readFile(formData, 'imagen');

  if (autor.length > 80) {
    return { success: false, message: 'El nombre no puede superar 80 caracteres.' };
  }
  if (mensaje.length > 1000) {
    return { success: false, message: 'El mensaje no puede superar 1000 caracteres.' };
  }
  if (!mensaje && !imageFile) {
    return { success: false, message: 'Escribe un mensaje o adjunta una imagen.' };
  }

  try {
    const client = getMailboxWriteClient();
    const attachment = imageFile ? await uploadMailboxImage(client, imageFile) : null;

    await client.create({
      _type: 'mailSubmission',
      author: autor,
      message: mensaje,
      submittedAt: new Date().toISOString(),
      ...(attachment ? { attachment } : {}),
    });

    revalidateMailboxPages();
    return { success: true, message: '¡Tu mensaje llegó al buzón!' };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'No se pudo enviar el mensaje. Inténtalo de nuevo.'),
    };
  }
}

export async function loginMailboxAdmin(formData) {
  const expectedPassword = process.env.BUZON_ADMIN_PASSWORD;
  const sessionSecret = process.env.BUZON_SESSION_SECRET;
  const submittedPassword = readAdminPassword(formData);

  if (!mailboxAdminIsConfigured()) {
    return {
      success: false,
      message: 'Configura SANITY_API_TOKEN, BUZON_ADMIN_PASSWORD y BUZON_SESSION_SECRET en el servidor.',
    };
  }
  if (!expectedPassword || !passwordsMatch(submittedPassword, expectedPassword)) {
    return { success: false, message: 'La contraseña no es correcta.' };
  }

  try {
    if (!sessionSecret) throw new Error('BUZON_SESSION_SECRET is not configured.');
    await createMailboxAdminSession();
    revalidateMailboxPages();
    return { success: true, message: 'Sesión de administración iniciada.' };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'No se pudo iniciar la sesión.'),
    };
  }
}

export async function logoutMailboxAdmin() {
  await clearMailboxAdminSession();
  revalidateMailboxPages();
  return { success: true };
}

export async function responderComentario(formData) {
  if (!(await hasMailboxAdminSession())) {
    return { success: false, message: 'Inicia sesión como administrador para responder.' };
  }

  const submissionId = readText(formData, 'submissionId');
  const reply = readText(formData, 'respuesta');
  const imageFile = readFile(formData, 'imagenRespuesta');

  if (!submissionId || submissionId.length > 128) {
    return { success: false, message: 'La referencia del mensaje no es válida.' };
  }
  if (reply.length > 2000) {
    return { success: false, message: 'La respuesta no puede superar 2000 caracteres.' };
  }
  if (!reply && !imageFile) {
    return { success: false, message: 'Escribe una respuesta o adjunta una imagen.' };
  }

  try {
    const client = getMailboxWriteClient();
    const submission = await client.fetch(
      '*[_id == $id && _type == "mailSubmission"][0]{_id}',
      { id: submissionId },
    );
    if (!submission) {
      return { success: false, message: 'No se encontró ese mensaje en el buzón.' };
    }

    const replyImage = imageFile ? await uploadMailboxImage(client, imageFile) : null;
    const fields = {
      reply,
      repliedAt: new Date().toISOString(),
      ...(replyImage ? { replyImage } : {}),
    };

    await client.patch(submissionId).set(fields).commit();
    revalidateMailboxPages();
    return { success: true, message: 'Respuesta publicada.' };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, 'No se pudo publicar la respuesta.'),
    };
  }
}
