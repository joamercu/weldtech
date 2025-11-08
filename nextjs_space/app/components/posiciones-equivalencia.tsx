
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface Position {
  iso: string
  aws: string
  en: string
  description: string
  image?: string
  type: 'groove' | 'fillet' | 'pipe'
  difficulty: 'easy' | 'medium' | 'hard'
}

const positions: Position[] = [
  {
    iso: 'PA',
    aws: '1G / 1F',
    en: 'PA',
    description: 'Posición plana para soldadura de ranura o filete, con el eje de la soldadura horizontal y progresión típicamente hacia abajo.',
    image: '/herramientas/posicion-pa-1g.jpg',
    type: 'groove',
    difficulty: 'easy'
  },
  {
    iso: 'PB',
    aws: '2F',
    en: 'PB',
    description: 'Posición de soldadura de filete horizontal, con el soldador sosteniendo la antorcha a aproximadamente 45°.',
    image: '/herramientas/posicion-pb-2f.jpg',
    type: 'fillet',
    difficulty: 'easy'
  },
  {
    iso: 'PC',
    aws: '2G',
    en: 'PC',
    description: 'Posición de soldadura de ranura horizontal, con el eje de soldadura paralelo al cuerpo del soldador.',
    image: '/herramientas/posicion-pc-2g.jpg',
    type: 'groove',
    difficulty: 'medium'
  },
  {
    iso: 'PD',
    aws: '4F',
    en: 'PD',
    description: 'Posición de soldadura de filete sobrecabeza, requiere que el soldador trabaje debajo de la junta con la antorcha a aproximadamente 45°.',
    image: '/herramientas/posicion-pd-4f.jpg',
    type: 'fillet',
    difficulty: 'hard'
  },
  {
    iso: 'PE',
    aws: '4G',
    en: 'PE',
    description: 'Posición de soldadura de ranura sobrecabeza, con la antorcha dirigida hacia arriba; demanda parámetros precisos.',
    image: '/herramientas/posicion-pe-4g.jpg',
    type: 'groove',
    difficulty: 'hard'
  },
  {
    iso: 'PF',
    aws: '3G Uphill',
    en: 'PF',
    description: 'Posición vertical ascendente para soldadura de ranura o filete, usando tensión superficial contra la gravedad.',
    image: '/herramientas/posicion-pf-3g.jpg',
    type: 'groove',
    difficulty: 'medium'
  },
  {
    iso: 'PG',
    aws: '3G Downhill',
    en: 'PG',
    description: 'Posición vertical descendente, aprovechando la fuerza del arco para mayor eficiencia en producción.',
    image: '/herramientas/posicion-pf-3g.jpg',
    type: 'groove',
    difficulty: 'medium'
  },
  {
    iso: 'PH',
    aws: '5G Uphill',
    en: 'PH',
    description: 'Soldadura de ranura de tubería vertical ascendente, involucrando múltiples posiciones (sobrecabeza, horizontal, plana).',
    image: '/herramientas/posicion-5g.jpg',
    type: 'pipe',
    difficulty: 'hard'
  },
  {
    iso: 'PJ',
    aws: '5G Downhill',
    en: 'PJ',
    description: 'Soldadura de ranura de tubería vertical descendente, comenzando desde plana y moviéndose a sobrecabeza.',
    image: '/herramientas/posicion-5g.jpg',
    type: 'pipe',
    difficulty: 'hard'
  },
  {
    iso: 'H-L045',
    aws: '6G Uphill',
    en: 'H-L045',
    description: 'Tubería fija a 45° con progresión ascendente; una de las posiciones más demandantes para calificación de soldadores.',
    image: '/herramientas/posicion-6g.jpg',
    type: 'pipe',
    difficulty: 'hard'
  },
  {
    iso: 'J-L045',
    aws: '6G Downhill',
    en: 'J-L045',
    description: 'Tubería fija a 45° con progresión descendente; usada para probar competencia del soldador en todas las posiciones.',
    image: '/herramientas/posicion-6g.jpg',
    type: 'pipe',
    difficulty: 'hard'
  }
]

export default function PosicionesEquivalencia() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredPositions = positions.filter(pos => {
    const matchesSearch = 
      pos.iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.aws.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || pos.type === selectedType

    return matchesSearch && matchesType
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return ''
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Básica'
      case 'medium':
        return 'Intermedia'
      case 'hard':
        return 'Avanzada'
      default:
        return ''
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'groove':
        return 'Ranura'
      case 'fillet':
        return 'Filete'
      case 'pipe':
        return 'Tubería'
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
      doc.text('Tabla de Equivalencia de Posiciones', 105, 20, { align: 'center' })
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Comparación entre normas AWS, ISO y EN', 105, 28, { align: 'center' })
      
      // Date
      doc.setFontSize(9)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 105, 35, { align: 'center' })
      
      let yPosition = 45
      
      // Table Header
      doc.setFillColor(255, 122, 0)
      doc.rect(15, yPosition, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('ISO', 20, yPosition + 5)
      doc.text('AWS/ASME', 45, yPosition + 5)
      doc.text('EN', 80, yPosition + 5)
      doc.text('Tipo', 100, yPosition + 5)
      doc.text('Dificultad', 125, yPosition + 5)
      
      yPosition += 10
      
      // Table Content
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      
      filteredPositions.forEach((pos, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245)
          doc.rect(15, yPosition - 4, 180, 8, 'F')
        }
        
        doc.setFontSize(8)
        doc.text(pos.iso, 20, yPosition)
        doc.text(pos.aws, 45, yPosition)
        doc.text(pos.en, 80, yPosition)
        doc.text(getTypeLabel(pos.type), 100, yPosition)
        doc.text(getDifficultyLabel(pos.difficulty), 125, yPosition)
        
        yPosition += 8
        
        // Description
        doc.setFontSize(7)
        doc.setTextColor(80, 80, 80)
        const splitDesc = doc.splitTextToSize(pos.description, 175)
        doc.text(splitDesc, 20, yPosition)
        yPosition += (splitDesc.length * 3) + 4
      })
      
      // Add info section at the end
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      }
      
      yPosition += 10
      doc.setFillColor(255, 122, 0, 0.1)
      doc.rect(15, yPosition, 180, 45, 'F')
      
      yPosition += 7
      doc.setTextColor(255, 122, 0)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Información Importante', 20, yPosition)
      
      yPosition += 7
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      const infoText = [
        '• ISO 6947: Estándar internacional que define posiciones mediante ángulos de inclinación y rotación.',
        '• AWS/ASME: Normas americanas ampliamente usadas en construcción estructural y recipientes a presión.',
        '• EN: Normas europeas armonizadas con ISO mediante el Acuerdo de Viena.',
        '• La calificación en posiciones más difíciles (ej: 6G) puede cubrir posiciones más simples según el código aplicable.'
      ]
      
      infoText.forEach((line, idx) => {
        const splitLine = doc.splitTextToSize(line, 170)
        doc.text(splitLine, 20, yPosition)
        yPosition += splitLine.length * 5
      })
      
      // Footer
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text('WeldTech Solutions - Tabla de Equivalencia de Posiciones', 105, 285, { align: 'center' })
      
      doc.save('Tabla_Equivalencia_Posiciones.pdf')
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
              Tabla de Equivalencia de Posiciones
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Comparación completa entre normas AWS, ISO y EN para posiciones de soldadura
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar posición (ISO, AWS, EN)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Filter className="text-gray-400 w-5 h-5 self-center" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="groove">Ranura</option>
                    <option value="fillet">Filete</option>
                    <option value="pipe">Tubería</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 mb-8">
              <TabsTrigger value="table" className="data-[state=active]:bg-[#FF7A00]">
                Vista de Tabla
              </TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-[#FF7A00]">
                Vista de Tarjetas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/80 border-b border-gray-700">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#FF7A00]">ISO 6947</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#2AA1FF]">AWS/ASME</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-green-400">EN</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Descripción</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tipo</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Dificultad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPositions.map((pos, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-[#FF7A00] font-bold text-lg">{pos.iso}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#2AA1FF] font-bold">{pos.aws}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-green-400 font-bold">{pos.en}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-300 text-sm">{pos.description}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {getTypeLabel(pos.type)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={getDifficultyColor(pos.difficulty)}>
                              {getDifficultyLabel(pos.difficulty)}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPositions.map((pos, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800 hover:border-[#FF7A00] transition-all duration-300 overflow-hidden h-full">
                      {pos.image && (
                        <div className="relative w-full aspect-video bg-gray-800">
                          <Image
                            src={pos.image}
                            alt={`Posición ${pos.iso}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-2xl text-white">
                            {pos.iso}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {getTypeLabel(pos.type)}
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(pos.difficulty)}>
                              {getDifficultyLabel(pos.difficulty)}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-gray-400">
                          <div className="flex flex-col gap-1">
                            <span>
                              <span className="text-[#2AA1FF] font-semibold">AWS:</span> {pos.aws}
                            </span>
                            <span>
                              <span className="text-green-400 font-semibold">EN:</span> {pos.en}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm">{pos.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <Card className="mt-8 bg-gradient-to-r from-[#FF7A00]/10 to-[#2AA1FF]/10 border-[#FF7A00]/30">
            <CardHeader>
              <CardTitle className="text-white">Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2">
                <li>• <strong>ISO 6947:</strong> Estándar internacional que define posiciones mediante ángulos de inclinación y rotación.</li>
                <li>• <strong>AWS/ASME:</strong> Normas americanas ampliamente usadas en construcción estructural y recipientes a presión.</li>
                <li>• <strong>EN:</strong> Normas europeas armonizadas con ISO mediante el Acuerdo de Viena.</li>
                <li>• La calificación en posiciones más difíciles (ej: 6G) puede cubrir posiciones más simples según el código aplicable.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
