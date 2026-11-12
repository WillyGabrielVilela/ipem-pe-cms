import type { CollectionConfig } from 'payload'

const role = (user: any) => user?.role
const isAdmin = ({ req: { user } }: { req: { user: any } }) => role(user) === 'admin'
const isReviewer = ({ req: { user } }: { req: { user: any } }) => ['admin', 'editor'].includes(role(user))
const isStaff = ({ req: { user } }: { req: { user: any } }) => ['admin', 'editor', 'communication'].includes(role(user))
const isAuthorOrReviewer = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  if (isReviewer({ req: { user } })) return true
  return { author: { equals: user.id } }
}

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Notícia', plural: 'Notícias' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedAt', 'author'] },
  access: {
    read: ({ req }) => {
      if (!req.user) return { status: { equals: 'published' } }
      if (['admin', 'editor'].includes(req.user.role)) return true
      return { author: { equals: req.user.id } }
    },
    create: isStaff,
    update: isAuthorOrReviewer,
    delete: isReviewer,
  },
  versions: { drafts: { autosave: false, schedulePublish: false }, maxPerDoc: 30 },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, label: 'Endereço (slug)' },
    { name: 'summary', type: 'textarea', required: true, maxLength: 300, label: 'Resumo' },
    { name: 'content', type: 'textarea', required: true, label: 'Texto da notícia', admin: { rows: 14, description: 'Texto integral da notícia. Parágrafos separados por linha em branco.' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Imagem de capa' },
    { name: 'imageAlt', type: 'text', label: 'Descrição da imagem (acessibilidade)' },
    { name: 'category', type: 'text', defaultValue: 'Notícias', label: 'Categoria' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [
      { label: 'Rascunho', value: 'draft' },
      { label: 'Aguardando revisão', value: 'pending_review' },
      { label: 'Publicado', value: 'published' },
    ], access: { update: isStaff, create: isStaff } },
    { name: 'publishedAt', type: 'date', label: 'Data de publicação', admin: { date: { pickerAppearance: 'dayAndTime' } }, access: { update: isReviewer, create: isReviewer } },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true, label: 'Autor', admin: { position: 'sidebar', readOnly: true } },
  ],
  hooks: {
    beforeChange: [({ data, req, operation }) => {
      if (operation === 'create' && req.user && !data.author) data.author = req.user.id
      if (req.user?.role === 'communication' && data.status === 'published') throw new Error('A Comunicação não pode publicar diretamente. Envie a notícia para revisão.')
      if (data.status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
      return data
    }],
  },
}
