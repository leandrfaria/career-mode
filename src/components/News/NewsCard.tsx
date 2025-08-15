interface NewsCardProps {
  titulo: string;
  resumo: string;
  imagemFundo: string;
}

export default function NewsCard({ titulo, resumo, imagemFundo }: NewsCardProps) {
  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg w-full h-[320px] transition-all duration-300 ease-in-out hover:scale-105 hover:ring hover:ring-emerald-400/30"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${imagemFundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 z-0" />
      <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
        <h3
          className="text-lg font-bold text-white mb-1"
          style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.8)' }}
        >
          {titulo}
        </h3>
        <p
          className="text-sm text-gray-300"
          style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.6)' }}
        >
          {resumo}
        </p>
      </div>
    </div>
  );
}
