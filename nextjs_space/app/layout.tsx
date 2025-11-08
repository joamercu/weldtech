
import type { Metadata, Viewport } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Providers } from './providers'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700']
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600']
})

export const metadata: Metadata = {
  title: 'WeldTech Solutions | Welder Qualification Guide EN-ES',
  description: 'Transformamos normativas complejas en herramientas prácticas. 13 reglas clave ASME/AWS/ISO en 90s. Guía bilingüe para soldadores, inspectores QA/QC y jefes de taller. Descarga gratuita con checklist y plantillas WPS/WPQ.',
  keywords: 'ASME, AWS, ISO, welder qualification, soldadores, calificación, WPS, WPQ, QA/QC, welding standards, weldtech, elite, trazabilidad',
  authors: [{ name: 'WeldTech Solutions' }],
  openGraph: {
    title: 'WeldTech Solutions | Welder Qualification Guide EN-ES',
    description: 'Transformamos normativas complejas en herramientas prácticas para la cualificación de soldadores con trazabilidad total.',
    url: 'https://proyecto-infografia-soldadores.vercel.app',
    siteName: 'WeldTech Solutions',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WeldTech Solutions - Welder Qualification Guide'
      }
    ],
    locale: 'es_ES',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeldTech Solutions | Welder Qualification Guide',
    description: 'Soluciones técnicas de élite para la industria de soldadura | ASME • AWS • ISO',
    images: ['/og-image.png']
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg'
  },
  robots: 'index, follow'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

// Removido force-static para permitir componentes client-side
// export const dynamic = "force-static"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
