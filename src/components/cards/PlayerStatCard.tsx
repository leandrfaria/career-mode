import { FaFutbol, FaHandshake, FaStopwatch, FaStar } from "react-icons/fa";

type PlayerStatCardProps = {
  imagem: string;
  nome: string;
  overall: number;
  idade: number;
  posicao: string;
  gols: number;
  assistencias: number;
  nacionalidade?: string;
  numero?: string;
  jogos?: number;
};

const bandeirasISO: { [pais: string]: string } = {
  Brasil: "br",
  Argentina: "ar",
  Uruguai: "uy",
  Paraguai: "py",
  Colômbia: "co",
  Inglaterra: "gb",
  México: "mx",
  Escócia: "gb",
};

export default function PlayerStatCard({
  imagem,
  nome,
  overall,
  idade,
  posicao,
  gols,
  assistencias,
  nacionalidade,
  jogos,
}: PlayerStatCardProps) {
  const codigoPais = nacionalidade ? bandeirasISO[nacionalidade] : null;

  return (
    <div className="relative flex w-full max-w-[360px] h-[200px] bg-[#111]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Imagem lateral */}
      <div className="w-[38%] h-full">
        <img
          src={imagem}
          alt={nome}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top rounded-l-xl image-rendering-auto"
          style={{ imageRendering: "auto" }}
        />
      </div>

      {/* Conteúdo do card */}
      <div className="flex flex-col justify-between px-4 py-3 flex-1">
        {/* Badge de overall */}
        <div className="absolute top-2 right-2 bg-neutral-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm z-10">
          <FaStar className="inline-block text-white text-sm mr-1" /> {overall}
        </div>

        {/* Nome, posição e nacionalidade */}
        <div className="flex flex-col gap-1">
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            {codigoPais && (
              <img
                src={`https://flagcdn.com/w20/${codigoPais}.png`}
                alt={nacionalidade}
                title={nacionalidade}
                className="w-5 h-4 rounded-sm border border-gray-500"
              />
            )}
            {nome}
          </h3>
          <p className="text-sm text-gray-400">{posicao}</p>
        </div>

        {/* Idade */}
        <div className="text-white text-sm">{idade} anos</div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-center mt-2">
          <div>
            <FaFutbol className="mx-auto text-white text-lg mb-1" />
            <div className="text-white font-semibold text-sm">{gols}</div>
            <div className="text-[11px] text-gray-400">Gols</div>
          </div>
          <div>
            <FaHandshake className="mx-auto text-white text-lg mb-1" />
            <div className="text-white font-semibold text-sm">{assistencias}</div>
            <div className="text-[11px] text-gray-400">Assistências</div>
          </div>
          {jogos !== undefined && (
            <div>
              <FaStopwatch className="mx-auto text-white text-lg mb-1" />
              <div className="text-white font-semibold text-sm">{jogos}</div>
              <div className="text-[11px] text-gray-400">Jogos</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
