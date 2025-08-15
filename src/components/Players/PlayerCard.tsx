type PlayerCardProps = {
  imagem: string;
  nome: string;
  funcao: string;
};

export default function PlayerCard({ imagem, nome, funcao}: PlayerCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-[320px] group transition-all duration-300 ease-in-out hover:scale-105 hover:ring hover:ring-emerald-400/30">
      <img
        src={imagem}
        alt={nome}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <h3 className="text-white text-base font-semibold text-center">{nome}</h3>
        <p className="text-sm text-gray-400 text-center italic mt-1">{funcao}</p>
      </div>
    </div>
  );
}
