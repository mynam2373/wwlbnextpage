export default {
  name: 'volume',
  title: 'Volúmenes de la Novela',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Volumen',
      type: 'string',
    },
    {
      name: 'premise',
      title: 'Premisa',
      type: 'text',
    },
    {
      name: 'conflict',
      title: 'Conflicto',
      type: 'text',
    },
    {
      name: 'climax',
      title: 'Clímax',
      type: 'text',
    },
  ],
}