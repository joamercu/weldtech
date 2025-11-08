
'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Download, ArrowLeft, QrCode, Lock, LogIn, Target, BookOpen, Calendar, Settings, RotateCcw, Shield, Award, Layers, CheckCircle2, Sparkles, FileText, Clipboard } from 'lucide-react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import Navbar from './navbar'
import { applyWatermarkToPDF, applyWatermarkToCanvas, trackDownload } from '@/lib/watermark'

const infographicSections = [
  {
    id: 1,
    titleEn: "Scope",
    titleEs: "Alcance",
    image: null,
    icon: Target,
    bgColor: 'from-orange-900/20 to-orange-800/10',
    badges: ['ASME IX', 'AWS D1.1', 'ISO 9606-1'],
    bullets: [
      { en: "ASME IX: boilers, pressure vessels, piping", es: "ASME IX: calderas, recipientes a presión, tuberías" },
      { en: "AWS D1.1: structural steel welding", es: "AWS D1.1: soldadura estructural" },
      { en: "ISO 9606-1: fusion welding of metals", es: "ISO 9606-1: soldadura por fusión" }
    ]
  },
  {
    id: 2,
    titleEn: "Standards",
    titleEs: "Normas", 
    image: null,
    icon: Shield,
    bgColor: 'from-blue-900/20 to-blue-800/10',
    badges: ['ASME', 'AWS', 'ISO'],
    bullets: [
      { en: "ASME IX QW-300 to QW-410", es: "ASME IX QW-300 a QW-410" },
      { en: "AWS D1.1 Clause 4 & Annex B", es: "AWS D1.1 Cláusula 4 y Anexo B" },
      { en: "ISO 9606-1 requirements", es: "ISO 9606-1 requisitos" }
    ]
  },
  {
    id: 3,
    titleEn: "Validity",
    titleEs: "Validez",
    image: null,
    icon: Award,
    bgColor: 'from-green-900/20 to-green-800/10',
    badges: ['3 Years', 'Indefinite*', '6 Months'],
    bullets: [
      { en: "ASME: indefinite unless >6 months no welding", es: "ASME: indefinida; se pierde si >6 meses sin soldar" },
      { en: "AWS: indefinite with continuity maintained", es: "AWS: indefinida con continuidad" },
      { en: "ISO: 3 years (extendable)", es: "ISO: 3 años (extensible)" }
    ]
  },
  {
    id: 4,
    titleEn: "Processes",
    titleEs: "Procesos",
    image: "/images/infografia/procesos.png",
    bgColor: 'from-purple-900/20 to-purple-800/10',
    badges: ['SMAW', 'GTAW', 'GMAW'],
    bullets: [
      { en: "SMAW, GTAW, GMAW, FCAW, SAW", es: "SMAW (electrodo), GTAW (TIG), GMAW (MIG/MAG), FCAW, SAW" }
    ]
  },
  {
    id: 5,
    titleEn: "Essential Variables",
    titleEs: "Variables esenciales",
    image: null,
    icon: Layers,
    bgColor: 'from-red-900/20 to-red-800/10',
    badges: ['P-No.', 'Thickness', 'Position'],
    bullets: [
      { en: "Base metal, thickness, diameter, position, process", es: "Material base, espesor, diámetro, posición, proceso" },
      { en: "Material group (P-No.), joint type", es: "Grupo de material (P-No.), tipo de junta" }
    ]
  },
  {
    id: 6,
    titleEn: "Test Positions",
    titleEs: "Posiciones de prueba",
    image: "/images/infografia/posiciones.png",
    bgColor: 'from-yellow-900/20 to-yellow-800/10',
    badges: ['1G-4G', '1F-4F', '1G-6G'],
    bullets: [
      { en: "Plate 1G–4G, Fillet 1F–4F; Pipe 1G–6G", es: "Placa 1G–4G, Filete 1F–4F; Tubería 1G–6G" },
      { en: "ISO PA, PB, PC, PF, PE, PG", es: "ISO PA, PB, PC, PF, PE, PG" }
    ]
  },
  {
    id: 7,
    titleEn: "Joint Types",
    titleEs: "Tipos de junta",
    image: "/images/infografia/juntas.png",
    bgColor: 'from-cyan-900/20 to-cyan-800/10',
    badges: ['Butt', 'Fillet', 'Groove'],
    bullets: [
      { en: "Butt (tope), Fillet (filete), Groove (ranura)", es: "Butt (tope), Fillet (filete), Groove (ranura)" },
      { en: "T-joint (en T), Pipe (tubería)", es: "T-joint (en T), Pipe (tubería)" }
    ]
  },
  {
    id: 8,
    titleEn: "Thickness Range", 
    titleEs: "Rango de espesor",
    image: "/images/infografia/espesor-diametro.png",
    bgColor: 'from-indigo-900/20 to-indigo-800/10',
    badges: ['T→2T', 'QW-451', 'Tables'],
    bullets: [
      { en: "ASME T→2T (QW-451); AWS Tables 4.11/4.12", es: "ASME T→2T (QW-451); AWS Tablas 4.11/4.12" },
      { en: "ISO according to coupon", es: "ISO según cupón" }
    ]
  },
  {
    id: 9,
    titleEn: "Diameter Range",
    titleEs: "Rango de diámetro",
    image: "/images/infografia/espesor-diametro.png",
    bgColor: 'from-pink-900/20 to-pink-800/10',
    badges: ['D<24', 'D≥24', 'ISO'],
    bullets: [
      { en: "ASME D<24 mm→≥20D; D≥24→all", es: "ASME D<24 mm→≥20D; D≥24→todos" },
      { en: "AWS N/A (except pipe); ISO D≤25→≥2D; D≥25→all", es: "AWS N/A (salvo pipe); ISO D≤25→≥2D; D≥25→todos" }
    ]
  },
  {
    id: 10,
    titleEn: "Test Methods",
    titleEs: "Métodos de ensayo", 
    image: "/images/infografia/ensayos.png",
    bgColor: 'from-teal-900/20 to-teal-800/10',
    badges: ['VT', 'Bend', 'RT/UT'],
    bullets: [
      { en: "VT, bend, macro/micro, fracture, RT/UT", es: "VT, bend, macro/micro, fracture, RT/UT" }
    ]
  },
  {
    id: 11,
    titleEn: "Retesting",
    titleEs: "Re-examen",
    image: null,
    icon: RotateCcw,
    bgColor: 'from-amber-900/20 to-amber-800/10',
    badges: ['QW-320', 'Clause 4.6', 'Retraining'],
    bullets: [
      { en: "Allowed (ASME QW-320; AWS 4.6; ISO after retraining)", es: "Permitido (ASME QW-320; AWS 4.6; ISO tras reentrenamiento)" }
    ]
  },
  {
    id: 12,
    titleEn: "WPS Requirement",
    titleEs: "Requisito WPS",
    image: "/images/infografia/documentacion.png",
    icon: FileText,
    bgColor: 'from-lime-900/20 to-lime-800/10',
    badges: ['WPS', 'Prequalified', 'Qualified'],
    bullets: [
      { en: "Prequalified/qualified WPS required", es: "WPS precalificado/calificado requerido" }
    ]
  },
  {
    id: 13,
    titleEn: "Continuity Record",
    titleEs: "Registro de continuidad", 
    image: "/images/infografia/documentacion.png",
    bgColor: 'from-rose-900/20 to-rose-800/10',
    badges: ['Biannual', '6 Months', 'Verification'],
    bullets: [
      { en: "Biannual verification; no interruption >6 months", es: "Verificación semestral; sin interrupción >6 meses" }
    ]
  }
]

export default function InfografiaViewer() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession() || {}
  const downloadFormat = searchParams?.get('download')
  const infographicRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  
  const isAuthenticated = !!session?.user

  useEffect(() => {
    setMounted(true)
    
    // Detectar ancho de ventana para QR responsivo
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }
    
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
    
    return () => window.removeEventListener('resize', updateWindowWidth)
  }, [])

  useEffect(() => {
    if (downloadFormat && (downloadFormat === 'png' || downloadFormat === 'pdf') && mounted) {
      handleExport(downloadFormat as 'png' | 'pdf')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFormat, mounted])

  const handleExport = async (format: 'png' | 'pdf') => {
    if (!infographicRef.current || !mounted) return
    
    setIsExporting(true)
    
    try {
      // Dimensiones A3 correctas: 297mm x 420mm (relación de aspecto 1:1.414 = √2)
      // Para visualización web a 96 DPI: 297mm = 1122px, 420mm = 1587px
      const a3WidthMM = 297
      const a3HeightMM = 420
      const a3Width96DPI = 1122  // 297mm a 96 DPI
      const a3Height96DPI = 1587 // 420mm a 96 DPI
      
      // Para exportación PDF usamos escala 2.5 para mejor rendimiento y calidad
      // Esto da aproximadamente 240 DPI, suficiente para impresión profesional
      const pdfScale = 2.5
      
      const canvas = await html2canvas(infographicRef.current, {
        scale: format === 'pdf' ? pdfScale : 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#0F1216',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Asegurar que las fuentes se carguen correctamente
          const clonedElement = clonedDoc.querySelector('[data-infographic]') as HTMLElement
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif'
            clonedElement.style.width = `${a3Width96DPI}px`
            clonedElement.style.height = 'auto'
            clonedElement.style.maxWidth = `${a3Width96DPI}px`
            clonedElement.style.minHeight = `${a3Height96DPI}px`
            
            // Asegurar que todas las imágenes se carguen
            const images = clonedElement.querySelectorAll('img')
            images.forEach(img => {
              img.style.display = 'block'
              img.style.maxWidth = '100%'
              img.style.height = 'auto'
            })
          }
        }
      })

      // Aplicar marca de agua si el usuario no está autenticado
      if (!isAuthenticated) {
        applyWatermarkToCanvas(canvas, {
          text: 'DESCARGA PÚBLICA - WeldTech Solutions',
          opacity: 0.18, // Aumentada para mejor visibilidad
          fontSize: format === 'pdf' ? 50 : 45, // Más grande para PDF
          color: '#999999',
          angle: 45,
        })
      }

      if (format === 'png') {
        // PNG Download
        const link = document.createElement('a')
        const filename = isAuthenticated 
          ? 'infografia_welder_qualification_1080x1920.png'
          : 'infografia_welder_qualification_1080x1920_public.png'
        link.download = filename
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
        
        // Registrar descarga
        await trackDownload({
          documentType: 'infografia',
          documentName: filename,
          hasWatermark: !isAuthenticated,
          userId: isAuthenticated ? (session.user as any).id : undefined,
          userEmail: session?.user?.email || undefined,
        })
      } else {
        // PDF Download A3 (297mm x 420mm)
        const imgData = canvas.toDataURL('image/png', 0.95)
        
        // Calcular dimensiones manteniendo relación de aspecto
        const canvasAspectRatio = canvas.width / canvas.height
        const a3AspectRatio = a3WidthMM / a3HeightMM
        
        let imgWidth = a3WidthMM
        let imgHeight = a3HeightMM
        let offsetX = 0
        let offsetY = 0
        
        // Ajustar para mantener relación de aspecto
        if (canvasAspectRatio > a3AspectRatio) {
          // Canvas es más ancho, ajustar altura
          imgHeight = a3WidthMM / canvasAspectRatio
          offsetY = (a3HeightMM - imgHeight) / 2
        } else {
          // Canvas es más alto, ajustar ancho
          imgWidth = a3HeightMM * canvasAspectRatio
          offsetX = (a3WidthMM - imgWidth) / 2
        }
        
        let pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a3',
          compress: true
        })
        
        // Agregar metadata al PDF
        pdf.setProperties({
          title: 'Welder Qualification - Calificación de Soldadores',
          subject: 'Infografía profesional sobre calificación de soldadores según normas ASME, AWS e ISO',
          author: 'WeldTech Solutions',
          keywords: 'soldadura, calificación, ASME, AWS, ISO, welder qualification',
          creator: 'WeldTech Solutions - Professional Welding Services'
        })
        
        // Agregar imagen escalada correctamente al PDF A3, centrada
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST')
        
        // Aplicar marca de agua adicional al PDF si el usuario no está autenticado
        if (!isAuthenticated) {
          pdf = applyWatermarkToPDF(pdf, {
            text: 'DESCARGA PÚBLICA - WeldTech Solutions',
            opacity: 0.12, // Aumentada para mejor visibilidad en impresión
            fontSize: 40, // Aumentada para mejor legibilidad
            color: '#999999',
            angle: 45,
          })
        }
        
        const filename = isAuthenticated 
          ? 'infografia_welder_qualification_A3.pdf'
          : 'infografia_welder_qualification_A3_public.pdf'
        pdf.save(filename)
        
        // Registrar descarga
        await trackDownload({
          documentType: 'infografia',
          documentName: filename,
          hasWatermark: !isAuthenticated,
          userId: isAuthenticated ? (session.user as any).id : undefined,
          userEmail: session?.user?.email || undefined,
        })
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-white">Cargando infografía...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-primary mesh-gradient flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Export Controls */}
      <div className="bg-primary/50 border-b border-gray-800/50 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {/* Alert de autenticación */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#FF7A00]/10 to-[#2AA1FF]/10 border border-[#FF7A00]/30 rounded-lg p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Las descargas públicas incluyen marca de agua
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Crea una cuenta gratis para descargar sin marca de agua
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#ff8c1a] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#FF7A00]/50 transition-all duration-300 text-sm font-semibold whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  Crear cuenta gratis
                </Link>
              </div>
            </motion.div>
          )}
          
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-400 text-sm font-medium">
                  ✓ Descargas sin marca de agua disponibles
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted text-sm">
              <Download size={16} className="inline mr-2" />
              Descarga la infografía en alta calidad
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('png')}
                disabled={isExporting}
                className="btn-primary disabled:opacity-50 text-sm py-2 px-4"
              >
                <Download size={16} />
                PNG 1080x1920
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="btn-secondary disabled:opacity-50 text-sm py-2 px-4"
              >
                <Download size={16} />
                PDF A3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Infographic Content */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex-1 overflow-x-hidden">
        <div 
          ref={infographicRef}
          data-infographic
          className="bg-primary print-optimize rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800/50 w-full mx-auto"
          style={{ 
            // Dimensiones A3 exactas: 297mm x 420mm (relación de aspecto 1:1.414)
            // Responsive: se adapta al ancho disponible pero mantiene proporción A3
            width: '100%',
            maxWidth: '1122px', // Ancho A3 (297mm a 96 DPI)
            minHeight: 'auto', // Altura automática para evitar desbordamiento
            aspectRatio: '297/420', // Relación de aspecto A3 correcta
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            padding: 'clamp(1rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem)', // Padding responsivo
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #0F1216 0%, #1a1d24 100%)',
            overflow: 'visible' // Permitir que el contenido se vea completo
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-6 px-4 relative w-full mb-8"
          >
            {/* Badges de normas internacionales */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg backdrop-blur-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">ASME IX</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg backdrop-blur-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-400">AWS D1.1</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg backdrop-blur-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">ISO 9606-1</span>
              </div>
            </div>

            {/* Línea decorativa superior */}
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-accent to-transparent mx-auto mb-4"></div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 relative">
              <span className="text-primary-accent drop-shadow-lg block">Welder Qualification</span>
              <span className="text-white drop-shadow-lg block">Calificación de Soldadores</span>
              <span className="text-secondary-accent text-base sm:text-lg md:text-xl lg:text-2xl label-technical inline-flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                EN-ES
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            </h1>
            
            {/* Línea decorativa intermedia */}
            <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-secondary-accent to-transparent mx-auto mb-4"></div>
            
            <p className="text-sm sm:text-base md:text-lg text-white mb-2 font-semibold max-w-2xl mx-auto leading-relaxed px-2">
              "Califica a tus soldadores en <span className="text-primary-accent font-bold">48–72h</span> con trazabilidad completa."
            </p>
            <p className="text-xs sm:text-sm md:text-base text-muted mb-3 sm:mb-4 max-w-2xl mx-auto font-medium px-2">
              Reduce retrabajos hasta <span className="text-secondary-accent font-bold">30%</span> y supera auditorías sin sorpresas.
            </p>
            
            <div className="relative aspect-[3/4] w-full max-w-[200px] sm:max-w-xs mx-auto mb-3 sm:mb-4 card-standard glow-orange overflow-hidden group">
              <Image
                src="/images/infografia/hero-portada.png"
                alt="Hero Welder"
                fill
                className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-40"></div>
              {/* Badge flotante */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-accent/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-white font-bold text-sm">Professional Standards</span>
              </div>
            </div>
            
            {/* Línea decorativa inferior */}
            <div className="h-1 w-40 bg-gradient-to-r from-transparent via-primary-accent to-transparent mx-auto mt-4"></div>
          </motion.div>

          {/* Grid of Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full mb-6 sm:mb-8">
            {infographicSections?.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-section relative group hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                >
                  {/* Número de sección con efecto brillante */}
                  <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 label-technical-orange bg-primary-accent/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[0.65rem] sm:text-xs border border-primary-accent/30 backdrop-blur-sm flex items-center gap-1 sm:gap-1.5 z-10">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {String(section.id).padStart(2, '0')}
                  </div>
                  
                  {/* Badges de normas en la esquina superior derecha */}
                  {section.badges && (
                    <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-wrap gap-0.5 sm:gap-1 justify-end max-w-[55%] sm:max-w-[60%] z-10">
                      {section.badges.map((badge, idx) => (
                        <span 
                          key={idx}
                          className="text-[0.6rem] sm:text-[0.65rem] px-1.5 sm:px-2 py-0.5 rounded-full bg-secondary-accent/20 text-secondary-accent border border-secondary-accent/30 font-semibold backdrop-blur-sm whitespace-nowrap"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Área de imagen o icono con overlay decorativo */}
                  <div className={`relative aspect-square mb-2 sm:mb-3 md:mb-4 rounded-lg overflow-hidden border-2 border-primary-accent/20 bg-gradient-to-br ${section.bgColor || 'from-gray-800 to-gray-900'} flex items-center justify-center group-hover:border-primary-accent/40 transition-all duration-300`}>
                    {section.image ? (
                      <>
                        <Image
                          src={section.image}
                          alt={`${section.titleEn} - ${section.titleEs}`}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay sutil al hacer hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : IconComponent ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                        {/* Círculo decorativo de fondo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-primary-accent/10 blur-xl"></div>
                        </div>
                        {/* Icono principal */}
                        <IconComponent 
                          className="w-20 h-20 text-primary-accent relative z-10 group-hover:scale-110 transition-transform duration-300" 
                          strokeWidth={1.5}
                        />
                        {/* Número de fondo decorativo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-8xl font-bold text-white/5 select-none">
                            {String(section.id).padStart(2, '0')}
                          </span>
                        </div>
                        
                        {/* Timeline visual para sección de Validity (id:3) */}
                        {section.id === 3 && (
                          <div className="absolute bottom-2 left-2 right-2 z-20 space-y-1.5">
                            {/* Timeline de validez */}
                            <div className="flex items-center gap-2 text-[0.6rem]">
                              <div className="flex-1 h-1.5 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full relative overflow-hidden">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                              </div>
                              <span className="text-green-400 font-bold whitespace-nowrap">3Y</span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.6rem]">
                              <div className="flex-1 h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full relative overflow-hidden">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                                />
                              </div>
                              <span className="text-blue-400 font-bold whitespace-nowrap">∞</span>
                            </div>
                            <div className="flex items-center gap-2 text-[0.6rem]">
                              <div className="flex-1 h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full relative overflow-hidden">
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  animate={{ x: ['-100%', '100%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.6 }}
                                />
                              </div>
                              <span className="text-orange-400 font-bold whitespace-nowrap">6M</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Gráficos decorativos de barras para otras secciones */}
                        {section.id !== 3 && section.id !== 4 && section.id !== 6 && section.id !== 7 && section.id !== 8 && section.id !== 9 && section.id !== 10 && (
                          <div className="absolute bottom-2 left-2 right-2 z-20 flex items-end justify-center gap-1 h-12">
                            {/* Barras decorativas animadas */}
                            {[0.6, 0.8, 1.0, 0.7, 0.9].map((height, idx) => (
                              <motion.div
                                key={idx}
                                className="w-2 bg-gradient-to-t from-primary-accent to-secondary-accent rounded-t"
                                initial={{ height: 0 }}
                                animate={{ height: `${height * 100}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-6xl font-bold text-white/10">
                        {String(section.id).padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido de la tarjeta */}
                  <div className="space-y-3">
                    <div className="text-center relative">
                      {/* Línea decorativa superior */}
                      <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-primary-accent to-transparent mx-auto mb-3"></div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-primary-accent mb-1 sm:mb-2 tracking-tight">
                        {section.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-white font-semibold mb-1 sm:mb-2">
                        {section.titleEs}
                      </p>
                      
                      {/* Línea decorativa inferior */}
                      <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-secondary-accent/30 to-transparent mx-auto mt-3"></div>
                    </div>
                    
                    <ul className="space-y-2 sm:space-y-3">
                      {section.bullets?.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-[0.7rem] sm:text-[0.75rem] leading-relaxed">
                          <div className="font-semibold text-white flex items-start gap-1.5 sm:gap-2">
                            <span className="text-primary-accent mt-0.5 font-bold text-[0.7rem] sm:text-[0.8rem] flex-shrink-0">→</span>
                            <span className="flex-1 break-words">{bullet.en}</span>
                          </div>
                          <div className="text-muted ml-4 sm:ml-5 mt-1 sm:mt-1.5 text-[0.65rem] sm:text-[0.7rem] leading-snug break-words">
                            {bullet.es}
                          </div>
                        </li>
                      )) ?? []}
                    </ul>
                  </div>
                </motion.div>
              );
            }) ?? []}
          </div>

          {/* Footer with QR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="w-full mt-8 mb-4"
          >
            {/* Línea decorativa separadora */}
            <div className="h-1 w-64 bg-gradient-to-r from-transparent via-secondary-accent to-transparent mx-auto mb-6"></div>
            
            {/* Sección principal del footer */}
            <div className="card-standard glow-blue relative overflow-hidden mb-6">
              {/* Pattern de fondo decorativo */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 grid-pattern"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start relative z-10 p-4 sm:p-6 pb-6 sm:pb-8">
                {/* Columna izquierda: Información y enlaces */}
                <div className="space-y-4">
                  {/* Icono y título */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-secondary-accent/10 rounded-full border border-secondary-accent/30 flex-shrink-0">
                      <QrCode className="w-8 h-8 text-secondary-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-accent flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="break-words">Scan the QR for full checklist & templates</span>
                      </h3>
                      <p className="text-white font-medium text-xs sm:text-sm mt-1">
                        Escanea el QR para checklist y plantillas
                      </p>
                    </div>
                  </div>
                  
                  {/* Enlace directo */}
                  <div className="space-y-2 pt-2">
                    <a 
                      href={`${typeof window !== 'undefined' ? window.location.origin : 'https://proyecto-infografia-soldadores.vercel.app'}/infografia?utm_source=qr&utm_medium=infographic&utm_campaign=welder_qualification`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-accent hover:text-secondary-accent/80 text-sm font-semibold underline flex items-center gap-2 transition-colors break-all"
                    >
                      <span className="break-all">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://proyecto-infografia-soldadores.vercel.app'}/infografia
                      </span>
                    </a>
                  </div>
                  
                  {/* Información de contacto */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <a
                      href="https://wa.me/573133691591?text=Hola, me interesa la infografía de calificación de soldadores"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm hover:text-green-400 transition-colors group py-1"
                    >
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse group-hover:scale-125 transition-transform flex-shrink-0"></div>
                      <span className="text-muted label-technical whitespace-nowrap">WhatsApp:</span>
                      <span className="text-white font-bold whitespace-nowrap">3133691591</span>
                    </a>
                  </div>
                </div>
                
                {/* Columna derecha: QR Code */}
                <div className="flex justify-center items-start">
                  <div className="relative mb-6">
                    {/* Anillos decorativos alrededor del QR */}
                    <div className="absolute inset-0 -m-4 border-2 border-primary-accent/20 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 -m-6 border border-secondary-accent/10 rounded-2xl"></div>
                    
                    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl glow-orange relative z-10 shadow-2xl hover:scale-105 transition-transform duration-300 w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] mx-auto">
                      <QRCode 
                        value={`${typeof window !== 'undefined' ? window.location.origin : 'https://proyecto-infografia-soldadores.vercel.app'}/infografia?utm_source=qr&utm_medium=infographic&utm_campaign=welder_qualification`}
                        size={windowWidth > 0 ? (windowWidth < 640 ? 120 : windowWidth < 768 ? 150 : 180) : 150}
                        level="H"
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                    
                    {/* Badge de escaneo */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-accent to-orange-600 px-4 py-1.5 rounded-full border-2 border-white/20 shadow-lg hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xs">SCAN ME</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Badges de características */}
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold hover:bg-green-500/20 transition-colors">
                      ✓ 48-72h Certification
                    </div>
                    <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 font-semibold hover:bg-blue-500/20 transition-colors">
                      ✓ Full Traceability
                    </div>
                    <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400 font-semibold hover:bg-purple-500/20 transition-colors">
                      ✓ International Standards
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer inferior: Copyright y valores */}
            <div className="pt-4 sm:pt-6 pb-3 sm:pb-4 border-t border-gray-800/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                {/* Copyright */}
                <div className="flex items-center gap-2 text-muted flex-wrap justify-center md:justify-start">
                  <Award className="w-4 h-4 text-primary-accent flex-shrink-0" />
                  <span className="label-technical text-center md:text-left">© 2025 WeldTech Solutions. Todos los derechos reservados.</span>
                </div>
                
                {/* Valores de la marca */}
                <div className="flex items-center gap-2.5 text-muted flex-wrap justify-center md:justify-end">
                  <span className="text-xs label-technical text-primary-accent/80 whitespace-nowrap">PRECISIÓN TÉCNICA</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs label-technical text-secondary-accent/80 whitespace-nowrap">CLARIDAD</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs label-technical text-primary-accent/80 whitespace-nowrap">ÉLITE</span>
                </div>
              </div>
            </div>
            
            {/* Línea decorativa final */}
            <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-primary-accent to-transparent mx-auto mt-4 mb-2"></div>
          </motion.div>
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-standard text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Exportando infografía...</p>
            <p className="text-muted text-sm mt-2">Esto puede tomar unos segundos</p>
          </div>
        </div>
      )}
    </div>
  )
}
