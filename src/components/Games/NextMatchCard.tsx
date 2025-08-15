import { FaRegCalendarAlt } from 'react-icons/fa';

type NextMatchCardProps = {
  adversario: string;
  data: string;
  logo: string;
};

export default function NextMatchCard({ adversario, data, logo }: NextMatchCardProps) {
  return (
    <div className="bg-[#0f1f17] rounded-xl p-6 text-white shadow-lg flex flex-col items-center justify-between w-full h-[320px] transition-all duration-300 ease-in-out hover:scale-105 hover:ring hover:ring-emerald-400/30">
      <p className="text-base font-semibold tracking-widest text-gray-300 uppercase mb-2">Próximo Jogo</p>
      <img src={logo} alt={`Logo do ${adversario}`} className="w-20 h-20 object-contain mb-4" />
      <h3 className="text-lg font-bold">{adversario}</h3>
      <div className="flex items-center gap-2 mt-2 text-gray-400 italic text-sm">
        <FaRegCalendarAlt size={14} />
        <span>{data}</span>
      </div>
    </div>
  );
}
