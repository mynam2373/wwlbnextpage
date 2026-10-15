import { defineField, defineType } from 'sanity'

const audioAccept = 'audio/mpeg,audio/mp3,audio/wav,audio/ogg'

export default defineType({
  name: 'fragmento',
  title: 'Fragmentos del Locket',
  type: 'document',
  fields: [
    defineField({
      name: 'orden',
      title: 'Número del fragmento',
      type: 'number',
      description: 'Define el orden del fragmento.',
      validation: (Rule) => Rule.required().integer().min(1).max(10),
    }),
    defineField({
      name: 'titulo',
      title: 'Título del poema',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'audioPoema',
      title: 'Audio del poema',
      type: 'file',
      description: 'Voz o recitado de este poema.',
      options: {
        accept: audioAccept,
      },
    }),
    defineField({
      name: 'volumenAudioPoema',
      title: 'Volumen del poema (%)',
      type: 'number',
      description: 'Volumen de la narración. 100% usa el volumen normal.',
      initialValue: 100,
      validation: (Rule) => Rule.required().integer().min(0).max(100),
    }),
    defineField({
      name: 'ilustracion',
      title: 'Ilustración del fragmento',
      type: 'image',
      description: 'Ilustración JPG o PNG que acompaña al poema.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      orden: 'orden',
      media: 'ilustracion',
    },
    prepare({ title, orden, media }) {
      return {
        title: `#${orden ?? '?'} - ${title ?? 'Sin título'}`,
        media,
      }
    },
  },
})
