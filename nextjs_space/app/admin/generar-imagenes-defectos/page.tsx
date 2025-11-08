'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DefectImageGenerator from '@/app/components/defect-image-generator'
import GenerationStatus from '@/app/components/generation-status'
import ApiConnectionTest from '@/app/components/api-connection-test'
import ListDeployments from '@/app/components/list-deployments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'

interface Defect {
  id: string
  name: string
  category: string
  severity: string
  description: string
}

const defects: Defect[] = [
  {
    id: 'porosidad',
    name: 'Porosidad',
    category: 'internal',
    severity: 'high',
    description: 'Pequeñas cavidades o bolsas de gas dentro del metal de soldadura'
  },
  {
    id: 'grietas',
    name: 'Grietas',
    category: 'internal',
    severity: 'high',
    description: 'Fisuras o fracturas lineales en la soldadura o zona afectada por calor'
  },
  {
    id: 'undercut',
    name: 'Socavado (Undercut)',
    category: 'dimensional',
    severity: 'medium',
    description: 'Ranuras o muescas a lo largo del borde de la soldadura'
  },
  {
    id: 'escoria',
    name: 'Inclusiones de Escoria',
    category: 'internal',
    severity: 'medium',
    description: 'Residuos no metálicos atrapados dentro o sobre la superficie de soldadura'
  },
  {
    id: 'salpicaduras',
    name: 'Salpicaduras',
    category: 'surface',
    severity: 'low',
    description: 'Pequeños glóbulos o gotas de metal adheridos a la superficie de soldadura'
  },
  {
    id: 'sobreposicion',
    name: 'Sobreposición (Overlap)',
    category: 'dimensional',
    severity: 'medium',
    description: 'Metal de soldadura en exceso que sobresale sin fusionarse adecuadamente'
  }
]

export default function GenerarImagenesDefectosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null)
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F1216] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleImageGenerated = (imageUrl: string) => {
    if (selectedDefect) {
      setGeneratedImages(prev => ({
        ...prev,
        [selectedDefect.id]: imageUrl
      }))
      toast.success(`Imagen generada para ${selectedDefect.name}`)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return ''
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Crítico'
      case 'medium':
        return 'Moderado'
      case 'low':
        return 'Leve'
      default:
        return ''
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'surface':
        return 'Superficial'
      case 'internal':
        return 'Interno'
      case 'dimensional':
        return 'Dimensional'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1216]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Generar Imágenes de Defectos con Abacus.AI
          </h1>
          <p className="text-gray-300 text-lg">
            Genera imágenes mejoradas de defectos de soldadura usando la API de Abacus.AI
          </p>
        </div>

        {/* Listar Deployments */}
        <div className="mb-8">
          <ListDeployments />
        </div>

        {/* Prueba de Conexión con API */}
        <div className="mb-8">
          <ApiConnectionTest />
        </div>

        {/* Estado de Generación */}
        <div className="mb-8">
          <GenerationStatus />
        </div>

        {!selectedDefect ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defects.map((defect) => (
              <Card
                key={defect.id}
                className="bg-gray-900/50 border-gray-800 hover:border-[#FF7A00] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedDefect(defect)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl text-white">{defect.name}</CardTitle>
                    {generatedImages[defect.id] && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                      {getSeverityLabel(defect.severity)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {getCategoryLabel(defect.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{defect.description}</p>
                  <Button
                    className="mt-4 w-full bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedDefect(defect)
                    }}
                  >
                    Generar Imagen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">
                      {selectedDefect.name}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className={getSeverityColor(selectedDefect.severity)}>
                        {getSeverityLabel(selectedDefect.severity)}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {getCategoryLabel(selectedDefect.category)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedDefect(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Cerrar
                  </Button>
                </div>
                <CardDescription className="text-gray-300 mt-4">
                  {selectedDefect.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DefectImageGenerator
                  defectId={selectedDefect.id}
                  defectName={selectedDefect.name}
                  category={selectedDefect.category}
                  severity={selectedDefect.severity}
                  onImageGenerated={(imageUrl, imageType) => {
                    handleImageGenerated(imageUrl)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

