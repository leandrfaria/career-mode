// components/modals/GameDetailsModal.tsx
import { FaTimes } from 'react-icons/fa';
import { FaFutbol, FaHome, FaPlane, FaTimesCircle } from 'react-icons/fa';

interface GameDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: {
    data: string;
    adversario: string;
    placar: string;
    local?: string;
    logoTime: string;
    golsTime?: string[];
    assistenciasTime?: string[];
    golsAdversario?: string[];
    jogadoresAmarelados?: string[];
    jogadoresExpulsos?: string[];
    descricaoPartida?: string;
    noticiasRelacionadas?: number[];
  } | null;
  allNews: NewsItem[];
}

interface NewsItem {
  id: string;
  autor: string;
  titulo: string;
  descricao: string;
  data: string;
  destaque: boolean;
  imageUrl?: string;
}

function formatDateToFull(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  return date.toLocaleDateString('pt-BR', options);
}

export function GameDetailsModal({ isOpen, onClose, game, allNews }: GameDetailsModalProps) {
  if (!isOpen || !game) return null;

  const isGamePlayed = game.placar && game.placar.includes('-');
  let scorePalestra: string | undefined;
  let scoreAdversario: string | undefined;

  if (isGamePlayed) {
    const match = game.placar.match(/(\d+)[-\sX]?(\d+)/i);
    if (match) {
      scorePalestra = match[1];
      scoreAdversario = match[2];
    }
  }

  const relatedNews = game.noticiasRelacionadas
    ? allNews.filter(news => game.noticiasRelacionadas?.includes(parseInt(news.id)))
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Adicionado a classe 'custom-scrollbar' aqui */}
      <div className="bg-[#1e1e1e] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative text-white custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl"
        >
          <FaTimes />
        </button>

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-300 absolute top-4 left-6">
                <span>{formatDateToFull(game.data)}</span>
                {game.local === 'Casa' && <FaHome className="text-white text-base" />}
                {game.local === 'Fora' && <FaPlane className="text-white text-base" />}
            </div>
          </div>

          {/* Ajustes no espaçamento e tamanho dos logos/nomes/placar */}
          <div className="flex items-center justify-center mt-8 mb-4">
            <div className="flex flex-col items-center flex-1 pr-4">
              <img src="/assets/img/logo.png" alt="Palestra Italia" className="w-20 h-20 object-contain" />
              <span className="text-lg font-bold text-center mt-1">Palestra Italia</span>
            </div>

            {isGamePlayed && scorePalestra && scoreAdversario ? (
              <div className="flex-shrink-0 text-center mx-2">
                <p className="text-5xl font-extrabold text-white leading-none">
                  {scorePalestra} <span className="text-gray-400 text-4xl mx-0.5">x</span> {scoreAdversario}
                </p>
              </div>
            ) : (
              <div className="flex-shrink-0 text-center mx-2">
                <p className="text-4xl font-extrabold text-gray-400">vs</p>
              </div>
            )}

            <div className="flex flex-col items-center flex-1 pl-4">
              <img src={game.logoTime} alt={game.adversario} className="w-20 h-20 object-contain" />
              <span className="text-lg font-bold text-center mt-1">{game.adversario}</span>
            </div>
          </div>
        </div>

        {isGamePlayed && (
          <div className="p-6 border-b border-gray-700">
            {/* Gols: nome - icone bola - nome, com espaçamento ajustado */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-4">
              {(game.golsTime && game.golsTime.length > 0) || (game.golsAdversario && game.golsAdversario.length > 0) ? (
                <>
                  {game.golsTime && game.golsTime.map((gol, index) => (
                    <div key={`palestra-gol-${index}`} className="flex items-center justify-center gap-4 text-sm text-white">
                      <span>{gol}</span>
                      <FaFutbol className="text-white text-base" />
                      {game.golsAdversario && game.golsAdversario[index] ? (
                        <span>{game.golsAdversario[index]}</span>
                      ) : (
                        <span className="w-[calc(var(--player-name-width))]"></span>
                      )}
                    </div>
                  ))}

                  {/* Caso o adversário tenha mais gols que o Palestra */}
                  {game.golsAdversario && game.golsTime && game.golsAdversario.slice(game.golsTime.length).map((gol, index) => (
                    <div key={`adversario-gol-${index}`} className="flex items-center justify-center gap-4 text-sm text-white">
                      <span className="w-[calc(var(--player-name-width))] text-right"></span>
                      <FaFutbol className="text-white text-base" />
                      <span>{gol}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center text-gray-400 text-sm">Nenhum gol marcado.</p>
              )}
            </div>

            {/* Jogadores Expulsos - Centralizado, apenas ícone e nome */}
            {game.jogadoresExpulsos && game.jogadoresExpulsos.length > 0 && (
              <div className="flex justify-center mt-6"> {/* Alterado mt-4 para mt-6 para mais espaçamento */}
                <div className="flex items-center gap-1 text-white text-sm">
                  <FaTimesCircle className="text-red-500 text-lg" />
                  <span>{game.jogadoresExpulsos.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {game.descricaoPartida && game.descricaoPartida.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold mb-3">Descrição da Partida</h3>
            <p className="text-gray-300 text-base leading-relaxed">{game.descricaoPartida}</p>
          </div>
        )}

        {relatedNews.length > 0 && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3">Notícias Relacionadas</h3>
            <div className="space-y-4">
              {relatedNews.map(news => (
                <div key={news.id} className="flex items-start bg-gray-800 rounded-md shadow-md p-3">
                  {news.imageUrl && (
                    <div className="flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 overflow-hidden rounded-md mr-4">
                      <img
                        src={news.imageUrl}
                        alt={news.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">
                      {news.autor} - {formatDateToFull(news.data)}
                    </p>
                    <h4 className="text-lg font-semibold text-white mb-1">{news.titulo}</h4>
                    <p className="text-gray-300 text-sm line-clamp-2">{news.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}