
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-gray-800/50 bg-gradient-to-b from-transparent to-black/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-48 h-16 transition-transform group-hover:scale-105">
                <Image
                  src="/logo/weldtech-horizontal-full-color.png"
                  alt="WeldTech Solutions"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Transformamos normativas complejas en herramientas prácticas para la cualificación de soldadores con trazabilidad total.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo/weldtech-symbol-only.jpg"
                  alt="WeldTech Symbol"
                  fill
                  className="object-contain opacity-60"
                />
              </div>
              <div className="text-xs text-muted label-technical">
                Soluciones técnicas de élite
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 label-technical">Navegación</h3>
            <div className="space-y-3">
              <Link
                href="/infografia"
                className="block text-muted hover:text-white transition-colors"
              >
                Infografía Completa
              </Link>
              <Link
                href="/recursos"
                className="block text-muted hover:text-secondary-accent transition-colors"
              >
                Centro de Recursos
              </Link>
              <Link
                href="/plantillas"
                className="block text-muted hover:text-primary-accent transition-colors"
              >
                Plantillas Premium
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 label-technical">Contacto</h3>
            <div className="space-y-4">
              <Link
                href="https://wa.me/573133691591?text=Hola, me interesa la guía de calificación de soldadores"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-success transition-colors group"
              >
                <div className="p-2 bg-success/20 rounded-lg group-hover:bg-success/30 transition-colors">
                  <MessageCircle size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">WhatsApp</div>
                  <div className="text-xs">Consultas y soporte</div>
                </div>
              </Link>
              <div className="text-muted text-sm">
                <p className="mb-1 label-technical">Estándares cubiertos:</p>
                <p className="text-xs">ASME IX • AWS D1.1 • ISO 9606 • API 1104</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted text-sm">
            <p>© 2025 WeldTech Solutions. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs label-technical">PRECISIÓN TÉCNICA</span>
              <span className="text-xs">•</span>
              <span className="text-xs label-technical">CLARIDAD</span>
              <span className="text-xs">•</span>
              <span className="text-xs label-technical">ÉLITE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
