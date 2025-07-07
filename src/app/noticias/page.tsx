'use client'

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Carousel } from '@/components/Carousel'; // Importe o componente Carousel
import { NewsCardHighlight } from '@/components/cards/NewCardHighlight';
import { NewsCardHorizontal } from '@/components/cards/NewCardHorizontal';


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

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/data/24-25/noticias.json');
        const newsData: NewsItem[] = await res.json();

        // Ordenar notícias por data (mais recente primeiro)
        newsData.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        // Separar notícias de destaque e notícias comuns
        const highlights = newsData.filter(news => news.destaque);
        const regulars = newsData.filter(news => !news.destaque);

        setAllNews(newsData);
        setHighlightNews(highlights);
        setRegularNews(regulars);

      } catch (err) {
        console.error('Erro ao carregar notícias:', err);
        setAllNews([]);
        setHighlightNews([]);
        setRegularNews([]);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* Fundo com imagem do estádio (mantendo o padrão das outras páginas) */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />

      {/* Conteúdo principal com scroll */}
      <div className="relative z-10">
        <Header />

        <main className="px-6 py-10 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Últimas Notícias</h1>

          {/* Seção de Notícias de Destaque (Carrossel) */}
          {highlightNews.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Destaques</h2>
              <Carousel itemsPerPage={3}> {/* Mostra 3 itens por vez no carrossel */}
                {highlightNews.map(news => (
                  <div key={news.id} className="p-2"> {/* Adiciona padding para espaçamento entre os cards no carrossel */}
                    <NewsCardHighlight {...news} />
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Seção de Notícias Comuns (Layout Horizontal) */}
          {regularNews.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Outras Notícias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Layout de duas colunas em telas maiores */}
                {regularNews.map(news => (
                  <NewsCardHorizontal key={news.id} {...news} />
                ))}
              </div>
            </section>
          )}

          {allNews.length === 0 && (
            <p className="text-center text-gray-400">Nenhuma notícia encontrada.</p>
          )}
        </main>
      </div>
    </div>
  );
}
