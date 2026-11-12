import type { Metadata } from "next";
import Link from "next/link";
import { news } from "@/data/news";
import SiteCard from "@/components/SiteCard";
import SiteDivider from "@/components/SiteDivider";
import SiteTag from "@/components/SiteTag";
import { getPublishedNews } from "@/lib/cms";

export const metadata: Metadata = { title: "Notícias" };

export default async function NoticiasPage() {
  const cmsNews = await getPublishedNews();
  const published = cmsNews.length ? cmsNews : news;
  return <main id="conteudo" className="container section-block">
    <p className="eyebrow">Comunicação institucional</p>
    <h1>Notícias</h1>
    <p className="page-intro">Notícias em destaque do IPEM-PE. Cada notícia possui uma página interna; quando o texto integral não foi migrado, a página também oferece acesso à publicação original.</p><div className="news-list-label"><SiteTag value="Notícias migradas parcialmente" severity="info" /></div><SiteDivider />
    <div className="news-grid">
      {published.map((item) => <SiteCard key={item.slug} className="news-card" elevation="low" header={<Link className="news-image" href={`/noticias/${item.slug}`}><img src={(typeof item.coverImage === "object" && item.coverImage?.url) || ("image" in item ? item.image : "")} alt={(item.imageAlt || ("alt" in item ? item.alt : ""))} loading="lazy" /></Link>}>
        <div className="news-content"><time>{item.date}</time><h2><Link href={`/noticias/${item.slug}`}>{item.title}</Link></h2><p>{"summary" in item ? item.summary : item.excerpt}</p><Link className="text-link" href={`/noticias/${item.slug}`}>Ler notícia →</Link></div>
      </SiteCard>)}
    </div>
  </main>;
}
