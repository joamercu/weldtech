# 📋 Instrucciones para Generar Imágenes de Defectos

**Fecha:** 8 de Noviembre de 2025

---

## 🎯 Objetivo

Generar nuevas imágenes de defectos usando Abacus.AI y reemplazar las imágenes originales.

---

## 📁 Estructura Requerida

Las imágenes deben estar en:
```
nextjs_space/public/herramientas/generated/abacus-ai/
├── porosidad/
│   └── main.jpg (requerida)
├── grietas/
│   └── main.jpg (requerida)
├── undercut/
│   └── main.jpg (requerida)
├── escoria/
│   └── main.jpg (requerida)
├── salpicaduras/
│   └── main.jpg (requerida)
└── sobreposicion/
    └── main.jpg (requerida)
```

**Nota:** Las carpetas ya están creadas. Solo necesitas agregar las imágenes.

---

## 🚀 Proceso de Generación

### Opción 1: Usando la Página de Administración (Recomendado)

1. **Iniciar el servidor:**
   ```bash
   cd nextjs_space
   npm run dev
   ```

2. **Acceder a la página:**
   ```
   http://localhost:3000/admin/generar-imagenes-defectos
   ```

3. **Para cada defecto:**
   - Seleccionar el defecto
   - Generar la imagen principal (`main.jpg`)
   - Descargar la imagen generada
   - Guardar en: `nextjs_space/public/herramientas/generated/abacus-ai/[defecto]/main.jpg`

4. **Repetir para los 6 defectos:**
   - Porosidad
   - Grietas
   - Socavado (undercut)
   - Escoria
   - Salpicaduras
   - Sobreposición

### Opción 2: Subir Imágenes Manualmente

Si ya tienes las imágenes generadas:

1. **Copiar las imágenes:**
   - Copiar cada imagen generada a su carpeta correspondiente
   - Nombrar como `main.jpg`

2. **Verificar estructura:**
   ```powershell
   cd "D:\07-11-25-APP WELDTECH\nextjs_space\public\herramientas\generated\abacus-ai"
   Get-ChildItem -Recurse -File
   ```

---

## ✅ Verificación Después de Generar

### 1. Verificar que las Imágenes Existan

```powershell
cd "D:\07-11-25-APP WELDTECH\nextjs_space\public\herramientas\generated\abacus-ai"
Get-ChildItem -Recurse -File | Select-Object FullName, Length
```

**Resultado esperado:** 6 archivos `main.jpg` (uno por cada defecto)

### 2. Verificar en la Página Web

1. Acceder a: `http://localhost:3000/herramientas/defectos`
2. Verificar que las imágenes se carguen correctamente
3. Verificar que sean diferentes a las originales

### 3. Comparar Tamaños

Las imágenes generadas deberían tener tamaños diferentes a las originales:

| Defecto | Original | Generada | Diferente |
|---------|----------|----------|-----------|
| Porosidad | 201 KB | ? KB | ? |
| Grietas | 162 KB | ? KB | ? |
| Socavado | 147 KB | ? KB | ? |
| Escoria | 150 KB | ? KB | ? |
| Salpicaduras | 169 KB | ? KB | ? |
| Sobreposición | 148 KB | ? KB | ? |

---

## 🔄 Actualizar Imágenes Originales (Opcional)

Si quieres reemplazar las imágenes originales con las generadas:

1. **Hacer respaldo adicional:**
   ```powershell
   cd "D:\07-11-25-APP WELDTECH\nextjs_space\public\herramientas"
   Copy-Item "porosidad.jpg" "backup\2025-11-08-original\porosidad-original.jpg"
   # Repetir para cada defecto
   ```

2. **Reemplazar imágenes originales:**
   ```powershell
   Copy-Item "generated\abacus-ai\porosidad\main.jpg" "porosidad.jpg" -Force
   # Repetir para cada defecto
   ```

**Nota:** Esto es opcional. El sistema funciona correctamente con el fallback.

---

## 📝 Notas Importantes

1. **Solo se requiere `main.jpg`:** Las vistas adicionales (cross-section, surface-view) son opcionales.

2. **El sistema usa fallback:** Si las imágenes generadas no existen, usa automáticamente las originales.

3. **Verificar nombres:** Los archivos deben llamarse exactamente `main.jpg` (en minúsculas).

4. **Verificar ubicación:** Las imágenes deben estar en las carpetas correctas según el defecto.

---

## ✅ Checklist

- [ ] Carpetas creadas para cada defecto
- [ ] Imágenes generadas usando Abacus.AI
- [ ] Imágenes guardadas como `main.jpg` en cada carpeta
- [ ] Verificación de que las imágenes existen
- [ ] Verificación en la página web
- [ ] Comparación de tamaños con originales
- [ ] Verificación de que las originales están respaldadas

---

**Última actualización:** 8 de Noviembre de 2025

