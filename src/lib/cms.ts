import config from '@payload-config'
import { getPayload } from 'payload'

export type CMSNews = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  publishedAt?: string | null
  imageAlt?: string | null
  coverImage?: { url?: string | null; alt?: string | null } | string | null
}

export async function getPublishedNews(): Promise<CMSNews[]> {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'news', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 100, depth: 1 })
    return result.docs as unknown as CMSNews[]
  } catch (error) {
    console.error('Não foi possível consultar as notícias do CMS:', error)
    return []
  }
}
