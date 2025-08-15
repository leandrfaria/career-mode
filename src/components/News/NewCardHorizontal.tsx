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
  const d = new Date(dateString);
  const isValid = !isNaN(d.getTime());
  if (!isValid) return dateString;

  const day = d.getDate().toString().padStart(2, '0');
  const month = d
    .toLocaleString('pt-BR', { month: 'short' })
    .replace('.', '');
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = d.getFullYear();
  return `${day} ${capitalizedMonth} de ${year}`;
}

export function NewsCardHorizontal({
  titulo,
  descricao,
  data,
  imageUrl,
  autor,
}: NewsCardHorizontalProps) {
  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-md flex flex-col sm:flex-row items-stretch overflow-hidden text-white w-full">
      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
        {hasImage && (
          <Image
            src={imageUrl as string}
            alt={titulo}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover"
          />
        )}
      </div>

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

export default NewsCardHorizontal;
