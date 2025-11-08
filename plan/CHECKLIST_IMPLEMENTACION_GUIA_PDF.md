# Checklist de Implementación: Guía de Servicio PDF

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Objetivo:** Checklist ejecutable para implementar el sistema de descarga de Guía de Servicio en PDF

---

## FASE 1: FUNDACIÓN (Semana 1)

### Setup Inicial
- [ ] Instalar dependencias necesarias
  ```bash
  npm install marked dompurify isomorphic-dompurify
  ```
- [ ] Crear estructura de directorios
  - [ ] `lib/pdf/` - Librerías de procesamiento
  - [ ] `lib/branding/` - Assets de marca
  - [ ] `app/api/guia-servicio/generate-pdf/` - API route
  - [ ] `app/components/guia-pdf/` - Componentes React
  - [ ] `public/assets/guia-pdf/` - Assets estáticos

### Procesamiento de Markdown
- [ ] Crear `lib/pdf/markdown-processor.ts`
  - [ ] Función para leer archivo markdown
  - [ ] Función para parsear markdown a HTML
  - [ ] Función para sanitizar HTML
  - [ ] Función para aplicar clases de estilo
- [ ] Testing: Verificar conversión correcta de markdown básico

### Constructor de PDF Base
- [ ] Crear `lib/pdf/pdf-builder.ts`
  - [ ] Clase `PDFBuilder`
  - [ ] Método `initialize()` - Configuración inicial
  - [ ] Método `addPage()` - Agregar nueva página
  - [ ] Método `addContent()` - Agregar contenido HTML
  - [ ] Método `generate()` - Generar PDF final
- [ ] Testing: Generar PDF básico con texto simple

### API Route Base
- [ ] Crear `app/api/guia-servicio/generate-pdf/route.ts`
  - [ ] Verificar autenticación con NextAuth
  - [ ] Leer archivo markdown source
  - [ ] Llamar a PDFBuilder
  - [ ] Retornar PDF como blob
- [ ] Testing: Endpoint responde correctamente para usuarios autenticados
- [ ] Testing: Endpoint rechaza usuarios no autenticados

### Componente Frontend
- [ ] Actualizar `app/guia-integral/page.tsx`
  - [ ] Agregar botón "Descargar Guía PDF"
  - [ ] Verificar autenticación antes de mostrar botón
  - [ ] Implementar loading state
  - [ ] Manejar descarga del PDF
  - [ ] Mostrar toast de confirmación
- [ ] Testing: Flujo completo de descarga funciona

**Entregable Fase 1:** PDF básico funcional con contenido de markdown

---

## FASE 2: DISEÑO Y ESTILOS (Semana 2)

### Sistema de Estilos
- [ ] Crear `lib/pdf/pdf-styles.ts`
  - [ ] Definir colores de marca (Dark Steel, Orange, Blue)
  - [ ] Definir tipografías (Montserrat, Inter)
  - [ ] Definir estilos de headers (H1, H2, H3)
  - [ ] Definir estilos de body text
  - [ ] Definir estilos de tablas
  - [ ] Definir estilos de recuadros
- [ ] Testing: Verificar colores y tipografías correctas

### Aplicación de Estilos
- [ ] Actualizar `lib/pdf/pdf-builder.ts`
  - [ ] Método `applyHeaderStyle()` - Headers de sección
  - [ ] Método `applyBodyStyle()` - Texto cuerpo
  - [ ] Método `applyTableStyle()` - Estilizar tablas
  - [ ] Método `applyHighlightBox()` - Recuadros destacados
- [ ] Testing: Estilos se aplican correctamente

### Headers de Sección
- [ ] Implementar diseño de headers
  - [ ] Fondo con gradiente Dark Steel → Blue
  - [ ] Texto Montserrat Bold, White
  - [ ] Borde inferior Orange
  - [ ] Altura consistente (30-40px)
- [ ] Testing: Headers se ven correctamente en PDF

### Recuadros Destacados
- [ ] Implementar diseño de recuadros
  - [ ] Fondo rgba(255, 122, 0, 0.1)
  - [ ] Borde Orange 2px
  - [ ] Border-radius 8px
  - [ ] Padding 16px
  - [ ] Icono opcional
- [ ] Testing: Recuadros se renderizan correctamente

### Estilización de Tablas
- [ ] Implementar diseño de tablas
  - [ ] Header: Fondo Blue, texto White
  - [ ] Filas alternadas: Dark Steel / Light Steel
  - [ ] Bordes: 1px Steel Gray
  - [ ] Padding celda: 8px
- [ ] Testing: Tablas se ven profesionales

**Entregable Fase 2:** PDF con diseño completo de marca aplicado

---

## FASE 3: ELEMENTOS VISUALES (Semana 3)

### Generación de Gráficos
- [ ] Crear `lib/pdf/pdf-charts.ts`
  - [ ] Función `generateComplianceChart()` - Gráfico de compliance
  - [ ] Función `generateMetricsChart()` - Métricas de casos de éxito
  - [ ] Función `generatePackageComparison()` - Comparación de paquetes
  - [ ] Integrar Chart.js o Recharts
  - [ ] Convertir canvas a imagen base64
- [ ] Testing: Gráficos se generan correctamente

### Infografías
- [ ] Crear/obtener infografías pre-generadas
  - [ ] "El Viaje del Cliente"
  - [ ] "Nuestros Valores"
  - [ ] "Ecosistema WeldTech"
  - [ ] "Índice de Compliance"
  - [ ] "Proceso de Implementación"
- [ ] Integrar infografías en PDF
  - [ ] Función para agregar imagen en posición específica
  - [ ] Ajustar tamaño según ancho de página
- [ ] Testing: Infografías se muestran correctamente

### Diagramas de Flujo
- [ ] Crear diagramas de flujo
  - [ ] Flujo de trabajo típico (Sección 6)
  - [ ] Proceso de onboarding (Sección 8)
- [ ] Integrar diagramas en PDF
- [ ] Testing: Diagramas se renderizan correctamente

### Portada Mejorada
- [ ] Diseñar portada profesional
  - [ ] Logo WeldTech centrado (200x80px)
  - [ ] Título grande y destacado
  - [ ] Información del usuario
  - [ ] Fecha de generación
  - [ ] Código QR (esquina inferior derecha)
  - [ ] Fondo con gradiente Dark Steel → Blue
- [ ] Testing: Portada se ve profesional

### Tabla de Contenidos
- [ ] Implementar tabla de contenidos
  - [ ] Lista de secciones con números de página
  - [ ] Iconos por sección
  - [ ] Enlaces internos (si el PDF lo soporta)
- [ ] Testing: Tabla de contenidos es navegable

**Entregable Fase 3:** PDF con elementos visuales completos

---

## FASE 4: OPTIMIZACIÓN Y REFINAMIENTO (Semana 4)

### Optimización de Tamaño
- [ ] Comprimir imágenes grandes
  - [ ] Reducir calidad a 85% para imágenes grandes
  - [ ] Optimizar formato (PNG vs JPEG)
- [ ] Optimizar fuentes
  - [ ] Usar solo fuentes necesarias
  - [ ] Considerar subset de fuentes
- [ ] Limpiar metadata innecesaria
- [ ] Testing: Tamaño de archivo < 10 MB

### Optimización de Rendimiento
- [ ] Implementar caché de elementos estáticos
  - [ ] Logos
  - [ ] Infografías pre-generadas
- [ ] Paralelizar generación de gráficos
- [ ] Optimizar procesamiento de markdown
- [ ] Testing: Tiempo de generación < 5 segundos

### Metadata Completa
- [ ] Agregar metadata al PDF
  - [ ] Título
  - [ ] Autor
  - [ ] Subject
  - [ ] Keywords
  - [ ] Creator
  - [ ] Producer
- [ ] Testing: Metadata se muestra correctamente en lectores PDF

### Tracking de Descargas
- [ ] Integrar tracking en API route
  - [ ] Registrar descarga en base de datos
  - [ ] Incluir userId, userEmail, timestamp
  - [ ] Incluir metadata del PDF (versión, tamaño)
- [ ] Testing: Tracking funciona correctamente

### Testing Completo
- [ ] Testing unitario
  - [ ] Procesamiento de markdown
  - [ ] Aplicación de estilos
  - [ ] Generación de gráficos
- [ ] Testing de integración
  - [ ] Flujo completo de generación
  - [ ] Autenticación y autorización
  - [ ] Tracking de descargas
- [ ] Testing de usuario
  - [ ] Descarga exitosa
  - [ ] Calidad visual del PDF
  - [ ] Compatibilidad con lectores PDF (Adobe, Chrome, etc.)
- [ ] Testing de rendimiento
  - [ ] Tiempo de generación
  - [ ] Tamaño de archivo
  - [ ] Uso de memoria

### Documentación
- [ ] Documentar código
  - [ ] Comentarios en funciones principales
  - [ ] JSDoc para funciones públicas
- [ ] Crear guía de uso
  - [ ] Cómo usar el sistema
  - [ ] Cómo agregar nuevas secciones
  - [ ] Cómo modificar estilos
- [ ] Actualizar README si es necesario

**Entregable Fase 4:** PDF optimizado y listo para producción

---

## VALIDACIÓN FINAL

### Checklist de Calidad
- [ ] PDF se genera correctamente para usuarios autenticados
- [ ] Contenido completo y preciso del markdown
- [ ] Diseño aplicado correctamente según manual de marca
- [ ] Elementos visuales (gráficos, infografías) se renderizan correctamente
- [ ] Metadata completa y correcta
- [ ] Tiempo de generación < 5 segundos
- [ ] Tamaño de archivo < 10 MB
- [ ] Compatible con lectores PDF estándar
- [ ] Tracking de descargas funcionando
- [ ] Sin errores en consola
- [ ] Sin warnings críticos

### Checklist de Experiencia de Usuario
- [ ] Botón de descarga visible y accesible
- [ ] Loading state claro durante generación
- [ ] Descarga fluida
- [ ] PDF útil y valioso para el usuario
- [ ] Diseño profesional y atractivo
- [ ] Legibilidad en todos los elementos
- [ ] Navegación clara (tabla de contenidos)

### Checklist de Marca
- [ ] Colores correctos (Dark Steel, Orange, Blue)
- [ ] Tipografías correctas (Montserrat, Inter)
- [ ] Logo correctamente aplicado
- [ ] Coherencia visual en todo el documento
- [ ] Elementos de marca consistentes

---

## DEPLOYMENT

### Pre-Deployment
- [ ] Revisar todos los tests
- [ ] Verificar que no hay errores en producción
- [ ] Optimizar assets para producción
- [ ] Verificar variables de entorno

### Deployment
- [ ] Deploy a staging
- [ ] Testing en staging
- [ ] Deploy a producción
- [ ] Verificar funcionamiento en producción

### Post-Deployment
- [ ] Monitorear logs de errores
- [ ] Monitorear métricas de descarga
- [ ] Recopilar feedback de usuarios
- [ ] Ajustes según feedback

---

## NOTAS

- Marcar cada tarea como completada cuando se termine
- Agregar notas si hay problemas o cambios de plan
- Actualizar este checklist si se agregan nuevas tareas
- Revisar este checklist al final de cada fase

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025  
**Estado:** Pendiente de Inicio

