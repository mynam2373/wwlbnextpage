import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'wwlb webpage',
  basePath: '/studio',

  projectId: 'vru32lc4',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Audio general')
              .child(S.document().schemaType('globalAudio').documentId('globalAudio')),
            S.documentTypeListItem('siteImage').title('Imágenes generales'),
            ...S.documentTypeListItems().filter(
              (item) => !['globalAudio', 'siteImage'].includes(item.getId() || ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
