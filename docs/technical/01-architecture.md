# Arquitectura del Sistema - WeldTech Solutions

## Descripción General

WeldTech Solutions es una aplicación web full-stack construida con Next.js 14 (App Router), utilizando React, TypeScript, PostgreSQL y NextAuth.js para autenticación.

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2.28 | Framework React con SSR/SSG |
| **React** | 18.2.0 | Librería UI |
| **TypeScript** | 5.2.2 | Tipado estático |
| **Tailwind CSS** | 3.3.3 | Estilos utility-first |
| **Framer Motion** | 10.18.0 | Animaciones |
| **Shadcn/ui** | Latest | Componentes UI accesibles |
| **Lucide React** | 0.446.0 | Iconos |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js API Routes** | 14.2.28 | API serverless |
| **Prisma** | 6.7.0 | ORM para base de datos |
| **NextAuth.js** | 4.24.11 | Autenticación |
| **bcryptjs** | 2.4.3 | Hash de contraseñas |

### Base de Datos

| Tecnología | Propósito |
|------------|-----------|
| **PostgreSQL** | Base de datos relacional |
| **Prisma Client** | Query builder type-safe |

### Librerías Adicionales

| Librería | Propósito |
|----------|-----------|
| **jsPDF** | Generación de PDFs |
| **html2canvas** | Captura de canvas a imagen |
| **sonner** | Toast notifications |
| **react-hook-form** | Manejo de formularios |
| **zod** | Validación de esquemas |

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                      Cliente (Browser)                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │         React Components (Next.js App)             │ │
│  │   ┌────────────┐  ┌──────────┐  ┌──────────────┐ │ │
│  │   │ Landing    │  │ Auth     │  │ Herramientas │ │ │
│  │   │ Page       │  │ Pages    │  │ Pages        │ │ │
│  │   └────────────┘  └──────────┘  └──────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js Server                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │              API Routes (/api/*)                   │ │
│  │   ┌──────────────┐  ┌──────────────────────────┐ │ │
│  │   │ NextAuth     │  │ Downloads Track          │ │ │
│  │   │ /auth/*      │  │ /downloads/track         │ │ │
│  │   └──────────────┘  └──────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │              Server Components                     │ │
│  │   - SSR (Server-Side Rendering)                   │ │
│  │   - ISR (Incremental Static Regeneration)        │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Prisma ORM
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Tables: User, Session, Account,                  │ │
│  │          Download, VerificationToken              │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Estructura de Directorios

```
D:\07-11-25-APP WELDTECH\
├── nextjs_space/              # Aplicación Next.js principal
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── downloads/     # Download tracking
│   │   │   │   └── track/route.ts
│   │   │   └── signup/route.ts
│   │   ├── auth/              # Auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── components/        # React components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── landing-page.tsx
│   │   │   ├── infografia-viewer.tsx
│   │   │   ├── calculadora-rangos.tsx
│   │   │   ├── comparador-normas.tsx
│   │   │   ├── guia-defectos.tsx
│   │   │   ├── posiciones-equivalencia.tsx
│   │   │   ├── wps-builder.tsx
│   │   │   └── plantillas-page.tsx
│   │   ├── herramientas/      # Tool pages
│   │   │   ├── calificaciones/
│   │   │   ├── defectos/
│   │   │   ├── posiciones/
│   │   │   └── wps-builder/
│   │   ├── infografia/page.tsx
│   │   ├── plantillas/page.tsx
│   │   ├── recursos/page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── providers.tsx      # Context providers
│   │   └── globals.css        # Global styles
│   ├── components/            # Shared components
│   │   ├── theme-provider.tsx
│   │   └── ui/                # Shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (40+ componentes)
│   ├── hooks/                 # Custom React hooks
│   │   └── use-toast.ts
│   ├── lib/                   # Utilities y configs
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma client
│   │   ├── types.ts           # TypeScript types
│   │   ├── utils.ts           # Helper functions
│   │   └── watermark.ts       # Watermark logic
│   ├── prisma/                # Database
│   │   └── schema.prisma      # Database schema
│   ├── public/                # Static assets
│   │   ├── favicon.svg
│   │   ├── herramientas/      # Tool images
│   │   ├── images/            # General images
│   │   │   └── infografia/
│   │   └── logo/              # Brand logos
│   ├── scripts/               # Utility scripts
│   │   └── seed.ts            # Database seeding
│   ├── components.json        # Shadcn/ui config
│   ├── next.config.js         # Next.js config
│   ├── package.json           # Dependencies
│   ├── tailwind.config.ts     # Tailwind config
│   └── tsconfig.json          # TypeScript config
├── docs/                      # Documentación
│   ├── user-guide/            # Guías de usuario
│   ├── technical/             # Docs técnicas
│   ├── assets/                # Assets para docs
│   └── diagrams/              # Diagramas Mermaid
├── assets/                    # Assets del proyecto
│   ├── branding/              # Marca
│   ├── infographics/          # Infografías
│   └── images/                # Imágenes
├── planning/                  # Docs de planificación
│   └── roadmaps/
└── README.md                  # Documentación principal
```

---

## Flujo de Datos

### 1. Autenticación con Credentials

```
User Input (Email + Password)
        ↓
[Login Form Component]
        ↓
POST /api/auth/callback/credentials
        ↓
[NextAuth CredentialsProvider]
        ↓
Prisma: findUnique(email)
        ↓
bcrypt.compare(password, hash)
        ↓
[Generate JWT Token]
        ↓
Set Session Cookie
        ↓
Redirect to Dashboard
```

### 2. Descarga de Infografía

```
User Click "Download PNG"
        ↓
[InfografiaViewer Component]
        ↓
Check Session (useSession)
        ↓
hasWatermark = !session.user
        ↓
[Generate Image with/without watermark]
        ↓
POST /api/downloads/track
  {documentType, documentName, hasWatermark}
        ↓
Prisma: create Download record
        ↓
Browser downloads file
```

### 3. Uso de Herramientas

```
User interacts with tool
        ↓
[Tool Component (e.g., CalculadoraRangos)]
        ↓
Client-side calculations
        ↓
Display results
        ↓
Optional: Export to PDF (jsPDF)
```

---

## Componentes Clave

### App Router Structure

**Next.js 14 App Router** permite:
- File-system based routing
- Layouts anidados
- Server Components por defecto
- Streaming y Suspense integrado

**Ejemplo de ruta**:
```
/app/herramientas/defectos/page.tsx
└─> URL: /herramientas/defectos
```

### Server vs Client Components

**Server Components** (por defecto):
- Rendered en servidor
- No hidratan en cliente
- Acceso directo a DB
- No pueden usar hooks (useState, useEffect)

```tsx
// app/page.tsx
export default function Home() {
  // Este es un Server Component
  return <LandingPage />
}
```

**Client Components** (con `'use client'`):
- Hidratan en cliente
- Pueden usar hooks de React
- Event handlers
- Acceso a browser APIs

```tsx
'use client'
// app/components/navbar.tsx
import { useSession } from 'next-auth/react'
export default function Navbar() {
  const { data: session } = useSession()
  // ...
}
```

---

## Base de Datos

### Modelos Principales

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?    // Hash bcrypt
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  downloads     Download[]
}
```

#### Download
```prisma
model Download {
  id           String   @id @default(cuid())
  userId       String?
  userEmail    String?
  documentType String   // "infografia", "wps", etc.
  documentName String
  hasWatermark Boolean  @default(true)
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  user         User?    @relation(...)
}
```

### Relaciones

```
User 1---* Download (Un usuario tiene muchas descargas)
User 1---* Session  (Un usuario tiene muchas sesiones)
User 1---* Account  (Un usuario tiene muchas cuentas OAuth)
```

---

## Autenticación (NextAuth.js)

### Estrategia

- **Session**: JWT-based (no database sessions)
- **Providers**:
  - ✅ Credentials (email/password)
  - ✅ Google OAuth (configurado pero no en uso activo)

### Flujo de Login

1. Usuario envía credenciales
2. NextAuth valida contra DB (Prisma)
3. Genera JWT token
4. Almacena en cookie HTTP-only
5. Token incluye: `id`, `email`, `name`, `role`

### Protección de Rutas

```tsx
// Proteger una página
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return <div>Protected content</div>
}
```

---

## Sistema de Marcas de Agua

### Lógica

**Archivo**: `lib/watermark.ts`

**Función**: `applyWatermark(canvas, text)`

**Proceso**:
1. Recibe canvas con imagen original
2. Obtiene contexto 2D
3. Configura estilos:
   ```tsx
   ctx.font = 'bold 48px Arial'
   ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
   ctx.rotate(-45 * Math.PI / 180)
   ```
4. Dibuja texto repetido diagonal
5. Retorna canvas modificado

**Aplicación en componentes**:
```tsx
const isAuthenticated = !!session?.user
const hasWatermark = !isAuthenticated

if (hasWatermark) {
  applyWatermark(canvas, "DESCARGA PÚBLICA - WeldTech Solutions")
}
```

---

## Estilos y Theming

### Tailwind CSS

**Configuración**: `tailwind.config.ts`

**CSS Variables** (en `globals.css`):
```css
:root {
  --background: 222 47% 11%;     /* Dark steel */
  --foreground: 210 40% 98%;     /* White */
  --primary: 24 100% 50%;        /* Orange */
  --secondary: 207 89% 58%;      /* Blue */
}
```

**Clases personalizadas**:
- `.mesh-gradient`: Fondo con gradiente de malla
- `.grid-pattern`: Patrón de grid sutil
- `.card-standard`: Tarjeta estándar con bordes y sombras
- `.btn-primary`: Botón primario con gradiente naranja
- `.btn-secondary`: Botón secundario con bordes
- `.glow-orange`: Efecto de brillo naranja

### Paleta de Colores WeldTech

| Color | Hex | Variable | Uso |
|-------|-----|----------|-----|
| Dark Steel | #0F1216 | `--background` | Fondo principal |
| Orange | #FF7A00 | `--primary` | CTA, destacados |
| Blue | #2AA1FF | `--secondary` | Links, info |
| White | #FFFFFF | `--foreground` | Texto principal |
| Steel Gray | #6B7280 | `--muted` | Texto secundario |

---

## Optimizaciones

### Performance

1. **Image Optimization**: Next.js Image component (desactivado en config actual)
2. **Code Splitting**: Automático por Next.js App Router
3. **Lazy Loading**: React.lazy() para componentes pesados
4. **Memoization**: React.memo() en componentes repetitivos

### SEO

1. **Metadata API**: En cada page.tsx
2. **og:image**: Imagen Open Graph configurada
3. **robots.txt**: En public/
4. **Sitemap**: Generado automáticamente

---

## Seguridad

### Implementaciones Actuales

1. **Password Hashing**: bcrypt con 10 rounds
2. **HTTP-only Cookies**: Para session tokens
3. **CSRF Protection**: Integrado en NextAuth
4. **SQL Injection Protection**: Prisma (parameterized queries)
5. **XSS Protection**: React escapa automáticamente
6. **Environment Variables**: Secretos en .env (no commiteado)

### Recomendaciones Adicionales

- [ ] Implementar rate limiting
- [ ] Añadir CAPTCHA en registro
- [ ] Implementar 2FA (futuro)
- [ ] Content Security Policy (CSP)
- [ ] HTTPS obligatorio en producción

---

## Escalabilidad

### Consideraciones Actuales

- **Stateless**: JWT sessions (no state en servidor)
- **API Routes Serverless**: Escalan automáticamente
- **Database Connection Pooling**: Prisma maneja pool
- **CDN**: Assets estáticos cacheables

### Cuellos de Botella Potenciales

1. **Database Queries**: Optimizar con índices
2. **PDF Generation**: Mover a worker (futuro)
3. **File Uploads**: Implementar S3/CloudStorage (futuro)

---

## Monitoreo y Logs

### Actual

- Console logs en desarrollo
- Error boundary en producción (Next.js automático)

### Recomendado (Futuro)

- Sentry para error tracking
- Vercel Analytics para métricas
- Custom logging con Winston/Pino
- Database query performance monitoring

---

## Dependencias Críticas

| Dependencia | Versión | Riesgo si Falla | Alternativa |
|-------------|---------|-----------------|-------------|
| Next.js | 14.2.28 | Alto | Ninguna fácil |
| Prisma | 6.7.0 | Alto | TypeORM, Drizzle |
| NextAuth | 4.24.11 | Medio | Auth0, Clerk |
| PostgreSQL | Latest | Alto | MySQL, MongoDB |

---

## Documentos Relacionados

- [Setup de Desarrollo](02-setup-development.md)
- [Database Schema](03-database-schema.md)
- [API Reference](04-api-reference.md)
- [Components Guide](05-components.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

