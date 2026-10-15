import { defineArrayMember, defineField, defineType } from 'sanity'

const audioAccept = 'audio/mpeg,audio/mp3,audio/wav,audio/ogg'

export default defineType({
  name: 'globalAudio',
  title: 'Audio general',
  type: 'document',
  fields: [
    defineField({
      name: 'pistas',
      title: 'Biblioteca de audio',
      type: 'array',
      description: 'Agrega aquí música y efectos de sonido reutilizables en toda la experiencia.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre del audio',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tipo',
              title: 'Tipo de audio',
              type: 'string',
              options: {
                list: [
                  { title: 'Música de fondo', value: 'musica' },
                  { title: 'Efecto de sonido', value: 'efecto' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'eventos',
              title: 'Uso o evento',
              type: 'array',
              description: 'Indica dónde se reproduce la pista. Un efecto puede asociarse a varios eventos.',
              of: [
                defineArrayMember({
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Música de fondo general', value: 'musicaFondoGeneral' },
                      { title: 'Ambiente del modo alternativo', value: 'ambienteModoAlternativo' },
                      { title: 'Al recoger un fragmento', value: 'recogerFragmento' },
                      { title: 'Al completar el Locket', value: 'completarLocket' },
                      { title: 'Latido del modo alternativo', value: 'latidoAlternativo' },
                      { title: 'Clic del modo alternativo', value: 'clicAlternativo' },
                    ],
                    layout: 'radio',
                  },
                }),
              ],
            }),
            defineField({
              name: 'archivo',
              title: 'Archivo de audio',
              type: 'file',
              options: {
                accept: audioAccept,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'volumen',
              title: 'Volumen (%)',
              type: 'number',
              description: 'Volumen relativo de esta pista. 100% usa el volumen normal.',
              initialValue: 100,
              validation: (Rule) => Rule.required().integer().min(0).max(100),
            }),
          ],
          preview: {
            select: {
              title: 'nombre',
              subtitle: 'tipo',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Audio sin nombre',
                subtitle: subtitle === 'efecto' ? 'Efecto de sonido' : 'Música de fondo',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Audio general',
      }
    },
  },
})
