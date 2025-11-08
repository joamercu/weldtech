'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DefectStatus {
  defectId: string
  defectName: string
  hasMain: boolean
  hasCrossSection: boolean
  hasSurfaceView: boolean
  mainPath?: string
  lastModified?: string
}

interface GenerationStatus {
  progress: {
    total: number
    generated: number
    remaining: number
    percentage: number
  }
  defects: Record<string, DefectStatus>
  estimatedTime: {
    perImage: string
    totalRemaining: string
  }
}

export default function GenerationStatus() {
  const [status, setStatus] = useState<GenerationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/images/generate-status')
      
      if (!response.ok) {
        throw new Error('Error al obtener estado')
      }

      const data = await response.json()
      setStatus(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !status) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
            <span className="ml-3 text-gray-300">Cargando estado...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <div className="text-red-400 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button onClick={fetchStatus} className="mt-4" variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) return null

  const defects = Object.values(status.defects)

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5" />
          Estado de Generación de Imágenes
        </CardTitle>
        <CardDescription className="text-gray-300">
          Progreso de generación de imágenes con Abacus.AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progreso General */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Progreso General</span>
            <span className="text-sm font-semibold text-white">
              {status.progress.generated} / {status.progress.total} imágenes
            </span>
          </div>
          <Progress value={status.progress.percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{status.progress.percentage}% completado</span>
            <span>{status.progress.remaining} pendientes</span>
          </div>
        </div>

        {/* Tiempo Estimado */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Tiempo Estimado</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Por imagen: {status.estimatedTime.perImage}</p>
            <p>Tiempo restante: {status.estimatedTime.totalRemaining}</p>
          </div>
        </div>

        {/* Lista de Defectos */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Estado por Defecto</h4>
          <div className="space-y-2">
            {defects.map((defect) => (
              <div
                key={defect.defectId}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  {defect.hasMain ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{defect.defectName}</p>
                    {defect.lastModified && (
                      <p className="text-xs text-gray-400">
                        Generada: {new Date(defect.lastModified).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={defect.hasMain ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
                  >
                    {defect.hasMain ? 'Principal' : 'Pendiente'}
                  </Badge>
                  {defect.hasCrossSection && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Transversal
                    </Badge>
                  )}
                  {defect.hasSurfaceView && (
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Superficial
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Actualizar */}
        <Button
          onClick={fetchStatus}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Actualizando...
            </>
          ) : (
            'Actualizar Estado'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

