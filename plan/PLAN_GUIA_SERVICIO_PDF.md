# Plan Detallado: Guía de Servicio en PDF
## Sistema de Descarga para Usuarios Registrados

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Objetivo:** Permitir a usuarios registrados descargar una Guía de Servicio completa, visualmente atractiva y profesional en formato PDF

---

## 1. OBJETIVO Y ALCANCE

### 1.1 Objetivo Principal

Desarrollar un sistema que permita a usuarios registrados descargar una **Guía de Servicio Integral en PDF** que:
- Traduzca la información de los documentos markdown existentes (`docs/GUIA_INTEGRAL_WELDTECH.md`)
- Complemente con temas relevantes y elementos visuales
- Sea visualmente atractiva y profesional
- Mantenga coherencia de marca (colores, tipografías, logos)
- Sea informativa, clara y fácil de usar

### 1.2 Alcance del Proyecto

**Incluye:**
- ✅ Conversión de markdown a PDF con diseño profesional
- ✅ Integración con sistema de autenticación (solo usuarios registrados)
- ✅ Elementos visuales (infografías, gráficos, recuadros)
- ✅ Branding consistente (colores, tipografías, logos)
- ✅ Tracking de descargas
- ✅ Optimización de tamaño de archivo

**No incluye (Fase 1):**
- ❌ Edición personalizada por usuario
- ❌ Múltiples idiomas (solo español en Fase 1)
- ❌ Versión interactiva del PDF

---

## 2. ESTRUCTURA DEL DOCUMENTO PDF

### 2.1 Secciones del Documento

El PDF estará estructurado en las siguientes secciones principales:

```
┌─────────────────────────────────────────────────────────┐
│ PORTADA                                                 │
│ - Logo WeldTech (centrado, grande)                      │
│ - Título: "Guía Integral de Servicios"                 │
│ - Subtítulo: "WeldTech Solutions"                       │
│ - Fecha de generación                                  │
│ - Información del usuario (nombre, email)              │
│ - Código QR para acceso rápido                         │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ TABLA DE CONTENIDOS                                     │
│ - Índice navegable con números de página              │
│ - Enlaces internos (si el PDF lo soporta)             │
│ - Diseño visual con iconos por sección                 │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 1. INTRODUCCIÓN                                         │
│ - Propósito de la guía                                 │
│ - A quién está dirigida                                │
│ - Cómo utilizar esta guía                              │
│ - Infografía: "El Viaje del Cliente"                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. QUIÉNES SOMOS                                        │
│ - Filosofía de marca                                    │
│ - Valores core (con iconos)                            │
│ - Posicionamiento                                      │
│ - Ventajas competitivas (tabla visual)                 │
│ - Gráfico: "Nuestros Valores"                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. PORTAFOLIO DE SERVICIOS                              │
│ - Resumen del portafolio                               │
│ - Servicio 1: Infografías Técnicas                     │
│   └─ Recuadro destacado con beneficios                 │
│ - Servicio 2: Herramientas Interactivas                │
│   └─ Screenshots o mockups                             │
│ - Servicio 3: Plantillas Profesionales                 │
│   └─ Tabla comparativa de plantillas                  │
│ - Servicio 4: Contenido Educativo                      │
│ - Servicio 5: Consultoría Especializada                │
│ - Infografía: "Ecosistema WeldTech"                    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. LISTA DE VERIFICACIÓN DE DIAGNÓSTICO                │
│ - Introducción al diagnóstico                         │
│ - Sección 1: Documentación (15 items)                 │
│   └─ Tabla con checkboxes visuales                     │
│ - Sección 2: Soldadores (12 items)                     │
│ - Sección 3: Materiales (8 items)                     │
│ - Sección 4: Equipos (7 items)                          │
│ - Sección 5: Procesos (8 items)                        │
│ - Sección 6: Trazabilidad (10 items)                   │
│ - Interpretación de resultados                         │
│ - Gráfico: "Índice de Compliance"                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. PLAN DE CALIDAD PERSONALIZADO                       │
│ - Introducción al plan                                 │
│ - Metodología de personalización                       │
│ - Componentes del plan                                 │
│ - Paquetes de servicios (A, B, C)                      │
│   └─ Tabla comparativa visual                          │
│ - Casos de personalización                             │
│ - Infografía: "Proceso de Implementación"              │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. METODOLOGÍA DE TRABAJO                               │
│ - Filosofía de implementación                          │
│ - Flujo de trabajo típico                              │
│   └─ Diagrama de flujo visual                          │
│ - Canales de comunicación                              │
│ - Roles y responsabilidades                            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 7. CASOS DE ÉXITO                                       │
│ - Introducción                                         │
│ - Caso 1: Oil & Gas - Pipeline 6G                       │
│   └─ Métricas destacadas en recuadros                  │
│ - Caso 2: Naval - Sistema Trazabilidad DNV             │
│ - Caso 3: Químico - GTAW SS 316L                        │
│ - Métricas agregadas                                   │
│   └─ Gráfico de barras comparativo                     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 8. PROCESO DE ONBOARDING                                │
│ - Qué esperar al contratar                             │
│ - Timeline detallado                                   │
│   └─ Diagrama de Gantt visual                         │
│ - Checklist de preparación                            │
│ - Soporte post-implementación                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 9. CONTACTO Y SOPORTE                                   │
│ - Canales de contacto                                  │
│ - Preguntas frecuentes (FAQ)                           │
│   └─ Recuadros destacados por pregunta                │
│ - Próximos pasos                                       │
│ - CTA final: "Agenda tu Diagnóstico Gratuito"         │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ CONCLUSIÓN                                              │
│ - Resumen de propuesta de valor                        │
│ - Próximos pasos                                       │
│ - Información de contacto                              │
│ - Logo y branding final                               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ ANEXOS (Opcional)                                       │
│ - Glosario de términos                                 │
│ - Referencias normativas                               │
│ - Recursos adicionales                                 │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Elementos Visuales por Sección

#### Portada
- Logo WeldTech (centrado, 200x80px aprox)
- Fondo con gradiente Dark Steel → Precision Blue
- Código QR (esquina inferior derecha) para acceso rápido
- Línea decorativa con acento Orange

#### Tabla de Contenidos
- Iconos por sección (Shield, FileCheck, Zap, etc.)
- Números de página destacados
- Líneas conectoras visuales

#### Secciones Principales
- **Headers de sección**: Fondo con color de marca (Orange/Blue)
- **Recuadros destacados**: Fondo sutil con borde Orange
- **Tablas**: Diseño limpio con alternancia de colores
- **Iconos**: Lucide React icons (24-32px)
- **Gráficos**: Chart.js o Recharts para visualizaciones

#### Elementos Especiales
- **Infografías**: Imágenes pre-generadas o generadas dinámicamente
- **Diagramas de flujo**: SVG o Canvas
- **Screenshots**: De herramientas existentes
- **Call-to-Action boxes**: Recuadros destacados con fondo Orange

---

## 3. ESPECIFICACIONES TÉCNICAS

### 3.1 Tecnologías y Librerías

#### Generación de PDF
- **jsPDF** (ya instalado): Generación base del PDF
- **html2canvas** (ya instalado): Captura de elementos HTML para imágenes
- **pdf-lib** (ya instalado): Manipulación avanzada de PDFs

#### Procesamiento de Markdown
- **gray-matter** (ya instalado): Parseo de frontmatter
- **marked** o **remark**: Conversión de markdown a HTML
- **DOMPurify**: Sanitización de HTML

#### Diseño y Estilos
- **Tailwind CSS**: Para estilos (ya instalado)
- **Canvas API**: Para gráficos y diagramas
- **Chart.js** o **Recharts**: Para gráficos de datos

#### Imágenes y Assets
- **next/image**: Optimización de imágenes
- **QRCode**: Generación de códigos QR (ya instalado)

### 3.2 Arquitectura de Implementación

```
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (Next.js Frontend)                                │
│                                                           │
│ /guia-integral/page.tsx                                  │
│ ├─ Botón "Descargar Guía PDF"                           │
│ ├─ Verificación de autenticación                         │
│ └─ Llamada a API route                                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ API ROUTE (/api/guia-servicio/generate-pdf)              │
│                                                           │
│ 1. Verificar autenticación (NextAuth)                   │
│ 2. Leer markdown source (docs/GUIA_INTEGRAL_WELDTECH.md)│
│ 3. Procesar markdown → HTML                              │
│ 4. Aplicar estilos de marca                             │
│ 5. Generar elementos visuales (gráficos, infografías)   │
│ 6. Convertir HTML → PDF (jsPDF)                         │
│ 7. Aplicar metadata (título, autor, keywords)           │
│ 8. Tracking de descarga                                  │
│ 9. Retornar PDF como blob                               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (Descarga)                                       │
│                                                           │
│ 1. Recibir blob del PDF                                  │
│ 2. Crear link de descarga                                │
│ 3. Trigger download                                      │
│ 4. Mostrar toast de confirmación                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de Archivos

```
nextjs_space/
├── app/
│   ├── api/
│   │   └── guia-servicio/
│   │       └── generate-pdf/
│   │           └── route.ts          # API route principal
│   ├── guia-integral/
│   │   └── page.tsx                  # Página con botón de descarga
│   └── components/
│       └── guia-pdf/
│           ├── PDFGenerator.tsx      # Componente principal
│           ├── PDFSections.tsx       # Componentes de secciones
│           ├── PDFStyles.ts          # Estilos para PDF
│           ├── PDFCharts.tsx         # Componentes de gráficos
│           └── PDFInfographics.tsx   # Generación de infografías
├── lib/
│   ├── pdf/
│   │   ├── markdown-processor.ts     # Procesamiento de markdown
│   │   ├── pdf-builder.ts            # Constructor de PDF
│   │   ├── pdf-styles.ts             # Aplicación de estilos
│   │   ├── pdf-charts.ts             # Generación de gráficos
│   │   └── pdf-infographics.ts       # Generación de infografías
│   └── branding/
│       └── brand-assets.ts           # Assets de marca (colores, logos)
└── public/
    └── assets/
        └── guia-pdf/
            ├── logos/                # Logos en diferentes formatos
            ├── infographics/         # Infografías pre-generadas
            └── templates/            # Templates de secciones
```

---

## 4. DISEÑO Y BRANDING

### 4.1 Paleta de Colores

Aplicar colores del manual de marca:

```typescript
const brandColors = {
  // Principales
  darkSteel: '#0F1216',      // Fondos principales
  weldOrange: '#FF7A00',     // CTAs, highlights
  precisionBlue: '#2AA1FF',  // Enlaces, información secundaria
  
  // Complementarios
  steelGray: '#6B7280',       // Textos secundarios
  lightSteel: '#E5E7EB',     // Fondos alternativos
  pureWhite: '#FFFFFF',       // Textos sobre fondos oscuros
  
  // Estados
  successGreen: '#10B981',    // Éxito, completado
  warningYellow: '#F59E0B',  // Alertas
  errorRed: '#EF4444',        // Errores
}
```

### 4.2 Tipografía

```typescript
const typography = {
  // Títulos
  h1: {
    font: 'Montserrat',
    weight: 'bold',
    size: 32, // 48px en web, 32px en PDF
    color: '#FFFFFF',
  },
  h2: {
    font: 'Montserrat',
    weight: 'semiBold',
    size: 24,
    color: '#FFFFFF',
  },
  h3: {
    font: 'Montserrat',
    weight: 'medium',
    size: 20,
    color: '#FFFFFF',
  },
  // Cuerpo
  body: {
    font: 'Inter',
    weight: 'regular',
    size: 12, // 16px en web, 12px en PDF
    color: '#E5E7EB',
    lineHeight: 1.6,
  },
  // Labels técnicos
  label: {
    font: 'Inter',
    weight: 'medium',
    size: 10,
    color: '#2AA1FF',
    transform: 'uppercase',
    letterSpacing: 0.05,
  },
}
```

### 4.3 Elementos de Diseño

#### Headers de Sección
- Fondo: Gradiente de Dark Steel a Precision Blue
- Texto: Montserrat Bold, White
- Altura: 30-40px
- Borde inferior: 2px Orange

#### Recuadros Destacados
- Fondo: rgba(255, 122, 0, 0.1) con borde Orange
- Padding: 16px
- Border-radius: 8px
- Icono: 24px Orange

#### Tablas
- Header: Fondo Precision Blue, texto White
- Filas alternadas: Dark Steel / Light Steel (10% opacity)
- Bordes: 1px Steel Gray
- Padding celda: 8px

#### Gráficos
- Colores: Orange, Blue, Green (según datos)
- Fondo: Transparente o Dark Steel
- Grid: Steel Gray (20% opacity)
- Labels: Inter Regular, 10px, Steel Gray

---

## 5. FUNCIONALIDADES ESPECÍFICAS

### 5.1 Procesamiento de Markdown

#### Conversión de Markdown a HTML
```typescript
// lib/pdf/markdown-processor.ts
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export function processMarkdownToHTML(markdown: string): string {
  // 1. Parsear markdown
  const html = marked(markdown);
  
  // 2. Sanitizar HTML
  const cleanHTML = DOMPurify.sanitize(html);
  
  // 3. Aplicar clases de estilo
  const styledHTML = applyPDFStyles(cleanHTML);
  
  return styledHTML;
}
```

#### Mapeo de Elementos Markdown a PDF
- `# Título` → Header H1 con estilo de marca
- `## Subtítulo` → Header H2 con fondo de color
- `### Subsección` → Header H3
- `- Lista` → Bullets con iconos
- `| Tabla |` → Tabla estilizada
- `> Cita` → Recuadro destacado
- `![Imagen]` → Imagen optimizada
- `**Negrita**` → Texto destacado Orange
- `[Enlace]` → Texto Blue subrayado

### 5.2 Generación de Elementos Visuales

#### Gráficos de Datos
```typescript
// lib/pdf/pdf-charts.ts
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';

export function generateComplianceChart(compliance: number): string {
  // Crear canvas temporal
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Generar gráfico con Chart.js
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [compliance, 100 - compliance],
        backgroundColor: ['#FF7A00', '#6B7280'],
      }],
    },
    options: {
      // Configuración de estilo de marca
    },
  });
  
  // Convertir canvas a imagen base64
  return canvas.toDataURL('image/png');
}
```

#### Infografías
- **Opción 1**: Usar infografías pre-generadas de `assets/infographics/`
- **Opción 2**: Generar dinámicamente con Canvas API
- **Formato**: PNG de alta resolución (300 DPI)
- **Tamaño**: Ajustado al ancho de página PDF

#### Diagramas de Flujo
- Usar librería de diagramas (mermaid.js o similar)
- Convertir a imagen SVG/PNG
- Integrar en PDF

### 5.3 Aplicación de Estilos

#### Sistema de Estilos para PDF
```typescript
// lib/pdf/pdf-styles.ts
export const pdfStyles = {
  page: {
    margin: { top: 20, right: 15, bottom: 20, left: 15 },
    backgroundColor: '#0F1216',
  },
  header: {
    backgroundColor: '#FF7A00',
    color: '#FFFFFF',
    fontSize: 24,
    font: 'Montserrat-Bold',
    padding: 10,
  },
  body: {
    color: '#E5E7EB',
    fontSize: 12,
    font: 'Inter-Regular',
    lineHeight: 1.6,
  },
  // ... más estilos
};
```

#### Aplicación de Estilos en jsPDF
```typescript
// lib/pdf/pdf-builder.ts
import { jsPDF } from 'jspdf';

export function applyBrandStyles(pdf: jsPDF): void {
  // Configurar fuentes (requiere cargar fuentes personalizadas)
  pdf.setFont('Montserrat', 'bold');
  pdf.setTextColor(255, 122, 0); // Orange
  
  // Aplicar colores de fondo
  pdf.setFillColor(15, 18, 22); // Dark Steel
  
  // Configurar márgenes
  pdf.setPage(pageNumber);
  // ... más configuración
}
```

### 5.4 Metadata del PDF

```typescript
pdf.setProperties({
  title: 'Guía Integral de Servicios - WeldTech Solutions',
  subject: 'Guía completa de servicios, metodología y casos de éxito',
  author: 'WeldTech Solutions',
  keywords: 'soldadura, calificación, ASME, AWS, ISO, WPS, PQR, WPQ',
  creator: 'WeldTech Solutions - Professional Welding Services',
  producer: 'WeldTech PDF Generator v1.0',
});
```

---

## 6. INTEGRACIÓN CON AUTENTICACIÓN

### 6.1 Verificación de Usuario

```typescript
// app/api/guia-servicio/generate-pdf/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // 1. Verificar autenticación
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Debes estar autenticado para descargar la guía' },
      { status: 401 }
    );
  }
  
  // 2. Generar PDF con información del usuario
  const pdf = await generateServiceGuidePDF({
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
  });
  
  // 3. Tracking de descarga
  await trackDownload({
    documentType: 'guia-servicio',
    documentName: 'Guia_Integral_Servicios_WeldTech.pdf',
    userId: session.user.id,
    userEmail: session.user.email,
    hasWatermark: false, // Usuarios registrados no tienen marca de agua
  });
  
  // 4. Retornar PDF
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Guia_Integral_Servicios_WeldTech_${Date.now()}.pdf"`,
    },
  });
}
```

### 6.2 Personalización por Usuario

- **Portada**: Incluir nombre del usuario
- **Metadata**: Incluir email del usuario
- **Tracking**: Registrar descarga en base de datos
- **Sin marca de agua**: Usuarios registrados reciben PDF sin marca de agua

---

## 7. OPTIMIZACIÓN Y RENDIMIENTO

### 7.1 Optimización de Tamaño

- **Compresión de imágenes**: Reducir calidad a 85% para imágenes grandes
- **Optimización de gráficos**: Usar formatos eficientes (PNG para gráficos simples, JPEG para fotos)
- **Fuentes**: Usar solo fuentes necesarias, considerar subset de fuentes
- **Metadata**: Limpiar metadata innecesaria

### 7.2 Caché y Reutilización

- **Caché de elementos estáticos**: Logos, infografías pre-generadas
- **Reutilización de componentes**: Componentes de sección reutilizables
- **Lazy loading**: Cargar imágenes bajo demanda

### 7.3 Tiempo de Generación

- **Objetivo**: < 5 segundos para PDF completo
- **Estrategias**:
  - Pre-generar elementos estáticos
  - Paralelizar generación de gráficos
  - Usar workers para procesamiento pesado

---

## 8. ELEMENTOS VISUALES ESPECÍFICOS

### 8.1 Infografías a Incluir

1. **"El Viaje del Cliente"** (Sección 1)
   - Diagrama de flujo: Contacto → Diagnóstico → Implementación → Resultados
   - Colores: Orange para CTAs, Blue para procesos

2. **"Nuestros Valores"** (Sección 2)
   - Gráfico circular o de barras con 5 valores core
   - Iconos representativos

3. **"Ecosistema WeldTech"** (Sección 3)
   - Diagrama de servicios interconectados
   - Visualización de cómo se relacionan los servicios

4. **"Índice de Compliance"** (Sección 4)
   - Gráfico de barras comparativo
   - Rangos de compliance con colores (verde, amarillo, rojo)

5. **"Proceso de Implementación"** (Sección 5)
   - Diagrama de Gantt visual
   - Timeline con hitos destacados

### 8.2 Gráficos de Datos

1. **Métricas de Casos de Éxito** (Sección 7)
   - Gráfico de barras: Reducción de tiempo, mejora en aprobación
   - Colores: Orange (mejora), Blue (baseline)

2. **Comparación de Paquetes** (Sección 5)
   - Tabla visual con checkmarks
   - Gráfico de barras de inversión vs. duración

### 8.3 Recuadros de Llamada a la Acción

- **"Agenda tu Diagnóstico Gratuito"**: Fondo Orange, texto White, icono de calendario
- **"Descarga Plantillas Premium"**: Fondo Blue, texto White, icono de descarga
- **"Contacta a Nuestro Equipo"**: Fondo Dark Steel con borde Orange, texto Orange

---

## 9. PLAN DE IMPLEMENTACIÓN

### 9.1 Fases de Desarrollo

#### FASE 1: Fundación (Semana 1)
**Objetivo**: Estructura base y conversión básica

- [ ] Crear estructura de archivos
- [ ] Implementar procesamiento básico de markdown
- [ ] Crear API route con autenticación
- [ ] Generar PDF básico con contenido de markdown
- [ ] Aplicar estilos básicos de marca

**Entregables**:
- PDF funcional con contenido básico
- Autenticación funcionando

#### FASE 2: Diseño y Estilos (Semana 2)
**Objetivo**: Aplicar diseño completo de marca

- [ ] Implementar sistema de estilos completo
- [ ] Aplicar colores de marca
- [ ] Configurar tipografías (Montserrat, Inter)
- [ ] Diseñar headers de sección
- [ ] Crear recuadros destacados
- [ ] Estilizar tablas

**Entregables**:
- PDF con diseño completo de marca

#### FASE 3: Elementos Visuales (Semana 3)
**Objetivo**: Agregar gráficos e infografías

- [ ] Implementar generación de gráficos (Chart.js)
- [ ] Crear infografías pre-generadas
- [ ] Integrar diagramas de flujo
- [ ] Agregar screenshots de herramientas
- [ ] Implementar código QR en portada

**Entregables**:
- PDF con elementos visuales completos

#### FASE 4: Optimización y Refinamiento (Semana 4)
**Objetivo**: Optimizar y pulir detalles

- [ ] Optimizar tamaño de archivo
- [ ] Mejorar tiempo de generación
- [ ] Agregar metadata completa
- [ ] Implementar tracking de descargas
- [ ] Testing completo
- [ ] Documentación

**Entregables**:
- PDF optimizado y listo para producción
- Documentación completa

### 9.2 Tareas Técnicas Detalladas

#### Tarea 1: Setup de Procesamiento de Markdown
```typescript
// Instalar dependencias
npm install marked dompurify

// Crear procesador
// lib/pdf/markdown-processor.ts
```

#### Tarea 2: Crear Constructor de PDF
```typescript
// lib/pdf/pdf-builder.ts
// Clase PDFBuilder que:
// - Lee markdown source
// - Procesa a HTML
// - Convierte a PDF
// - Aplica estilos
```

#### Tarea 3: Sistema de Estilos
```typescript
// lib/pdf/pdf-styles.ts
// Definir todos los estilos según manual de marca
```

#### Tarea 4: Generación de Gráficos
```typescript
// lib/pdf/pdf-charts.ts
// Funciones para generar cada tipo de gráfico
```

#### Tarea 5: API Route
```typescript
// app/api/guia-servicio/generate-pdf/route.ts
// Endpoint completo con autenticación
```

#### Tarea 6: Componente Frontend
```typescript
// app/guia-integral/page.tsx
// Botón de descarga con loading state
```

### 9.3 Testing

#### Tests Unitarios
- Procesamiento de markdown
- Aplicación de estilos
- Generación de gráficos
- Metadata del PDF

#### Tests de Integración
- Flujo completo de generación
- Autenticación y autorización
- Tracking de descargas

#### Tests de Usuario
- Descarga exitosa
- Calidad visual del PDF
- Tiempo de generación aceptable
- Compatibilidad con diferentes lectores PDF

---

## 10. CONSIDERACIONES ADICIONALES

### 10.1 Accesibilidad

- **Contraste**: Asegurar contraste suficiente en todos los elementos
- **Estructura**: Usar headings correctamente para navegación
- **Alt text**: Agregar descripciones a imágenes
- **Metadata**: Incluir metadata de accesibilidad

### 10.2 Internacionalización (Futuro)

- Preparar estructura para múltiples idiomas
- Separar contenido de diseño
- Considerar RTL para futuros idiomas

### 10.3 Versionado

- Incluir versión del documento en metadata
- Tracking de qué versión descargó cada usuario
- Notificaciones cuando hay nueva versión disponible

### 10.4 Analytics

- Tracking de descargas por usuario
- Métricas de uso (qué secciones se leen más)
- Feedback de usuarios sobre calidad del PDF

---

## 11. RECURSOS Y DEPENDENCIAS

### 11.1 Dependencias a Instalar

```json
{
  "dependencies": {
    "marked": "^11.0.0",           // Procesamiento de markdown
    "dompurify": "^3.0.0",         // Sanitización de HTML
    "isomorphic-dompurify": "^2.0.0", // Versión para Node.js
    "chart.js": "^4.4.0",          // Ya instalado
    "html2canvas": "^1.4.1",        // Ya instalado
    "jspdf": "^2.5.1",              // Ya instalado
    "qrcode": "^1.5.4"              // Ya instalado
  }
}
```

### 11.2 Assets Necesarios

- Logo WeldTech en formato PNG/SVG (alta resolución)
- Infografías pre-generadas (si aplica)
- Imágenes de herramientas/screenshots
- Fuentes: Montserrat, Inter (para PDF)

### 11.3 Documentación de Referencia

- `docs/GUIA_INTEGRAL_WELDTECH.md` - Contenido fuente
- `assets/branding/MANUAL_IMAGEN_CORPORATIVA.md` - Guía de marca
- `nextjs_space/lib/watermark.ts` - Referencia de marca de agua

---

## 12. CRITERIOS DE ÉXITO

### 12.1 Funcionalidad

- ✅ PDF se genera correctamente para usuarios autenticados
- ✅ Contenido completo y preciso del markdown
- ✅ Diseño aplicado correctamente según manual de marca
- ✅ Elementos visuales (gráficos, infografías) se renderizan correctamente
- ✅ Metadata completa y correcta

### 12.2 Calidad Visual

- ✅ Diseño profesional y atractivo
- ✅ Coherencia de marca (colores, tipografías, logos)
- ✅ Legibilidad en todos los elementos
- ✅ Elementos visuales claros y útiles

### 12.3 Rendimiento

- ✅ Tiempo de generación < 5 segundos
- ✅ Tamaño de archivo < 10 MB
- ✅ Compatible con lectores PDF estándar (Adobe, Chrome, etc.)

### 12.4 Experiencia de Usuario

- ✅ Descarga fluida
- ✅ PDF útil y valioso para el usuario
- ✅ Tracking de descargas funcionando

---

## 13. PRÓXIMOS PASOS

### Inmediato (Esta Semana)
1. Revisar y aprobar este plan
2. Instalar dependencias necesarias
3. Crear estructura de archivos base
4. Iniciar Fase 1 de implementación

### Corto Plazo (Próximas 2 Semanas)
1. Completar Fases 1 y 2
2. Testing inicial
3. Feedback de diseño

### Mediano Plazo (Próximo Mes)
1. Completar todas las fases
2. Testing completo
3. Lanzamiento a producción
4. Monitoreo y ajustes

---

## CONCLUSIÓN

Este plan detalla la implementación completa de un sistema de generación de Guía de Servicio en PDF para usuarios registrados. El resultado será un documento profesional, visualmente atractivo y alineado con la identidad de marca de WeldTech Solutions.

**El PDF será:**
- ✅ Informativo y completo
- ✅ Visualmente atractivo
- ✅ Coherente con la marca
- ✅ Fácil de usar
- ✅ Valioso para los usuarios

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Autor:** Sistema de Planificación WeldTech  
**Estado:** Pendiente de Aprobación

