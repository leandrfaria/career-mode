import { FaFutbol, FaPlane, FaHome, FaDoorOpen } from 'react-icons/fa'

interface GameCardProps {
  team: string
  date: string
  competition: string
  score?: string
  logoUrl: string
  local?: string
  golsTime?: string[]
  golsAdversario?: string[]
  jogadoresExpulsos?: string[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${day} ${capitalizedMonth}`
}

function getGameResultBorder(score?: string): string {
  if (!score) return 'border-transparent'
  const [g1, g2] = score.split('x').map(s => parseInt(s.trim()))
  if (isNaN(g1) || isNaN(g2)) return 'border-transparent'
  if (g1 > g2) return 'border-l-4 border-lime-400'
  if (g1 < g2) return 'border-l-4 border-red-500'
  return 'border-l-4 border-yellow-400'
}

function getBadge(score?: string): string | null {
  if (!score) return null
  const [g1, g2] = score.split('x').map(s => parseInt(s.trim()))
  if (isNaN(g1) || isNaN(g2)) return null
  if (g1 > g2) return 'Vitória'
  if (g1 < g2) return 'Derrota'
  return 'Empate'
}

export function GameCard({
  team,
  date,
  competition,
  score,
  logoUrl,
  local,
  golsTime = [],
  golsAdversario = [],
  jogadoresExpulsos = [],
}: GameCardProps) {
  const isPast = score && /^\d+\s*x\s*\d+$/.test(score)
  const border = getGameResultBorder(score)
  const badge = getBadge(score)

  return (
    <div className={`relative bg-[#1e1e1e] p-5 rounded-lg text-white w-full flex flex-col gap-3 shadow-md hover:scale-[1.01] transition-transform duration-200 ${border}`}>
      {/* Badge */}
      {badge && (
        <span className="absolute top-2 right-3 bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt={team} className="w-12 h-12 object-contain" />
          <span className="text-lg font-bold">{team}</span>
        </div>
        <div className="text-sm text-gray-300 flex items-center gap-2">
          {formatDate(date)}
          {local === 'Casa' && <FaHome className="text-white text-base" />}
          {local === 'Fora' && <FaPlane className="text-white text-base" />}
        </div>
      </div>

      {/* Competition */}
      <p className="text-sm text-gray-400">{competition}</p>

      {/* Score */}
      {isPast && (
        <p className="text-2xl font-extrabold">{score}</p>
      )}

      {/* Extra info only if game already happened */}
      {isPast && (
        <div className="flex flex-col gap-1 text-sm">
          {golsTime.length > 0 && (
            <div className="flex items-start gap-2 text-green-300">
              <FaFutbol className="mt-0.5 text-white" />
              <span>{golsTime.join(', ')}</span>
            </div>
          )}
          {golsAdversario.length > 0 && (
            <div className="flex items-start gap-2 text-red-300">
              <FaFutbol className="mt-0.5 text-white" />
              <span>{golsAdversario.join(', ')}</span>
            </div>
          )}
          {jogadoresExpulsos.length > 0 && (
            <div className="flex items-start gap-2 text-red-500">
              <FaDoorOpen className="mt-0.5 text-white" />
              <span>Expulsos: {jogadoresExpulsos.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
