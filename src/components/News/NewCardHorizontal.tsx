import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';

interface NewsCardHorizontalProps {
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

export function NewsCardHorizontal({
  titulo,
  descricao,
  data,
  imageUrl,
  autor,
}: NewsCardHorizontalProps) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-md flex flex-col sm:flex-row items-center overflow-hidden text-white w-full">
      {imageUrl && (
        <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
          <Image
            src={imageUrl}
            alt={titulo}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
          />
        </div>
      )}
      <div className="p-4 flex-1">
        <p className="text-xs text-gray-400 mb-1">{autor}</p>
        <h3 className="text-lg font-bold mb-2 leading-tight line-clamp-2">
          {titulo}
        </h3>
        <p className="text-sm text-gray-300 mb-3 line-clamp-3">
          {descricao}
        </p>
        <div className="flex items-center text-gray-400 text-xs">
          <FaCalendarAlt className="mr-1" />
          <span>{formatDateCard(data)}</span>
        </div>
      </div>
    </div>
  );
}
