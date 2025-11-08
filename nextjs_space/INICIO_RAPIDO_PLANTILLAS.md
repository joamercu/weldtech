# 🚀 Inicio Rápido - Sistema de Plantillas

## ⚡ Empezar en 5 Minutos

### Paso 1: Setup Inicial

```powershell
# Navegar a la carpeta del proyecto Next.js
cd nextjs_space

# Instalar dependencias necesarias (si no están instaladas)
npm install xlsx exceljs pdf-lib file-saver

# Ejecutar script de setup (crea carpetas necesarias)
node scripts/setup-templates-structure.js
```

**Output esperado:**
```
🚀 Iniciando setup de estructura de plantillas...
==================================================
✓ Creado: public\templates
✓ Creado: public\templates\source
✓ Creado: public\templates\preview
✓ Creado: public\templates\guides
✓ Creado: app\api\templates
✓ Creado: app\api\templates\download
✓ Creado: scripts\templates
✓ Creado: lib

📄 Creando archivos README...
✓ Creado: public/templates/source/README.md
✓ Creado: public/templates/preview/README.md
✓ Creado: public/templates/guides/README.md

==================================================
✅ Setup completado!
📁 11 carpetas/archivos creados
```

---

### Paso 2: Verificar Estructura

```powershell
# Ver estructura creada
tree public\templates /F
```

**Output esperado:**
```
public\templates
├── guides
│   └── README.md
├── preview
│   └── README.md
└── source
    └── README.md
```

---

### Paso 3: Abrir Documentación

```powershell
# Opción 1: Abrir todos los documentos en VS Code
code ../planning/RESUMEN_VISUAL_PLAN.md
code ../planning/CHECKLIST_EJECUCION.md
code ../planning/GUIA_IMPLEMENTACION_PLANTILLAS.md

# Opción 2: Abrir carpeta planning completa
code ../planning
```

---

### Paso 4: Empezar con la Primera Plantilla

```
1. Abrir Microsoft Excel
2. Crear nuevo libro
3. Guardar como: public/templates/source/WPS_Template_v1.0.xlsx
4. Seguir instrucciones en: planning/GUIA_IMPLEMENTACION_PLANTILLAS.md
   → Sección "Fase 1: Crear Primera Plantilla (WPS)"
```

---

## 📚 Documentos Clave

| Documento | Cuándo Leerlo | Tiempo |
|-----------|---------------|--------|
| [RESUMEN_VISUAL_PLAN.md](../planning/RESUMEN_VISUAL_PLAN.md) | **PRIMERO** - Vista general | 5 min |
| [CHECKLIST_EJECUCION.md](../planning/CHECKLIST_EJECUCION.md) | Referencia diaria | N/A |
| [GUIA_IMPLEMENTACION_PLANTILLAS.md](../planning/GUIA_IMPLEMENTACION_PLANTILLAS.md) | Durante desarrollo | N/A |
| [PLAN_PLANTILLAS_PROFESIONALES.md](../planning/PLAN_PLANTILLAS_PROFESIONALES.md) | Lectura completa (opcional) | 90 min |

---

## ✅ Checklist Pre-Inicio

Antes de empezar, verifica que tienes:

- [ ] Microsoft Excel 2016+ instalado y funcionando
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Dependencias NPM instaladas (`npm list xlsx exceljs pdf-lib`)
- [ ] Carpetas creadas (ejecutaste `setup-templates-structure.js`)
- [ ] Has leído [RESUMEN_VISUAL_PLAN.md](../planning/RESUMEN_VISUAL_PLAN.md) (al menos)
- [ ] Entiendes el concepto de Excel editable vs. PDF con marca de agua
- [ ] Tienes ejemplos de WPS/PQR reales para referencia (opcional pero útil)

---

## 🗓️ Plan de Hoy (Día 1)

### Tareas del Día 1: Diseño de WPS (4-6 horas)

1. **Crear archivo WPS_Template_v1.0.xlsx** (15 min)
   - Abrir Excel
   - Crear libro nuevo
   - Guardar en `public/templates/source/`

2. **Diseñar 6 hojas** (2 horas)
   - Portada
   - Variables_Soldadura
   - Parametros_Electricos
   - Tecnica_Soldadura
   - Tratamiento_Termico
   - Rangos_Cualificados

3. **Crear hoja oculta DataLists** (1 hora)
   - P-Numbers (ASME IX QW-420)
   - F-Numbers (ASME IX QW-432)
   - Procesos de soldadura
   - Posiciones AWS/ASME

4. **Layout básico de cada hoja** (2 horas)
   - Títulos, headers
   - Campos de entrada
   - Espaciado y formato

5. **Guardar y hacer backup** (5 min)
   - Guardar Excel
   - Hacer git commit: `git commit -m "feat: WPS template initial structure"`

---

## 📞 ¿Necesitas Ayuda?

### Problemas Comunes

**Problema 1: "No se crearon las carpetas"**
```powershell
# Solución: Ejecutar con permisos de administrador
# Abrir PowerShell como administrador
cd "D:\07-11-25-APP WELDTECH\nextjs_space"
node scripts/setup-templates-structure.js
```

**Problema 2: "Error al instalar dependencias NPM"**
```powershell
# Solución: Limpiar cache y reinstalar
npm cache clean --force
npm install
```

**Problema 3: "No tengo Microsoft Excel"**
```
Opción 1: Usar Microsoft 365 (versión online)
Opción 2: Usar LibreOffice Calc (funcionalidad limitada)
Opción 3: Pedir acceso temporal a cuenta de Microsoft 365
```

---

## 🎯 Objetivo del Día 1

Al final del día deberías tener:

✅ Estructura de carpetas creada  
✅ Archivo `WPS_Template_v1.0.xlsx` creado  
✅ 6 hojas diseñadas con layout básico  
✅ Hoja `DataLists` con listas de datos  
✅ Git commit realizado  

**No es necesario:**
- ❌ Fórmulas todavía (eso es Día 3-4)
- ❌ Validaciones de datos todavía (eso es Día 3-4)
- ❌ Formato condicional todavía (eso es Día 3-4)

**Enfócate en:** Diseño, estructura, layout visual.

---

## 🚀 Comando Todo-en-Uno

Copia y pega en PowerShell para hacer setup completo:

```powershell
# Navegar al proyecto
cd "D:\07-11-25-APP WELDTECH\nextjs_space"

# Instalar dependencias
npm install xlsx exceljs pdf-lib file-saver

# Ejecutar setup
node scripts/setup-templates-structure.js

# Abrir documentación
code ../planning/RESUMEN_VISUAL_PLAN.md

# Abrir checklist
code ../planning/CHECKLIST_EJECUCION.md

Write-Host "`n✅ Setup completo! Ahora abre Excel y empieza con WPS.`n" -ForegroundColor Green
```

---

## 📊 Progreso Visual

```
Semana 1: WPS
[🟦⬜⬜⬜⬜⬜⬜] Día 1/7

Progreso General:
[🟦⬜⬜⬜⬜⬜⬜⬜⬜⬜] 2% completado (1/42 días)
```

---

**¡Listo! Ahora sí, a crear plantillas increíbles.** 🎉

**Siguiente acción:** Abrir Excel → Crear `WPS_Template_v1.0.xlsx` → Empezar con hoja "Portada"

---

*Para más detalles, ver [GUIA_IMPLEMENTACION_PLANTILLAS.md](../planning/GUIA_IMPLEMENTACION_PLANTILLAS.md)*

