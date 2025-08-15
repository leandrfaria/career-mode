'use client'

import { useEffect, useState } from 'react'
import { ChampionshipTabs } from '@/components/Layout/ChampionshipTabs'
import { GameHighlightCard } from '@/components/Games/GameHighlightCard'
import Header from '@/components/Layout/Header'
import { GameDetailsModal } from '@/components/Games/GameDetailsModal'
import { MonthSection } from '@/components/Games/MonthSection'

// Interfaces completas para os tipos de dados
type Game = {
  data: string
  adversario: string
  placar: string
  logoTime: string
  local?: string
  golsTime?: string[]
  assistenciasTime?: string[]
  golsAdversario?: string[]
  jogadoresAmarelados?: string[]
  jogadoresExpulsos?: string[]
  craquePartida?: string
  substituicoesTime?: Array<{ saiu: string; entrou: string; minuto: number }>
  noticiasRelacionadas?: number[]
  descricaoPartida?: string
}

type NewsItem = {
  id: string
  autor: string
  titulo: string
  descricao: string
  data: string
  destaque: boolean
}

type ChampionshipData = {
  calendario: Record<string, Game[]>
}

type Player = {
  nome: string
}

type ElencoData = {
  temporada: string
  elenco: {
    goleiros: Player[]
    defensores: Player[]
    meioCampistas: Player[]
    atacantes: Player[]
  }
}

// **ALINHADO COM OS ARQUIVOS QUE VOCÊ TEM NA PASTA public/data/24-25/**
const championshipFiles: Record<string, string> = {
  'Premier League': 'premier-league.json',
  'Copa da Inglaterra': 'emirates-cup.json', // (FA Cup / Emirates FA Cup)
  'Carabao Cup': 'carabao-cup.json',
  'Champions League': 'champions-league.json',
}

export default function JogosPage() {
  const [selectedChampionship, setSelectedChampionship] = useState<keyof typeof championshipFiles>('Premier League')
  const [games, setGames] = useState<Record<string, Game[]>>({})
  const [lastGame, setLastGame] = useState<Game | null>(null)
  const [nextGame, setNextGame] = useState<Game | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [palestraPlayers, setPalestraPlayers] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const openModal = (game: Game) => {
    setSelectedGame(game)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedGame(null)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setErrorMsg(null)

        const fileName = championshipFiles[selectedChampionship]
        if (!fileName) {
          throw new Error(`Arquivo do campeonato não mapeado: ${selectedChampionship}`)
        }

        // ---- CARREGA JOGOS ----
        const resGames = await fetch(`/data/24-25/${fileName}`)
        if (!resGames.ok) {
          throw new Error(`Falha ao carregar ${fileName} (${resGames.status})`)
        }
        const jsonGames: ChampionshipData = await resGames.json()
        const calendario = jsonGames?.calendario ?? {}
        setGames(calendario)

        const all = Object.values(calendario).flat()

        const realizados = all.filter((j) => j.placar && j.placar !== 'x-x')
        const futuros = all.filter((j) => !j.placar || j.placar === 'x-x')

        realizados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
        setLastGame(realizados.at(-1) ?? null)

        // Próximo jogo com base na data atual
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const trulyFutureGames = futuros
          .filter((game) => {
            const gameDate = new Date(game.data)
            gameDate.setHours(0, 0, 0, 0)
            return gameDate.getTime() >= now.getTime()
          })
          .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

        setNextGame(trulyFutureGames[0] ?? null)

        // ---- CARREGA NOTÍCIAS ----
        const resNews = await fetch('/data/24-25/noticias.json')
        if (resNews.ok) {
          const jsonNews: NewsItem[] = await resNews.json()
          setAllNews(jsonNews)
        } else {
          setAllNews([])
        }

        // ---- CARREGA ELENCO ----
        const resElenco = await fetch('/data/24-25/elenco.json')
        if (resElenco.ok) {
          const jsonElenco: ElencoData = await resElenco.json()
          const normalizedPalestraNames = new Set<string>()

          ;[
            ...jsonElenco.elenco.goleiros,
            ...jsonElenco.elenco.defensores,
            ...jsonElenco.elenco.meioCampistas,
            ...jsonElenco.elenco.atacantes,
          ].forEach((player) => {
            const name = player.nome.trim()
            normalizedPalestraNames.add(name)

            const parts = name.split(' ')
            if (parts.length > 0) normalizedPalestraNames.add(parts[0].trim())
            if (parts.length > 1) normalizedPalestraNames.add(parts[parts.length - 1].trim())
            if (parts.length > 1 && parts[0].endsWith('.')) {
              normalizedPalestraNames.add(parts.slice(1).join(' ').trim())
            }
          })

          setPalestraPlayers(Array.from(normalizedPalestraNames))
        } else {
          setPalestraPlayers([])
        }
      } catch (err: any) {
        console.error('Erro ao carregar JSON:', err)
        setErrorMsg(err?.message ?? 'Erro ao carregar dados')
        setGames({})
        setLastGame(null)
        setNextGame(null)
        setAllNews([])
        setPalestraPlayers([])
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
          <ChampionshipTabs selected={selectedChampionship} onSelect={setSelectedChampionship} />

          {errorMsg && (
            <p className="mb-6 text-center text-red-400">
              {`Não foi possível carregar ${selectedChampionship}. Verifique o arquivo em /public/data/24-25/${championshipFiles[selectedChampionship]}.`}
            </p>
          )}

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

      <GameDetailsModal isOpen={isModalOpen} onClose={closeModal} game={selectedGame} allNews={allNews} />
    </div>
  )
}
