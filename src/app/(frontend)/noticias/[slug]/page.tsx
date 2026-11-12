import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { news } from '@/data/news'
import { getPublishedNews } from '@/lib/cms'
import SiteTag from '@/components/SiteTag'
import SiteDivider from '@/components/SiteDivider'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cmsItems = await getPublishedNews()
  const cmsItem = cmsItems.find((entry) => entry.slug === slug)
  const legacyItem = news.find((entry) => entry.slug === slug)
  const item = cmsItem || legacyItem
  return item ? { title: item.title, description: 'summary' in item ? item.summary : item.excerpt } : { title: 'Notícia não encontrada' }
}

export default async function NoticiaDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsItems = await getPublishedNews()
  const cmsItem = cmsItems.find((entry) => entry.slug === slug)
  const legacyItem = news.find((entry) => entry.slug === slug)
  const item = cmsItem || legacyItem
  if (!item) notFound()

  const isCMS = Boolean(cmsItem)
  const image = isCMS && typeof cmsItem?.coverImage === 'object' ? cmsItem.coverImage?.url : (!isCMS && legacyItem ? legacyItem.image : '')
  const alt = isCMS ? (cmsItem?.imageAlt || '') : (legacyItem?.alt || '')
  const date = isCMS ? (cmsItem?.publishedAt ? new Date(cmsItem.publishedAt).toLocaleDateString('pt-BR') : '') : legacyItem?.date
  const summary = isCMS ? cmsItem?.summary : legacyItem?.excerpt
  const content = isCMS ? cmsItem?.content : ''

  return <main id="conteudo" className="container section-block article-page">
    <p className="eyebrow">Comunicação institucional</p>
    <p><Link href="/noticias">← Todas as notícias</Link></p>
    {date && <SiteTag value={date} severity="info" />}
    <h1>{item.title}</h1>
    <SiteDivider />
    {image && <figure className="article-lead-image"><img src={image} alt={alt} /></figure>}
    {summary && <p className="page-intro">{summary}</p>}
    {isCMS && content ? content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Esta versão do portal contém o resumo migrado da publicação. O texto integral da notícia ainda não foi incorporado ao novo site; a versão abaixo é um resumo editorial.</p>}
  </main>
}
