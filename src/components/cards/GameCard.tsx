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
  craquePartida?: string;
  palestraPlayers: string[];
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

const normalizeExpelledName = (expelledString: string): string => {
  // Remove o minuto se presente (ex: "Leandro 4'" -> "Leandro")
  return expelledString.replace(/\s\d+'$/, '').trim();
};

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
  craquePartida = '',
  palestraPlayers = [],
  onClick
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

  // Primeiro, filtre e normalize os jogadores expulsos para remover entradas vazias ou inválidas
  const cleanedJogadoresExpulsos = jogadoresExpulsos.filter(jogador => {
    const normalized = normalizeExpelledName(jogador);
    return normalized !== ''; // Garante que apenas nomes não vazios permaneçam
  });

  // Separa os jogadores expulsos entre Palestra e Adversário usando a lista limpa
  const expulsosPalestra = cleanedJogadoresExpulsos.filter(jogador => {
    const normalizedName = normalizeExpelledName(jogador);
    return palestraPlayers.includes(normalizedName);
  });

  const expulsosAdversario = cleanedJogadoresExpulsos.filter(jogador => {
    const normalizedName = normalizeExpelledName(jogador);
    return !palestraPlayers.includes(normalizedName);
  });

  // Verifica se há algum jogador expulso (do Palestra ou adversário) na lista limpa
  const hasExpelledPlayers = expulsosPalestra.length > 0 || expulsosAdversario.length > 0;

  return (
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
              {/* Gols do time da casa - cada gol em uma nova linha */}
              <div className="flex-1 text-left text-white flex flex-col">
                {golsTime.flatMap(gol =>
                  gol.split(', ').map((playerGol, index) => (
                    <span key={playerGol + index}>{playerGol}</span>
                  ))
                )}
              </div>
              {/* Ícone de gol centralizado */}
              <FaFutbol className="text-white text-base flex-shrink-0 mx-2" />
              {/* Gols do time adversário - cada gol em uma nova linha */}
              <div className="flex-1 text-right text-white flex flex-col">
                {golsAdversario.flatMap(gol =>
                  gol.split(', ').map((playerGol, index) => (
                    <span key={playerGol + index}>{playerGol}</span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Seção de Jogadores Expulsos - só renderiza se houver jogadores expulsos */}
          {hasExpelledPlayers && (
            <div className="flex items-center justify-between mt-6 pb-1">
              {/* Jogadores expulsos do Palestra Italia */}
              <div className="flex-1 text-left text-white flex flex-col">
                {expulsosPalestra.map((jogador, index) => (
                  <span key={index}>{jogador}</span>
                ))}
              </div>
              {/* Ícone de expulsão centralizado - renderizado condicionalmente */}
              <FaTimesCircle className="text-base text-red-500 flex-shrink-0 mx-2" />
              {/* Jogadores expulsos do time adversário */}
              <div className="flex-1 text-right text-white flex flex-col">
                {expulsosAdversario.map((jogador, index) => (
                  <span key={index}>{jogador}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
