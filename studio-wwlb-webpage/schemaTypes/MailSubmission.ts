import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mailSubmission',
  title: 'Mensajes del buzón',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Nombre o alias',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'message',
      title: 'Pregunta o comentario',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Fecha de envío',
      type: 'datetime',
    }),
    defineField({
      name: 'attachment',
      title: 'Imagen adjunta',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'reply',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(2000),
    }),
    defineField({
      name: 'repliedAt',
      title: 'Fecha de respuesta',
      type: 'datetime',
    }),
    defineField({
      name: 'replyImage',
      title: 'Imagen de respuesta',
      type: 'image',
      options: { hotspot: true },
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
      title: 'author',
      subtitle: 'message',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Anónimo',
        subtitle: subtitle || 'Imagen adjunta',
      };
    },
  },
})
