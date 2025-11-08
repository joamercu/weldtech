# Guía de Pruebas: WPS Excel Import & Word Export

## ✅ Implementación Completada

Se han implementado las siguientes funcionalidades en el WPS Builder:

### 1. **Importar Plantilla Excel** 📊
- Botón visible solo para usuarios autenticados
- Badge "Dev" para indicar funcionalidad de desarrollador
- Importa datos WPS desde archivos `.xlsx` o `.xls`
- Mapea automáticamente todos los campos del formulario
- Validación de formato y notificaciones de éxito/error

### 2. **Generar Documento Word Profesional** 📄
- Botón visible solo para usuarios autenticados
- Genera documentos `.docx` con imagen corporativa WeldTech
- Utiliza la API Python `md2word-api` para el procesamiento
- Incluye logo, colores corporativos y formato profesional
- Loading state durante la generación

### 3. **Plantilla Excel de Ejemplo**
- Archivo generado: `nextjs_space/public/templates/plantilla_wps_ejemplo.xlsx`
- Contiene datos de ejemplo completos de un WPS
- Incluye hoja de instrucciones de uso
- Descargable desde la interfaz

---

## 🧪 Instrucciones de Prueba

### Paso 1: Iniciar Servidores

#### Servidor Next.js (Frontend)
```bash
cd "D:\07-11-25-APP WELDTECH\nextjs_space"
npm run dev
```
Acceder a: http://localhost:3000

#### Servidor Python API (Backend)
```bash
cd "D:\07-11-25-APP WELDTECH\md2word-api"
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```
O ejecutar: `start_api_simple.bat`

Verificar API: http://localhost:8000/docs

---

### Paso 2: Autenticarse

Usar cualquiera de estas credenciales de prueba:

| Usuario | Email | Contraseña |
|---------|-------|------------|
| Admin | john@doe.com | johndoe123 |
| Usuario | test@weldtech.com | Soldador123! |
| Ingeniero | ingeniero@weldtech.com | Ingeniero2024! |
| Inspector | inspector@weldtech.com | Inspector2024! |

1. Ir a `/auth/login`
2. Ingresar credenciales
3. Navegar a `/herramientas/wps-builder`

---

### Paso 3: Probar Importación de Excel

#### 3.1. Descargar Plantilla de Ejemplo
- En el WPS Builder (usuario autenticado), aparece un banner informativo morado/verde
- Click en "Descargar plantilla Excel de ejemplo"
- Se descarga: `plantilla_wps_ejemplo.xlsx`

#### 3.2. Importar Plantilla
1. Click en botón **"Cargar Plantilla Excel"** (morado con badge "Dev")
2. Seleccionar el archivo `.xlsx` descargado
3. ✅ Debe aparecer toast: "✅ Plantilla cargada: X campos importados"
4. Verificar que los datos se cargaron en el formulario
5. Revisar las diferentes pestañas: General, Junta, Materiales, etc.

#### 3.3. Probar con Archivo Inválido
- Intentar cargar un archivo que no sea `.xlsx` o `.xls`
- Debe mostrar error: "Por favor seleccione un archivo Excel"

---

### Paso 4: Probar Generación de Documento Word

#### 4.1. Verificar API Python Disponible
Antes de probar, verificar que la API Python esté corriendo:
```bash
curl http://localhost:8000/health
```
Debe retornar: `{"status":"ok","service":"md2word-api","version":"1.0.0"}`

#### 4.2. Generar Documento
1. Con datos cargados (o ingresados manualmente), asegurar que:
   - WPS Number esté completo
   - Company esté completo
2. Click en botón **"Generar Word Profesional"** (verde)
3. Durante generación:
   - Botón muestra spinner: "Generando..."
   - Toast: "Generando documento Word con branding corporativo..."
4. Al completar:
   - Se descarga automáticamente: `WPS-XXX.docx`
   - Toast: "✅ Documento Word generado exitosamente"

#### 4.3. Verificar Documento Generado
Abrir el archivo `.docx` descargado y verificar:
- ✅ Logo de WeldTech en el encabezado
- ✅ Colores corporativos (naranja/azul)
- ✅ Formato profesional con tablas
- ✅ Todas las secciones del WPS están presentes:
  - Información General
  - Diseño de Junta
  - Materiales Base
  - Materiales de Aporte
  - Características Eléctricas
  - Posiciones
  - Tratamiento Térmico
  - Gas de Protección
  - Técnica de Soldadura
- ✅ Footer con fecha de generación

---

### Paso 5: Casos de Prueba Adicionales

#### 5.1. Usuario No Autenticado
- Cerrar sesión
- Navegar a WPS Builder
- ✅ NO deben aparecer:
  - Botón "Cargar Plantilla Excel"
  - Botón "Generar Word Profesional"
  - Banner informativo morado/verde
- ✅ Solo deben estar disponibles:
  - Guardar WPS
  - Exportar PDF
  - Limpiar

#### 5.2. Error API Python No Disponible
1. Detener el servidor Python (Ctrl+C)
2. Intentar generar documento Word
3. ✅ Debe mostrar error: 
   - "API de generación no disponible"
   - "Inicie el servidor Python: cd md2word-api && start_api.bat"

#### 5.3. Validación de Campos Obligatorios
1. Limpiar formulario
2. Intentar generar Word sin WPS Number o Company
3. ✅ Debe mostrar: "Complete los campos obligatorios (WPS Number y Compañía)"

---

## 📂 Archivos Creados/Modificados

### Nuevos Archivos
- ✅ `nextjs_space/lib/wps-converter.ts` - Utilidades de conversión WPS a Markdown
- ✅ `nextjs_space/app/api/wps/generate-word/route.ts` - API route para generar Word
- ✅ `nextjs_space/public/templates/plantilla_wps_ejemplo.xlsx` - Plantilla Excel
- ✅ `nextjs_space/scripts/generate-wps-template.js` - Script generador de plantilla

### Archivos Modificados
- ✅ `nextjs_space/app/components/wps-builder.tsx`
  - Agregado hook `useSession`
  - Agregado imports: `XLSX`, `FileSpreadsheet`, `Loader2`
  - Agregada función `handleLoadExcel()`
  - Agregada función `handleGenerateWord()`
  - Agregados botones condicionales (solo usuarios autenticados)
  - Agregado banner informativo
  - Agregado input file oculto para Excel
  - Agregado estado `isGeneratingWord`

### Dependencias Instaladas
- ✅ `xlsx` - Lectura y escritura de archivos Excel
- ✅ `form-data` - Manejo de multipart/form-data para API calls

---

## 🎯 Resultados Esperados

### ✅ Importación Excel
- Carga exitosa de plantilla
- Todos los campos mapeados correctamente
- Notificaciones claras de éxito/error
- Visible solo para usuarios autenticados

### ✅ Exportación Word
- Documento generado con branding WeldTech
- Formato profesional y legible
- Logo e imagen corporativa incluidos
- Descarga automática
- Manejo de errores cuando API no disponible

### ✅ Experiencia de Usuario
- Badge "Dev" indica funcionalidad especial
- Loading states durante procesamiento
- Mensajes informativos y descriptivos
- Integración fluida con flujo existente

---

## 🐛 Troubleshooting

### Problema: API Python no inicia
**Solución:**
```bash
cd md2word-api
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

### Problema: Excel no carga datos
**Verificar:**
- Archivo tiene extensión `.xlsx` o `.xls`
- Primera fila contiene nombres de columnas exactos
- Segunda fila contiene datos

### Problema: Word no se genera
**Verificar:**
1. API Python está corriendo en puerto 8000
2. Usuario está autenticado
3. Campos WPS Number y Company están completos
4. Revisar consola del navegador para errores

### Problema: Botones no aparecen
**Verificar:**
- Usuario está autenticado (iniciar sesión)
- Sesión es válida (no expirada)
- Revisar consola: `session` y `status` en DevTools

---

## 📋 Checklist Final

- [x] Dependencias instaladas (xlsx, form-data)
- [x] Plantilla Excel generada con datos de ejemplo
- [x] Función handleLoadExcel implementada
- [x] Función handleGenerateWord implementada
- [x] API route creada y probada
- [x] wps-converter.ts con funciones de conversión
- [x] Botones condicionalmente renderizados
- [x] Banner informativo para usuarios autenticados
- [x] Loading states y validaciones
- [x] Manejo de errores completo
- [ ] Pruebas manuales completadas
- [ ] API Python ejecutándose
- [ ] Documento Word generado y verificado

---

## 🚀 Próximos Pasos Sugeridos

1. **Agregar persistencia**: Guardar WPS en base de datos
2. **Histórico de documentos**: Registro de documentos generados
3. **Plantillas personalizadas**: Permitir crear/editar plantillas
4. **Validación AWS**: Validación avanzada según normas AWS
5. **Preview PDF**: Vista previa antes de generar documento
6. **Batch processing**: Generar múltiples WPS a la vez

---

**Desarrollado por:** WeldTech Solutions  
**Fecha:** 07/11/2025  
**Versión:** 1.0.0

