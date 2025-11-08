
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle, CheckCircle, XCircle, Info, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import { toast } from 'sonner'
import { getDefectImagePaths, getAllDefectImages } from '@/lib/defect-image-helper'

interface Defect {
  id: string
  name: string
  image: string
  severity: 'high' | 'medium' | 'low'
  category: 'surface' | 'internal' | 'dimensional'
  description: string
  causes: string[]
  prevention: string[]
  remedies: string[]
  detection: string[]
  crossSectionImage?: string
  surfaceViewImage?: string
}

const defects: Defect[] = [
  {
    id: 'porosidad',
    name: 'Porosidad',
    image: '/herramientas/porosidad.jpg',
    severity: 'high',
    category: 'internal',
    description: 'Pequeñas cavidades o bolsas de gas dentro del metal de soldadura, que aparecen como agujeros redondos o grupos similares a burbujas en la superficie o subsuperficie.',
    causes: [
      'Metales base contaminados (aceite, óxido, humedad)',
      'Gas de protección insuficiente o excesivo',
      'Corriente de soldadura demasiado alta',
      'Velocidad de avance muy rápida',
      'Inadecuada preparación de la junta'
    ],
    prevention: [
      'Limpiar exhaustivamente la superficie de soldadura',
      'Usar flujo correcto de gas de protección (22-30 CFH)',
      'Precalentar metales cuando sea necesario',
      'Ajustar parámetros de corriente y velocidad',
      'Usar electrodos secos y bien almacenados'
    ],
    remedies: [
      'Esmerilar áreas afectadas hasta metal sano',
      'Resoldar con técnica correcta',
      'Verificar ausencia de contaminación antes de reparar',
      'Aplicar procedimiento calificado de reparación'
    ],
    detection: [
      'Inspección visual superficial',
      'Radiografía (RT) para porosidad interna',
      'Ultrasonido (UT)',
      'Prueba de partículas magnéticas (MT)'
    ]
  },
  {
    id: 'grietas',
    name: 'Grietas',
    image: '/herramientas/grietas.jpg',
    severity: 'high',
    category: 'internal',
    description: 'Fisuras o fracturas lineales en la soldadura o zona afectada por calor (ZAC), que pueden ser longitudinales, transversales o de cráter. Incluyen grietas en caliente (solidificación) y en frío (post-enfriamiento).',
    causes: [
      'Enfriamiento rápido y tensiones residuales altas',
      'Metal de aporte incompatible',
      'Alto contenido de carbono o azufre en metal base',
      'Restricción excesiva de la junta',
      'Hidrógeno en la soldadura (grietas en frío)'
    ],
    prevention: [
      'Precalentar el área de soldadura para reducir contracción',
      'Usar materiales de aporte compatibles',
      'Controlar velocidad de enfriamiento',
      'Diseñar juntas con holguras adecuadas',
      'Usar electrodos de bajo hidrógeno',
      'Aplicar postcalentamiento cuando sea requerido'
    ],
    remedies: [
      'Remover completamente la grieta mediante esmerilado',
      'Verificar extensión con líquidos penetrantes o MT',
      'Resoldar según procedimiento calificado',
      'Aplicar tratamiento térmico de alivio de tensiones si es necesario'
    ],
    detection: [
      'Inspección visual con magnificación',
      'Líquidos penetrantes (PT)',
      'Partículas magnéticas (MT)',
      'Ultrasonido (UT)',
      'Radiografía (RT) para grietas internas'
    ]
  },
  {
    id: 'undercut',
    name: 'Socavado (Undercut)',
    image: '/herramientas/undercut.jpg',
    severity: 'medium',
    category: 'dimensional',
    description: 'Ranuras o muescas a lo largo del borde de la soldadura que reducen el área de sección transversal y crean concentraciones de tensión que pueden conducir a fallas por fatiga.',
    causes: [
      'Corriente de soldadura excesiva',
      'Voltaje de arco muy alto',
      'Ángulo incorrecto del electrodo',
      'Velocidad de avance muy rápida',
      'Técnica inadecuada de manipulación'
    ],
    prevention: [
      'Reducir entrada de calor (amperaje)',
      'Mantener longitud de arco apropiada (no exceder diámetro del electrodo)',
      'Usar ángulos correctos del electrodo (30-45 grados)',
      'Controlar velocidad de avance',
      'Soldar en posiciones planas cuando sea posible'
    ],
    remedies: [
      'Soldar sobre el socavado con metal de aporte adicional',
      'Esmerilar para acabado suave',
      'Evitar sobrecalentamiento durante reparación',
      'Verificar que el área de sección transversal cumpla requisitos'
    ],
    detection: [
      'Inspección visual directa',
      'Medición con galgas',
      'Inspección dimensional',
      'Perfilómetro para profundidad'
    ]
  },
  {
    id: 'escoria',
    name: 'Inclusiones de Escoria',
    image: '/herramientas/escoria.jpg',
    severity: 'medium',
    category: 'internal',
    description: 'Residuos no metálicos atrapados dentro o sobre la superficie de soldadura, que aparecen como partículas abultadas o alargadas, a menudo cerca de la superficie o entre pasadas.',
    causes: [
      'Remoción inadecuada de escoria entre pasadas',
      'Corriente de soldadura baja',
      'Limpieza deficiente de la superficie',
      'Técnica incorrecta de manipulación del electrodo',
      'Diseño de junta inadecuado (ángulo muy cerrado)'
    ],
    prevention: [
      'Limpiar exhaustivamente entre pasadas con cepillo y picador',
      'Aumentar corriente dentro del rango recomendado',
      'Mantener ángulos apropiados de antorcha/electrodo',
      'Usar preparación de junta adecuada',
      'Verificar que el fundente/escoria flote correctamente'
    ],
    remedies: [
      'Esmerilar o cincelar escoria y áreas afectadas',
      'Resoldar con bajo calor y limpieza adecuada',
      'Inspeccionar visualmente durante reparación'
    ],
    detection: [
      'Inspección visual con magnificación',
      'Radiografía (RT)',
      'Ultrasonido (UT)',
      'Partículas magnéticas (MT) para escoria superficial'
    ]
  },
  {
    id: 'salpicaduras',
    name: 'Salpicaduras',
    image: '/herramientas/salpicaduras.jpg',
    severity: 'low',
    category: 'surface',
    description: 'Pequeños glóbulos o gotas de metal adheridos a la superficie de soldadura o áreas cercanas, a menudo con bordes irregulares. Generalmente superficial pero puede requerir remoción por estética o función.',
    causes: [
      'Corriente de soldadura muy alta',
      'Gas de protección incorrecto o contaminado',
      'Ángulo inadecuado del electrodo',
      'Longitud de arco excesiva',
      'Voltaje de arco muy alto'
    ],
    prevention: [
      'Usar corriente dentro del rango recomendado',
      'Seleccionar gas de protección apropiado (pureza adecuada)',
      'Reducir longitud de arco',
      'Mantener ángulo correcto del electrodo',
      'Aplicar spray anti-salpicaduras en áreas adyacentes',
      'Usar transferencia de cortocircuito o spray cuando sea apropiado'
    ],
    remedies: [
      'Remover con esmerilado o cepillo de alambre',
      'Limpiar químicamente si es necesario',
      'Generalmente no requiere resoldadura'
    ],
    detection: [
      'Inspección visual directa',
      'Fácilmente identificable en superficie'
    ]
  },
  {
    id: 'sobreposicion',
    name: 'Sobreposición (Overlap)',
    image: '/herramientas/sobreposicion.jpg',
    severity: 'medium',
    category: 'dimensional',
    description: 'Metal de soldadura en exceso que sobresale sin fusionarse adecuadamente, formando un reborde o cordón a lo largo del pie de soldadura en ángulo menor a 90 grados sin unión apropiada.',
    causes: [
      'Velocidad de avance muy lenta',
      'Entrada de calor excesiva',
      'Tamaño incorrecto del electrodo (muy grande)',
      'Ángulo inadecuado de la antorcha',
      'Técnica de manipulación incorrecta'
    ],
    prevention: [
      'Mantener velocidad de avance constante y apropiada',
      'Usar electrodos de tamaño correcto',
      'Preparar juntas adecuadamente',
      'Controlar entrada de calor',
      'Usar técnica correcta de tejido o stringer'
    ],
    remedies: [
      'Esmerilar material en exceso',
      'Resoldar con varilla de aporte coincidente',
      'Verificar fusión adecuada en reparación'
    ],
    detection: [
      'Inspección visual directa',
      'Medición con galgas de soldadura',
      'Inspección dimensional'
    ]
  }
]

export default function GuiaDefectos() {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [defectImages, setDefectImages] = useState<Record<string, { main: string; crossSection?: string; surfaceView?: string }>>({})
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Cargar imágenes mejoradas para cada defecto
  useEffect(() => {
    const loadDefectImages = async () => {
      const images: Record<string, { main: string; crossSection?: string; surfaceView?: string }> = {}
      
      for (const defect of defects) {
        try {
          const paths = getDefectImagePaths(defect.id, true)
          // Verificar si existe la imagen generada
          const response = await fetch(paths.main, { method: 'HEAD' })
          if (response.ok) {
            images[defect.id] = await getAllDefectImages(defect.id)
          } else {
            // Usar imagen original como fallback
            images[defect.id] = { main: defect.image }
          }
        } catch {
          // En caso de error, usar imagen original
          images[defect.id] = { main: defect.image }
        }
      }
      
      setDefectImages(images)
      setImagesLoaded(true)
    }

    loadDefectImages()
  }, [])

  const filteredDefects = defects.filter(defect => {
    const matchesCategory = filterCategory === 'all' || defect.category === filterCategory
    const matchesSeverity = filterSeverity === 'all' || defect.severity === filterSeverity
    return matchesCategory && matchesSeverity
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-5 h-5" />
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />
      case 'low':
        return <Info className="w-5 h-5" />
      default:
        return null
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

  const handleExportPDF = () => {
    try {
      toast.info('Generando PDF...')
      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Guía de Defectos de Soldadura', 105, 20, { align: 'center' })
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Identificación, Causas, Prevención y Remedios', 105, 28, { align: 'center' })
      
      doc.setFontSize(9)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 105, 35, { align: 'center' })
      
      let yPosition = 45
      
      filteredDefects.forEach((defect, index) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        // Defect Header
        doc.setFillColor(255, 122, 0)
        doc.rect(15, yPosition, 180, 10, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text(defect.name, 20, yPosition + 7)
        
        // Severity and Category badges
        doc.setFontSize(8)
        doc.text(`Severidad: ${getSeverityLabel(defect.severity)}`, 130, yPosition + 7)
        doc.text(`Categoría: ${getCategoryLabel(defect.category)}`, 165, yPosition + 7)
        
        yPosition += 13
        
        // Description
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        const descSplit = doc.splitTextToSize(defect.description, 175)
        doc.text(descSplit, 20, yPosition)
        yPosition += (descSplit.length * 5) + 5
        
        // Causas
        doc.setTextColor(255, 122, 0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Causas Principales:', 20, yPosition)
        yPosition += 5
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        defect.causes.forEach(cause => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          const causeSplit = doc.splitTextToSize(`• ${cause}`, 170)
          doc.text(causeSplit, 22, yPosition)
          yPosition += causeSplit.length * 4
        })
        yPosition += 3
        
        // Prevención
        doc.setTextColor(34, 197, 94)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Métodos de Prevención:', 20, yPosition)
        yPosition += 5
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        defect.prevention.forEach(prev => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          const prevSplit = doc.splitTextToSize(`✓ ${prev}`, 170)
          doc.text(prevSplit, 22, yPosition)
          yPosition += prevSplit.length * 4
        })
        yPosition += 3
        
        // Remedios
        doc.setTextColor(42, 161, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Remedios y Reparación:', 20, yPosition)
        yPosition += 5
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        defect.remedies.forEach(remedy => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          const remedySplit = doc.splitTextToSize(`→ ${remedy}`, 170)
          doc.text(remedySplit, 22, yPosition)
          yPosition += remedySplit.length * 4
        })
        yPosition += 3
        
        // Detección
        doc.setTextColor(168, 85, 247)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Métodos de Detección:', 20, yPosition)
        yPosition += 5
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const detectionText = defect.detection.join(', ')
        const detectionSplit = doc.splitTextToSize(detectionText, 170)
        doc.text(detectionSplit, 22, yPosition)
        yPosition += (detectionSplit.length * 4) + 8
        
        // Separator line
        if (index < filteredDefects.length - 1) {
          doc.setDrawColor(200, 200, 200)
          doc.line(15, yPosition, 195, yPosition)
          yPosition += 8
        }
      })
      
      // Footer on last page
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text(`WeldTech Solutions - Guía de Defectos | Página ${i} de ${pageCount}`, 105, 285, { align: 'center' })
      }
      
      doc.save('Guia_Defectos_Soldadura.pdf')
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error al generar el PDF')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1216] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Guía Visual de Defectos de Soldadura
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Identificación, causas, prevención y remedios para defectos comunes en soldadura
            </p>
          </div>

          {/* Export Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleExportPDF}
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar a PDF
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8 bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="surface">Superficial</option>
                    <option value="internal">Interno</option>
                    <option value="dimensional">Dimensional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Severidad</label>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  >
                    <option value="all">Todas las severidades</option>
                    <option value="high">Crítico</option>
                    <option value="medium">Moderado</option>
                    <option value="low">Leve</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Defects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDefects.map((defect, index) => (
              <motion.div
                key={defect.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDefect(defect)}
                className="cursor-pointer"
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-[#FF7A00] transition-all duration-300 overflow-hidden h-full group">
                  <div className="relative w-full aspect-video bg-gray-800">
                    <Image
                      src={imagesLoaded && defectImages[defect.id]?.main ? defectImages[defect.id].main : defect.image}
                      alt={defect.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback a imagen original si falla la generada
                        const target = e.target as HTMLImageElement
                        target.src = defect.image
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="outline" className={getSeverityColor(defect.severity)}>
                        <span className="flex items-center gap-1">
                          {getSeverityIcon(defect.severity)}
                          {getSeverityLabel(defect.severity)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">{defect.name}</CardTitle>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {getCategoryLabel(defect.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-3">{defect.description}</p>
                    <button className="mt-4 text-[#FF7A00] hover:text-[#FF7A00]/80 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Ver detalles completos
                      <span>→</span>
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedDefect} onOpenChange={() => setSelectedDefect(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
          {selectedDefect && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="text-3xl text-white">{selectedDefect.name}</DialogTitle>
                  <Badge variant="outline" className={getSeverityColor(selectedDefect.severity)}>
                    <span className="flex items-center gap-1">
                      {getSeverityIcon(selectedDefect.severity)}
                      {getSeverityLabel(selectedDefect.severity)}
                    </span>
                  </Badge>
                </div>
              </DialogHeader>

              <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
                <Image
                  src={defectImages[selectedDefect.id]?.main || selectedDefect.image}
                  alt={selectedDefect.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                        // Fallback a imagen original si falla la generada
                        const target = e.target as HTMLImageElement
                        target.src = selectedDefect.image
                      }}
                />
              </div>

              {/* Imágenes adicionales si están disponibles */}
              {(defectImages[selectedDefect.id]?.crossSection || defectImages[selectedDefect.id]?.surfaceView) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {defectImages[selectedDefect.id].crossSection && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">Vista de Corte Transversal</h4>
                      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={defectImages[selectedDefect.id].crossSection!}
                          alt={`${selectedDefect.name} - Corte Transversal`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {defectImages[selectedDefect.id].surfaceView && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">Vista Superficial</h4>
                      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={defectImages[selectedDefect.id].surfaceView!}
                          alt={`${selectedDefect.name} - Vista Superficial`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogDescription className="text-gray-300 text-base mb-6">
                {selectedDefect.description}
              </DialogDescription>

              <div className="space-y-6">
                {/* Causas */}
                <div>
                  <h3 className="text-xl font-semibold text-[#FF7A00] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Causas Principales
                  </h3>
                  <ul className="space-y-2">
                    {selectedDefect.causes.map((cause, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-[#FF7A00] mt-1">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevención */}
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Métodos de Prevención
                  </h3>
                  <ul className="space-y-2">
                    {selectedDefect.prevention.map((prev, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Remedios */}
                <div>
                  <h3 className="text-xl font-semibold text-[#2AA1FF] mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Remedios y Reparación
                  </h3>
                  <ul className="space-y-2">
                    {selectedDefect.remedies.map((remedy, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="text-[#2AA1FF] mt-1">→</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detección */}
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Métodos de Detección
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDefect.detection.map((method, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
