'use client'

import { useEffect, useState } from 'react'
import { ChampionshipTabs } from '@/components/ChampionshipTabs'
import { GameHighlightCard } from '@/components/cards/GameHighlightCard'
import { MonthSection } from '@/components/MonthSection'
import Header from '@/components/Header'

type Game = {
  data: string
  adversario: string
  placar: string
  logoTime: string
  local?: string
  golsTime?: string[]
  golsAdversario?: string[]
  jogadoresExpulsos?: string[]
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/data/24-25/${championshipFiles[selectedChampionship]}`)
        const json: ChampionshipData = await res.json()
        const calendario = json.calendario
        setGames(calendario)

        const all = Object.values(calendario).flat()
        const realizados = all.filter(j => /\d+\s*-\s*\d+/.test(j.placar))
        const futuros = all.filter(j => !/\d+\s*-\s*\d+/.test(j.placar))

        setLastGame(realizados.at(-1) ?? null)
        setNextGame(futuros[0] ?? null)
      } catch (err) {
        console.error('Erro ao carregar JSON:', err)
        setGames({})
        setLastGame(null)
        setNextGame(null)
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

          {Object.entries(games).map(([month, games]) => (
            <MonthSection
              key={month}
              month={month}
              games={games.map((j) => ({
                team: j.adversario,
                date: j.data,
                competition: selectedChampionship,
                score: j.placar === 'x-x' ? undefined : j.placar,
                logoUrl: j.logoTime,
                local: j.local,
                golsTime: j.golsTime,
                golsAdversario: j.golsAdversario,
                jogadoresExpulsos: j.jogadoresExpulsos,
              }))}
            />
          ))}
        </main>
      </div>
    </div>
  )
}
