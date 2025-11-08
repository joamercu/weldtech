
'use client'

import { useState } from 'react'
import { Scale, Search, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

type Category = 'all' | 'variables' | 'ranges' | 'positions' | 'validity' | 'testing'

interface ComparisonData {
  category: string
  asmeIX: string
  awsD11: string
  iso9606: string
}

export default function ComparadorNormas() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const comparisonData: ComparisonData[] = [
    {
      category: 'Variables Esenciales',
      asmeIX: 'P-No., F-No., espesor, diámetro, posición, proceso (QW-250)',
      awsD11: 'Material base, proceso, posición, progresión (Clause 4)',
      iso9606: 'Grupo de material, espesor, diámetro, posición, proceso'
    },
    {
      category: 'Rango de Espesor',
      asmeIX: 'T<3mm: 0-2T; 3≤T<19mm: T/2-2T; T≥19mm: T/2-unlimited (QW-451)',
      awsD11: 'Según tablas 4.11 y 4.12, generalmente T/2-2T',
      iso9606: 'T≤3mm: 0-2T; 3<T≤12mm: 3-2T; T>12mm: T/2-2T'
    },
    {
      category: 'Rango de Diámetro',
      asmeIX: 'D<24mm: califica ≥20D; D≥24mm: todos los diámetros (QW-452)',
      awsD11: 'No especifica para placas; ver especificaciones de proyecto',
      iso9606: 'D≤25mm: califica ≥2D; D>25mm: todos los diámetros'
    },
    {
      category: 'Nomenclatura de Posiciones',
      asmeIX: '1G, 2G, 3G, 4G (placas); 1G, 2G, 5G, 6G (tuberías); 1F-4F (filetes)',
      awsD11: '1G, 2G, 3G, 4G (placas); 1G, 2G, 5G, 6G (tuberías); 1F-4F (filetes)',
      iso9606: 'PA (plana), PB, PC (horizontal), PD, PE (sobrecabeza), PF (vertical), PG, PH'
    },
    {
      category: 'Calificación de Posiciones',
      asmeIX: '6G califica todas (tuberías); 4G califica 1G-4G (placas)',
      awsD11: '3G/4G califica 1G, 2G, 1F, 2F (sin limitación vertical)',
      iso9606: 'Según tabla de rangos de calificación ISO 9606-1 Anexo A'
    },
    {
      category: 'Validez de Calificación',
      asmeIX: 'Indefinida; se pierde si >6 meses sin soldar en proceso (QW-322)',
      awsD11: 'Indefinida con continuity maintained (cada 6 meses)',
      iso9606: '3 años desde fecha de calificación (extensible con renovación)'
    },
    {
      category: 'Continuidad',
      asmeIX: 'Verificación semestral; >6 meses inactivo → recalificación',
      awsD11: 'Cada 6 meses verificar actividad en proceso cualificado',
      iso9606: 'No aplica durante período de validez (3 años)'
    },
    {
      category: 'Métodos de Ensayo',
      asmeIX: 'VT obligatorio; Bend/RT/UT según QW-142 a QW-149',
      awsD11: 'VT obligatorio; Bend según Tabla 4.2; RT/UT opcional',
      iso9606: 'VT obligatorio; Ensayos destructivos según tipo de junta'
    },
    {
      category: 'Criterios de Aceptación Visual',
      asmeIX: 'QW-195: sin fisuras, fusión completa, socavado limitado',
      awsD11: 'Tabla 6.1: perfiles, socavado, porosidad, fisuras',
      iso9606: 'ISO 5817 nivel B (estricto), C (intermedio), D (permisivo)'
    },
    {
      category: 'Re-examen',
      asmeIX: 'Permitido (QW-320); máximo 2 intentos',
      awsD11: 'Permitido (4.6); sin límite de intentos especificado',
      iso9606: 'Permitido después de reentrenamiento documentado'
    },
    {
      category: 'WPS Requirement',
      asmeIX: 'WPS precalificado o calificado (QW-480) obligatorio',
      awsD11: 'WPS precalificado (Clause 3) o calificado (Clause 4)',
      iso9606: 'WPQR (Welding Procedure Qualification Record) obligatorio'
    },
    {
      category: 'Documentación',
      asmeIX: 'WPQ (QW-484) con firma de inspector autorizado',
      awsD11: 'WOPQ (Welder/Operator Performance Qualification) Clause 4',
      iso9606: 'Certificado ISO 9606 emitido por organismo acreditado'
    }
  ]

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Todas las Categorías' },
    { id: 'variables', label: 'Variables Esenciales' },
    { id: 'ranges', label: 'Rangos' },
    { id: 'positions', label: 'Posiciones' },
    { id: 'validity', label: 'Validez' },
    { id: 'testing', label: 'Ensayos' }
  ]

  const filteredData = comparisonData.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory)
    const matchesSearch = searchTerm === '' || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asmeIX.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.awsD11.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.iso9606.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleExportPDF = () => {
    try {
      toast.info('Generando PDF...')
      const doc = new jsPDF()
      
      // Header
      doc.setFillColor(255, 122, 0)
      doc.rect(0, 0, 210, 25, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('Comparador de Normas de Soldadura', 105, 12, { align: 'center' })
      doc.setFontSize(10)
      doc.text('ASME IX vs AWS D1.1 vs ISO 9606', 105, 19, { align: 'center' })
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' })
      
      let y = 40
      
      filteredData.forEach((item, index) => {
        if (y > 250) {
          doc.addPage()
          y = 20
        }
        
        // Category Header
        doc.setFillColor(255, 122, 0)
        doc.rect(15, y, 180, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text(item.category, 20, y + 6)
        
        y += 12
        
        // ASME IX
        doc.setFillColor(255, 122, 0, 0.1)
        doc.rect(15, y, 180, 8, 'F')
        doc.setTextColor(255, 122, 0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('ASME IX', 20, y + 5)
        y += 10
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const asmeSplit = doc.splitTextToSize(item.asmeIX, 175)
        doc.text(asmeSplit, 20, y)
        y += (asmeSplit.length * 4) + 4
        
        // AWS D1.1
        doc.setFillColor(42, 161, 255, 0.1)
        doc.rect(15, y, 180, 8, 'F')
        doc.setTextColor(42, 161, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('AWS D1.1', 20, y + 5)
        y += 10
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const awsSplit = doc.splitTextToSize(item.awsD11, 175)
        doc.text(awsSplit, 20, y)
        y += (awsSplit.length * 4) + 4
        
        // ISO 9606
        doc.setFillColor(34, 197, 94, 0.1)
        doc.rect(15, y, 180, 8, 'F')
        doc.setTextColor(34, 197, 94)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('ISO 9606', 20, y + 5)
        y += 10
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const isoSplit = doc.splitTextToSize(item.iso9606, 175)
        doc.text(isoSplit, 20, y)
        y += (isoSplit.length * 4) + 8
        
        // Separator
        if (index < filteredData.length - 1) {
          doc.setDrawColor(200, 200, 200)
          doc.line(15, y, 195, y)
          y += 8
        }
      })
      
      // Add summary page
      doc.addPage()
      y = 20
      
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('Puntos Clave de Comparación', 20, y + 6)
      
      y += 15
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      const keyPoints = [
        '• ASME IX: Código más utilizado en recipientes a presión y tuberías industriales.',
        '• AWS D1.1: Estándar dominante en construcción estructural de acero.',
        '• ISO 9606: Norma internacional que facilita movilidad de soldadores entre países.',
        '• Nomenclatura de Posiciones: AWS/ASME usan sistema numérico (1G-6G), ISO usa letras (PA-PH).',
        '• Validez: ASME IX e ISO 9606 requieren renovación periódica, AWS D1.1 requiere continuidad.',
        '• Variables Esenciales: Cada norma define diferentes parámetros que afectan calificación.',
        '• Criterios de Aceptación: Nivel de tolerancia para defectos varía según norma aplicable.',
        '• Documentación: WPQ (ASME), WOPQ (AWS), Certificado ISO para evidenciar calificación.'
      ]
      
      keyPoints.forEach((point, idx) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        const pointSplit = doc.splitTextToSize(point, 175)
        doc.text(pointSplit, 20, y)
        y += pointSplit.length * 5 + 3
      })
      
      // Footer on all pages
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(128, 128, 128)
        doc.rect(0, 285, 210, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(`WeldTech Solutions - Comparador de Normas | Página ${i} de ${pageCount}`, 105, 291, { align: 'center' })
      }
      
      doc.save('Comparacion_Normas_Soldadura.pdf')
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error al generar el PDF')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-accent/10 rounded-full mb-4">
          <Scale className="w-5 h-5 text-secondary-accent" />
          <span className="text-secondary-accent font-semibold label-technical">
            COMPARADOR DE NORMAS
          </span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Compara Requisitos entre Normas
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Visualiza las diferencias y similitudes entre ASME IX, AWS D1.1 e ISO 9606 
          para tomar decisiones informadas en tus proyectos.
        </p>
      </div>

      {/* Filters */}
      <div className="card-standard glow-blue max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en comparaciones..."
              className="w-full bg-white/5 border-2 border-white/10 rounded-lg pl-12 pr-4 py-3 text-white 
                placeholder:text-muted focus:border-secondary-accent focus:bg-white/10 transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-secondary-accent text-white'
                    : 'bg-white/5 text-muted hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto space-y-6">
        {filteredData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-standard"
          >
            <h3 className="text-xl font-bold text-primary-accent mb-6">
              {item.category}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* ASME IX */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-accent"></div>
                  <h4 className="font-bold text-white">ASME IX</h4>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {item.asmeIX}
                </p>
              </div>

              {/* AWS D1.1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary-accent"></div>
                  <h4 className="font-bold text-white">AWS D1.1</h4>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {item.awsD11}
                </p>
              </div>

              {/* ISO 9606 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <h4 className="font-bold text-white">ISO 9606</h4>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {item.iso9606}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredData.length === 0 && (
          <div className="card-standard text-center py-12">
            <p className="text-muted text-lg">
              No se encontraron resultados para "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleExportPDF}
          className="btn-secondary w-full"
        >
          <Download size={20} />
          Exportar Comparación a PDF
        </button>
      </div>
    </motion.div>
  )
}
