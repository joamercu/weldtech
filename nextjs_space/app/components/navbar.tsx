
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Menu, X, ChevronDown, Wrench, User, LogOut, LogIn, UserPlus, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { data: session, status } = useSession() || {}
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [herramientasOpen, setHerramientasOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const isAuthenticated = !!session?.user

  const navLinks = [
    { href: '/infografia', label: 'Infografía' },
    { href: '/recursos', label: 'Recursos' },
    { href: '/plantillas', label: 'Plantillas' },
  ]

  const herramientasLinks = [
    { href: '/herramientas/posiciones', label: 'Equivalencia de Posiciones', description: 'Tabla comparativa AWS/ISO/EN' },
    { href: '/herramientas/defectos', label: 'Guía de Defectos', description: 'Identificación y prevención' },
    { href: '/herramientas/wps-builder', label: 'WPS Builder', description: 'Constructor de especificaciones' },
    { href: '/herramientas/calificaciones', label: 'Qualification Tracker', description: 'Gestión de certificaciones' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-primary/80 border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-32 h-10 md:w-48 md:h-12 transition-transform group-hover:scale-105">
              <Image
                src="/logo/weldtech-horizontal-full-color.png"
                alt="WeldTech Solutions"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-primary-accent transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Herramientas Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setHerramientasOpen(true)}
              onMouseLeave={() => setHerramientasOpen(false)}
            >
              <button 
                onClick={() => setHerramientasOpen(!herramientasOpen)}
                className="text-white hover:text-primary-accent transition-colors font-medium flex items-center gap-1"
              >
                <Wrench size={18} />
                Herramientas
                <ChevronDown size={16} className={`transition-transform ${herramientasOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {herramientasOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl overflow-hidden"
                  >
                    {herramientasLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                      >
                        <div className="text-white font-semibold text-sm">{link.label}</div>
                        <div className="text-gray-400 text-xs mt-1">{link.description}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="https://wa.me/573133691591?text=Hola, me interesa la guía de calificación de soldadores"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 !px-4"
            >
              <MessageCircle size={18} />
              Contactar
            </Link>
            
            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-primary-accent transition-colors font-medium"
                >
                  <LogIn size={18} />
                  Entrar
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#ff8c1a] text-white rounded-lg hover:shadow-lg hover:shadow-[#FF7A00]/50 transition-all duration-300 font-semibold"
                >
                  <UserPlus size={18} />
                  Registrarse
                </Link>
              </div>
            ) : (
              <div 
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#FF7A00] to-[#2AA1FF] rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-white font-medium max-w-32 truncate">
                    {session?.user?.name || session?.user?.email}
                  </span>
                  <ChevronDown size={16} className={`text-white transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-white font-semibold text-sm truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/guia-integral"
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                      >
                        <BookOpen size={18} />
                        <span className="text-sm font-medium">Guía Integral</span>
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-800 transition-colors text-red-400"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Cerrar sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-white/10 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-primary-accent transition-colors font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Herramientas Section Mobile */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-primary-accent font-semibold mb-2 py-2">
                    <Wrench size={18} />
                    Herramientas
                  </div>
                  <div className="pl-4 space-y-2">
                    {herramientasLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2"
                      >
                        <div className="text-white font-medium text-sm">{link.label}</div>
                        <div className="text-gray-400 text-xs">{link.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="https://wa.me/573133691591?text=Hola, me interesa la guía de calificación de soldadores"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full justify-center mt-4"
                >
                  <MessageCircle size={18} />
                  Contactar por WhatsApp
                </Link>
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-white/10 mt-4">
                  {!isAuthenticated ? (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-medium"
                      >
                        <LogIn size={18} />
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#FF7A00] to-[#ff8c1a] text-white rounded-lg hover:shadow-lg hover:shadow-[#FF7A00]/50 transition-all duration-300 font-semibold"
                      >
                        <UserPlus size={18} />
                        Crear cuenta gratis
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="px-4 py-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#FF7A00] to-[#2AA1FF] rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">
                              {session?.user?.name}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/guia-integral"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-medium"
                      >
                        <BookOpen size={18} />
                        Guía Integral
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors font-medium"
                      >
                        <LogOut size={18} />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

