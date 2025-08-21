import React from 'react'
import { PillIcon, StethoscopeIcon } from 'lucide-react'

// Array of pill colors with actual color values instead of Tailwind classes
const pillColors = [
  {
    primary: '#3B82F6',
    secondary: 'white',
  },
  {
    primary: '#FBBF24',
    secondary: 'white',
  },
  {
    primary: '#10B981',
    secondary: 'white',
  },
  {
    primary: '#EF4444',
    secondary: 'white',
  },
  {
    primary: '#8B5CF6',
    secondary: 'white',
  },
  {
    primary: '#000000',
    secondary: 'white',
  }, // black
]

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background Pills Pattern */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          zIndex: 0,
        }}
      >
        {/* Generate 30 random pills with different colors and positions */}
        {Array.from({
          length: 30,
        }).map((_, index) => {
          const color =
            pillColors[Math.floor(Math.random() * pillColors.length)]
          const rotation = Math.floor(Math.random() * 360)
          const top = Math.floor(Math.random() * 100)
          const left = Math.floor(Math.random() * 100)
          const opacity = Math.random() * 0.2 + 0.05 // Between 0.05 and 0.25
          const scale = 0.5 + Math.random() * 1.5 // Between 0.5 and 2
          return (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: `rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity,
              }}
            >
              <svg
                width="60"
                height="24"
                viewBox="0 0 60 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24H48C54.627 24 60 18.627 60 12C60 5.373 54.627 0 48 0H12Z"
                  fill={color.primary}
                />
                <path
                  d="M30 0H12C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24H30V0Z"
                  fill={color.secondary}
                />
              </svg>
            </div>
          )
        })}
      </div>
      {/* Main Content - with higher z-index to appear above the pattern */}
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Antibioticoterapia
          </h1>
          <p className="text-blue-700 text-lg">
            Guia clínico de antibióticos e condições para medicina veterinária.
          </p>
        </header>
        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <PillIcon size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Guia de Antibióticos</h2>
            <p className="opacity-90">
              Consulte fármacos, espectro, e use a calculadora de dose.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <StethoscopeIcon size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Guia por Paciente</h2>
            <p className="opacity-90">
              Receba recomendações baseadas no paciente e condição.
            </p>
          </div>
        </div>
        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>
            Ferramenta educacional. Para uso clínico: baseie-se em
            cultura/antibiograma e consensos atualizados.
          </p>
        </footer>
      </div>
    </div>
  )
}