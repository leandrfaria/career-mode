// app/jogos/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { ChampionshipTabs } from '@/components/ChampionshipTabs'
import { GameHighlightCard } from '@/components/cards/GameHighlightCard'
import { MonthSection } from '@/components/MonthSection'
import Header from '@/components/Header'
import { GameDetailsModal } from '@/components/GameDetailsModal'; // Certifique-se de que o caminho está correto

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

  // ESTADOS E FUNÇÕES PARA O MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [allNews, setAllNews] = useState<NewsItem[]>([]); // Estado para todas as notícias

  const openModal = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };
  // FIM DOS ESTADOS E FUNÇÕES PARA O MODAL

  useEffect(() => {
    async function fetchData() {
      try {
        // Carregar dados dos jogos
        const resGames = await fetch(`/data/24-25/${championshipFiles[selectedChampionship]}`)
        const jsonGames: ChampionshipData = await resGames.json()
        const calendario = jsonGames.calendario
        setGames(calendario)

        const all = Object.values(calendario).flat()

        const realizados = all.filter(j => j.placar !== 'x-x')
        const futuros = all.filter(j => j.placar === 'x-x')

        realizados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        futuros.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

        setLastGame(realizados.at(-1) ?? null)
        setNextGame(futuros[0] ?? null)

        // Carregar dados das notícias
        const resNews = await fetch('/data/24-25/noticias.json');
        const jsonNews: NewsItem[] = await resNews.json();
        setAllNews(jsonNews);

      } catch (err) {
        console.error('Erro ao carregar JSON:', err)
        setGames({})
        setLastGame(null)
        setNextGame(null)
        setAllNews([]);
      }
    }

    fetchData()
  }, [selectedChampionship])

  return (
    <div className="relative min-h-screen text-white">
      {/* Fundo com imagem do estádio */}
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />

      {/* Conteúdo principal com scroll */}
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
                // INJETANDO OS DADOS COMPLETOS E A FUNÇÃO DE CLIQUE AQUI
                descricaoPartida: j.descricaoPartida, // <-- Garante que a descrição é passada
                noticiasRelacionadas: j.noticiasRelacionadas, // <-- Garante que as notícias relacionadas são passadas
                onClick: () => openModal(j), // <-- AQUI É ONDE A FUNÇÃO openModal É ATRIBUÍDA
              }))}
            />
          ))}
        </main>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DO MODAL */}
      <GameDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        game={selectedGame}
        allNews={allNews} // Passa todas as notícias para o modal
      />
    </div>
  )
}