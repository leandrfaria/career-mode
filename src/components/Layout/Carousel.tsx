import { useState, ReactNode } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
  children: ReactNode[];
  itemsPerPage?: number; // Quantos itens mostrar por vez
}

export function Carousel({ children, itemsPerPage = 3 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalItems = children.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= totalItems ? 0 : prevIndex + itemsPerPage));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerPage < 0 ? (totalPages - 1) * itemsPerPage : prevIndex - itemsPerPage));
  };

  // Calcula os itens a serem exibidos na página atual
  const visibleItems = children.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out"
           style={{ transform: `translateX(-${(currentIndex / itemsPerPage) * 100}%)` }}>
        {children.map((child, index) => (
          <div key={index} className="flex-shrink-0 w-full" style={{ width: `${100 / itemsPerPage}%` }}>
            {child}
          </div>
        ))}
      </div>

      {totalItems > itemsPerPage && ( // Só mostra os botões se houver mais itens que a página
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 z-30"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 z-30"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
}
