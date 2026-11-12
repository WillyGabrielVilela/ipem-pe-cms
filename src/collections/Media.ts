import type { CollectionConfig } from 'payload'

const canManage = ({ req }: { req: { user: any } }) => ['admin', 'editor', 'communication'].includes(req.user?.role)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Arquivo de mídia', plural: 'Biblioteca de mídia' },
  access: { read: () => true, create: canManage, update: canManage, delete: ({ req }) => ['admin', 'editor'].includes(req.user?.role) },
  upload: { mimeTypes: ['image/*', 'application/pdf'], imageSizes: [{ name: 'thumbnail', width: 480 }, { name: 'card', width: 900 }] },
  fields: [{ name: 'alt', type: 'text', label: 'Texto alternativo' }, { name: 'caption', type: 'text', label: 'Legenda' }],
}
