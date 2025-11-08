
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Calendar, CheckCircle, MessageCircle, Sparkles, FileText, Users, Wrench, Table, AlertTriangle, FileEdit, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from './navbar'
import Footer from './footer'

export default function LandingPage() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (format: 'png' | 'pdf') => {
    setIsDownloading(true)
    // Redirect to infographic page for download
    window.open(`/infografia?download=${format}&utm_source=whatsapp&utm_medium=message&utm_campaign=infografia_welder`, '_blank')
    
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  const benefits = [
    {
      icon: CheckCircle,
      title: "Checklist listo para auditoría",
      description: "Verificación sistemática de todos los requisitos ASME/AWS/ISO"
    },
    {
      icon: Users,
      title: "Bilingüe EN-ES",
      description: "Vocabulario técnico en inglés y español para equipos internacionales"
    },
    {
      icon: FileText,
      title: "Plantillas WPS/WPQ incluidas",
      description: "Formatos preconfigurables para calificaciones y procedimientos"
    }
  ]

  return (
    <div className="min-h-screen bg-primary mesh-gradient">
      <Navbar />
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-20 px-4 grid-pattern"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-primary-accent">Welder Qualification</span>
                  <br />
                  <span className="text-white">Guía EN-ES</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted mt-4">
                  13 reglas clave ASME/AWS/ISO en 90 segundos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="card-standard glow-orange"
              >
                <p className="text-lg font-medium text-white">
                  "Califica a tus soldadores en 48–72h con trazabilidad completa. 
                  Reduce retrabajos hasta 30% y supera auditorías sin sorpresas."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => handleDownload('png')}
                  disabled={isDownloading}
                  className="btn-primary disabled:opacity-70"
                >
                  <Download size={20} />
                  {isDownloading ? 'Preparando...' : 'Descargar Infografía PNG'}
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="btn-secondary"
                >
                  <FileText size={20} />
                  Descargar PDF A3
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link
                  href="#"
                  className="btn-ghost"
                >
                  <Calendar size={18} />
                  Agenda Diagnóstico Gratuito 15 min
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] card-standard glow-blue">
                <Image
                  src="/images/infografia/hero-portada.png"
                  alt="Infografía Calificación de Soldadores"
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm backdrop-blur-sm bg-black/30 p-2 rounded label-technical">
                    Vista previa de la infografía completa
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              ¿Qué incluye esta guía?
            </h2>
            <p className="text-xl text-muted">
              Todo lo que necesitas para calificar soldadores según estándares internacionales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits?.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-section card-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-accent/20 rounded-lg icon-primary">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">{benefit.title}</h3>
                </div>
                <p className="text-muted">{benefit.description}</p>
              </motion.div>
            )) ?? []}
          </div>
        </div>
      </motion.section>

      {/* Professional Tools Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-primary"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 gradient-text">
                Herramientas Profesionales
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                Suite completa de herramientas interactivas para soldadores y supervisores
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/herramientas/posiciones" className="block h-full">
                <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Table className="w-6 h-6 text-primary-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Equivalencia de Posiciones</h3>
                      <p className="text-muted">
                        Tabla comparativa completa entre normas AWS, ISO y EN para posiciones de soldadura con descripciones detalladas.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/herramientas/defectos" className="block h-full">
                <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Guía Visual de Defectos</h3>
                      <p className="text-muted">
                        Identificación, causas, prevención y remedios para defectos comunes en soldadura con imágenes ilustrativas.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/herramientas/wps-builder" className="block h-full">
                <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileEdit className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">WPS Builder Interactivo</h3>
                      <p className="text-muted">
                        Constructor completo de Especificaciones de Procedimientos de Soldadura con exportación y gestión.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/herramientas/calificaciones" className="block h-full">
                <div className="card p-6 h-full hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Qualification Tracker</h3>
                      <p className="text-muted">
                        Sistema profesional de seguimiento y gestión de certificaciones AWS y ASME con alertas de vencimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Social Proof Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 hero-gradient"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-standard glow-orange">
            <div className="flex justify-center mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-400 rounded-full border-2 border-white animate-pulse-glow"
                  />
                ))}
              </div>
            </div>
            <blockquote className="text-xl lg:text-2xl font-medium mb-4 text-white">
              "Implementamos esta guía en nuestro taller y reducimos los tiempos de calificación en 40%. 
              La claridad del contenido bilingüe facilitó la comunicación con nuestro equipo internacional."
            </blockquote>
            <cite className="text-muted font-medium">
              — Jefe de Calidad, Empresa Metalúrgica LatAm
            </cite>
          </div>
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-b from-transparent to-black/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Más Recursos para Ti
            </h2>
            <p className="text-xl text-muted">
              Herramientas y plantillas profesionales para optimizar tu trabajo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link
                href="/recursos"
                className="block card-standard glow-blue h-full transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary-accent/20 rounded-lg">
                    <Sparkles className="w-8 h-8 text-secondary-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Centro de Recursos
                    </h3>
                    <p className="text-muted mb-4">
                      Calculadora de rangos, comparador de normas y herramientas interactivas
                    </p>
                    <div className="text-secondary-accent font-semibold">
                      Explorar herramientas →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link
                href="/plantillas"
                className="block card-standard glow-orange h-full transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-accent/20 rounded-lg">
                    <FileText className="w-8 h-8 text-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Plantillas Premium
                    </h3>
                    <p className="text-muted mb-4">
                      WPS, PQR, WPQ, checklists y más. Descarga gratuita del pack completo
                    </p>
                    <div className="text-primary-accent font-semibold">
                      Descargar plantillas →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}
