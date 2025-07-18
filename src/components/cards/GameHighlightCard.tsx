import { FaHome, FaPlane } from 'react-icons/fa'

interface GameHighlightCardProps {
  title: string
  team: string
  date: string
  competition: string
  logoUrl: string
  score?: string
  local?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
  const year = date.getFullYear()
  return `${day} ${capitalizedMonth} ${year}`
}

export function GameHighlightCard({
  title,
  team,
  date,
  competition,
  logoUrl,
  score,
  local,
}: GameHighlightCardProps) {
  const isGamePlayed = score && score.includes('-');

  let homeScore: string | undefined;
  let awayScore: string | undefined;

  if (isGamePlayed) {
    const scores = score.split('-');
    homeScore = scores[0];
    awayScore = scores[1];
  }

  return (
    <div className="bg-[#1e1e1e] text-white rounded-2xl px-10 py-6 w-full max-w-xl shadow-lg">
      {/* Top row: Title + Date/Location */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>{formatDate(date)}</span>
          {local === 'Casa' ? (
            <FaHome className="text-white ml-1" />
          ) : (
            <FaPlane className="text-white ml-1" />
          )}
        </div>
      </div>

      {/* Center row: Teams and Score */}
      <div className="grid grid-cols-3 items-center text-center">
        {/* Time 1 (Palestra Italia) */}
        <div className="flex flex-col items-center gap-2 truncate">
          <div className="w-14 h-14">
            <img
              src="/assets/img/logo.png"
              alt="Palmeiras"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold truncate max-w-[120px]">Palestra Italia</span>
        </div>

        {/* Placar ou "x" */}
        <div className="text-center">
          {isGamePlayed ? (
            <p className="text-4xl font-extrabold text-white leading-none"> {/* Alterado de text-5xl para text-4xl */}
              {homeScore} <span className="text-gray-400 text-3xl mx-0.5">x</span> {awayScore} {/* Alterado de text-4xl para text-3xl */}
            </p>
          ) : (
            <div className="text-2xl font-bold text-gray-200">x</div>
          )}
        </div>

        {/* Time 2 (Adversário) */}
        <div className="flex flex-col items-center gap-2 truncate">
          <div className="w-14 h-14">
            <img
              src={logoUrl}
              alt={team}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold truncate max-w-[120px]">{team}</span>
        </div>
      </div>
    </div>
  )
}