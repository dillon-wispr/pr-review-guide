'use client'

import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

const themes = [
  {
    id: 'dracula',
    label: 'Dracula',
    color: '#bd93f9',
    toast: { bg: '#282a36', border: '#44475a', text: '#f8f8f2' },
  },
  {
    id: 'solarized',
    label: 'Solarized Dark',
    color: '#268bd2',
    toast: { bg: '#073642', border: '#586e75', text: '#93a1a1' },
  },
  {
    id: 'nord',
    label: 'Nord',
    color: '#88c0d0',
    toast: { bg: '#3b4252', border: '#4c566a', text: '#eceff4' },
  },
  {
    id: 'monokai',
    label: 'Monokai',
    color: '#a6e22e',
    toast: { bg: '#272822', border: '#49483e', text: '#f8f8f2' },
  },
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

  const current = themes.find((t) => t.id === theme) ?? themes[0]

  return (
    <>
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
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: current.toast.bg,
            border: `1px solid ${current.toast.border}`,
            color: current.toast.text,
          },
        }}
      />
    </>
  )
}
