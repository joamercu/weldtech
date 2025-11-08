import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import GuiaIntegralPage from '../components/guia-integral-page'

export const metadata = {
  title: 'Guía Integral de Servicios | WeldTech Solutions',
  description: 'Guía completa de servicios, diagnóstico y planes de calidad personalizados para profesionales de soldadura.',
}

export default async function GuiaIntegral() {
  const session = await getServerSession(authOptions)
  
  // Proteger la ruta - solo usuarios autenticados
  if (!session) {
    redirect('/auth/login?callbackUrl=/guia-integral')
  }

  return <GuiaIntegralPage />
}

