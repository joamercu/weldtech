# ✅ Checklist de Ejecución - Plantillas Profesionales

## 📅 Cronograma de 6 Semanas

---

## 🔧 Preparación (Día 1)

### Setup del Entorno
- [ ] Crear estructura de carpetas (`public/templates/source`, `preview`, `guides`)
- [ ] Instalar dependencias NPM (`xlsx`, `exceljs`, `pdf-lib`, `file-saver`)
- [ ] Verificar instalación de dependencias
- [ ] Crear archivo `lib/excel-handler.ts`
- [ ] Git commit: "chore: Setup templates infrastructure"

---

## 📋 Semana 1: Plantilla WPS (7 días)

### Día 1-2: Diseño de WPS
- [ ] Crear archivo `WPS_Template_v1.0.xlsx`
- [ ] Diseñar hoja "Portada" (logo, campos básicos)
- [ ] Diseñar hoja "Variables_Soldadura" (proceso, materiales, posiciones)
- [ ] Diseñar hoja "Parametros_Electricos" (corriente, voltaje, velocidad)
- [ ] Diseñar hoja "Tecnica_Soldadura" (secuencia, limpieza, gas)
- [ ] Diseñar hoja "Tratamiento_Termico" (PWHT, temperaturas)
- [ ] Diseñar hoja "Rangos_Cualificados" (espesores, diámetros)

### Día 3-4: Funcionalidades de WPS
- [ ] Crear hoja oculta "DataLists" con datos de dropdowns
- [ ] Agregar P-Numbers (ASME IX QW-420) a DataLists
- [ ] Agregar F-Numbers (ASME IX QW-432) a DataLists
- [ ] Agregar procesos de soldadura a DataLists
- [ ] Agregar posiciones AWS/ASME a DataLists
- [ ] Aplicar validación de datos (dropdowns) en celdas
- [ ] Crear fórmula de Heat Input: `=(C*V*60)/(1000*S*10)`
- [ ] Aplicar formato condicional (alerta HI > 2.5 kJ/mm)
- [ ] Proteger hojas (solo celdas editables desbloqueadas)
- [ ] Ocultar hoja "DataLists"

### Día 5: Testing de WPS
- [ ] Probar todos los dropdowns (seleccionar cada opción)
- [ ] Probar cálculo de Heat Input (3 casos de prueba)
- [ ] Probar formato condicional (HI alto → rojo)
- [ ] Probar protección de hoja (intentar editar celda bloqueada)
- [ ] Testear inserción de logo (reemplazar imagen)
- [ ] Testear impresión (PDF de prueba)
- [ ] Testear en Excel 2016, 2019, Microsoft 365
- [ ] Testear en LibreOffice Calc (documentar limitaciones)
- [ ] Corregir errores encontrados

### Día 6-7: Generación de Preview PDF de WPS
- [ ] Llenar WPS con datos de ejemplo realistas
- [ ] Exportar a PDF desde Excel (Archivo → Guardar como → PDF)
- [ ] Aplicar marca de agua manualmente (usando Adobe/Canva) o
- [ ] Crear script de generación automática (Node.js + `pdf-lib`)
- [ ] Guardar como `WPS_Template_Preview.pdf` en `public/templates/preview/`
- [ ] Verificar que marca de agua es visible pero no obstructiva
- [ ] Guardar WPS Excel limpio (sin datos ejemplo) en `public/templates/source/`

---

## 📊 Semana 2: Plantilla PQR (7 días)

### Día 8-9: Diseño de PQR
- [ ] Duplicar `WPS_Template_v1.0.xlsx` → `PQR_Template_v1.0.xlsx`
- [ ] Modificar portada (título → "PROCEDURE QUALIFICATION RECORD")
- [ ] Diseñar hoja "Datos_Generales" (PQR#, WPS soportado, fecha)
- [ ] Diseñar hoja "Variables_AsWelded" (proceso real, materiales reales)
- [ ] Diseñar hoja "Parametros_Reales" (tabla de pasadas)
- [ ] Diseñar hoja "Ensayos_Mecanicos" (tracción, doblado, dureza, impacto)
- [ ] Diseñar hoja "Resultados_Visuales" (placeholders para fotos)
- [ ] Diseñar hoja "Verificacion_Rangos" (comparación vs código)

### Día 10-11: Funcionalidades de PQR
- [ ] Crear tabla de pasadas (columnas: Pasada, I, V, Velocidad, HI)
- [ ] Agregar fórmula de HI en cada fila de la tabla
- [ ] Crear sección de ensayo de tracción (UTS, YS, % elongación)
- [ ] Agregar fórmula de % elongación: `=(Lf-Li)/Li*100`
- [ ] Crear sección de ensayo de doblado (tipo, resultado Pass/Fail)
- [ ] Crear sección de dureza (tabla BM-HAZ-WM, gráfico de perfil)
- [ ] Crear checklist de ensayos requeridos (checkboxes según código)
- [ ] Crear sección de verificación de rangos (fórmulas IF de cumplimiento)
- [ ] Aplicar formato condicional (COMPLIANT=verde, NON-COMPLIANT=rojo)
- [ ] Proteger hojas

### Día 12: Testing de PQR
- [ ] Probar cálculo de HI en tabla de pasadas (3 pasadas ejemplo)
- [ ] Probar cálculo de % elongación
- [ ] Probar validación de criterios ASME IX QW-153
- [ ] Probar gráfico de dureza (insertar datos → ver gráfico)
- [ ] Probar formato condicional de cumplimiento
- [ ] Testear inserción de fotos (macro, fracture)
- [ ] Corregir errores encontrados

### Día 13-14: Preview PDF de PQR
- [ ] Llenar PQR con datos de ejemplo
- [ ] Exportar a PDF y aplicar marca de agua
- [ ] Guardar como `PQR_Template_Preview.pdf`
- [ ] Guardar PQR Excel limpio en `source/`

---

## 👷 Semana 3: Plantilla WPQ (7 días)

### Día 15-16: Diseño de WPQ
- [ ] Crear `WPQ_Template_v1.0.xlsx` desde cero
- [ ] Diseñar hoja "Datos_Soldador" (nombre, ID, stamp, foto)
- [ ] Diseñar hoja "Datos_Prueba" (WPQ#, WPS usado, fechas)
- [ ] Diseñar hoja "Parametros_Usados" (junta, espesor, diámetro)
- [ ] Diseñar hoja "Rangos_Cualificados" (auto-cálculo)
- [ ] Diseñar hoja "Resultados_Ensayos" (VT, bend, fracture, RT)
- [ ] Diseñar hoja "Continuidad" (última fecha soldadura, estado)
- [ ] Diseñar hoja "Firmas" (soldador, inspector, fecha)

### Día 17-18: Funcionalidades de WPQ
- [ ] Crear fórmula de cálculo de espesor cualificado (según QW-451.1)
  - Ejemplo: Si probó 10mm → cualifica 5mm a 20mm
- [ ] Crear fórmula de cálculo de diámetro cualificado (según QW-452.1)
- [ ] Crear tabla de posiciones cualificadas (según QW-461.3)
- [ ] Agregar cálculo de días desde última soldadura: `=HOY()-B10`
- [ ] Crear alerta de continuidad (si >180 días → VENCIDO en rojo)
- [ ] Aplicar formato condicional:
  - VIGENTE (verde): <150 días
  - POR VENCER (amarillo): 150-180 días
  - VENCIDO (rojo): >180 días
- [ ] Agregar placeholder para foto del soldador
- [ ] Proteger hojas

### Día 19: Testing de WPQ
- [ ] Probar cálculo de rangos cualificados (3 casos de prueba)
- [ ] Probar alerta de continuidad (casos: vigente, por vencer, vencido)
- [ ] Probar formato condicional de estado
- [ ] Testear inserción de foto de soldador
- [ ] Corregir errores encontrados

### Día 20-21: Preview PDF de WPQ
- [ ] Llenar WPQ con datos de ejemplo
- [ ] Exportar a PDF y aplicar marca de agua
- [ ] Guardar como `WPQ_Template_Preview.pdf`
- [ ] Guardar WPQ Excel limpio en `source/`

---

## ✅ Semana 4: Checklist de Auditoría (7 días)

### Día 22-23: Diseño de Checklist
- [ ] Crear `Checklist_Auditoria_v1.0.xlsx`
- [ ] Diseñar hoja "Info_Auditoria" (empresa, sitio, fecha, auditor)
- [ ] Diseñar hoja "Documentacion" (15 items)
- [ ] Diseñar hoja "Cualificacion_Soldadores" (12 items)
- [ ] Diseñar hoja "Equipos_Calibracion" (8 items)
- [ ] Diseñar hoja "Materiales" (7 items)
- [ ] Diseñar hoja "Ejecucion_Soldadura" (10 items)
- [ ] Diseñar hoja "Inspeccion_Ensayos" (8 items)
- [ ] Diseñar hoja "Dashboard" (resumen visual)
- [ ] Diseñar hoja "Plan_Accion" (no conformidades)

### Día 24-25: Funcionalidades de Checklist
- [ ] Agregar dropdown en cada item: Compliant / Minor / Major / N/A
- [ ] Aplicar formato condicional por estado:
  - Compliant → Verde
  - Minor → Amarillo
  - Major → Rojo
  - N/A → Gris
- [ ] Crear fórmula de auto-scoring:
  - `% Compliance = (Compliant + N/A) / Total * 100`
- [ ] Crear gráfico circular: distribución de estados
- [ ] Crear gráfico de barras: % compliance por sección
- [ ] Crear indicador de estado general:
  - >90% → APROBADO (verde)
  - 70-90% → CON OBSERVACIONES (amarillo)
  - <70% → NO APROBADO (rojo)
- [ ] Crear tabla de plan de acción (item, acción, responsable, fecha)
- [ ] Agregar filtros avanzados (por sección, por estado)
- [ ] Proteger hojas

### Día 26: Testing de Checklist
- [ ] Probar todos los dropdowns (60 items)
- [ ] Probar formato condicional (cambiar estados → ver colores)
- [ ] Probar auto-scoring (verificar % calculado correctamente)
- [ ] Probar gráficos (cambiar datos → ver actualización de charts)
- [ ] Probar filtros avanzados
- [ ] Corregir errores encontrados

### Día 27-28: Preview PDF de Checklist
- [ ] Llenar Checklist con datos de ejemplo (mix de estados)
- [ ] Exportar a PDF y aplicar marca de agua
- [ ] Guardar como `Checklist_Auditoria_Preview.pdf`
- [ ] Guardar Checklist Excel limpio en `source/`

---

## 🔗 Semana 5: Matriz de Trazabilidad (7 días)

### Día 29-30: Diseño de Matriz
- [ ] Crear `Matriz_Trazabilidad_v1.0.xlsx`
- [ ] Diseñar hoja "BD_WPS" (base de datos de WPS)
- [ ] Diseñar hoja "BD_PQR" (base de datos de PQR)
- [ ] Diseñar hoja "BD_WPQ" (base de datos de WPQ)
- [ ] Diseñar hoja "BD_Soldadores" (base de datos de soldadores)
- [ ] Diseñar hoja "Matriz_Visual" (tabla relacional)
- [ ] Diseñar hoja "Dashboard" (KPIs, gráficos, alertas)

### Día 31-32: Funcionalidades de Matriz
- [ ] Crear dropdowns en BD_WPS (proceso, material, posición)
- [ ] Agregar validación de IDs únicos (no duplicados)
- [ ] Crear fórmulas VLOOKUP para relacionar PQR ↔ WPS
- [ ] Crear fórmulas VLOOKUP para relacionar WPQ ↔ WPS
- [ ] Crear fórmulas VLOOKUP para relacionar Soldadores ↔ WPQ
- [ ] En "Matriz_Visual": tabla con checks (✓/✗) de relaciones
- [ ] Aplicar formato condicional:
  - Relación completa y vigente → Verde
  - Relación por vencer → Amarillo
  - Falta relación o vencido → Rojo
- [ ] Crear KPIs en Dashboard:
  - Total WPS activos
  - Total PQRs aprobados
  - Total WPQs vigentes
  - Total soldadores aptos
- [ ] Crear gráficos:
  - WPS por proceso (pie chart)
  - WPQs por estado (bar chart)
  - Soldadores por proceso (bar chart)
- [ ] Crear alertas automáticas:
  - ⚠️ WPS sin PQR soporte
  - ⚠️ WPQ próximos a vencer (<30 días)
  - ⚠️ WPQ vencidos (>6 meses)
  - ⚠️ Soldadores sin WPQ vigente
- [ ] Agregar filtros avanzados (por proceso, material, estado)
- [ ] Proteger hojas

### Día 33: Testing de Matriz
- [ ] Agregar 3 WPS de ejemplo (diferentes procesos)
- [ ] Agregar 5 PQR de ejemplo (algunos soportando WPS)
- [ ] Agregar 10 WPQ de ejemplo (diferentes estados)
- [ ] Agregar 8 soldadores de ejemplo
- [ ] Verificar que relaciones VLOOKUP funcionan
- [ ] Verificar que matriz visual muestra checks correctamente
- [ ] Verificar que alertas se generan automáticamente
- [ ] Probar filtros avanzados
- [ ] Corregir errores encontrados

### Día 34-35: Preview PDF de Matriz
- [ ] Con datos de ejemplo cargados, exportar hoja "Dashboard" a PDF
- [ ] Aplicar marca de agua
- [ ] Guardar como `Matriz_Trazabilidad_Preview.pdf`
- [ ] Limpiar datos de ejemplo
- [ ] Guardar Matriz Excel limpia en `source/`

---

## 🖥️ Semana 6: Backend y Frontend (7 días)

### Día 36: Backend - Excel Handler
- [ ] Crear `lib/excel-handler.ts` (si no existe)
- [ ] Implementar función `getTemplatePath()`
- [ ] Implementar función `getPreviewPath()`
- [ ] Implementar función `templateExists()`
- [ ] Implementar función `previewExists()`
- [ ] Implementar función `readTemplate()`
- [ ] Implementar función `readPreview()`
- [ ] Implementar función `getTemplateInfo()`
- [ ] Implementar función `getAllTemplates()`
- [ ] Testear cada función (console.log)

### Día 37: Backend - API de Descarga
- [ ] Crear `app/api/templates/download/route.ts`
- [ ] Implementar lógica de autenticación (getServerSession)
- [ ] Implementar lógica para usuarios NO registrados (PDF)
- [ ] Implementar lógica para usuarios registrados (Excel)
- [ ] Implementar tracking de descargas (`trackDownload`)
- [ ] Configurar headers HTTP correctos
- [ ] Testear endpoint con Postman/Thunder Client:
  - Sin sesión → retorna PDF
  - Con sesión → retorna Excel

### Día 38: Frontend - Actualización de Página
- [ ] Abrir `app/components/plantillas-page.tsx`
- [ ] Agregar hook `useSession()` de NextAuth
- [ ] Implementar función `handleDownload(templateId)`
- [ ] Actualizar botones de descarga en tarjetas:
  - Usuario NO registrado → "Descargar Vista Previa (PDF)"
  - Usuario registrado → "Descargar Excel Editable"
- [ ] Agregar badges de estado:
  - Usuario NO registrado → "🔒 Regístrate para obtener versión Excel"
  - Usuario registrado → "✓ Sin marca de agua • Completamente editable"
- [ ] Agregar toasts de notificación (usar librería `sonner`)
- [ ] Testear en navegador:
  - Descargar sin sesión → PDF descargado
  - Registrarse → Descargar con sesión → Excel descargado

### Día 39: Guías de Uso
- [ ] Crear guía de uso para WPS (PDF, 3-5 páginas)
- [ ] Crear guía de uso para PQR (PDF, 3-5 páginas)
- [ ] Crear guía de uso para WPQ (PDF, 3-5 páginas)
- [ ] Crear guía de uso para Checklist (PDF, 3-5 páginas)
- [ ] Crear guía de uso para Matriz (PDF, 3-5 páginas)
- [ ] Crear guía general del pack (PDF, 10-12 páginas)
- [ ] Guardar todas en `public/templates/guides/`
- [ ] Agregar enlaces de descarga de guías en página de plantillas

### Día 40: Testing Integral
- [ ] Testing de plantillas Excel (5 plantillas):
  - [ ] Fórmulas funcionan
  - [ ] Dropdowns funcionan
  - [ ] Formato condicional funciona
  - [ ] Protección de hojas activa
  - [ ] Compatible con Excel 2016, 2019, Microsoft 365
- [ ] Testing de sistema de descarga:
  - [ ] Usuario NO registrado → PDF con marca de agua ✓
  - [ ] Usuario registrado → Excel sin marca de agua ✓
  - [ ] Tracking registra descargas ✓
  - [ ] Nombres de archivo correctos ✓
- [ ] Testing de frontend:
  - [ ] Botones funcionan
  - [ ] Badges se muestran correctamente
  - [ ] Toasts funcionan
  - [ ] Responsive (móvil, tablet, desktop)
- [ ] Corregir bugs encontrados

### Día 41-42: Lanzamiento
- [ ] Verificación final (todos los archivos en su lugar)
- [ ] Deploy a producción:
  ```bash
  git add .
  git commit -m "feat: Launch professional templates system"
  git push origin main
  ```
- [ ] Verificar en URL de producción
- [ ] Anuncio en redes sociales:
  - [ ] Post en LinkedIn
  - [ ] Post en Instagram
  - [ ] Compartir en grupos de Facebook
- [ ] Email a usuarios existentes (si aplica)
- [ ] Publicar artículo de blog
- [ ] Publicar video en YouTube (opcional)

---

## 📊 Post-Lanzamiento (Semana 7+)

### Monitoreo (Primera Semana)
- [ ] Monitorear descargas diarias (revisar base de datos)
- [ ] Revisar feedback de usuarios (emails, comentarios)
- [ ] Corregir bugs reportados urgentes
- [ ] Responder preguntas de soporte
- [ ] Documentar problemas comunes en FAQ

### Optimización (Semana 2-4)
- [ ] Analizar métricas:
  - [ ] Total descargas PDF vs Excel
  - [ ] Tasa de conversión (PDF → registro → Excel)
  - [ ] Plantilla más descargada
- [ ] Implementar mejoras basadas en feedback
- [ ] Crear contenido adicional (blog posts, videos)
- [ ] Optimizar SEO de página de plantillas
- [ ] Configurar email automation (seguimiento a usuarios)

---

## 🎯 Métricas de Éxito

### Mes 1
- [ ] 100+ descargas PDF (usuarios no registrados)
- [ ] 50+ descargas Excel (usuarios registrados)
- [ ] Tasa de conversión >30% (PDF → registro)
- [ ] 0 bugs críticos reportados

### Mes 3
- [ ] 500+ descargas PDF
- [ ] 300+ descargas Excel
- [ ] Tasa de conversión >40%
- [ ] NPS >50

### Mes 6
- [ ] 1,500+ descargas PDF
- [ ] 1,000+ descargas Excel
- [ ] Tasa de conversión >50%
- [ ] NPS >70

---

## 🚨 Alertas y Triggers

### Alertas de Progreso
- Si llevas >10 días en una plantilla → Reevaluar complejidad o pedir ayuda
- Si tasa de conversión <20% en Mes 1 → Mejorar CTA y mensajes de valor
- Si bugs críticos >3 en primera semana → Hacer hotfix inmediato

### Triggers de Escalación
- Bug que impide descargas → Prioridad máxima, resolver en <4 horas
- Usuarios reportan datos incorrectos en fórmulas → Validar y corregir en <24h
- Plantillas no abren en Excel → Investigar compatibilidad en <24h

---

## 📞 Contacto y Soporte

**En caso de bloqueo o dudas:**
- Revisar [GUIA_IMPLEMENTACION_PLANTILLAS.md](./GUIA_IMPLEMENTACION_PLANTILLAS.md)
- Revisar [PLAN_PLANTILLAS_PROFESIONALES.md](./PLAN_PLANTILLAS_PROFESIONALES.md)
- Contactar equipo técnico: dev@weldtech.solutions
- WhatsApp: +57 313 369 1591

---

**¡Adelante con el proyecto! Cada check es un paso hacia el éxito.** ✅🚀

