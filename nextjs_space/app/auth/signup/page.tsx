
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Registrar usuario
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Verificar si la respuesta es JSON válida
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Si no es JSON, leer como texto para debugging
          const text = await response.text();
          console.error('Respuesta no JSON:', text);
          setError('Error al registrar usuario. Por favor intenta nuevamente.');
          setIsLoading(false);
          return;
        }
      } catch (parseError) {
        console.error('Error al parsear respuesta:', parseError);
        setError('Error al procesar la respuesta del servidor. Por favor intenta nuevamente.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // Mostrar error específico del backend
        let errorMessage = data.error || 'Error al registrar usuario. Por favor intenta nuevamente.';
        
        // En desarrollo, mostrar detalles adicionales si están disponibles
        if (process.env.NODE_ENV === 'development' && data.details) {
          console.error('Detalles del error del servidor:', data.details);
          errorMessage = `${errorMessage} (${data.details})`;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Auto login después del registro
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Cuenta creada pero no se pudo iniciar sesión automáticamente');
        setIsLoading(false);
        return;
      }

      router.replace('/');
    } catch (err) {
      console.error('Error en registro:', err);
      // Mostrar mensaje de error más específico
      if (err instanceof Error) {
        setError(`Error al registrar usuario: ${err.message}`);
      } else {
        setError('Error al registrar usuario. Por favor verifica tu conexión e intenta nuevamente.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('Error al registrarse con Google.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1216] via-[#1a1f2e] to-[#0F1216] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="relative w-48 h-16 mx-auto">
              <Image
                src="/logo/weldtech-horizontal-full-color.png"
                alt="WeldTech Solutions"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-gray-400">
            Descargas sin marcas de agua, gratis para siempre
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Beneficios */}
            <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
                <span>Descargas sin marca de agua</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
                <span>Acceso a todas las herramientas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
                <span>Gratis para siempre</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gradient-to-r from-[#FF7A00] to-[#ff8c1a] text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF7A00]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta gratis'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-gray-400">
                O continúa con
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg border border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Conectando con Google...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continuar con Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 text-gray-400">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Login */}
          <Link
            href="/auth/login"
            className="block w-full text-center bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg border border-white/10 transition-all duration-300"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <Link href="/" className="hover:text-[#FF7A00] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
