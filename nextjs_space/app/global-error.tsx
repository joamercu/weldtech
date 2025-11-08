'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="es">
      <body className="antialiased">
        <div className="min-h-screen bg-[#0F1216] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">
                Error crítico
              </h1>
              <p className="text-gray-400">
                Ocurrió un error crítico en la aplicación. Por favor, recarga la página.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  ID de error: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-[#FF7A00] hover:bg-[#FF8A1A] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Intentar de nuevo
              </button>
              
              <Link
                href="/"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Ir al inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  )
}

