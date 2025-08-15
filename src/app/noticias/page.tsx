'use client';

import { useEffect, useState } from 'react';
import { NewsCardHorizontal } from '@/components/News/NewCardHorizontal';
import { NewsCardHighlight } from '@/components/News/NewCardHighlight';
import Header from '@/components/Layout/Header';
import { Carousel } from '@/components/News/NewsCarousel';

interface NewsItem {
  id: string;
  autor: string;
  titulo: string;
  descricao: string;
  data: string;
  destaque: boolean;
  imageUrl?: string;
}

export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [highlightNews, setHighlightNews] = useState<NewsItem[]>([]);
  const [regularNews, setRegularNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setError(null);
        const res = await fetch('/data/24-25/noticias.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const newsData: NewsItem[] = await res.json();

        newsData.sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );

        const highlights = newsData.filter((n) => n.destaque);
        const regulars = newsData.filter((n) => !n.destaque);

        setAllNews(newsData);
        setHighlightNews(highlights);
        setRegularNews(regulars);
      } catch (err: any) {
        console.error('Erro ao carregar notícias:', err);
        setError('Não foi possível carregar as notícias agora.');
        setAllNews([]);
        setHighlightNews([]);
        setRegularNews([]);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* Fundo padrão */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />

      <div className="relative z-10">
        <Header />

        <main className="px-6 py-10 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Últimas Notícias</h1>

          {/* Destaques em carrossel */}
          {highlightNews.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Destaques</h2>
              <Carousel itemsPerPage={3}>
                {highlightNews.map((news) => (
                  <div key={news.id} className="px-2">
                    <NewsCardHighlight {...news} />
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Outras notícias em grid */}
          {regularNews.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Outras Notícias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularNews.map((news) => (
                  <NewsCardHorizontal key={news.id} {...news} />
                ))}
              </div>
            </section>
          )}

          {(allNews.length === 0 && !error) && (
            <p className="text-center text-gray-400">Nenhuma notícia encontrada.</p>
          )}
          {error && (
            <p className="mt-6 text-center text-red-300">{error}</p>
          )}
        </main>
      </div>
    </div>
  );
}
