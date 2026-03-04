'use client'

import { useEffect, useState } from 'react'

const themes = [
  { id: 'dracula',   label: 'Dracula',        color: '#bd93f9' },
  { id: 'solarized', label: 'Solarized Dark',  color: '#268bd2' },
  { id: 'nord',      label: 'Nord',            color: '#88c0d0' },
  { id: 'monokai',   label: 'Monokai',         color: '#a6e22e' },
]

export function ThemeSwitcher() {
  const [theme, setTheme] = useState('dracula')

  useEffect(() => {
    const saved = localStorage.getItem('theme') ?? 'dracula'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  function applyTheme(id: string) {
    setTheme(id)
    localStorage.setItem('theme', id)
    document.documentElement.setAttribute('data-theme', id)
  }

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => applyTheme(t.id)}
          title={t.label}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
            theme === t.id
              ? 'border-white scale-125'
              : 'border-transparent opacity-50 hover:opacity-90 hover:scale-110'
          }`}
          style={{ backgroundColor: t.color }}
        />
      ))}
    </div>
  )
}
