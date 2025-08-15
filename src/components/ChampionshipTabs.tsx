interface ChampionshipTabsProps {
  selected: string
  onSelect: (championship: string) => void
}

// **As abas agora batem com os arquivos mapeados em page.tsx**
const championships = ['Premier League', 'Copa da Inglaterra', 'Carabao Cup']

export function ChampionshipTabs({ selected, onSelect }: ChampionshipTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-6 px-2">
        {championships.map((name) => (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`relative pb-2 text-sm md:text-base font-medium transition-colors duration-300 ease-in-out
              ${selected === name ? 'text-white' : 'text-gray-400 hover:text-white'}
            `}
            aria-pressed={selected === name}
            aria-label={`Selecionar ${name}`}
          >
            {name}
            <span
              className={`absolute left-0 -bottom-[1px] h-[2px] rounded bg-green-700 transition-all duration-300 ease-in-out
                ${selected === name ? 'w-full opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}
              `}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
