// components/cards/GameCard.tsx
import { FaFutbol, FaPlane, FaHome, FaTimesCircle } from 'react-icons/fa';

interface GameCardProps {
  team: string;
  date: string;
  competition: string;
  score?: string;
  logoUrl: string;
  local?: string;
  golsTime?: string[];
  golsAdversario?: string[];
  jogadoresExpulsos?: string[];
  // Nova prop para o clique
  onClick?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${day} ${capitalizedMonth}`
}

function getBadgeColorClass(score?: string): string {
  if (!score) return 'bg-gray-700 text-gray-300';

  const match = score.match(/(\d+)[-\sX]?(\d+)/i);
  if (!match) return 'bg-gray-700 text-gray-300';

  const g1 = parseInt(match[1]);
  const g2 = parseInt(match[2]);

  if (isNaN(g1) || isNaN(g2)) return 'bg-gray-700 text-gray-300';

  if (g1 > g2) return 'bg-lime-600 text-white';
  if (g1 < g2) return 'bg-red-600 text-white';
  return 'bg-yellow-500 text-black';
}

function getBadgeText(score?: string): string | null {
  if (!score) return null
  const match = score.match(/(\d+)[-\sX]?(\d+)/i);
  if (!match) return null;

  const g1 = parseInt(match[1]);
  const g2 = parseInt(match[2]);

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
  onClick // Recebe a nova prop
}: GameCardProps) {
  const isPast = score && /^\d+\s*[-\sX]?\s*\d+$/i.test(score);
  const badgeText = getBadgeText(score);
  const badgeColorClass = getBadgeColorClass(score);

  let scorePalestra: string | undefined;
  let scoreAdversario: string | undefined;

  if (isPast && score) {
    const match = score.match(/(\d+)[-\sX]?(\d+)/i);
    if (match) {
      scorePalestra = match[1];
      scoreAdversario = match[2];
    }
  }

  return (
    // Adiciona o onClick e cursor-pointer
    <div
      className={`relative bg-[#1e1e1e] p-5 rounded-lg text-white w-full flex flex-col gap-3 shadow-md hover:scale-[1.01] transition-transform duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {badgeText && (
        <span className={`absolute top-2 left-3 ${badgeColorClass} text-xs font-bold px-2 py-0.5 rounded-full z-10`}>
          {badgeText}
        </span>
      )}

      <div className="absolute top-3 right-3 text-sm text-gray-300 flex items-center gap-2">
        {formatDate(date)}
        {local === 'Casa' && <FaHome className="text-white text-base" />}
        {local === 'Fora' && <FaPlane className="text-white text-base" />}
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="flex flex-col items-center flex-1 pr-2">
          <img src="/assets/img/logo.png" alt="Palestra Italia" className="w-16 h-16 object-contain" />
          <span className="text-sm font-bold text-center mt-1">Palestra Italia</span>
        </div>

        {isPast && scorePalestra && scoreAdversario ? (
          <div className="flex-shrink-0 text-center mx-2">
            <p className="text-4xl font-extrabold text-white leading-none">
              {scorePalestra} <span className="text-gray-400 text-3xl mx-0.5">x</span> {scoreAdversario}
            </p>
          </div>
        ) : (
          <div className="flex-shrink-0 text-center mx-2">
            <p className="text-4xl font-extrabold text-gray-400">vs</p>
          </div>
        )}

        <div className="flex flex-col items-center flex-1 pl-2">
          <img src={logoUrl} alt={team} className="w-16 h-16 object-contain" />
          <span className="text-sm font-bold text-center mt-1">{team}</span>
        </div>
      </div>

      {isPast && (
        <div className="pt-3 relative">
          {(golsTime.length > 0 || golsAdversario.length > 0) && (
            <div className="flex items-center justify-between mb-4 mt-2">
              <div className="flex-1 text-left text-white pr-2">
                {golsTime.length > 0 && <span className="mr-1">{golsTime.join(', ')}</span>}
              </div>
              <FaFutbol className="text-white text-base flex-shrink-0" />
              <div className="flex-1 text-right text-white pl-2">
                {golsAdversario.length > 0 && <span className="ml-1">{golsAdversario.join(', ')}</span>}
              </div>
            </div>
          )}

          {jogadoresExpulsos.length > 0 && (
            <div className="flex justify-center mt-4 pb-1">
                <div className="flex items-center gap-1">
                    <FaTimesCircle className="text-base text-red-500" />
                    <span className="text-sm text-white">{jogadoresExpulsos.join(', ')}</span>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}