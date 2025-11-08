'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Scale, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from './navbar'
import Footer from './footer'
import CalculadoraRangos from './calculadora-rangos'
import ComparadorNormas from './comparador-normas'

export default function RecursosPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const tools = [
    {
      id: 'calculadora',
      title: 'Calculadora de Rangos',
      description: 'Calcula los rangos de espesor y diámetro permitidos según ASME IX, AWS D1.1 e ISO 9606',
      icon: Calculator,
      component: CalculadoraRangos
    },
    {
      id: 'comparador',
      title: 'Comparador de Normas',
      description: 'Compara requisitos y diferencias entre ASME IX, AWS D1.1 e ISO 9606',
      icon: Scale,
      component: ComparadorNormas
    }
  ]

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null)
    } else {
      setActiveTool(toolId)
    }
  }

  const ActiveComponent = activeTool 
    ? tools.find(t => t.id === activeTool)?.component 
    : null

  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-[#FF7A00]/10 rounded-full">
                  <Sparkles className="w-12 h-12 text-[#FF7A00]" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Centro de Recursos Técnicos
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                Herramientas prácticas para profesionales de soldadura: calculadora de rangos, comparador de normas y más.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {tools.map((tool, index) => {
                const Icon = tool.icon
                const isActive = activeTool === tool.id
                
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleToolClick(tool.id)}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? 'border-[#FF7A00] bg-[#FF7A00]/10'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          isActive ? 'bg-[#FF7A00]/20' : 'bg-gray-800'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isActive ? 'text-[#FF7A00]' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {tool.description}
                          </p>
                        </div>
                        <ArrowRight className={`w-5 h-5 transition-transform ${
                          isActive ? 'text-[#FF7A00] rotate-90' : 'text-gray-500'
                        }`} />
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Active Tool Component */}
            {ActiveComponent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                  <ActiveComponent />
                </div>
              </motion.div>
            )}

            {/* Additional Resources */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Más Recursos
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/herramientas/posiciones"
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-[#FF7A00] hover:bg-gray-900 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">
                    Equivalencia de Posiciones
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Tabla comparativa de posiciones AWS/ISO/EN
                  </p>
                </Link>
                
                <Link
                  href="/herramientas/defectos"
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-[#FF7A00] hover:bg-gray-900 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">
                    Guía de Defectos
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Identificación y prevención de defectos de soldadura
                  </p>
                </Link>
                
                <Link
                  href="/plantillas"
                  className="p-6 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-[#FF7A00] hover:bg-gray-900 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">
                    Plantillas WPS/WPQ
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Formatos preconfigurables para calificaciones
                  </p>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

