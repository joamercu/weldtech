'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Target, 
  Users, 
  TrendingUp,
  Download,
  ArrowRight,
  Shield,
  Zap,
  Award,
  MessageCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Navbar from './navbar'
import Footer from './footer'

// Función para procesar markdown básico y convertir a elementos React
function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentList: JSX.Element[] = []
  let listType: 'ordered' | 'unordered' | null = null
  let keyCounter = 0

  const processLine = (line: string, index: number) => {
    const trimmed = line.trim()
    
    // Línea vacía
    if (!trimmed) {
      if (currentList.length > 0) {
        elements.push(
          listType === 'ordered' ? (
            <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ol>
          ) : (
            <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ul>
          )
        )
        currentList = []
        listType = null
      }
      elements.push(<br key={`br-${keyCounter++}`} />)
      return
    }

    // Procesar texto con negritas y emojis
    const processText = (text: string): (string | JSX.Element)[] => {
      const parts: (string | JSX.Element)[] = []
      const boldRegex = /\*\*(.+?)\*\*/g
      let lastIndex = 0
      let match

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index))
        }
        parts.push(
          <strong key={`bold-${keyCounter++}`} className="font-bold text-white">
            {match[1]}
          </strong>
        )
        lastIndex = match.index + match[0].length
      }
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex))
      }
      return parts.length > 0 ? parts : [text]
    }

    // Detectar títulos (líneas que terminan en ":")
    const isTitle = trimmed.endsWith(':') && trimmed.includes('**')
    if (isTitle) {
      if (currentList.length > 0) {
        elements.push(
          listType === 'ordered' ? (
            <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ol>
          ) : (
            <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ul>
          )
        )
        currentList = []
        listType = null
      }
      const processed = processText(trimmed)
      elements.push(
        <h3 key={`title-${keyCounter++}`} className="text-lg font-bold text-white mb-3 mt-6 first:mt-0">
          {processed}
        </h3>
      )
      return
    }

    // Lista ordenada (1. 2. 3.)
    const orderedListMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (orderedListMatch) {
      if (listType !== 'ordered' && currentList.length > 0) {
        elements.push(
          listType === 'unordered' ? (
            <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ul>
          ) : (
            <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ol>
          )
        )
        currentList = []
      }
      listType = 'ordered'
      const content = processText(orderedListMatch[2])
      currentList.push(
        <li key={`item-${keyCounter++}`} className="text-gray-300 mb-2 leading-relaxed">
          {content}
        </li>
      )
      return
    }

    // Lista con viñetas (-)
    const unorderedListMatch = trimmed.match(/^-\s+(.+)$/)
    if (unorderedListMatch) {
      if (listType !== 'unordered' && currentList.length > 0) {
        elements.push(
          listType === 'ordered' ? (
            <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ol>
          ) : (
            <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
              {currentList}
            </ul>
          )
        )
        currentList = []
      }
      listType = 'unordered'
      const content = processText(unorderedListMatch[1])
      currentList.push(
        <li key={`item-${keyCounter++}`} className="text-gray-300 mb-2 leading-relaxed">
          {content}
        </li>
      )
      return
    }

    // Cerrar lista si existe
    if (currentList.length > 0) {
      elements.push(
        listType === 'ordered' ? (
          <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
            {currentList}
          </ol>
        ) : (
          <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {currentList}
          </ul>
        )
      )
      currentList = []
      listType = null
    }

    // Párrafo normal
    const processed = processText(trimmed)
    elements.push(
      <p key={`p-${keyCounter++}`} className="mb-4 text-gray-300 leading-relaxed">
        {processed}
      </p>
    )
  }

  lines.forEach((line, index) => processLine(line, index))

  // Cerrar lista final si existe
  if (currentList.length > 0) {
    elements.push(
      listType === 'ordered' ? (
        <ol key={`list-${keyCounter++}`} className="list-decimal list-inside space-y-2 mb-4 ml-4">
          {currentList}
        </ol>
      ) : (
        <ul key={`list-${keyCounter++}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
          {currentList}
        </ul>
      )
    )
  }

  return <div className="space-y-3">{elements}</div>
}

export default function GuiaIntegralPage() {
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  const sections = [
    {
      id: 'introduccion',
      title: 'Introducción',
      icon: BookOpen,
      description: 'Propósito de la guía y su importancia para clientes',
      content: `
        Esta guía integral ha sido diseñada para proporcionarle una comprensión completa de los servicios, herramientas y metodologías que WeldTech Solutions pone a su disposición. 
        
        Nuestro objetivo es transformar la complejidad de las normativas internacionales de soldadura en soluciones prácticas y aplicables que generen resultados medibles en su organización.
        
        **Esta guía es importante porque:**
        - Clarifica el alcance completo de nuestros servicios y recursos
        - Establece expectativas realistas sobre resultados y tiempos
        - Proporciona un diagnóstico estructurado de sus necesidades actuales
        - Define un plan de calidad personalizado adaptado a su contexto
        - Garantiza trazabilidad total desde la documentación hasta la ejecución
      `
    },
    {
      id: 'portafolio',
      title: 'Portafolio de Servicios',
      icon: FileText,
      description: 'Resumen de los aspectos más destacados y las principales ofertas del portafolio',
      content: `
        WeldTech Solutions ofrece un ecosistema completo de recursos técnicos diseñados para profesionales de soldadura:
        
        **1. Infografías Técnicas Bilingües**
        - ASME IX, AWS D1.1, ISO 9606, API 1104
        - Formato: PNG, PDF A3, PDF A4
        - Aplicación: Training, referencia, presentaciones
        
        **2. Herramientas Interactivas**
        - Calculadora de Rangos de Calificación (ahorra 30-45 min por cálculo)
        - Comparador Visual de Normas (ASME IX vs AWS D1.1 vs ISO 9606)
        - Tabla de Equivalencias de Posiciones (1G-6G ↔ PA-PG)
        - Guía de Defectos de Soldadura (50+ defectos con causas y soluciones)
        
        **3. Plantillas Profesionales**
        - WPS (ASME IX QW-482 / AWS D1.1)
        - PQR (QW-483) con auto-cálculo heat input
        - WPQ (QW-484) con auto-cálculo rangos QW-451
        - Checklist de Auditoría (50+ puntos con auto-scoring)
        - Matriz de Trazabilidad WPS-PQR-WPQ-Soldador
        
        **4. Contenido Educativo**
        - Blog técnico profundo (1,500-2,500 palabras/artículo)
        - Casos de estudio reales con ROI comprobado
        
        **5. Consultoría Especializada**
        - Diagnóstico inicial (GRATUITO - 30-45 min)
        - Implementación de sistema de calidad
        - Preparación para auditorías
      `
    },
    {
      id: 'diagnostico',
      title: 'Lista de Verificación de Diagnóstico',
      icon: CheckCircle2,
      description: 'Lista de elementos necesarios para iniciar la evaluación del servicio',
      content: `
        Esta lista de verificación exhaustiva le permitirá evaluar el estado actual de su sistema de calificación de soldadores y documentación técnica.
        
        **60 items organizados en 6 secciones:**
        
        1. **Documentación** (15 items): WPS, PQR, WPQ, matriz de trazabilidad
        2. **Soldadores** (12 items): Identificación, calificaciones, continuidad
        3. **Materiales** (8 items): MTRs, trazabilidad, almacenamiento
        4. **Equipos** (7 items): Calibración, mantenimiento
        5. **Procesos** (8 items): Precalentamiento, PWHT, limpieza
        6. **Trazabilidad y Gestión** (10 items): Matriz, sistema digital, auditorías
        
        **Índice de Compliance:**
        - 90-100%: ✅ Excelente - Mantenimiento y mejora continua
        - 75-89%: ⚠️ Bueno con mejoras - Atención a Minor NCs
        - 60-74%: ⚠️ Requiere acción - Plan de cierre de gaps inmediato
        - <60%: ❌ Crítico - Intervención urgente, riesgo alto
        
        **Próximos Pasos:**
        Con base en su diagnóstico, puede agendar una consultoría de diagnóstico profundo (GRATUITA) con nuestro equipo.
      `
    },
    {
      id: 'plan-calidad',
      title: 'Plan de Calidad Personalizado',
      icon: Target,
      description: 'Descripción de cómo se personalizará el plan de calidad para cada cliente',
      content: `
        El Plan de Calidad Personalizado de WeldTech Solutions no es un documento genérico. Es una hoja de ruta específica diseñada para transformar los hallazgos de su diagnóstico en acciones concretas con resultados medibles.
        
        **Este plan se personaliza según:**
        - Su índice de compliance actual
        - Los gaps identificados en diagnóstico
        - Su industria y normativa aplicable
        - Tamaño de su operación (soldadores, proyectos)
        - Urgencia (próximas auditorías, fechas límite)
        - Presupuesto y recursos disponibles
        
        **3 Paquetes de Servicios:**
        
        **PAQUETE A: BÁSICO** (Para compliance >75%)
        - 5 Plantillas Profesionales (WPS, PQR, WPQ, Checklist, Matriz)
        - Acceso a Herramientas Interactivas
        - 1 Sesión de training online (2 horas)
        - Soporte por email (30 días)
        - Duración: 2-3 semanas
        
        **PAQUETE B: ESTÁNDAR** (Para compliance 60-75%)
        - Todo del Paquete A +
        - Consultoría de implementación (20 horas)
        - Creación de matriz de trazabilidad inicial
        - 2 Sesiones de training (4 horas total)
        - Mock audit (auditoría simulada)
        - Soporte prioritario (60 días)
        - Duración: 4-6 semanas
        
        **PAQUETE C: PREMIUM** (Para compliance <60%)
        - Todo del Paquete B +
        - Consultoría intensiva (40+ horas)
        - Creación de WPS/PQR faltantes (hasta 5)
        - Re-diseño completo de sistema documental
        - Training in-company para todo el equipo
        - Soporte durante auditoría real
        - Garantía de resultados (cero hallazgos mayores)
        - Duración: 8-12 semanas
      `
    },
    {
      id: 'casos-exito',
      title: 'Casos de Éxito',
      icon: Award,
      description: 'Resultados reales con métricas comprobadas',
      content: `
        **CASO 1: Contractor de Oil & Gas - Calificación 6G para Pipeline**
        - Cliente: Contractor de tuberías en Colombia
        - Desafío: Calificar 15 soldadores en posición 6G en 2 semanas
        - Resultado: 87% aprobación (13/15 en 1er intento), reducción 40% tiempo
        - ROI: Ahorro $12,000 USD en retrasos evitados
        
        **CASO 2: Astillero Naval - Sistema de Trazabilidad para DNV**
        - Cliente: Astillero en Ecuador
        - Desafío: Implementar trazabilidad completa WPS-PQR-WPQ-Soldador
        - Resultado: 0 hallazgos mayores en auditoría DNV, contrato renovado $500k+
        - ROI: Contrato renovado por 3 años
        
        **CASO 3: Planta Química - GTAW para Acero Inoxidable**
        - Cliente: Planta química en Chile
        - Desafío: Cero porosidad, 100% RT, técnica de purga compleja
        - Resultado: 95% aprobación RT (vs. 60% histórico), ahorro $45k en retrabajos
        - ROI: Ahorro $45,000 USD en retrabajos evitados
        
        **Métricas Agregadas:**
        - Reducción promedio de tiempo: 40%
        - Mejora en tasa de aprobación: +35 puntos porcentuales
        - Ahorro promedio en retrabajos: $30k-50k USD por proyecto
        - Hallazgos mayores en auditorías: 0 (en 12 casos)
        - Satisfacción (NPS): 78 (Promoter)
        - Clientes recurrentes: 85%
      `
    },
    {
      id: 'metodologia',
      title: 'Metodología de Trabajo',
      icon: Zap,
      description: 'Nuestra filosofía de implementación y flujo de trabajo',
      content: `
        En WeldTech Solutions trabajamos bajo el principio de **"Resultados Medibles, No Solo Documentos"**.
        
        **Principios Rectores:**
        - 🎯 **Practicidad sobre Teoría**: Cada acción debe generar valor tangible
        - 📊 **Data-Driven**: Todas las decisiones se basan en datos
        - 🤝 **Colaborativo**: Trabajamos CON su equipo, no EN LUGAR de su equipo
        - ⚡ **Ágil**: Iteraciones cortas (1-2 semanas), feedback continuo
        - ✅ **Orientado a Resultados**: KPIs específicos, timeline realista
        
        **Flujo de Trabajo:**
        1. **FASE 0: Contacto Inicial** (Día 1-2)
        2. **FASE 1: Diagnóstico** (Día 3-7) - Sesión 30-45 min
        3. **FASE 2: Propuesta** (Día 8-14) - Plan personalizado
        4. **FASE 3: Implementación** (Semana 3-8) - Sprints
        5. **FASE 4: Validación** (Semana 9) - Mock audit
        6. **FASE 5: Soporte Post** (Semana 10-22) - 30-60 días
        
        **Canales de Comunicación:**
        - WhatsApp Business: +57 313 369 1591 (<4h hábiles)
        - Email: contacto@weldtechsolutions.com (<24h)
        - Video Calls: Google Meet / Zoom (agendadas semanalmente)
        - Dashboard Compartido: Google Sheets / Notion (actualización diaria)
      `
    }
  ]

  return (
    <div className="min-h-screen bg-primary mesh-gradient">
      <Navbar />
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Shield className="text-primary-accent" size={20} />
            <span className="text-white font-semibold">Acceso Exclusivo para Usuarios Registrados</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Guía Integral de Servicios
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transformamos normativas complejas en herramientas prácticas para la cualificación de soldadores con trazabilidad total.
          </p>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Bienvenido, {session?.user?.name || session?.user?.email}</span>
            <span>•</span>
            <span>Versión 1.0 | Noviembre 2025</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <Link
            href="https://wa.me/573133691591?text=Hola, me interesa agendar un diagnóstico gratuito"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
          >
            <MessageCircle className="text-primary-accent mb-3" size={24} />
            <h3 className="text-white font-semibold mb-2">Diagnóstico Gratuito</h3>
            <p className="text-gray-400 text-sm">Agenda una sesión de 30-45 min sin compromiso</p>
            <ArrowRight className="text-primary-accent mt-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Link>

          <Link
            href="/plantillas"
            className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
          >
            <Download className="text-primary-accent mb-3" size={24} />
            <h3 className="text-white font-semibold mb-2">Descargar Plantillas</h3>
            <p className="text-gray-400 text-sm">WPS, PQR, WPQ, Checklist y más</p>
            <ArrowRight className="text-primary-accent mt-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Link>

          <Link
            href="/recursos"
            className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
          >
            <Zap className="text-primary-accent mb-3" size={24} />
            <h3 className="text-white font-semibold mb-2">Herramientas Interactivas</h3>
            <p className="text-gray-400 text-sm">Calculadoras, comparadores y más</p>
            <ArrowRight className="text-primary-accent mt-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = activeSection === section.id

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className="w-full p-6 flex items-start gap-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#2AA1FF] rounded-lg flex items-center justify-center">
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{section.title}</h2>
                    <p className="text-gray-400 text-sm">{section.description}</p>
                  </div>
                  <ArrowRight
                    className={`text-gray-400 transition-transform flex-shrink-0 mt-2 ${isActive ? 'rotate-90' : ''}`}
                    size={20}
                  />
                </button>

                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="pt-4 border-t border-white/10">
                      <div className="prose prose-invert max-w-none">
                        {renderMarkdown(section.content)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-8 bg-gradient-to-r from-[#FF7A00]/20 to-[#2AA1FF]/20 border border-primary-accent/30 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Listo para Transformar su Sistema de Calificación?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Agende una sesión de diagnóstico gratuita de 30-45 minutos. Sin compromiso, solo valor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://wa.me/573133691591?text=Hola, me interesa agendar un diagnóstico gratuito"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Agendar Diagnóstico Gratuito
            </Link>
            <Link
              href="/plantillas"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Ver Plantillas
            </Link>
          </div>
        </motion.div>

        {/* Download Full Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            ¿Necesita la guía completa en formato PDF profesional?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/api/guia-servicio/generate-pdf"
              download
              onClick={() => {
                if (!isDownloadingPDF) {
                  setIsDownloadingPDF(true);
                  toast.loading('Generando PDF...', { id: 'pdf-download' });
                  
                  setTimeout(() => {
                    toast.success('PDF descargado exitosamente', { id: 'pdf-download' });
                    setIsDownloadingPDF(false);
                  }, 3000);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF9500] text-white rounded-lg font-semibold hover:from-[#FF9500] hover:to-[#FF7A00] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed no-underline"
            >
              {isDownloadingPDF ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Descargar Guía Completa (PDF)
                </>
              )}
            </a>
            <Link
              href="/docs/GUIA_INTEGRAL_WELDTECH.md"
              download
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-accent hover:text-primary-accent/80 transition-colors font-semibold border border-primary-accent/30 rounded-lg"
            >
              <FileText size={18} />
              Versión Markdown
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

