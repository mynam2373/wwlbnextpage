import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { createClient } from '@sanity/client';

const SESSION_COOKIE = 'wwlb-mailbox-admin';
const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const PROJECT_ID = 'vru32lc4';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

export function getMailboxWriteClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error('SANITY_API_TOKEN is not configured on the server.');
  }

  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
  });
}

function getSessionSecret() {
  const secret = process.env.BUZON_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('BUZON_SESSION_SECRET must contain at least 32 characters.');
  }
  return secret;
}

function createSessionSignature(timestamp, secret) {
  return createHmac('sha256', secret).update(timestamp).digest('hex');
}

export function passwordsMatch(candidate, expected) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length
    && timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function readAdminPassword(formData) {
  const value = formData.get('password');
  return typeof value === 'string' ? value : '';
}

export async function createMailboxAdminSession() {
  const secret = getSessionSecret();
  const timestamp = String(Date.now());
  const signature = createSessionSignature(timestamp, secret);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, `${timestamp}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearMailboxAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function hasMailboxAdminSession() {
  const password = process.env.BUZON_ADMIN_PASSWORD;
  if (!password) return false;

  let secret;
  try {
    secret = getSessionSecret();
  } catch {
    return false;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return false;

  const [timestamp, signature, ...extraParts] = value.split('.');
  const issuedAt = Number(timestamp);
  if (
    extraParts.length > 0
    || !Number.isSafeInteger(issuedAt)
    || Date.now() - issuedAt > SESSION_DURATION_SECONDS * 1000
    || issuedAt > Date.now()
    || !/^[a-f0-9]{64}$/.test(signature || '')
  ) {
    return false;
  }

  const expected = createSessionSignature(timestamp, secret);
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
}

export function mailboxAdminIsConfigured() {
  return Boolean(
    process.env.SANITY_API_TOKEN
    && process.env.BUZON_ADMIN_PASSWORD
    && process.env.BUZON_SESSION_SECRET
    && Buffer.byteLength(process.env.BUZON_SESSION_SECRET) >= 32,
  );
}

export async function uploadMailboxImage(client, file) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo adjunto debe ser una imagen.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La imagen no puede pesar más de 5 MB.');
  }

  const asset = await client.assets.upload(
    'image',
    Buffer.from(await file.arrayBuffer()),
    {
      filename: file.name || 'mailbox-image',
      contentType: file.type,
    },
  );

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: file.name || 'Imagen enviada por un visitante',
  };
}

export { SESSION_DURATION_SECONDS };
