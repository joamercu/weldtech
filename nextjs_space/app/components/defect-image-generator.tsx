'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Download, RefreshCw, Image as ImageIcon, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface DefectPrompt {
  id: string
  name: string
  category: string
  severity: string
  mainPrompt: string
  crossSectionPrompt: string
  surfaceViewPrompt: string
}

interface DefectImageGeneratorProps {
  defectId: string
  defectName: string
  category: string
  severity: string
  onImageGenerated?: (imageUrl: string, imageType: string) => void
}

export default function DefectImageGenerator({
  defectId,
  defectName,
  category,
  severity,
  onImageGenerated
}: DefectImageGeneratorProps) {
  const [prompts, setPrompts] = useState<DefectPrompt | null>(null)
  const [loadingPrompts, setLoadingPrompts] = useState(true)
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({})
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, string>>({})

  useEffect(() => {
    // Cargar prompts técnicos
    const loadPrompts = async () => {
      try {
        const response = await fetch('/herramientas/generated/abacus-ai/prompts-tecnicos.json')
        if (!response.ok) {
          throw new Error('Error cargando prompts')
        }
        const data = await response.json()
        const defectPrompt = data.prompts[defectId]
        if (defectPrompt) {
          setPrompts(defectPrompt)
        } else {
          toast.error(`No se encontraron prompts para ${defectName}`)
        }
      } catch (error) {
        console.error('Error cargando prompts:', error)
        toast.error('Error cargando prompts técnicos')
      } finally {
        setLoadingPrompts(false)
      }
    }

    loadPrompts()
  }, [defectId, defectName])

  const generateImage = async (prompt: string, imageType: string) => {
    setGenerating(prev => ({ ...prev, [imageType]: true }))
    
    try {
      toast.info(`Generando imagen: ${imageType}...`)
      
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: 'weldtech-brand',
          data: {
            defectId,
            defectName,
            category,
            severity,
            imageType
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.details || 'Error al generar imagen')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Error al generar imagen')
      }

      setGeneratedImages(prev => ({
        ...prev,
        [imageType]: result.imageUrl
      }))
      
      setGeneratedPrompts(prev => ({
        ...prev,
        [imageType]: result.prompt
      }))

      toast.success(`✅ Imagen ${imageType} generada exitosamente`)
      
      if (onImageGenerated) {
        onImageGenerated(result.imageUrl, imageType)
      }

    } catch (error) {
      console.error(`Error generating ${imageType}:`, error)
      toast.error(`Error al generar imagen ${imageType}`, {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setGenerating(prev => ({ ...prev, [imageType]: false }))
    }
  }

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Imagen descargada')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Error al descargar imagen')
    }
  }

  if (loadingPrompts) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
            <span className="ml-3 text-gray-300">Cargando prompts técnicos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prompts) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="pt-6">
          <p className="text-red-400">No se encontraron prompts para este defecto</p>
        </CardContent>
      </Card>
    )
  }

  const imageTypes = [
    { key: 'main', label: 'Imagen Principal', prompt: prompts.mainPrompt },
    { key: 'cross-section', label: 'Vista de Corte Transversal', prompt: prompts.crossSectionPrompt },
    { key: 'surface-view', label: 'Vista Superficial', prompt: prompts.surfaceViewPrompt }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ImageIcon className="h-5 w-5" />
            Generador de Imágenes para {defectName}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Genera imágenes técnicas mejoradas usando prompts predefinidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {imageTypes.map((imageType) => (
            <Card key={imageType.key} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{imageType.label}</CardTitle>
                  {generatedImages[imageType.key] && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Generada
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => generateImage(imageType.prompt, imageType.key)}
                    disabled={generating[imageType.key]}
                    className="flex-1 bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
                  >
                    {generating[imageType.key] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generar {imageType.label}
                      </>
                    )}
                  </Button>
                  
                  {generatedImages[imageType.key] && (
                    <>
                      <Button
                        onClick={() => handleDownload(
                          generatedImages[imageType.key],
                          `${defectId}-${imageType.key}.jpg`
                        )}
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setGeneratedImages(prev => {
                            const newState = { ...prev }
                            delete newState[imageType.key]
                            return newState
                          })
                          setGeneratedPrompts(prev => {
                            const newState = { ...prev }
                            delete newState[imageType.key]
                            return newState
                          })
                        }}
                        variant="outline"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {generatedPrompts[imageType.key] && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="text-muted-foreground font-semibold mb-2">Prompt usado:</p>
                    <p className="text-muted-foreground whitespace-pre-wrap break-words text-xs">
                      {generatedPrompts[imageType.key]}
                    </p>
                  </div>
                )}

                {generatedImages[imageType.key] && (
                  <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={generatedImages[imageType.key]}
                      alt={`${defectName} - ${imageType.label}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

