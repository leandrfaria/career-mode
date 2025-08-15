'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[--color-background] text-[--color-gray] py-4 px-6 flex items-center justify-between">
      {/* Logo do Palmeiras */}
      <Link href="/">
      <div className="flex items-center gap-3">
        <img
          src="/assets/img/logo.png"
          alt="Palmeiras"
          className="h-10 w-10 object-contain"
        />
      </div>
      </Link>

      {/* Navegação */}
      <nav className="flex gap-6 text-sm sm:text-base font-semibold">
        <Link href="/elenco" className="hover:text-white transition">
          Elenco
        </Link>
        <Link href="/estatisticas" className="hover:text-white transition">
          Estatísticas
        </Link>
        <Link href="/jogos" className="hover:text-white transition">
          Calendário
        </Link>
        <Link href="/noticias" className="hover:text-white transition">
          Notícias
        </Link>
      </nav>
    </header>
  );
}
