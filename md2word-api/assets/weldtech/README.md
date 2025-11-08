
# WeldTech Solutions - Logo Usage Guide

## Logo Assets Overview

Este directorio contiene los logos oficiales de **WeldTech Solutions** diseñados según el Manual de Imagen Corporativa.

---

## 📁 Archivos Disponibles

### 1. **Logo Horizontal (Uso Principal)**
**Archivo:** `weldtech-horizontal-full-color.png`
- **Dimensiones:** 1536 × 512 px (3:1)
- **Tamaño:** 469 KB
- **Uso recomendado:**
  - Headers de sitio web
  - Presentaciones corporativas
  - Documentación técnica (encabezados)
  - Email signatures
  - Banners y publicidad digital

**Características:**
- Símbolo de junta soldada (V-groove) en naranja (#FF7A00)
- Texto "WELDTECH" en Montserrat Bold, blanco
- Texto "Solutions" en Montserrat Medium, gris acero
- Fondo oscuro (#0F1216)

---

### 2. **Logo Símbolo Solo (Uso Mínimo)**
**Archivo:** `weldtech-symbol-only.jpg`
- **Dimensiones:** 2048 × 2048 px (1:1)
- **Tamaño:** 89 KB
- **Uso recomendado:**
  - Favicon del sitio web
  - Íconos de aplicación móvil
  - Fotos de perfil en redes sociales
  - Watermarks en imágenes
  - Marcas de identificación pequeñas

**Características:**
- Símbolo geométrico de V-groove weld
- Gradiente naranja vibrante (#FF7A00 → #FF9500)
- Diseño minimalista y escalable
- Alta legibilidad en tamaños pequeños

---

### 3. **Logo Vertical (Uso Secundario)**
**Archivo:** `weldtech-vertical-full-color.png`
- **Dimensiones:** 1024 × 1536 px (2:3)
- **Tamaño:** 2.1 MB
- **Uso recomendado:**
  - Pósters y carteles verticales
  - Instagram Stories y TikTok
  - Portadas de documentos A4
  - Roll-ups y banners de eventos
  - Packaging vertical

**Características:**
- Mismo diseño que horizontal pero apilado verticalmente
- Símbolo en la parte superior
- "WELDTECH" centrado debajo
- "Solutions" en la parte inferior
- Mantiene la identidad visual completa

---

## 🎨 Especificaciones de Color

### Paleta Oficial
```
Dark Steel (Fondo):     #0F1216
Weld Orange (Principal): #FF7A00
Orange Gradient:         #FF7A00 → #FF9500
White (Texto):           #FFFFFF
Steel Gray (Secundario): #6B7280
Precision Blue (Acento): #2AA1FF
```

---

## ✅ Uso Correcto

### ✓ Hacer:
- Mantener proporciones originales
- Usar sobre fondos oscuros (#0F1216) o fotografías con overlay
- Dejar espacio mínimo alrededor equivalente a la altura de la letra "W"
- Usar versión horizontal como predeterminada
- Escalar proporcionalmente

### ✗ Evitar:
- No rotar el logo
- No cambiar colores ni aplicar filtros
- No distorsionar proporciones (stretch)
- No usar sobre fondos de bajo contraste
- No agregar efectos (sombras, brillos externos)
- No colocar elementos que interfieran con la legibilidad

---

## 📐 Tamaños Mínimos

Para mantener legibilidad:
- **Digital:** 120 px de ancho (horizontal)
- **Impreso:** 25 mm de ancho (horizontal)
- **Favicon:** 32 × 32 px (símbolo solo)
- **Social Media Profile:** 400 × 400 px (símbolo solo)

---

## 🌐 Implementación Web

### Next.js Image Component
```tsx
import Image from 'next/image'

// Logo horizontal en header
<Image
  src="/logo/weldtech-horizontal-full-color.png"
  alt="WeldTech Solutions"
  width={384}
  height={128}
  priority
/>

// Símbolo en footer o pequeño
<Image
  src="/logo/weldtech-symbol-only.jpg"
  alt="WeldTech"
  width={64}
  height={64}
/>
```

### HTML Estándar
```html
<!-- Logo horizontal -->
<img 
  src="/logo/weldtech-horizontal-full-color.png" 
  alt="WeldTech Solutions"
  style="max-width: 384px; height: auto;"
/>

<!-- Símbolo solo -->
<img 
  src="/logo/weldtech-symbol-only.jpg" 
  alt="WeldTech"
  style="width: 64px; height: 64px; object-fit: contain;"
/>
```

### CSS Background
```css
.logo-horizontal {
  background-image: url('/logo/weldtech-horizontal-full-color.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 384px;
  height: 128px;
}
```

---

## 📱 Redes Sociales

### LinkedIn
- **Foto de perfil:** Usar `weldtech-symbol-only.jpg` (recortado 400×400)
- **Banner:** Crear banner personalizado con logo horizontal

### WhatsApp Business
- **Foto de perfil:** `weldtech-symbol-only.jpg` (500×500)

### Instagram/Facebook
- **Foto de perfil:** Símbolo solo (320×320)
- **Stories:** Logo vertical en esquina superior

---

## 🖨️ Aplicaciones Impresas

### Tarjetas de Presentación
- Usar logo horizontal en frente
- Símbolo solo en reverso (opcional)
- Tamaño mínimo: 30 mm de ancho

### Documentación Técnica
- Portada: Logo horizontal centrado o logo vertical
- Páginas interiores: Logo horizontal pequeño en header (30 mm)
- Footer: Símbolo solo (15 mm) como watermark

### Presentaciones (PowerPoint/PDF)
- Diapositiva título: Logo horizontal grande
- Diapositivas de contenido: Logo horizontal pequeño en esquina
- Tamaño recomendado: 5-8 cm de ancho

---

## 🔄 Variaciones Futuras (Pendientes)

Según el Manual de Imagen Corporativa, se pueden crear:
- Logo monocromático blanco (para fondos muy oscuros)
- Logo monocromático negro (para impresión B/N)
- Logo en formato SVG vectorial (escalabilidad infinita)
- Variantes por estándar técnico:
  - ASME IX (naranja) ← Actual
  - AWS D1.1 (azul)
  - ISO 9606 (verde)
  - API 1104 (morado)

---

## 📧 Contacto

Para solicitar variaciones adicionales o uso especial del logo, consultar el **Manual de Imagen Corporativa** completo en el directorio raíz del proyecto.

**Archivos relacionados:**
- `/MANUAL_IMAGEN_CORPORATIVA.md`
- `/BRAND_ASSETS_GUIDE.md`
- `/PROPUESTA_EXPANSION_MODULAR.md`

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Compatibilidad:** Web, print, redes sociales, documentación
