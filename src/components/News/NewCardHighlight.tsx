import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';

interface NewsCardHighlightProps {
  id: string;
  autor: string;
  titulo: string;
  descricao: string;
  data: string;
  destaque: boolean;
  imageUrl?: string;
}

function formatDateCard(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = date.getFullYear();
  return `${day} ${capitalizedMonth} de ${year}`;
}

export function NewsCardHighlight({
  titulo,
  data,
  imageUrl,
}: NewsCardHighlightProps) {
  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={titulo}
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

      <div className="relative z-20 p-6 flex flex-col justify-end h-full">
        <h3 className="text-white text-2xl font-bold mb-2 leading-tight line-clamp-2">
          {titulo}
        </h3>
        <div className="flex items-center text-gray-300 text-sm">
          <FaCalendarAlt className="mr-2" />
          <span>{formatDateCard(data)}</span>
        </div>
      </div>
    </div>
  );
}
