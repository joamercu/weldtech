# 🚀 Guía de Implementación - Plantillas Profesionales WeldTech

## 📋 Tabla de Contenidos
1. [Preparación del Entorno](#preparación-del-entorno)
2. [Fase 1: Crear Primera Plantilla (WPS)](#fase-1-crear-primera-plantilla-wps)
3. [Fase 2: Configurar Sistema de Descarga](#fase-2-configurar-sistema-de-descarga)
4. [Fase 3: Crear Plantillas Restantes](#fase-3-crear-plantillas-restantes)
5. [Fase 4: Testing y Lanzamiento](#fase-4-testing-y-lanzamiento)

---

## Preparación del Entorno

### 1. Crear Estructura de Carpetas

Ejecuta estos comandos en PowerShell desde la raíz del proyecto:

```powershell
# Navegar a nextjs_space
cd nextjs_space

# Crear estructura de carpetas para plantillas
New-Item -ItemType Directory -Force -Path "public\templates\source"
New-Item -ItemType Directory -Force -Path "public\templates\preview"
New-Item -ItemType Directory -Force -Path "public\templates\guides"

# Crear carpetas para APIs
New-Item -ItemType Directory -Force -Path "app\api\templates\download"
New-Item -ItemType Directory -Force -Path "app\api\templates\generate-preview"

# Crear scripts
New-Item -ItemType Directory -Force -Path "scripts\templates"
```

### 2. Instalar Dependencias Necesarias

```powershell
# Desde nextjs_space/
npm install xlsx exceljs pdf-lib file-saver
```

### 3. Verificar Instalación

```powershell
npm list xlsx exceljs pdf-lib file-saver
```

---

## Fase 1: Crear Primera Plantilla (WPS)

### Día 1-2: Diseño y Estructura

#### Paso 1: Abrir Excel y Configurar Libro

1. Abrir Microsoft Excel (versión 2016 o superior)
2. Crear nuevo libro
3. Guardar como: `WPS_Template_v1.0.xlsx`
4. Crear 6 hojas:
   - Portada
   - Variables_Soldadura
   - Parametros_Electricos
   - Tecnica_Soldadura
   - Tratamiento_Termico
   - Rangos_Cualificados

#### Paso 2: Diseñar Hoja "Portada"

**Layout sugerido:**

```
┌─────────────────────────────────────────────┐
│  [Logo]              WELDING PROCEDURE      │
│                      SPECIFICATION          │
│                                             │
│  WPS Number:    [________]                  │
│  Revision:      [________]                  │
│  Date:          [________]                  │
│                                             │
│  Prepared by:   [________]                  │
│  Approved by:   [________]                  │
│                                             │
│  Company:       [________________________]  │
│  Project:       [________________________]  │
└─────────────────────────────────────────────┘
```

**Celdas editables:**
- B5: WPS Number (texto libre)
- B6: Revision (texto libre)
- B7: Date (formato fecha)
- B9: Prepared by (texto libre)
- B10: Approved by (texto libre)
- B12: Company (texto libre)
- B13: Project (texto libre)

**Celdas para logo:**
- A1:B4 → Insertar imagen → Clic derecho → "Tamaño y propiedades" → Nombre: "CompanyLogo"

#### Paso 3: Crear Dropdowns (Hoja Oculta con Datos)

1. Crear hoja nueva: "DataLists" (luego ocultar)
2. En "DataLists", columna A: P-Numbers (según ASME IX QW-420)

```
A1: P1
A2: P3
A3: P4
A4: P5A
A5: P5B
A6: P5C
A7: P8
A8: P9A
A9: P9B
A10: P10A
A11: P11A
A12: P15E
... (completar lista)
```

3. En "DataLists", columna B: F-Numbers (según ASME IX QW-432)

```
B1: F1
B2: F2
B3: F3
B4: F4
B5: F5
B6: F6
```

4. En "DataLists", columna C: Procesos de soldadura

```
C1: SMAW (Shielded Metal Arc Welding)
C2: GMAW (Gas Metal Arc Welding)
C3: GTAW (Gas Tungsten Arc Welding)
C4: FCAW (Flux Cored Arc Welding)
C5: SAW (Submerged Arc Welding)
```

5. En "DataLists", columna D: Posiciones AWS

```
D1: 1G - Flat (Groove)
D2: 2G - Horizontal (Groove)
D3: 3G - Vertical (Groove)
D4: 4G - Overhead (Groove)
D5: 5G - Horizontal Fixed (Pipe)
D6: 6G - Inclined Fixed (Pipe)
D7: 1F - Flat (Fillet)
D8: 2F - Horizontal (Fillet)
D9: 3F - Vertical (Fillet)
D10: 4F - Overhead (Fillet)
```

#### Paso 4: Aplicar Validación de Datos (Dropdowns)

En hoja "Variables_Soldadura":

1. Celda B5 (Proceso):
   - Datos → Validación de datos
   - Permitir: Lista
   - Origen: =DataLists!$C$1:$C$5
   - Mensaje de entrada: "Selecciona el proceso de soldadura"

2. Celda B6 (P-Number Material Base):
   - Validación de datos
   - Lista: =DataLists!$A$1:$A$20 (ajustar según cantidad)

3. Celda B7 (F-Number Material Aporte):
   - Validación de datos
   - Lista: =DataLists!$B$1:$B$6

4. Celda B8 (Posición):
   - Validación de datos
   - Lista: =DataLists!$D$1:$D$10

#### Paso 5: Crear Fórmula de Heat Input

En hoja "Parametros_Electricos":

**Layout:**
```
A1: Parámetros Eléctricos
A3: Pasada    A4: Corriente (A)    A5: Voltaje (V)    A6: Velocidad (cm/min)    A7: Heat Input (kJ/mm)
A5: Pass 1
A6: Pass 2
A7: Pass 3
```

**Fórmula de Heat Input en columna E:**

Celda E5 (Heat Input Pass 1):
```excel
=IF(AND(B5>0, C5>0, D5>0), (C5*B5*60)/(1000*D5*10), "")
```

Explicación:
- B5 = Corriente (A)
- C5 = Voltaje (V)
- D5 = Velocidad (cm/min)
- Fórmula: HI = (V × I × 60) / (1000 × S × 10)
- El *10 convierte cm/min a mm/s

**Copiar fórmula** a E6, E7 (para Pass 2 y Pass 3)

#### Paso 6: Formato Condicional

**Alertas de Heat Input alto:**

1. Seleccionar rango E5:E7
2. Inicio → Formato condicional → Nueva regla
3. Tipo: "Dar formato únicamente a las celdas que contengan"
4. Condición: Valor de la celda > 2.5
5. Formato: Fondo rojo, texto blanco
6. Mensaje: "PRECAUCIÓN: Heat Input elevado"

#### Paso 7: Proteger Hoja

1. Desbloquear celdas editables:
   - Seleccionar todas las celdas donde el usuario escribirá
   - Clic derecho → Formato de celdas → Protección
   - Desmarcar "Bloqueada"

2. Proteger hoja:
   - Revisar → Proteger hoja
   - Contraseña: (dejar en blanco para fácil acceso)
   - Opciones: Marcar "Seleccionar celdas desbloqueadas"

3. Ocultar hoja "DataLists":
   - Clic derecho en pestaña → Ocultar

### Día 3-4: Pulir y Testear WPS

#### Checklist de Validación

- [ ] Todos los dropdowns funcionan
- [ ] Fórmula de Heat Input calcula correctamente
- [ ] Formato condicional se aplica
- [ ] Logo se puede reemplazar sin romper layout
- [ ] Impresión se ve profesional (configurar márgenes)
- [ ] Protección de hoja activa (solo editables desbloqueadas)
- [ ] Testear en Excel 2016, 2019, Microsoft 365
- [ ] Testear en LibreOffice Calc (opcional, documentar limitaciones)

#### Casos de Prueba

**Prueba 1: Cálculo de Heat Input**
- Input: Corriente = 100A, Voltaje = 25V, Velocidad = 20 cm/min
- Expected: HI = (25 × 100 × 60) / (1000 × 20 × 10) = 0.75 kJ/mm
- Resultado: [_____]

**Prueba 2: Alerta de Heat Input alto**
- Input: Corriente = 250A, Voltaje = 30V, Velocidad = 15 cm/min
- Expected: HI = 3.0 kJ/mm → Celda en rojo
- Resultado: [_____]

**Prueba 3: Validación de dropdowns**
- Intentar escribir "XYZ" en campo Proceso
- Expected: Error "El valor no es válido"
- Resultado: [_____]

---

## Fase 2: Configurar Sistema de Descarga

### Día 5: Crear Biblioteca de Manejo de Excel

Crear archivo: `nextjs_space/lib/excel-handler.ts`

```typescript
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export interface TemplateInfo {
  id: string;
  name: string;
  fileName: string;
  description: string;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'wps',
    name: 'WPS - Welding Procedure Specification',
    fileName: 'WPS_Template_v1.0.xlsx',
    description: 'Especificación de Procedimiento de Soldadura según ASME IX QW-482',
  },
  {
    id: 'pqr',
    name: 'PQR - Procedure Qualification Record',
    fileName: 'PQR_Template_v1.0.xlsx',
    description: 'Registro de Calificación de Procedimiento según ASME IX QW-483',
  },
  {
    id: 'wpq',
    name: 'WPQ - Welder Performance Qualification',
    fileName: 'WPQ_Template_v1.0.xlsx',
    description: 'Calificación de Desempeño del Soldador según ASME IX QW-484',
  },
  {
    id: 'checklist',
    name: 'Checklist de Auditoría',
    fileName: 'Checklist_Auditoria_v1.0.xlsx',
    description: 'Checklist exhaustivo de auditoría con 50+ puntos de verificación',
  },
  {
    id: 'matriz',
    name: 'Matriz de Trazabilidad',
    fileName: 'Matriz_Trazabilidad_v1.0.xlsx',
    description: 'Sistema de trazabilidad WPS-PQR-WPQ-Soldador',
  },
];

/**
 * Obtiene la ruta completa de un template Excel
 */
export function getTemplatePath(templateId: string): string {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} no encontrado`);
  }

  return path.join(process.cwd(), 'public', 'templates', 'source', template.fileName);
}

/**
 * Obtiene la ruta del PDF preview
 */
export function getPreviewPath(templateId: string): string {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} no encontrado`);
  }

  const pdfFileName = template.fileName.replace('.xlsx', '_Preview.pdf');
  return path.join(process.cwd(), 'public', 'templates', 'preview', pdfFileName);
}

/**
 * Verifica si un template existe
 */
export function templateExists(templateId: string): boolean {
  try {
    const filePath = getTemplatePath(templateId);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Verifica si el preview PDF existe
 */
export function previewExists(templateId: string): boolean {
  try {
    const filePath = getPreviewPath(templateId);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Lee un template Excel y retorna el buffer
 */
export function readTemplate(templateId: string): Buffer {
  const filePath = getTemplatePath(templateId);
  return fs.readFileSync(filePath);
}

/**
 * Lee un preview PDF y retorna el buffer
 */
export function readPreview(templateId: string): Buffer {
  const filePath = getPreviewPath(templateId);
  return fs.readFileSync(filePath);
}

/**
 * Obtiene información de un template
 */
export function getTemplateInfo(templateId: string): TemplateInfo | undefined {
  return TEMPLATES.find(t => t.id === templateId);
}

/**
 * Obtiene todos los templates disponibles
 */
export function getAllTemplates(): TemplateInfo[] {
  return TEMPLATES;
}
```

### Día 6: Crear API de Descarga

Crear archivo: `nextjs_space/app/api/templates/download/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  templateExists,
  previewExists,
  readTemplate,
  readPreview,
  getTemplateInfo,
} from '@/lib/excel-handler';
import { trackDownload } from '@/lib/watermark';

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID es requerido' },
        { status: 400 }
      );
    }

    // Obtener sesión del usuario
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    // Obtener información del template
    const templateInfo = getTemplateInfo(templateId);
    if (!templateInfo) {
      return NextResponse.json(
        { error: 'Template no encontrado' },
        { status: 404 }
      );
    }

    let fileBuffer: Buffer;
    let fileName: string;
    let contentType: string;
    let hasWatermark: boolean;

    if (isAuthenticated) {
      // Usuario registrado → Servir Excel SIN marca de agua
      if (!templateExists(templateId)) {
        return NextResponse.json(
          { error: 'Archivo Excel no disponible' },
          { status: 404 }
        );
      }

      fileBuffer = readTemplate(templateId);
      fileName = templateInfo.fileName;
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      hasWatermark = false;

      // Registrar descarga
      await trackDownload({
        documentType: 'template',
        documentName: templateInfo.name,
        hasWatermark: false,
        userId: session.user.id,
        userEmail: session.user.email,
      });
    } else {
      // Usuario NO registrado → Servir PDF CON marca de agua
      if (!previewExists(templateId)) {
        return NextResponse.json(
          { error: 'Preview PDF no disponible. Por favor contacta soporte.' },
          { status: 404 }
        );
      }

      fileBuffer = readPreview(templateId);
      fileName = templateInfo.fileName.replace('.xlsx', '_Preview_public.pdf');
      contentType = 'application/pdf';
      hasWatermark = true;

      // Registrar descarga
      await trackDownload({
        documentType: 'template',
        documentName: templateInfo.name,
        hasWatermark: true,
      });
    }

    // Crear respuesta con el archivo
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error en descarga de template:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

### Día 7: Actualizar Página de Plantillas

Modificar: `nextjs_space/app/components/plantillas-page.tsx`

**Agregar función de descarga:**

```typescript
// Agregar al inicio del componente (después de los imports)
import { useSession } from 'next-auth/react'

// Dentro del componente PlantillasPage:
const { data: session } = useSession()
const isAuthenticated = !!session?.user

// Función de descarga
const handleDownload = async (templateId: string) => {
  try {
    const response = await fetch(`/api/templates/download?id=${templateId}`)
    
    if (!response.ok) {
      throw new Error('Error al descargar')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Obtener nombre del archivo desde header
    const contentDisposition = response.headers.get('Content-Disposition')
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
    a.download = fileNameMatch ? fileNameMatch[1] : 'template.xlsx'
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    // Mostrar mensaje de éxito
    if (isAuthenticated) {
      toast.success('¡Plantilla Excel descargada!')
    } else {
      toast.info('PDF descargado. Regístrate gratis para obtener la versión Excel editable.')
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Error al descargar. Por favor intenta de nuevo.')
  }
}
```

**Actualizar botones de descarga en las tarjetas:**

```typescript
{/* Botón de descarga */}
<button
  onClick={() => handleDownload(template.id)}
  className={`btn-primary w-full ${!isAuthenticated && 'btn-secondary'}`}
>
  <Download size={20} />
  {isAuthenticated 
    ? 'Descargar Excel Editable' 
    : 'Descargar Vista Previa (PDF)'}
</button>

{/* Badge de estado */}
{isAuthenticated ? (
  <div className="mt-2 text-center text-xs text-success">
    ✓ Sin marca de agua • Completamente editable
  </div>
) : (
  <div className="mt-2 text-center text-xs text-muted">
    🔒 Regístrate para obtener versión Excel
  </div>
)}
```

---

## Fase 3: Crear Plantillas Restantes

### Semana 2: PQR (Procedure Qualification Record)

**Reutilizar estructura de WPS:**
1. Duplicar archivo `WPS_Template_v1.0.xlsx`
2. Guardar como `PQR_Template_v1.0.xlsx`
3. Modificar hojas según especificaciones del plan estratégico
4. Agregar fórmulas específicas de PQR (cálculos de ensayos mecánicos)
5. Testear y validar

### Semana 3: WPQ (Welder Performance Qualification)

**Funcionalidades clave:**
1. Auto-cálculo de rangos cualificados (tabla QW-451)
2. Alerta de continuidad (6 meses)
3. Espacio para foto del soldador

### Semana 4: Checklist de Auditoría

**Funcionalidades clave:**
1. 50+ items con dropdowns (Compliant/Minor/Major/N/A)
2. Auto-scoring con gráficos
3. Dashboard visual
4. Plan de acción integrado

### Semana 4: Matriz de Trazabilidad

**Funcionalidades clave:**
1. Base de datos relacional (WPS, PQR, WPQ, Soldadores)
2. Fórmulas VLOOKUP / INDEX-MATCH
3. Dashboard con alertas automáticas
4. Filtros avanzados

---

## Fase 4: Testing y Lanzamiento

### Testing Integral (Día 28-30)

#### Checklist de Testing

**Plantillas Excel:**
- [ ] Las 5 plantillas funcionan correctamente
- [ ] Todas las fórmulas calculan sin errores
- [ ] Dropdowns muestran opciones correctas
- [ ] Formato condicional se aplica
- [ ] Protección de hojas activa
- [ ] Compatible con Excel 2016, 2019, Microsoft 365

**Sistema de Descarga:**
- [ ] Usuario NO registrado descarga PDF con marca de agua
- [ ] Usuario registrado descarga Excel sin marca de agua
- [ ] Tracking registra descargas correctamente
- [ ] Nombres de archivo correctos
- [ ] Tamaño de archivos razonable (<10MB)

**Frontend:**
- [ ] Botones de descarga funcionan
- [ ] Badges de estado se muestran correctamente
- [ ] Toasts/notificaciones funcionan
- [ ] Responsive en móvil, tablet, desktop

### Lanzamiento (Día 31)

#### Pre-Lanzamiento (Morning)

1. **Verificación final:**
   ```powershell
   # Verificar que todos los archivos existen
   ls public\templates\source\*.xlsx
   ls public\templates\preview\*.pdf
   ```

2. **Deploy a producción:**
   ```powershell
   git add .
   git commit -m "feat: Launch professional templates system (WPS, PQR, WPQ, Checklist, Matriz)"
   git push origin main
   ```

3. **Verificar en producción:**
   - Visitar URL de producción
   - Probar descarga pública (PDF)
   - Registrar usuario de prueba
   - Probar descarga autenticada (Excel)

#### Lanzamiento (Afternoon)

4. **Anuncio en redes sociales:**
   - LinkedIn: Post profesional con imagen de las plantillas
   - Instagram: Carrusel con screenshots de las 5 plantillas
   - Facebook: Compartir en grupos de soldadura

5. **Email a usuarios existentes:**
   - Usar template "Email 2: Confirmación de registro y descarga"
   - Enviar a todos los usuarios registrados

6. **Publicar contenido:**
   - Artículo de blog: "Lanzamos 5 Plantillas Profesionales Gratuitas"
   - Video YouTube: "Tour de las Plantillas WeldTech"

---

## 🆘 Solución de Problemas Comunes

### Problema 1: Fórmulas no calculan

**Síntoma:** Fórmulas muestran #REF! o #VALUE!

**Solución:**
1. Verificar referencias de celdas (no se movieron)
2. Verificar nombre de hojas (sin espacios extra)
3. Fórmulas → Calcular ahora (F9)

### Problema 2: Dropdowns no funcionan

**Síntoma:** Al hacer clic en celda, no aparece dropdown

**Solución:**
1. Verificar validación de datos en la celda
2. Verificar que hoja "DataLists" no fue eliminada
3. Verificar rango de datos en validación

### Problema 3: Marca de agua no aparece en PDF

**Síntoma:** PDF se genera pero sin marca de agua

**Solución:**
1. Verificar que función `applyWatermarkToPDF()` se llama
2. Revisar parámetros de opacity (no debe ser 0)
3. Revisar console.log para errores

### Problema 4: Descarga falla (500 error)

**Síntoma:** Al hacer clic en descargar, error 500

**Solución:**
1. Verificar logs del servidor: `npm run dev` (ver terminal)
2. Verificar que archivo existe en carpeta correcta
3. Verificar permisos de lectura en archivos

---

## 📞 Recursos y Soporte

### Documentación Técnica

- **ASME IX**: [asme.org](https://www.asme.org/codes-standards/find-codes-standards/bpvc-section-ix-welding-brazing-fusing-qualifications)
- **AWS D1.1**: [aws.org](https://www.aws.org/standards)
- **Excel VBA**: [Microsoft Docs](https://docs.microsoft.com/en-us/office/vba/api/overview/excel)
- **Next.js API Routes**: [nextjs.org/docs](https://nextjs.org/docs/api-routes/introduction)

### Contacto

- **Email técnico**: dev@weldtech.solutions
- **WhatsApp soporte**: +57 313 369 1591

---

**¡Éxito con la implementación!** 🚀

