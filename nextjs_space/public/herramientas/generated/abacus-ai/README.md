# 🎨 Imágenes Generadas con Abacus.AI

**Fecha de creación:** 8 de Noviembre de 2025  
**Propósito:** Imágenes mejoradas de defectos de soldadura generadas usando la API de Abacus.AI

---

## 📁 Estructura de Directorios

```
generated/abacus-ai/
├── prompts-tecnicos.json          # Prompts técnicos para cada defecto
├── porosidad/
│   ├── main.jpg                   # Imagen principal
│   ├── cross-section.jpg          # Vista de corte transversal
│   └── surface-view.jpg          # Vista superficial
├── grietas/
│   ├── main.jpg
│   ├── cross-section.jpg
│   └── surface-view.jpg
├── undercut/
│   ├── main.jpg
│   ├── cross-section.jpg
│   └── surface-view.jpg
├── escoria/
│   ├── main.jpg
│   ├── cross-section.jpg
│   └── surface-view.jpg
├── salpicaduras/
│   ├── main.jpg
│   ├── cross-section.jpg
│   └── surface-view.jpg
└── sobreposicion/
    ├── main.jpg
    ├── cross-section.jpg
    └── surface-view.jpg
```

---

## 🖼️ Tipos de Imágenes

### Imagen Principal (`main.jpg`)
- Vista técnica completa del defecto
- Incluye todos los elementos técnicos
- Anotaciones en español e inglés
- Indicadores de severidad y categoría

### Vista de Corte Transversal (`cross-section.jpg`)
- Corte transversal del defecto
- Muestra estructura interna
- Indicadores de profundidad y dimensiones
- Etiquetas técnicas detalladas

### Vista Superficial (`surface-view.jpg`)
- Vista de la superficie del defecto
- Muestra cómo se ve en la superficie
- Indicadores de tamaño y distribución
- Detalles de textura superficial

---

## 🔧 Uso

### En el Componente

Las imágenes se pueden usar en el componente `guia-defectos.tsx`:

```typescript
// Imagen principal
image: '/herramientas/generated/abacus-ai/porosidad/main.jpg'

// Imagen complementaria en modal
crossSection: '/herramientas/generated/abacus-ai/porosidad/cross-section.jpg'
surfaceView: '/herramientas/generated/abacus-ai/porosidad/surface-view.jpg'
```

### Generar Nuevas Imágenes

Para generar nuevas imágenes, usar el script:

```bash
cd nextjs_space
npm run generate-defect-images
```

O ejecutar directamente:

```bash
npx tsx scripts/generate-defect-images.ts
```

---

## 📝 Prompts Técnicos

Los prompts técnicos están estructurados en `prompts-tecnicos.json` e incluyen:

- Descripción técnica del defecto
- Contexto de soldadura específico
- Estilo de marca WeldTech
- Elementos técnicos requeridos
- Anotaciones y etiquetas necesarias

---

## ⚠️ Notas Importantes

1. **Autenticación:** La generación de imágenes requiere que el usuario esté autenticado
2. **API Key:** Asegúrate de tener `ABACUS_API_KEY` configurada en `.env.local`
3. **Fallback:** Si una imagen generada no está disponible, el componente usará la imagen original del respaldo
4. **Optimización:** Las imágenes deben optimizarse antes de usar en producción

---

## 🔄 Actualización

Para actualizar las imágenes:

1. Modificar prompts en `prompts-tecnicos.json` si es necesario
2. Ejecutar el script de generación
3. Validar calidad de las nuevas imágenes
4. Actualizar el componente si hay cambios en la estructura

---

**Última actualización:** 8 de Noviembre de 2025

