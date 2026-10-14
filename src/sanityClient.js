import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'vru32lc4', // El ID de tu proyecto Sanity
  dataset: 'production',
  useCdn: false, // En servidor (Next.js) es mejor usarlo en 'false' para traer siempre los datos más recientes
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Asegúrate de tener tu token en las variables de entorno 
});