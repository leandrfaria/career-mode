import Header from '@/components/Layout/Header';
import LastMatchCard from '@/components/Games/LastMatchCard';
import PlayerCard from '@/components/Players/PlayerCard';
import NextMatchCard from '@/components/Games/NextMatchCard';
import NewsCard from '@/components/News/NewsCard';

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Imagem de fundo e overlay escuro atrás de tudo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/90" />
      </div>

      {/* Conteúdo principal sobre o fundo */}
      <div className="relative z-10">
        <Header />
        <main className="text-white px-6 py-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-10">2025 - 2026</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <LastMatchCard
              logo="/assets/img/times/gremio.png"
              adversario="Grêmio"
              resultado="1 – 2"
              data="22 de abril de 2024"
            />

            <PlayerCard
              imagem="/assets/img/jogadores/veiga.png"
              nome="Raphael Veiga"
              funcao="Meio Campo"
            />

            <NextMatchCard
              adversario="Internacional"
              data="25 de abril de 2024"
              logo="/assets/img/times/internacional.png"
            />

            <NewsCard
              titulo="Palmeiras vence fora de casa"
              resumo="O Palmeiras conquistou uma vitória importante sobre o Grêmio na última rodada."
              imagemFundo="/assets/img/noticias/paulinho-gol.jpg"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
