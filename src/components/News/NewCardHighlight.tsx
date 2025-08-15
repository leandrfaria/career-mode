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

/** Formata a data se for válida; caso contrário, retorna o texto original */
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

export function NewsCardHighlight({
  titulo,
  data,
  imageUrl,
}: NewsCardHighlightProps) {
  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
      {hasImage && (
        <Image
          src={imageUrl as string}
          alt={titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      )}

      {/* overlay sempre presente (com ou sem imagem) */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
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

export default NewsCardHighlight;
