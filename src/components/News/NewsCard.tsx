import React from 'react';

interface NewsCardProps {
  // mesmos campos do JSON (pode usar só os que precisar)
  id?: string;
  autor?: string;
  titulo: string;
  descricao: string;      // <- vem de "descricao" no JSON
  data?: string;
  destaque?: boolean;
  imageUrl?: string;      // <- vem de "imageUrl" no JSON (opcional)
}

// troque por um caminho de imagem que exista no seu projeto, se preferir
const PLACEHOLDER = '/assets/img/news/placeholder.jpg';

export default function NewsCard({
  titulo,
  descricao,
  imageUrl,
}: NewsCardProps) {
  // se imageUrl vier vazio/undefined, usa placeholder
  const bg = (imageUrl && imageUrl.trim() !== '' ? imageUrl : PLACEHOLDER);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg w-full h-[320px] transition-all duration-300 ease-in-out hover:scale-105 hover:ring hover:ring-emerald-400/30"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 z-0" />
      <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
        <h3
          className="text-lg font-bold text-white mb-1 line-clamp-2"
          style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.8)' }}
        >
          {titulo}
        </h3>
        <p
          className="text-sm text-gray-300 line-clamp-3"
          style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.6)' }}
        >
          {descricao}
        </p>
      </div>
    </div>
  );
}
