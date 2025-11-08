# Componentes, Hooks y Utilities - WeldTech Solutions

## Componentes Principales

### Navbar (`components/navbar.tsx`)

**Tipo**: Client Component  
**Propósito**: Barra de navegación principal con autenticación

**Props**: Ninguna

**Estado Interno**:
- `mobileMenuOpen`: Boolean para menú móvil
- `herramientasOpen`: Boolean para dropdown de herramientas
- `userMenuOpen`: Boolean para menú de usuario

**Hooks Utilizados**:
- `useSession()`: Estado de autenticación NextAuth

**Características**:
- Responsive (hamburger menu en móvil)
- Menú desplegable de herramientas
- Avatar y menú de usuario cuando está autenticado
- Botones de login/signup cuando no está autenticado

---

### Footer (`components/footer.tsx`)

**Tipo**: Server Component  
**Propósito**: Pie de página con links y contacto

**Secciones**:
- About WeldTech
- Navegación rápida
- Información de contacto
- Copyright

---

### LandingPage (`components/landing-page.tsx`)

**Tipo**: Client Component  
**Propósito**: Página de inicio principal

**Secciones**:
1. Hero con CTA de descarga
2. Beneficios principales
3. Herramientas destacadas
4. Testimonios/características
5. CTA final

---

### InfografiaViewer (`components/infografia-viewer.tsx`)

**Tipo**: Client Component  
**Propósito**: Visualizador y descarga de infografías con sistema de marcas de agua

**Características Clave**:
- Detecta estado de autenticación
- Aplica marca de agua si es descarga pública
- Genera PNG y PDF
- Tracking de descargas vía API
- Alertas visuales sobre estado de marca de agua

**Funciones Principales**:
```typescript
handleDownloadPNG(): Genera y descarga imagen PNG
handleDownloadPDF(): Genera y descarga PDF A3
trackDownload(): Registra descarga en base de datos
```

---

### CalculadoraRangos (`components/calculadora-rangos.tsx`)

**Tipo**: Client Component  
**Propósito**: Calculadora interactiva de rangos de calificación

**Estado**:
- `standard`: ASME IX | AWS D1.1 | ISO 9606
- `jointType`: plate | pipe
- `thickness`: número
- `diameter`: número (opcional)
- `result`: objeto con rangos calculados

**Lógica de Cálculo**:
```typescript
// Ejemplo ASME IX
if (thickness < 3) {
  minThickness = 0;
  maxThickness = 2 * thickness;
} else if (thickness < 19) {
  minThickness = thickness / 2;
  maxThickness = 2 * thickness;
} else {
  minThickness = thickness / 2;
  maxThickness = Infinity; // sin límite superior
}
```

---

### ComparadorNormas (`components/comparador-normas.tsx`)

**Tipo**: Client Component  
**Propósito**: Tabla comparativa de normas ASME IX, AWS D1.1, ISO 9606

**Datos**:
- Array de 12+ comparaciones categorizadas
- Filtros por categoría
- Búsqueda por texto
- Export a PDF con jsPDF

---

### GuiaDefectos (`components/guia-defectos.tsx`)

**Tipo**: Client Component  
**Propósito**: Catálogo visual de defectos de soldadura

**Defectos** (14 totales):
```typescript
interface Defect {
  id: string
  name: string
  image: string
  severity: 'high' | 'medium' | 'low'
  category: 'surface' | 'internal' | 'dimensional'
  description: string
  causes: string[]
  prevention: string[]
  remedies: string[]
  detection: string[]
}
```

**Features**:
- Filtro por categoría y severidad
- Modal con detalles completos
- Imágenes reales de defectos
- Export a PDF

---

### PosicionesEquivalencia (`components/posiciones-equivalencia.tsx`)

**Tipo**: Client Component  
**Propósito**: Tabla de equivalencias ISO ↔ AWS/ASME

**Datos**:
```typescript
interface Position {
  iso: string       // "PA", "PB", etc.
  aws: string       // "1G", "2G", etc.
  en: string        // código EN
  description: string
  image?: string
  type: 'groove' | 'fillet' | 'pipe'
  difficulty: 'easy' | 'medium' | 'hard'
}
```

**Features**:
- Tabs por tipo (groove/fillet/pipe)
- Búsqueda
- Filtro por dificultad
- Imágenes ilustrativas

---

### WPSBuilder (`components/wps-builder.tsx`)

**Tipo**: Client Component  
**Propósito**: Constructor de WPS (en desarrollo)

**Estado Planificado**: Próximamente activo

---

### PlantillasPage (`components/plantillas-page.tsx`)

**Tipo**: Client Component  
**Propósito**: Página de plantillas descargables

**Plantillas**:
1. WPS (Excel/PDF)
2. PQR (Excel/PDF)
3. WPQ (Excel/PDF)
4. Checklist (Excel/PDF)
5. Matriz Trazabilidad (Excel)

---

## Componentes UI (Shadcn/ui)

Ubicados en `components/ui/`, incluyen 40+ componentes:

**Principales**:
- `button.tsx`: Botones con variantes
- `card.tsx`: Tarjetas contenedoras
- `dialog.tsx`: Modales
- `input.tsx`: Campos de texto
- `select.tsx`: Dropdowns
- `tabs.tsx`: Pestañas
- `table.tsx`: Tablas
- `badge.tsx`: Badges/tags
- `toast.tsx`: Notificaciones

Ver documentación completa en: [shadcn/ui](https://ui.shadcn.com/)

---

## Hooks Personalizados

### `use-toast.ts`

**Ubicación**: `hooks/use-toast.ts`

**Propósito**: Sistema de notificaciones toast

**Uso**:
```typescript
import { toast } from 'sonner'

// Success
toast.success('Operación exitosa')

// Error
toast.error('Error al procesar')

// Info
toast.info('Información importante')

// Con duración personalizada
toast('Mensaje', { duration: 5000 })
```

---

## Utilities

### `lib/auth.ts`

**Configuración de NextAuth**

**Exports**:
- `authOptions`: Configuración completa de NextAuth
  - Providers: Credentials, Google
  - Callbacks: signIn, jwt, session
  - Pages personalizadas

**Uso**:
```typescript
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
```

---

### `lib/db.ts`

**Cliente de Prisma singleton**

**Export**:
- `prisma`: Instancia única de PrismaClient

**Uso**:
```typescript
import { prisma } from '@/lib/db'

const users = await prisma.user.findMany()
```

---

### `lib/watermark.ts`

**Lógica de marcas de agua**

**Función principal**:
```typescript
export function applyWatermark(
  canvas: HTMLCanvasElement,
  text: string = "DESCARGA PÚBLICA - WeldTech Solutions"
): HTMLCanvasElement
```

**Algoritmo**:
1. Obtiene contexto 2D del canvas
2. Configura fuente y estilo
3. Rota -45 grados
4. Dibuja texto repetido en diagonal
5. Retorna canvas modificado

---

### `lib/utils.ts`

**Funciones helper generales**

**Principales**:

```typescript
// Combina clases de Tailwind
cn(...classes: ClassValue[]): string

// Formatea fechas
formatDate(date: Date): string

// Valida email
isValidEmail(email: string): boolean
```

---

### `lib/types.ts`

**Tipos TypeScript compartidos**

**Interfaces principales**:
```typescript
export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export const EXPENSE_CATEGORIES = [
  'Food', 'Transportation', 'Housing', // ...
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}
```

---

## Patterns y Convenciones

### Naming Conventions

**Componentes**:
- PascalCase: `MyComponent.tsx`
- Default export: `export default function MyComponent()`

**Hooks**:
- camelCase con prefijo `use`: `useMyHook.ts`
- Named export: `export function useMyHook()`

**Utilities**:
- camelCase: `myUtility.ts`
- Named exports: `export function myFunction()`

### Component Pattern

```tsx
'use client' // Si necesita hooks o interactividad

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export default function MyComponent({ 
  title, 
  onAction 
}: MyComponentProps) {
  const [state, setState] = useState(false)
  
  return (
    <div className="container">
      <h1>{title}</h1>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### Custom Hook Pattern

```typescript
import { useState, useEffect } from 'react'

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue)
  
  useEffect(() => {
    // Side effects
  }, [value])
  
  return { value, setValue }
}
```

---

## Performance Optimizations

### React.memo()

Para componentes pesados o con props estables:

```typescript
const ExpensiveComponent = React.memo(function ExpensiveComponent(props) {
  // Renderiza solo si props cambian
  return <div>{props.data}</div>
})
```

### useMemo() y useCallback()

```typescript
// Memoriza cálculos costosos
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])

// Memoriza funciones
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Cargando...</p>
})
```

---

## Testing (Recomendado)

Actualmente no hay tests implementados. Se recomienda:

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can download infographic', async ({ page }) => {
  await page.goto('http://localhost:3000/infografia')
  await page.click('button:has-text("PNG 1080x1920")')
  // Assert download started
})
```

---

## Documentos Relacionados

- [Arquitectura](01-architecture.md)
- [Setup de Desarrollo](02-setup-development.md)
- [Authentication Flow](07-authentication-flow.md)
- [Styling & Theming](09-styling-theming.md)

---

*Última actualización: Noviembre 2025 | Versión: 1.0*

