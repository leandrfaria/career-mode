'use client'

import { useEffect, useState } from "react"
import PlayerStatCard from "@/components/cards/PlayerStatCard"
import Header from "@/components/Header"

type Jogador = {
  imagem: string
  nome: string
  overall: number
  idade: number
  posicao: string
  gols: number
  assistencias: number
  nacionalidade?: string
  numero?: string
  jogos?: number
}

type ElencoData = {
  elenco: {
    goleiros: Jogador[]
    defensores: Jogador[]
    meioCampistas: Jogador[]
    atacantes: Jogador[]
  }
}

export default function ElencoPage() {
  const [elenco, setElenco] = useState<ElencoData['elenco'] | null>(null)

  useEffect(() => {
    fetch('/data/24-25/elenco.json')
      .then((res) => res.json())
      .then((data: ElencoData) => setElenco(data.elenco))
      .catch((err) => console.error("Erro ao carregar elenco:", err))
  }, [])

  const renderPlayers = (jogadores: Jogador[]) =>
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
    ))

  if (!elenco) {
    return (
      <div className="text-white text-center mt-10">
        Carregando elenco...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-[url('/assets/img/estadio/allianz1.jpg')] bg-top bg-no-repeat bg-cover" />
      <div className="fixed inset-0 -z-10 bg-black/80" />
      <div className="relative z-10">
        <Header />
        <main className="px-6 py-10 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center">ELENCO 2024/2025</h1>

          {/* Goleiros */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Goleiros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(elenco.goleiros)}
            </div>
          </section>

          {/* Defensores */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Defensores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(elenco.defensores)}
            </div>
          </section>

          {/* Meio-campistas */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Meio-campistas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(elenco.meioCampistas)}
            </div>
          </section>

          {/* Atacantes */}
          <section className="mb-10">
            <h2 className="text-base font-semibold tracking-widest uppercase text-gray-400 mb-4">Atacantes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {renderPlayers(elenco.atacantes)}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
