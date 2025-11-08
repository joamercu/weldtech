# 📖 Guía de Uso: Imágenes Generadas con Abacus.AI

**Fecha:** 8 de Noviembre de 2025  
**Versión:** 1.0

---

## 🎯 Resumen

Esta guía explica cómo usar las imágenes generadas con Abacus.AI en la página web de defectos de soldadura.

---

## 📁 Estructura de Archivos

### Ubicación de Imágenes

Las imágenes generadas deben estar en:
```
nextjs_space/public/herramientas/generated/abacus-ai/
├── porosidad/
│   ├── main.jpg (requerida)
│   ├── cross-section.jpg (opcional)
│   └── surface-view.jpg (opcional)
├── grietas/
│   ├── main.jpg
│   ├── cross-section.jpg
│   └── surface-view.jpg
└── ... (otros defectos)
```

### Fallback

Si las imágenes generadas no existen, el sistema usa:
```
nextjs_space/public/herramientas/
├── porosidad.jpg (imagen original)
├── grietas.jpg
└── ... (otros defectos)
```

---

## 🔄 Cómo Funciona el Sistema

### 1. Carga Automática

El componente `guia-defectos.tsx` automáticamente:

1. **Intenta cargar** la imagen generada desde:
   ```
   /herramientas/generated/abacus-ai/[defecto]/main.jpg
   ```

2. **Si no existe**, usa la imagen original:
   ```
   /herramientas/[defecto].jpg
   ```

3. **Si falla**, usa el fallback automático

### 2. Imágenes Adicionales

En el modal de detalles:

- **Vista de Corte Transversal:** Se muestra si existe `cross-section.jpg`
- **Vista Superficial:** Se muestra si existe `surface-view.jpg`

Si no existen, simplemente no se muestran (sin errores).

---

## ✅ Verificación

### Verificar que las Imágenes se Carguen

1. **En la página web:**
   - Acceder a `/herramientas/defectos`
   - Verificar que las imágenes se muestren correctamente
   - Hacer clic en un defecto para ver el modal

2. **En la consola del navegador:**
   - Abrir DevTools (F12)
   - Ir a "Network" → Filtrar por "img"
   - Verificar las rutas de las imágenes cargadas

3. **Verificar estructura de archivos:**
   ```powershell
   cd nextjs_space/public/herramientas/generated/abacus-ai
   Get-ChildItem -Recurse -File
   ```

---

## 🛠️ Mantenimiento

### Agregar Nuevas Imágenes

1. **Generar imágenes:**
   - Acceder a `/admin/generar-imagenes-defectos`
   - Generar las imágenes necesarias
   - Descargar y guardar en la estructura correcta

2. **Verificar nombres:**
   - `main.jpg` - Imagen principal (requerida)
   - `cross-section.jpg` - Vista de corte transversal (opcional)
   - `surface-view.jpg` - Vista superficial (opcional)

3. **Verificar ubicación:**
   - Deben estar en: `generated/abacus-ai/[defecto]/`

### Actualizar Imágenes

1. **Reemplazar archivo:**
   - Simplemente reemplazar el archivo existente
   - El sistema cargará la nueva imagen automáticamente

2. **Limpiar caché:**
   - Si es necesario, limpiar caché del navegador
   - O usar Ctrl+F5 para forzar recarga

---

## 🐛 Solución de Problemas

### Las Imágenes No se Cargan

1. **Verificar estructura:**
   - Asegurarse de que las imágenes estén en la estructura correcta
   - Verificar nombres de archivo (deben ser exactos)

2. **Verificar rutas:**
   - Las rutas deben ser relativas a `/public/herramientas/`
   - Ejemplo: `/herramientas/generated/abacus-ai/porosidad/main.jpg`

3. **Verificar servidor:**
   - Asegurarse de que el servidor Next.js esté ejecutándose
   - Reiniciar el servidor si es necesario

### Se Muestran Imágenes Originales

- **Esto es normal:** El sistema usa fallback automático
- Si las imágenes generadas no existen, usa las originales
- Verificar que las imágenes generadas estén en la estructura correcta

### Imágenes Adicionales No se Muestran

- **Esto es normal:** Las imágenes adicionales son opcionales
- Solo se muestran si existen
- Si no existen, simplemente no se muestran (sin errores)

---

## 📊 Estado del Sistema

- ✅ **Carga automática:** Implementada
- ✅ **Sistema de fallback:** Funcionando
- ✅ **Manejo de errores:** Robusto
- ✅ **Soporte multi-vista:** Preparado
- ✅ **Carga condicional:** Implementada

---

## 📝 Notas Importantes

1. **Solo se requiere `main.jpg`:** Las otras vistas son opcionales
2. **Fallback automático:** El sistema siempre tiene una imagen que mostrar
3. **Sin errores visibles:** El sistema maneja errores silenciosamente
4. **Carga condicional:** Solo carga lo que existe

---

**Última actualización:** 8 de Noviembre de 2025  
**Versión:** 1.0

