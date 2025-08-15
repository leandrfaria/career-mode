import { GameCard } from "./GameCard"


interface Game {
  team: string;
  date: string;
  competition: string;
  score?: string;
  logoUrl: string;
  local?: string;
  golsTime?: string[];
  golsAdversario?: string[];
  jogadoresExpulsos?: string[];
  craquePartida?: string;        
  palestraPlayers?: string[];    
  onClick?: () => void;
  descricaoPartida?: string;
  noticiasRelacionadas?: number[];
}


interface MonthSectionProps {
  month: string
  games: Game[]
}

export function MonthSection({ month, games }: MonthSectionProps) {
  return (
    <div className="w-full mt-8">
      <h3 className="text-white text-lg font-bold mb-4">{month}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, idx) => (
          // <GameCard key={idx} {...game} /> // Linha original
          <GameCard key={idx} {...game} onClick={game.onClick} /> 
        ))}
      </div>
    </div>
  )
}