'use client'

import { useEffect, useState } from 'react'
import { ChampionshipTabs } from '@/components/ChampionshipTabs'
import { GameHighlightCard } from '@/components/cards/GameHighlightCard'
import { MonthSection } from '@/components/MonthSection'
import Header from '@/components/Header'
import { GameDetailsModal } from '@/components/GameDetailsModal';

// Interfaces completas para os tipos de dados
type Game = {
  data: string
  adversario: string
  placar: string
  logoTime: string
  local?: string
  golsTime?: string[]
  golsAdversario?: string[]
  jogadoresAmarelados?: string[]
  jogadoresExpulsos?: string[]
  craquePartida?: string;
  substituicoesTime?: Array<{ saiu: string; entrou: string; minuto: number }>
  noticiasRelacionadas?: number[]
  descricaoPartida?: string
}

type NewsItem = {
  id: string;
  autor: string;
  titulo: string;
  descricao: string;
  data: string;
  destaque: boolean;
}

type ChampionshipData = {
  calendario: Record<string, Game[]>
}

type Player = {
  nome: string;
  // ... outras propriedades do jogador
}

type ElencoData = {
  temporada: string;
  elenco: {
    goleiros: Player[];
    defensores: Player[];
    meioCampistas: Player[];
    atacantes: Player[];
  };
}


const championshipFiles: Record<string, string> = {
  'Premier League': 'premier-league.json',
  'Copa da Inglaterra': 'copa-da-inglaterra.json',
  'Champions League': 'champions-league.json',
}

export default function JogosPage() {
  const [selectedChampionship, setSelectedChampionship] = useState('Premier League')
  const [games, setGames] = useState<Record<string, Game[]>>({})
  const [lastGame, setLastGame] = useState<Game | null>(null)
  const [nextGame, setNextGame] = useState<Game | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [palestraPlayers, setPalestraPlayers] = useState<string[]>([]);

  const openModal = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const resGames = await fetch(`/data/24-25/${championshipFiles[selectedChampionship]}`)
        const jsonGames: ChampionshipData = await resGames.json()
        const calendario = jsonGames.calendario
        setGames(calendario)

        const all = Object.values(calendario).flat()

        const realizados = all.filter(j => j.placar !== 'x-x')
        const futuros = all.filter(j => j.placar === 'x-x')

        realizados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        setLastGame(realizados.at(-1) ?? null)

        // --- LÓGICA PARA DETERMINAR O PRÓXIMO JOGO CORRETAMENTE ---
        // Para fins de demonstração com os dados de 2024, vamos simular a data atual
        // Se você estiver usando dados com anos mais recentes, pode mudar para:
        // const now = new Date();
        const now = new Date('2024-08-01T00:00:00'); // Simula a data como 1º de Agosto de 2024
        now.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia

        const trulyFutureGames = futuros.filter(game => {
          const gameDate = new Date(game.data);
          gameDate.setHours(0, 0, 0, 0);
          return gameDate.getTime() >= now.getTime();
        });

        trulyFutureGames.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        setNextGame(trulyFutureGames[0] ?? null);
        // --- FIM DA LÓGICA PARA DETERMINAR O PRÓXIMO JOGO CORRETAMENTE ---

        const resNews = await fetch('/data/24-25/noticias.json');
        const jsonNews: NewsItem[] = await resNews.json();
        setAllNews(jsonNews);

        const resElenco = await fetch('/data/24-25/elenco.json');
        const jsonElenco: ElencoData = await resElenco.json();

        const normalizedPalestraNames = new Set<string>();
        [
          ...jsonElenco.elenco.goleiros,
          ...jsonElenco.elenco.defensores,
          ...jsonElenco.elenco.meioCampistas,
          ...jsonElenco.elenco.atacantes,
        ].forEach(player => {
          const name = player.nome.trim();
          normalizedPalestraNames.add(name);

          const parts = name.split(' ');
          if (parts.length > 0) {
            normalizedPalestraNames.add(parts[0].trim());
          }

          if (parts.length > 1) {
            normalizedPalestraNames.add(parts[parts.length - 1].trim());
          }

          if (parts.length > 1 && parts[0].endsWith('.')) {
              normalizedPalestraNames.add(parts.slice(1).join(' ').trim());
          }
        });
        setPalestraPlayers(Array.from(normalizedPalestraNames));

      } catch (err) {
        console.error('Erro ao carregar JSON:', err)
        setGames({})
        setLastGame(null)
        setNextGame(null)
        setAllNews([]);
        setPalestraPlayers([]);
      }
    }

    fetchData()
  }, [selectedChampionship])

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />

      <div className="relative z-10">
        <Header />

        <main className="px-6 py-10 max-w-7xl mx-auto">
          <ChampionshipTabs
            selected={selectedChampionship}
            onSelect={setSelectedChampionship}
          />

          {(lastGame || nextGame) ? (
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
              {lastGame && (
                <GameHighlightCard
                  title="Último Jogo"
                  team={lastGame.adversario}
                  date={lastGame.data}
                  competition={selectedChampionship}
                  logoUrl={lastGame.logoTime}
                  score={lastGame.placar}
                  local={lastGame.local}
                />
              )}
              {nextGame && (
                <GameHighlightCard
                  title="Próximo Jogo"
                  team={nextGame.adversario}
                  date={nextGame.data}
                  competition={selectedChampionship}
                  logoUrl={nextGame.logoTime}
                  local={nextGame.local}
                />
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 mb-10">Datas ainda não confirmadas.</p>
          )}

          {Object.entries(games).map(([month, monthGames]) => (
            <MonthSection
              key={month}
              month={month}
              games={monthGames.map((j) => ({
                team: j.adversario,
                date: j.data,
                competition: selectedChampionship,
                score: j.placar === 'x-x' ? undefined : j.placar,
                logoUrl: j.logoTime,
                local: j.local,
                golsTime: j.golsTime,
                golsAdversario: j.golsAdversario,
                jogadoresExpulsos: j.jogadoresExpulsos,
                craquePartida: j.craquePartida,
                palestraPlayers: palestraPlayers,
                descricaoPartida: j.descricaoPartida,
                noticiasRelacionadas: j.noticiasRelacionadas,
                onClick: () => openModal(j),
              }))}
            />
          ))}
        </main>
      </div>

      <GameDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        game={selectedGame}
        allNews={allNews}
      />
    </div>
  )
}
