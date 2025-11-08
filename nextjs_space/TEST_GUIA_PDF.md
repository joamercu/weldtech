# Test de Funcionalidad: Descarga de Guía PDF

**Fecha:** Noviembre 2025  
**Objetivo:** Verificar que el botón de descarga de PDF funcione correctamente

---

## 🧪 Pruebas a Realizar

### Test 1: Verificación de Componentes

#### 1.1 Verificar que el botón esté visible
- [ ] El botón "Descargar Guía Completa (PDF)" está visible en la página `/guia-integral`
- [ ] El botón tiene el estilo correcto (gradiente naranja)
- [ ] El botón muestra el icono de descarga

#### 1.2 Verificar estado de carga
- [ ] Al hacer clic, el botón muestra spinner de carga
- [ ] El texto cambia a "Generando PDF..."
- [ ] El botón se deshabilita durante la generación

#### 1.3 Verificar notificaciones
- [ ] Se muestra toast de "Generando PDF..." al iniciar
- [ ] Se muestra toast de éxito al completar
- [ ] Se muestra toast de error si falla

---

### Test 2: Funcionalidad del Botón

#### 2.1 Flujo de descarga exitosa
1. Iniciar sesión como usuario registrado
2. Navegar a `/guia-integral`
3. Hacer clic en "Descargar Guía Completa (PDF)"
4. Verificar:
   - [ ] Toast de "Generando PDF..." aparece
   - [ ] Botón muestra spinner
   - [ ] Después de unos segundos, el PDF se descarga
   - [ ] Toast de éxito aparece
   - [ ] El archivo descargado es un PDF válido

#### 2.2 Verificar archivo descargado
- [ ] El nombre del archivo es: `Guia_Integral_Servicios_WeldTech_YYYY-MM-DD.pdf`
- [ ] El archivo se puede abrir en un lector PDF (Adobe, Chrome, etc.)
- [ ] El PDF contiene:
  - [ ] Portada con logo y título
  - [ ] Información del usuario
  - [ ] Tabla de contenidos
  - [ ] Contenido del markdown

#### 2.3 Verificar autenticación
- [ ] Usuario no autenticado NO puede acceder a `/guia-integral`
- [ ] Usuario no autenticado es redirigido a `/auth/login`
- [ ] Solo usuarios autenticados pueden descargar el PDF

---

### Test 3: API Route

#### 3.1 Verificar endpoint
- [ ] El endpoint `/api/guia-servicio/generate-pdf` existe
- [ ] El endpoint requiere autenticación
- [ ] El endpoint retorna PDF con headers correctos:
  - [ ] `Content-Type: application/pdf`
  - [ ] `Content-Disposition: attachment; filename="..."`
  - [ ] `Content-Length: ...`

#### 3.2 Verificar errores
- [ ] Usuario no autenticado recibe 401
- [ ] Errores se manejan correctamente
- [ ] Mensajes de error son claros

---

### Test 4: Rendimiento

#### 4.1 Tiempo de generación
- [ ] El PDF se genera en menos de 5 segundos
- [ ] El tiempo de generación es aceptable para el usuario

#### 4.2 Tamaño del archivo
- [ ] El PDF tiene un tamaño razonable (< 10 MB)
- [ ] El archivo no es demasiado grande para descargar

---

## 🚀 Cómo Ejecutar las Pruebas

### Prueba Manual (Recomendada)

1. **Iniciar el servidor de desarrollo:**
   ```bash
   cd nextjs_space
   npm run dev
   ```

2. **Abrir el navegador:**
   - Ir a `http://localhost:3000`
   - Iniciar sesión como usuario registrado

3. **Navegar a la guía:**
   - Ir a `http://localhost:3000/guia-integral`

4. **Probar el botón:**
   - Hacer clic en "Descargar Guía Completa (PDF)"
   - Observar el comportamiento
   - Verificar que el PDF se descarga correctamente

### Prueba Automatizada (Script)

Ejecutar el script de prueba:

```bash
cd nextjs_space
npx tsx scripts/test-pdf-generation.ts
```

Este script:
- Verifica que el archivo markdown existe
- Genera un PDF de prueba
- Verifica que el PDF es válido
- Guarda el PDF en `test-guia-servicio.pdf`
- Muestra métricas de rendimiento

---

## ✅ Checklist de Validación

### Funcionalidad
- [ ] Botón visible y accesible
- [ ] Estado de carga funciona correctamente
- [ ] Descarga de PDF funciona
- [ ] PDF generado es válido
- [ ] Autenticación requerida funciona

### Experiencia de Usuario
- [ ] Feedback visual claro (toast, spinner)
- [ ] Tiempo de generación aceptable
- [ ] Mensajes de error claros
- [ ] Descarga fluida

### Calidad del PDF
- [ ] Portada correcta
- [ ] Contenido completo
- [ ] Metadata correcta
- [ ] Tamaño razonable
- [ ] Compatible con lectores PDF estándar

---

## 🐛 Problemas Conocidos

### Si el PDF no se genera:
1. Verificar que el archivo markdown existe en `docs/GUIA_INTEGRAL_WELDTECH.md`
2. Verificar que las dependencias están instaladas:
   ```bash
   npm install marked isomorphic-dompurify
   ```
3. Verificar logs del servidor para errores

### Si el botón no funciona:
1. Verificar que el usuario está autenticado
2. Verificar la consola del navegador para errores
3. Verificar que el endpoint API está accesible

### Si el PDF está vacío o corrupto:
1. Verificar que el markdown se procesa correctamente
2. Verificar que jsPDF está funcionando
3. Revisar logs del servidor

---

## 📊 Resultados Esperados

### Éxito
- ✅ PDF se genera correctamente
- ✅ Tiempo de generación < 5 segundos
- ✅ Tamaño de archivo < 10 MB
- ✅ PDF válido y legible
- ✅ Tracking de descarga funciona

### Métricas
- **Tiempo de generación:** < 5 segundos
- **Tamaño del PDF:** < 10 MB
- **Tasa de éxito:** 100% para usuarios autenticados
- **Tasa de error:** 0% para usuarios autenticados

---

## 📝 Notas

- El PDF se genera dinámicamente desde el markdown
- Solo usuarios autenticados pueden descargar
- El tracking de descargas se registra en la base de datos
- El PDF incluye información personalizada del usuario

---

**Versión:** 1.0  
**Fecha:** Noviembre 2025

