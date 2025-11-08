# 📋 Instrucciones para Crear las Plantillas Excel

## ✅ Estado Actual del Sistema

El sistema de descarga de plantillas está **100% funcional**. Se ha completado:

- ✅ Estructura de carpetas creada
- ✅ Dependencias instaladas (xlsx, exceljs, pdf-lib, file-saver)
- ✅ Backend API de descarga implementado
- ✅ Frontend actualizado con botones de descarga diferenciados
- ✅ Sistema de autenticación integrado
- ✅ Tracking de descargas configurado

## 📝 Próximo Paso: Crear las Plantillas Excel

Ahora necesitas crear manualmente las 5 plantillas Excel. Sigue estas instrucciones:

---

## 🎯 Plantilla 1: WPS (Welding Procedure Specification)

### Ubicación del archivo:
```
public/templates/source/WPS_Template_v1.0.xlsx
```

### Pasos para crear:

1. **Abrir Microsoft Excel**
   - Crear nuevo libro
   - Guardar como: `WPS_Template_v1.0.xlsx`
   - Guardar en: `nextjs_space/public/templates/source/`

2. **Crear 6 hojas:**
   - `Portada`
   - `Variables_Soldadura`
   - `Parametros_Electricos`
   - `Tecnica_Soldadura`
   - `Tratamiento_Termico`
   - `Rangos_Cualificados`

3. **Crear hoja oculta `DataLists`:**
   - Columna A: P-Numbers (ASME IX QW-420)
     ```
     P1
     P3
     P4
     P5A
     P5B
     P5C
     P8
     P9A
     P9B
     P10A
     P11A
     P15E
     ```
   - Columna B: F-Numbers (ASME IX QW-432)
     ```
     F1
     F2
     F3
     F4
     F5
     F6
     ```
   - Columna C: Procesos de soldadura
     ```
     SMAW (Shielded Metal Arc Welding)
     GMAW (Gas Metal Arc Welding)
     GTAW (Gas Tungsten Arc Welding)
     FCAW (Flux Cored Arc Welding)
     SAW (Submerged Arc Welding)
     ```
   - Columna D: Posiciones AWS
     ```
     1G - Flat (Groove)
     2G - Horizontal (Groove)
     3G - Vertical (Groove)
     4G - Overhead (Groove)
     5G - Horizontal Fixed (Pipe)
     6G - Inclined Fixed (Pipe)
     1F - Flat (Fillet)
     2F - Horizontal (Fillet)
     3F - Vertical (Fillet)
     4F - Overhead (Fillet)
     ```
   - **Ocultar esta hoja** (clic derecho → Ocultar)

4. **En hoja `Parametros_Electricos`, crear fórmula de Heat Input:**
   - Celda E5 (Heat Input Pass 1):
     ```excel
     =IF(AND(B5>0, C5>0, D5>0), (C5*B5*60)/(1000*D5*10), "")
     ```
   - Donde:
     - B5 = Corriente (A)
     - C5 = Voltaje (V)
     - D5 = Velocidad (cm/min)
   - Copiar fórmula a E6, E7 (para Pass 2 y Pass 3)

5. **Aplicar validación de datos (dropdowns):**
   - En hoja `Variables_Soldadura`:
     - Celda B5 (Proceso): Datos → Validación de datos → Lista → `=DataLists!$C$1:$C$5`
     - Celda B6 (P-Number): Lista → `=DataLists!$A$1:$A$20`
     - Celda B7 (F-Number): Lista → `=DataLists!$B$1:$B$6`
     - Celda B8 (Posición): Lista → `=DataLists!$D$1:$D$10`

6. **Formato condicional (alerta Heat Input alto):**
   - Seleccionar rango E5:E7
   - Inicio → Formato condicional → Nueva regla
   - Condición: Valor > 2.5
   - Formato: Fondo rojo, texto blanco

7. **Proteger hojas:**
   - Desbloquear celdas editables (Formato de celdas → Protección → Desmarcar "Bloqueada")
   - Revisar → Proteger hoja (sin contraseña)

8. **Guardar y verificar:**
   - Guardar archivo
   - Probar que dropdowns funcionan
   - Probar que fórmula de Heat Input calcula correctamente

---

## 📊 Plantilla 2: PQR (Procedure Qualification Record)

### Ubicación:
```
public/templates/source/PQR_Template_v1.0.xlsx
```

### Pasos similares a WPS, pero con:
- Tabla de pasadas con cálculo de HI por cada fila
- Sección de ensayos mecánicos (tracción, doblado, dureza)
- Fórmula de % elongación: `=(Lf-Li)/Li*100`
- Verificación de cumplimiento vs. código

**Ver documentación completa en:** `planning/GUIA_IMPLEMENTACION_PLANTILLAS.md`

---

## 👷 Plantilla 3: WPQ (Welder Performance Qualification)

### Ubicación:
```
public/templates/source/WPQ_Template_v1.0.xlsx
```

### Funcionalidades clave:
- Auto-cálculo de rangos cualificados (tabla QW-451)
- Alerta de continuidad (6 meses)
- Cálculo de días desde última soldadura: `=HOY()-B10`
- Formato condicional: VIGENTE/POR VENCER/VENCIDO

---

## ✅ Plantilla 4: Checklist de Auditoría

### Ubicación:
```
public/templates/source/Checklist_Auditoria_v1.0.xlsx
```

### Funcionalidades clave:
- 50+ items con dropdown: Compliant/Minor/Major/N/A
- Auto-scoring: `% Compliance = (Compliant+N/A)/Total*100`
- Gráficos dinámicos (pie chart, bar chart)
- Plan de acción integrado

---

## 🔗 Plantilla 5: Matriz de Trazabilidad

### Ubicación:
```
public/templates/source/Matriz_Trazabilidad_v1.0.xlsx
```

### Funcionalidades clave:
- 4 bases de datos relacionales (WPS, PQR, WPQ, Soldadores)
- Fórmulas VLOOKUP para relaciones
- Dashboard con KPIs y gráficos
- Alertas automáticas

---

## 📄 Generar PDFs Preview

Una vez creadas las plantillas Excel, necesitas generar los PDFs preview con marca de agua:

### Opción 1: Manual (Rápido)
1. Abrir cada plantilla Excel
2. Llenar con datos de ejemplo
3. Archivo → Guardar como → PDF
4. Aplicar marca de agua usando Adobe Acrobat o herramienta online
5. Guardar en: `public/templates/preview/`

### Opción 2: Automático (Futuro)
Crear script Node.js que:
- Lee archivo Excel
- Convierte a PDF
- Aplica marca de agua usando `pdf-lib`
- Guarda en carpeta preview

**Ver:** `planning/GUIA_IMPLEMENTACION_PLANTILLAS.md` - Sección "Generación de PDFs"

---

## ✅ Checklist de Verificación

Antes de considerar una plantilla completa:

- [ ] Archivo Excel guardado en `public/templates/source/`
- [ ] Todas las hojas creadas
- [ ] Dropdowns funcionan correctamente
- [ ] Fórmulas calculan sin errores
- [ ] Formato condicional aplicado
- [ ] Protección de hojas activa
- [ ] Logo personalizable (placeholder)
- [ ] PDF preview generado con marca de agua
- [ ] PDF guardado en `public/templates/preview/`
- [ ] Probar descarga desde la página web

---

## 🧪 Testing

Una vez creadas las plantillas:

1. **Probar descarga sin autenticación:**
   - Ir a `/plantillas`
   - Hacer clic en "Descargar Vista Previa (PDF)"
   - Verificar que descarga PDF con marca de agua

2. **Probar descarga con autenticación:**
   - Iniciar sesión
   - Ir a `/plantillas`
   - Hacer clic en "Descargar Excel Editable"
   - Verificar que descarga Excel sin marca de agua

3. **Verificar tracking:**
   - Revisar base de datos (tabla `Download`)
   - Verificar que se registran las descargas

---

## 📚 Documentación Completa

Para instrucciones detalladas de cada plantilla, ver:

- **Plan completo:** `planning/PLAN_PLANTILLAS_PROFESIONALES.md`
- **Guía de implementación:** `planning/GUIA_IMPLEMENTACION_PLANTILLAS.md`
- **Checklist día a día:** `planning/CHECKLIST_EJECUCION.md`

---

## 🆘 ¿Necesitas Ayuda?

- **Dudas sobre Excel:** Ver sección "Solución de Problemas" en guías
- **Dudas sobre código:** Revisar archivos en `lib/` y `app/api/`
- **Dudas sobre normas:** Ver referencias en plan completo

---

**¡El sistema está listo! Solo falta crear las plantillas Excel.** 🚀

