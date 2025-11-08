
# Guía de Assets de Marca
## Complemento al Manual de Imagen Corporativa

Esta guía proporciona instrucciones técnicas detalladas para la creación y aplicación de assets visuales siguiendo el manual de imagen corporativa.

---

## 1. CREACIÓN DE LOGO (Especificaciones Técnicas)

### 1.1 Concepto Visual Propuesto

**Elemento Principal: Símbolo de Junta Soldada**
```
   /\
  /  \     <- Representación estilizada de V-groove weld
 /    \       con línea de fusión central
/______\
```

### 1.2 Construcción del Logo

#### Versión Horizontal (Uso Principal)
```
[SÍMBOLO] WELDTECH
          Solutions

Proporciones:
- Símbolo: 1 unidad de altura
- "WELDTECH": 0.8 unidades de altura
- "Solutions": 0.3 unidades de altura
- Espacio entre símbolo y texto: 0.3 unidades
```

#### Versión Vertical (Uso Secundario)
```
[SÍMBOLO]
WELDTECH
Solutions

Proporciones:
- Símbolo: 1.2 unidades
- Todo centrado
- Espacio símbolo-texto: 0.2 unidades
```

#### Versión Símbolo Solo (Uso Mínimo)
```
[SÍMBOLO]

Uso: Favicon, app icon, redes sociales
Tamaño mínimo: 32x32px
```

### 1.3 Especificaciones de Color

**Versión Full Color (Sobre Oscuro)**
- Símbolo: Orange (#FF7A00) con gradiente sutil
- "WELDTECH": White (#FFFFFF)
- "Solutions": Steel Gray (#6B7280)

**Versión Full Color (Sobre Claro)**
- Símbolo: Orange (#FF7A00)
- "WELDTECH": Dark Steel (#0F1216)
- "Solutions": Steel Gray (#6B7280)

**Versión Monocromática Blanca**
- Todo en #FFFFFF
- Uso: Sobre fondos oscuros o fotografías

**Versión Monocromática Negra**
- Todo en #0F1216
- Uso: Documentos formales, impresión BN

### 1.4 Archivos a Generar

```
/logo/
  ├── weldtech-horizontal-full-color.svg
  ├── weldtech-horizontal-full-color.png (transparente, 4000px)
  ├── weldtech-horizontal-white.svg
  ├── weldtech-horizontal-white.png
  ├── weldtech-horizontal-black.svg
  ├── weldtech-horizontal-black.png
  ├── weldtech-vertical-full-color.svg
  ├── weldtech-vertical-full-color.png
  ├── weldtech-symbol-only.svg
  ├── weldtech-symbol-only.png (1000x1000px)
  ├── favicon.ico (16x16, 32x32, 48x48)
  └── logo-usage-guide.pdf
```

---

## 2. TEMPLATES DE INFOGRAFÍAS

### 2.1 Template Base (1080x1920px)

**Estructura de Capas** (Figma/Illustrator):
```
1. Background
   └── Gradiente base (#0F1216 → #1a1f26)

2. Grid Guides
   └── 3 columnas | márgenes 60px | gap 30px

3. Header Section (0-200px)
   ├── Logo (top-left, 40px margin)
   ├── Título principal (centrado)
   └── Subtítulo (centrado)

4. Content Grid (200-1720px)
   ├── Sección 1-4 (4 filas x 3 columnas)
   ├── Sección 5-8
   ├── Sección 9-12
   └── Sección 13 (centrada)

5. Footer Section (1720-1920px)
   ├── QR code (200x200px, centrado)
   ├── URL de descarga
   └── Logos partners (si aplica)

6. Overlays & Effects
   └── Glows, borders, shadows
```

### 2.2 Componente: Tarjeta de Sección

**Dimensiones**: 310x350px (aprox)

**Estructura**:
```css
.section-card {
  background: linear-gradient(135deg, 
    rgba(255,255,255,0.05) 0%, 
    rgba(255,255,255,0.02) 100%
  );
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 24px;
  position: relative;
}

.section-number {
  position: absolute;
  top: 16px;
  left: 16px;
  font: Montserrat Bold 600 | 14px;
  color: #FF7A00;
  background: rgba(255,122,0,0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

.section-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #2AA1FF;
}

.section-title {
  font: Montserrat SemiBold 600 | 18px;
  color: #FFFFFF;
  margin-bottom: 12px;
  line-height: 1.3;
}

.section-content {
  font: Inter Regular 400 | 14px;
  color: #E5E7EB;
  line-height: 1.6;
}

.section-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.section-list-item::before {
  content: '→';
  color: #FF7A00;
  margin-right: 8px;
  font-weight: bold;
}
```

### 2.3 Variaciones por Estándar

**ASME IX** (actual):
- Color dominante: Orange (#FF7A00)
- Icono header: Shield

**AWS D1.1** (próximo):
- Color dominante: Blue (#2AA1FF)
- Icono header: Zap

**ISO 9606**:
- Color dominante: Green (#10B981)
- Icono header: Globe

**API 1104**:
- Color dominante: Purple (#8B5CF6)
- Icono header: Droplet

---

## 3. TEMPLATES DE REDES SOCIALES

### 3.1 LinkedIn Post (1200x1200px)

**Template Anuncio**:
```
┌─────────────────────────────┐
│ [Logo] WeldTech   [Badge]   │ <- Header (100px)
├─────────────────────────────┤
│                             │
│   [IMAGEN/GRÁFICO]          │ <- Visual principal (700px)
│                             │
├─────────────────────────────┤
│  Título del Contenido       │ <- Info section (400px)
│  Descripción breve          │
│  ┌───────────────┐          │
│  │ [CTA Button]  │          │
│  └───────────────┘          │
└─────────────────────────────┘
```

**Capas**:
1. Background: Dark Steel
2. Visual area: Imagen con overlay gradient
3. Text overlay: Títulos con sombra para legibilidad
4. CTA button: Orange gradient
5. Logo watermark: 40% opacity, bottom-right

### 3.2 Instagram Story (1080x1920px)

**Template Tip Técnico**:
```
┌─────────────┐
│   [Logo]    │ <- Top (100px)
│             │
│ ┌─────────┐ │
│ │  [Icon] │ │ <- Icono grande (300px)
│ └─────────┘ │
│             │
│ TÍTULO      │ <- Título (200px)
│ CORTO       │
│             │
│ • Punto 1   │
│ • Punto 2   │ <- Contenido (900px)
│ • Punto 3   │
│             │
│ Swipe Up    │ <- CTA (420px)
│ para más    │
└─────────────┘
```

### 3.3 WhatsApp Status (1080x1920px)

**Template Actualización**:
- Fondo: Dark con foto técnica overlay
- Texto: Grande, legible, máximo 3 líneas
- Emoji: Uno relevante al inicio
- CTA: "Escribe HOLA para recibir"

---

## 4. TEMPLATES DE DOCUMENTACIÓN

### 4.1 Portada de Manual Técnico

**Elementos** (A4 vertical):
```
┌─────────────────────┐
│                     │
│ [Logo]              │ <- 30mm desde arriba
│                     │
│                     │
│   TÍTULO            │ <- Centrado vertical
│   DEL MANUAL        │
│                     │
│   Subtítulo         │
│                     │
│                     │
│ Código: WTS-XXX-001 │ <- 20mm desde abajo
│ Versión: 1.0        │
│ Fecha: Nov 2025     │
└─────────────────────┘
```

**Especificaciones**:
- Márgenes: 25mm top/bottom, 20mm sides
- Logo: 50mm de ancho
- Título: Montserrat Bold 48pt
- Subtítulo: Inter Regular 18pt
- Fondo: Gradient oscuro con textura sutil

### 4.2 Página Interior

**Layout**:
```
┌────────────────────────────┐
│ [Logo] Título del Doc  Pág │ <- Header
├────────────────────────────┤
│                            │
│  Sección                   │
│                            │
│  Contenido del documento   │
│  con párrafos, listas,     │
│  tablas, etc.              │
│                            │
│                            │
├────────────────────────────┤
│ WTS-XXX-001 | v1.0    [#]  │ <- Footer
└────────────────────────────┘
```

**Elementos Tipográficos**:
- H2 Sección: Montserrat SemiBold 24pt, Orange
- H3 Subsección: Montserrat Medium 18pt
- Body: Inter Regular 11pt, line-height 1.5
- Captions: Inter Regular 9pt, Steel Gray

---

## 5. ELEMENTOS GRÁFICOS REUTILIZABLES

### 5.1 Iconos Personalizados

**A crear** (SVG, 64x64px base):

```
✓ weld-joint.svg         (junta soldada)
✓ certification.svg      (certificado con sello)
✓ inspector.svg          (inspector con tableta)
✓ welding-arc.svg        (arco de soldadura)
✓ thickness-gauge.svg    (medidor de espesor)
✓ test-coupon.svg        (probeta de prueba)
✓ wps-document.svg       (documento WPS)
✓ acceptance-criteria.svg (criterios con check)
✓ date-validity.svg      (calendario con reloj)
✓ process-flow.svg       (diagrama de flujo)
✓ position-code.svg      (código de posición)
✓ traceability.svg       (cadena de trazabilidad)
```

**Especificaciones**:
- Stroke: 2px
- Style: Outlined (no fill)
- Color: Single path (aplicar color en uso)
- Viewbox: 0 0 64 64
- Grid: Alineado a píxel perfecto

### 5.2 Texturas y Backgrounds

**Pattern Grid (Subtle)**:
```css
background-image: 
  linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
background-size: 20px 20px;
```

**Noise Texture**:
```css
background-image: url('data:image/svg+xml;base64,[noise pattern]');
opacity: 0.03;
mix-blend-mode: overlay;
```

**Mesh Gradient (Hero Background)**:
```css
background: 
  radial-gradient(circle at 20% 30%, rgba(255,122,0,0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(42,161,255,0.1) 0%, transparent 50%),
  linear-gradient(135deg, #0F1216 0%, #1a1f26 100%);
```

### 5.3 Overlays y Effects

**Card Glow (Hover)**:
```css
.card:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #FF7A00, #2AA1FF);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover::before {
  opacity: 1;
}
```

**Text Gradient**:
```css
.gradient-text {
  background: linear-gradient(135deg, #FF7A00 0%, #2AA1FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 6. SISTEMA DE NOMENCLATURA DE ARCHIVOS

### 6.1 Convenciones

**Formato General**:
```
{tipo}-{descripcion}-{variante}-{tamaño}.{ext}

Ejemplos:
logo-weldtech-horizontal-white-4000px.png
infografia-asme-ix-es-1080x1920.pdf
social-linkedin-post-webinar-aws-1200x1200.jpg
doc-portada-manual-qc-a4.pdf
icon-weld-joint-orange-64px.svg
```

**Tipos**:
- `logo` - Logotipos y variantes
- `infografia` - Infografías completas
- `social` - Contenido para redes sociales
- `doc` - Documentación y templates
- `icon` - Iconografía
- `texture` - Texturas y backgrounds
- `photo` - Fotografías y bancos de imagen
- `mockup` - Mockups y visualizaciones

**Variantes**:
- `full-color` / `white` / `black` / `orange`
- `horizontal` / `vertical` / `square`
- `es` / `en` (idioma)
- `light` / `dark` (para temas)

### 6.2 Estructura de Carpetas

```
/brand-assets/
├── /logo/
│   ├── /svg/
│   ├── /png/
│   └── /usage-examples/
├── /colors/
│   ├── palette.ase (Adobe Swatch)
│   └── colors.json
├── /typography/
│   ├── /Montserrat/
│   └── /Inter/
├── /icons/
│   ├── /svg/
│   └── /png/
├── /templates/
│   ├── /infografias/
│   ├── /social-media/
│   ├── /documentation/
│   └── /presentations/
├── /photography/
│   ├── /welding-processes/
│   ├── /equipment/
│   └── /professionals/
├── /textures/
│   ├── grid-patterns.svg
│   ├── noise-textures.svg
│   └── gradients.svg
└── /exports/
    └── /[project-name]/
```

---

## 7. EXPORTACIÓN Y OPTIMIZACIÓN

### 7.1 Especificaciones por Medio

**Web**:
- Formato: WebP (o PNG con fallback)
- Resolución: 2x para Retina (@2x suffix)
- Optimización: TinyPNG, ImageOptim
- Naming: descriptivo + dimensiones

**Impresión**:
- Formato: PDF (con fuentes embebidas) o TIFF
- Resolución: 300 DPI mínimo
- Color: CMYK (convertir desde RGB)
- Sangrado: +3mm en todos los lados

**Redes Sociales**:
- Formato: JPG (fotos), PNG (gráficos con texto)
- Resolución: Exacta según plataforma
- Color: sRGB
- Compresión: 80-90% quality

### 7.2 Checklist de Pre-exportación

**Vectoriales (SVG)**:
- [ ] Convertir textos a contornos (outline)
- [ ] Expandir strokes a fills
- [ ] Agrupar elementos relacionados
- [ ] Limpiar paths innecesarios
- [ ] Remover metadatos de software
- [ ] Verificar viewBox correcto

**Rasterizados (PNG/JPG)**:
- [ ] Verificar dimensiones exactas
- [ ] Comprobar espacio de color (sRGB)
- [ ] Optimizar peso de archivo
- [ ] Generar versiones @2x si aplica
- [ ] Verificar transparencias (PNG)
- [ ] Embed color profile

**PDFs**:
- [ ] Fuentes embebidas o convertidas
- [ ] Imágenes a 300 DPI
- [ ] Páginas con sangrado si va a imprenta
- [ ] PDF/X-1a para impresión profesional
- [ ] Tamaño de página correcto
- [ ] Eliminar contenido oculto

---

## 8. HERRAMIENTAS Y RECURSOS

### 8.1 Plugins y Extensiones Útiles

**Figma**:
- Unsplash (imágenes stock)
- Iconify (librería de iconos)
- Stark (contrast checker)
- Content Reel (texto placeholder)
- Remove BG (eliminar fondos)

**Adobe**:
- AEUX (After Effects ↔ Figma)
- Fontself (crear iconfonts)
- Anima (export to code)

**VS Code**:
- SVG Preview
- Color Highlight
- Image Preview

### 8.2 Recursos Online

**Imágenes Técnicas**:
- Unsplash: "welding", "industrial", "construction"
- Pexels: "metal work", "fabrication"
- Freepik (premium): Vectores industriales

**Mockups**:
- Smartmockups (web, mobile)
- Mockup World (gratuitos)
- Placeit (subscripción)

**Inspiración**:
- Behance: "technical infographic", "industrial design"
- Dribbble: "dark mode", "saas dashboard"
- Pinterest: "industrial branding"

### 8.3 Flujo de Trabajo Recomendado

**Nuevo Asset**:
1. Revisar manual de imagen corporativa
2. Buscar template existente
3. Diseñar en Figma/Illustrator
4. Revisar checklist de marca
5. Exportar en formatos necesarios
6. Optimizar archivos
7. Archivar en estructura de carpetas
8. Documentar si es nuevo componente

**Actualización de Asset**:
1. Localizar archivo fuente (.fig, .ai)
2. Aplicar cambios siguiendo manual
3. Incrementar número de versión
4. Re-exportar
5. Actualizar documentación
6. Comunicar cambio si afecta otros materiales

---

## 9. ANEXO: PROMPT GUIDE PARA GENERACIÓN DE IMÁGENES IA

### 9.1 Prompt Base para Estilo de Marca

```
Style: Industrial technical photography, dramatic lighting, 
blue and orange color grading, high contrast, professional,
dark moody atmosphere, cinematic look, shallow depth of field

Technical elements: Welding equipment, metal surfaces, 
sparks, protective gear, blueprints, technical drawings

Color palette: Dark steel background (#0F1216), 
orange accents (#FF7A00), blue highlights (#2AA1FF)

Mood: Elite craftsmanship, precision, technical excellence,
modern industrial, professional workshop environment
```

### 9.2 Prompts Específicos por Tema

**Soldador en Acción**:
```
Professional welder in action, wearing full protective gear,
electric welding arc creating bright orange sparks,
dark industrial workshop background, dramatic side lighting,
blue and orange color grading, high contrast, cinematic,
technical precision, safety equipment visible,
metal fabrication workspace, professional craftsmanship
```

**Equipo y Herramientas**:
```
Professional welding equipment close-up, modern welding machine,
TIG torch and electrode holder, on dark metal workbench,
technical lighting with blue and orange accents,
industrial setting, high detail, professional photography,
safety equipment in background, workshop environment
```

**Inspector de Calidad**:
```
QA inspector examining welded joint, wearing safety glasses,
using precision measurement tools, technical clipboard,
industrial workshop background, professional lighting,
blue and orange color scheme, technical documentation visible,
serious professional demeanor, quality control environment
```

### 9.3 Negative Prompts (Evitar)

```
cartoon, illustration, sketch, painting, unrealistic,
amateur, messy, cluttered, bright colors, oversaturated,
low quality, blurry, generic stock photo, office setting,
casual clothing, smiling faces (unless specifically needed),
clean white background, corporate aesthetic, outdated equipment
```

---

## CONCLUSIÓN

Esta guía de assets complementa el manual de imagen corporativa con especificaciones técnicas concretas. Cada elemento creado debe pasar por el checklist correspondiente antes de considerarse finalizado.

**Recuerda**: La consistencia en los detalles técnicos es lo que separa una marca amateur de una profesional.

---

**Última actualización**: Noviembre 2025  
**Próxima revisión**: Trimestral o según necesidad

