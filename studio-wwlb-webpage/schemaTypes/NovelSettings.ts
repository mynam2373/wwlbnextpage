export default {
  name: 'novelSettings',
  title: 'Configuración y Lore General',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título Principal',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    },
    {
      name: 'aboutTitle',
      title: 'Título - ¿Qué es...?',
      type: 'string',
    },
    {
      name: 'aboutContent',
      title: 'Contenido - ¿Qué es...?',
      type: 'text', // Texto largo
    },
    {
      name: 'settingTitle',
      title: 'Título - El Escenario',
      type: 'string',
    },
    {
      name: 'settingContent',
      title: 'Contenido - El Escenario',
      type: 'text',
    },
  ],
}