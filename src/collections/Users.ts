import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: { req: { user: any } }) => user?.role === 'admin'
const canAccessAdmin = ({ req: { user } }: { req: { user: any } }) => Boolean(user)

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'] },
  access: {
    admin: canAccessAdmin,
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [async ({ data, req, operation }) => {
      if (operation === 'create') {
        const existing = await req.payload.count({ collection: 'users', overrideAccess: true })
        if (existing.totalDocs === 0) data.role = 'admin'
      }
      return data
    }],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nome completo' },
    {
      name: 'role', type: 'select', required: true, defaultValue: 'communication',
      options: [
        { label: 'Comunicação', value: 'communication' },
        { label: 'Editor / Revisor', value: 'editor' },
        { label: 'Administrador do portal', value: 'admin' },
      ],
      access: { update: isAdmin, create: isAdmin },
    },
  ],
}
