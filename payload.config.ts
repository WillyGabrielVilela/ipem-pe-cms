import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import { Users } from './src/collections/Users'
import { News } from './src/collections/News'
import { Media } from './src/collections/Media'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: { user: Users.slug, meta: { titleSuffix: '- CMS IPEM-PE' } },
  editor: lexicalEditor(),
  collections: [Users, News, Media],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' }, push: false }),
  sharp,
  plugins: [vercelBlobStorage({ enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN), collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN, clientUploads: true })],
  typescript: { outputFile: './src/payload-types.ts' },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
})
