import PlayerStatCard from "@/components/cards/PlayerStatCard";
import Header from "@/components/Header";
import elencoData from "@/data/24-25/elenco.json";

export default function ElencoPage() {
  const { goleiros, defensores, meioCampistas, atacantes } = elencoData.elenco;

  const renderPlayers = (jogadores: typeof goleiros) =>
    jogadores.map((jogador, index) => (
      <PlayerStatCard
        key={index}
        imagem={jogador.imagem}
        nome={jogador.nome}
        overall={jogador.overall}
        idade={jogador.idade}
        posicao={jogador.posicao}
        gols={jogador.gols}
        assistencias={jogador.assistencias}
        nacionalidade={jogador.nacionalidade}
        numero={jogador.numero}
        jogos={jogador.jogos}
      />
    ));

  return (
    <div className="relative min-h-screen text-white">
      {/* Imagem de fundo com melhor performance */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />

      {/* Conteúdo principal */}
      <div className="relative z-10">
        <Header />
        <main className="px-6 py-10 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center">ELENCO 2024/2025</h1>

          {/* Goleiros */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Goleiros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(goleiros)}
            </div>
          </section>

          {/* Defensores */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Defensores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(defensores)}
            </div>
          </section>

          {/* Meio-campistas */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Meio-campistas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(meioCampistas)}
            </div>
          </section>

          {/* Atacantes */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Atacantes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(atacantes)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
