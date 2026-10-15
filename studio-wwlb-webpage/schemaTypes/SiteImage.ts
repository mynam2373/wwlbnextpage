import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteImage',
  title: 'Imagen general',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre de la imagen',
      type: 'string',
      description: 'Usa el ID del punto del mapa o el imageName de una ficha de personaje para asignarla desde el código.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Imagen sin nombre',
        media,
      }
    },
  },
})
