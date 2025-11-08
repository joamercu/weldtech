# Flujos del Sistema y Styling - WeldTech Solutions

## Parte 1: Flujo de Autenticación

### Registro de Usuario

```
1. Usuario completa formulario (/auth/signup)
   ├─ name, email, password
   └─ Validaciones frontend

2. Submit → POST /api/auth/signup
   ├─ Valida campos requeridos
   ├─ Verifica email único en DB
   ├─ Verifica password >= 8 caracteres
   └─ Hash password con bcrypt (10 rounds)

3. Prisma: user.create()
   └─ Inserta en tabla User

4. Response 201 + datos del usuario
   
5. Auto-login con NextAuth
   ├─ signIn('credentials', {...})
   └─ Genera JWT token

6. Redirect a /
   └─ Session activa
```

### Login de Usuario

```
1. Usuario ingresa credenciales (/auth/login)
   ├─ email
   └─ password

2. Submit → signIn('credentials', {email, password})
   ├─ NextAuth ejecuta CredentialsProvider.authorize()
   │  ├─ prisma.user.findUnique({where: {email}})
   │  ├─ bcrypt.compare(password, user.password)
   │  └─ Return user object si válido
   │
   ├─ Genera JWT con callbacks
   │  ├─ jwt callback: token.id = user.id, token.role = user.role
   │  └─ session callback: session.user.id = token.id
   │
   └─ Almacena JWT en HTTP-only cookie

3. Redirect a /
   └─ Session disponible en todos los componentes
```

### Verificar Sesión

**En Server Component**:
```typescript
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
if (!session) redirect('/auth/login')
```

**En Client Component**:
```typescript
'use client'
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
// status: 'loading' | 'authenticated' | 'unauthenticated'
```

### Cerrar Sesión

```
1. Usuario click "Cerrar sesión"
2. signOut({ callbackUrl: '/' })
3. NextAuth elimina cookie de sesión
4. Redirect a /
```

---

## Parte 2: Sistema de Marcas de Agua

### Flujo Completo

```
Usuario → Clic "Descargar PNG/PDF"
    ↓
┌───────────────────────────────────┐
│ InfografiaViewer Component        │
│                                   │
│ 1. Check session                  │
│    const isAuth = !!session?.user │
│                                   │
│ 2. hasWatermark = !isAuth         │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│ Generate Image                    │
│                                   │
│ IF hasWatermark:                  │
│   → applyWatermark(canvas, text)  │
│ ELSE:                             │
│   → canvas sin modificar          │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│ POST /api/downloads/track         │
│ {                                 │
│   documentType: "infografia",     │
│   documentName: "...",            │
│   hasWatermark: true/false        │
│ }                                 │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│ Database: Insert Download record  │
│ - userId (si auth)                │
│ - hasWatermark                    │
│ - timestamp                       │
└───────────────────────────────────┘
    ↓
Browser download file
```

### Implementación de Marca de Agua

**Archivo**: `lib/watermark.ts`

```typescript
export function applyWatermark(
  canvas: HTMLCanvasElement,
  text: string = "DESCARGA PÚBLICA - WeldTech Solutions"
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.save()
  
  // Configuración
  ctx.font = 'bold 48px Arial'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Rotación
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-45 * Math.PI / 180)
  
  // Dibuja texto múltiples veces
  const spacing = 300
  for (let y = -canvas.height; y < canvas.height; y += spacing) {
    for (let x = -canvas.width; x < canvas.width; x += spacing) {
      ctx.fillText(text, x, y)
    }
  }
  
  ctx.restore()
  return canvas
}
```

---

## Parte 3: Styling y Theming

### Paleta de Colores

**CSS Variables** (en `globals.css`):
```css
:root {
  --background: 222 47% 11%;      /* #0F1216 Dark Steel */
  --foreground: 210 40% 98%;      /* #FFFFFF White */
  --primary: 24 100% 50%;         /* #FF7A00 Orange */
  --secondary: 207 89% 58%;       /* #2AA1FF Blue */
  --muted: 220 13% 46%;           /* #6B7280 Steel Gray */
  --accent: 24 100% 50%;          /* Orange accent */
  --destructive: 0 84% 60%;       /* Red */
  --border: 217 33% 17%;          /* Dark border */
  --ring: 24 100% 50%;            /* Orange ring */
}
```

### Clases Personalizadas

**Backgrounds**:
```css
.mesh-gradient {
  background: 
    radial-gradient(circle at 20% 30%, rgba(255,122,0,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(42,161,255,0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0F1216 0%, #1a1f26 100%);
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

**Cards**:
```css
.card-standard {
  @apply bg-[#1a1f26] border border-white/10 rounded-xl p-6;
  @apply backdrop-blur-sm;
}

.glow-orange {
  box-shadow: 0 0 20px rgba(255, 122, 0, 0.2);
}

.glow-blue {
  box-shadow: 0 0 20px rgba(42, 161, 255, 0.2);
}
```

**Buttons**:
```css
.btn-primary {
  @apply bg-gradient-to-r from-orange-500 to-orange-600;
  @apply text-white font-semibold py-3 px-6 rounded-lg;
  @apply hover:from-orange-600 hover:to-orange-700;
  @apply transition-all duration-300;
  @apply shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply border-2 border-blue-500 text-blue-500;
  @apply font-semibold py-3 px-6 rounded-lg;
  @apply hover:bg-blue-500 hover:text-white;
  @apply transition-all duration-300;
}
```

### Typography

**Fuentes**:
- **Headings**: Montserrat (Bold, SemiBold)
- **Body**: Inter (Regular, Medium)
- **Code**: Monospace default

**Configuración Tailwind**:
```javascript
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      heading: ['Montserrat', 'sans-serif'],
      mono: ['Monaco', 'monospace']
    }
  }
}
```

### Responsive Design

**Breakpoints Tailwind**:
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Ejemplo de uso**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 col en móvil, 2 en tablet, 3 en desktop */}
</div>
```

### Animaciones con Framer Motion

**Configuración común**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

**Stagger Children**:
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Dark Mode

**Actualmente**: Solo dark mode (no hay toggle)

**Para implementar toggle**:
```tsx
// Usar next-themes
import { ThemeProvider } from 'next-themes'

// En app/providers.tsx
<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>

// Componente Toggle
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle
    </button>
  )
}
```

### Accessibility

**Focus States**:
```css
.focus-visible:outline-none
.focus-visible:ring-2
.focus-visible:ring-orange-500
.focus-visible:ring-offset-2
```

**ARIA Labels**:
```tsx
<button aria-label="Cerrar modal">
  <X />
</button>

<nav aria-label="Navegación principal">
  {/* Links */}
</nav>
```

---

*Última actualización: Noviembre 2025 | Versión: 1.0*

