
'use client'

import { useState } from 'react'
import { FileText, Download, CheckCircle, ArrowLeft, X, Lock, FileSpreadsheet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Navbar from './navbar'
import Footer from './footer'
import { TEMPLATES } from '@/lib/templates-config'

interface Template {
  id: string
  title: string
  titleEn: string
  description: string
  features: string[]
  icon: string
  standard: string
}

interface FormData {
  fullName: string
  email: string
  company: string
  position: string
  country: string
  howDidYouHear: string
  acceptNewsletter: boolean
}

export default function PlantillasPage() {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    position: '',
    country: '',
    howDidYouHear: '',
    acceptNewsletter: true
  })

  // Función de descarga de plantillas
  const handleDownload = async (templateId: string) => {
    if (downloading === templateId) return // Evitar múltiples clics

    setDownloading(templateId)
    
    try {
      const response = await fetch(`/api/templates/download?id=${templateId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al descargar')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Obtener nombre del archivo desde header
      const contentDisposition = response.headers.get('Content-Disposition')
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
      a.download = fileNameMatch ? fileNameMatch[1] : `template_${templateId}.xlsx`
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      // Mostrar mensaje de éxito
      if (isAuthenticated) {
        toast.success('¡Plantilla Excel descargada!', {
          description: 'Archivo editable sin marca de agua',
        })
      } else {
        toast.info('PDF descargado', {
          description: 'Regístrate gratis para obtener la versión Excel editable',
          action: {
            label: 'Registrarse',
            onClick: () => window.location.href = '/auth/signup'
          }
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al descargar', {
        description: error instanceof Error ? error.message : 'Por favor intenta de nuevo',
      })
    } finally {
      setDownloading(null)
    }
  }

  // Convertir TEMPLATES a formato de Template para compatibilidad
  const templates: Template[] = TEMPLATES.map(t => ({
    id: t.id,
    title: t.name,
    titleEn: t.nameEn,
    description: t.description,
    features: t.features,
    icon: t.icon,
    standard: t.standard,
  }))

  const positions = [
    'Inspector CWI/CSWIP',
    'Ingeniero de Soldadura',
    'QC Manager',
    'Supervisor de Soldadura',
    'Coordinador de Calidad',
    'Ingeniero de Proyectos',
    'Soldador',
    'Otro'
  ]

  const sources = [
    'WhatsApp',
    'LinkedIn',
    'Google',
    'Referido',
    'Instagram',
    'Otro'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.company) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido')
      return
    }

    // Here you would normally send to your backend/CRM
    console.log('Form submitted:', formData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
      setFormData({
        fullName: '',
        email: '',
        company: '',
        position: '',
        country: '',
        howDidYouHear: '',
        acceptNewsletter: true
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-primary mesh-gradient">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-accent/10 rounded-full mb-6">
              <FileText className="w-5 h-5 text-primary-accent" />
              <span className="text-primary-accent font-semibold label-technical">
                PLANTILLAS PREMIUM
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Plantillas Profesionales</span>
              <br />
              <span className="text-primary-accent">Listas para Usar</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
              Descarga 5 plantillas profesionales de WPS, PQR, WPQ, checklist de auditoría y matriz de trazabilidad. 
              Ahorra 2-3 horas de trabajo con formatos preconfigurables según ASME IX, AWS D1.1 e ISO 9606.
            </p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={() => setShowModal(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              <Download size={24} />
              Descargar Pack Completo Gratis
            </motion.button>

            <p className="text-sm text-muted mt-4">
              ✓ Descarga instantánea • ✓ Sin tarjeta de crédito • ✓ Guía de uso incluida
            </p>

            {/* Indicador de estado de autenticación */}
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-success/20 border border-success/30 rounded-full"
              >
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success font-semibold text-sm">
                  Acceso completo: Descargas Excel editables sin marca de agua
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-accent/20 border border-primary-accent/30 rounded-full"
              >
                <Lock className="w-5 h-5 text-primary-accent" />
                <span className="text-primary-accent font-semibold text-sm">
                  Las descargas públicas incluyen marca de agua
                </span>
                <Link
                  href="/auth/signup"
                  className="text-primary-accent hover:text-white underline font-bold"
                >
                  Crear cuenta gratis
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="card-standard glow-orange"
              >
                <div className="text-5xl mb-4">{template.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-secondary-accent mb-3 label-technical">
                  {template.titleEn}
                </p>
                <p className="text-muted text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="border-t border-gray-800/50 pt-4 mb-4">
                  <p className="text-xs text-muted mb-2 font-semibold">
                    Características:
                  </p>
                  <ul className="space-y-1">
                    {template.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted">
                        <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-muted label-technical mb-4">
                  Estándar: {template.standard}
                </div>

                {/* Botón de descarga */}
                <button
                  onClick={() => handleDownload(template.id)}
                  disabled={downloading === template.id}
                  className={`w-full btn-primary flex items-center justify-center gap-2 ${
                    !isAuthenticated ? 'btn-secondary' : ''
                  } ${downloading === template.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {downloading === template.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Descargando...
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <FileSpreadsheet size={20} />
                      Descargar Excel Editable
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Descargar Vista Previa (PDF)
                    </>
                  )}
                </button>

                {/* Badge de estado */}
                {isAuthenticated ? (
                  <div className="mt-2 text-center text-xs text-success flex items-center justify-center gap-1">
                    <CheckCircle size={14} />
                    Sin marca de agua • Completamente editable
                  </div>
                ) : (
                  <div className="mt-2 text-center text-xs text-muted flex items-center justify-center gap-1">
                    <Lock size={14} />
                    Regístrate gratis para obtener versión Excel
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="card-standard glow-blue text-center max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              ¿Por qué usar nuestras plantillas?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">⏱️</div>
                <h4 className="font-semibold text-white mb-2">Ahorra Tiempo</h4>
                <p className="text-sm text-muted">
                  2-3 horas promedio ahorradas por documento
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">✅</div>
                <h4 className="font-semibold text-white mb-2">Sin Errores</h4>
                <p className="text-sm text-muted">
                  Validaciones automáticas según códigos
                </p>
              </div>
              <div>
                <div className="text-4xl mb-3">🎓</div>
                <h4 className="font-semibold text-white mb-2">Profesional</h4>
                <p className="text-sm text-muted">
                  Diseño técnico de nivel internacional
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              <Download size={24} />
              Descargar Ahora
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !submitted && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-standard max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {!submitted ? (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="text-center mb-8">
                    <Download className="w-16 h-16 text-primary-accent mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Descarga Tus Plantillas
                    </h2>
                    <p className="text-muted">
                      Completa el formulario para recibir el pack completo por email
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Nombre Completo <span className="text-primary-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Juan Pérez"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          placeholder:text-muted focus:border-secondary-accent focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Email Corporativo <span className="text-primary-accent">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="juan.perez@empresa.com"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          placeholder:text-muted focus:border-secondary-accent focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Empresa <span className="text-primary-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Empresa Metalúrgica S.A."
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          placeholder:text-muted focus:border-secondary-accent focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Cargo
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          focus:border-secondary-accent focus:bg-white/10 transition-all"
                      >
                        <option value="">Selecciona un cargo</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        placeholder="Colombia"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          placeholder:text-muted focus:border-secondary-accent focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* How did you hear */}
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        ¿Cómo nos conociste?
                      </label>
                      <select
                        value={formData.howDidYouHear}
                        onChange={(e) => setFormData({...formData, howDidYouHear: e.target.value})}
                        className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white 
                          focus:border-secondary-accent focus:bg-white/10 transition-all"
                      >
                        <option value="">Selecciona una opción</option>
                        {sources.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>

                    {/* Newsletter Checkbox */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={formData.acceptNewsletter}
                        onChange={(e) => setFormData({...formData, acceptNewsletter: e.target.checked})}
                        className="mt-1"
                      />
                      <label htmlFor="newsletter" className="text-sm text-muted cursor-pointer">
                        Acepto recibir contenido técnico y actualizaciones de WeldTech Solutions. 
                        Puedes cancelar en cualquier momento.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full btn-primary text-lg py-4"
                    >
                      <Download size={20} />
                      Descargar Plantillas
                    </button>

                    <p className="text-xs text-muted text-center">
                      Al descargar, aceptas nuestros términos de uso. 
                      Tus datos están protegidos y no serán compartidos.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    ¡Listo!
                  </h2>
                  <p className="text-xl text-muted mb-2">
                    Revisa tu email: <span className="text-white font-semibold">{formData.email}</span>
                  </p>
                  <p className="text-muted">
                    Recibirás el pack de plantillas en los próximos minutos
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
