'use client'

import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F1216] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-[#FF7A00]/10 rounded-full">
            <FileQuestion className="w-12 h-12 text-[#FF7A00]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-white">
            Página no encontrada
          </h2>
          <p className="text-gray-400">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#FF7A00] hover:bg-[#FF8A1A] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </motion.div>
    </div>
  )
}

