import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'fragmento',
  title: 'Fragmento del Locket',
  type: 'document',
  // Definimos pestañas (groups) para organizar la interfaz en Sanity Studio
  groups: [
    { name: 'contenido', title: '📜 Contenido & Poema' },
    { name: 'audioVoces', title: '🎙️ Audio & Narración' },
    { name: 'audioAmbiente', title: '🔊 Música & Efectos de Sonido' },
    { name: 'arte', title: '🎨 Ilustración & Visuales' },
  ],
  fields: [
    // --- PESTAÑA: CONTENIDO Y POEMA ---
    defineField({
      name: 'orden',
      title: 'Número / Orden del Fragmento',
      type: 'number',
      description: 'Del 1 al 10 (define en qué posición del scroll aparece).',
      group: 'contenido',
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'titulo',
      title: 'Título del Fragmento / Poema',
      type: 'string',
      group: 'contenido',
      validation: (Rule) => Rule.required(),
    }),
    // --- PESTAÑA: AUDIO Y NARRACIÓN (VOZ) ---
    defineField({
      name: 'audioPoema',
      title: 'Voz / Recitado del Poema (MP3)',
      type: 'file',
      group: 'audioVoces',
      description: 'Archivo de audio principal con la narración del poema.',
      options: {
        accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
      },
    }),

    // --- PESTAÑA: MÚSICA DE FONDO Y EFECTOS DE SONIDO ---
    defineField({
      name: 'musicaFondo',
      title: 'Música de Fondo / Ambiente Específico (MP3)',
      type: 'file',
      group: 'audioAmbiente',
      description: 'Pista instrumental o ambiente sutil que suena mientras se lee/escucha este fragmento específico.',
      options: {
        accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
      },
    }),
    defineField({
      name: 'efectoDesbloqueo',
      title: 'Efecto de Sonido al Desbloquear (SFX)',
      type: 'file',
      group: 'audioAmbiente',
      description: 'Sonido corto (ej. cristal rompiéndose, eco, latido) que suena al hacer clic sobre este fragmento.',
      options: {
        accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
      },
    }),

    // --- PESTAÑA: ILUSTRACIÓN Y VISUALES ---
    defineField({
      name: 'ilustracion',
      title: 'Ilustración Acompañante',
      type: 'image',
      group: 'arte',
      description: 'Imagen/arte que se revela junto al poema.',
      options: {
        hotspot: true, // Permite recortar/centrar la imagen desde Sanity
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto Alternativo (Descripción)',
          type: 'string',
        }),
      ],
    }),
  ],

  // Vista previa dentro de las listas de Sanity Studio
  preview: {
    select: {
      title: 'titulo',
      orden: 'orden',
      media: 'ilustracion',
    },
    prepare({ title, orden, media }) {
      return {
        title: `#${orden ?? '?'} - ${title ?? 'Sin título'}`,
        media: media,
      }
    },
  },
})