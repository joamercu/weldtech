# 🎨 Configuración de Generación de Imágenes con Abacus.AI

Esta guía explica cómo configurar la generación de imágenes usando la API de Abacus.AI en el proyecto WeldTech.

## 📋 Requisitos Previos

1. **API Key de Abacus.AI**: `s2_05d59eff71e9485391529e7285d0019f`
2. **Deployment ID** (opcional): Si tienes un deployment específico configurado en Abacus.AI

## 🔧 Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local` en `nextjs_space/`:

```env
# API Key de Abacus.AI
ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f

# Deployment ID (opcional)
# Si tienes un deployment específico configurado en Abacus.AI, agrégalo aquí
ABACUS_DEPLOYMENT_ID=tu_deployment_id_aqui
```

### 2. Verificar Configuración

Puedes verificar que la API esté configurada correctamente haciendo una petición GET a:

```
GET /api/images/generate
```

Esto retornará el estado de la configuración.

## 🚀 Uso

### API Route

La API route está disponible en:

```
POST /api/images/generate
```

**Body:**
```json
{
  "prompt": "Professional welder in action",
  "style": "close-up", // opcional
  "data": { // opcional - datos de entrada (ej: datos WPS
    "wpsNumber": "WPS-001",
    "company": "WeldTech Solutions"
  },
  "deploymentId": "tu_deployment_id" // opcional, sobrescribe env
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "imageUrl": "https://cdn.abacus.ai/images/...",
  "prompt": "Prompt completo generado...",
  "metadata": {
    "generatedAt": "2025-11-08T...",
    "userId": "user@example.com"
  }
}
```

### Componente React

Usa el componente `ImageGenerator` en cualquier página:

```tsx
import ImageGenerator from '@/components/image-generator';

export default function MyPage() {
  return (
    <div>
      <ImageGenerator 
        initialData={{
          wpsNumber: "WPS-001",
          company: "WeldTech Solutions"
        }}
        onImageGenerated={(imageUrl) => {
          console.log('Imagen generada:', imageUrl);
        }}
      />
    </div>
  );
}
```

## 🎨 Estilo de Marca WeldTech

El sistema automáticamente incorpora el estilo de marca WeldTech en todos los prompts:

- **Estilo**: Industrial technical photography, dramatic lighting
- **Colores**: Dark steel (#0F1216), orange accents (#FF7A00), blue highlights (#2AA1FF)
- **Mood**: Elite craftsmanship, precision, technical excellence

Los prompts predefinidos incluyen:
- Soldador en Acción
- Equipo de Soldadura
- Inspector de Calidad

## 📝 Prompts Recomendados

### Soldador en Acción
```
Professional welder in action, wearing full protective gear,
electric welding arc creating bright orange sparks,
dark industrial workshop background, dramatic side lighting
```

### Equipo y Herramientas
```
Professional welding equipment close-up, modern welding machine,
TIG torch and electrode holder, on dark metal workbench,
technical lighting with blue and orange accents
```

### Inspector de Calidad
```
QA inspector examining welded joint, wearing safety glasses,
using precision measurement tools, technical clipboard,
industrial workshop background, professional lighting
```

## 🔍 Integración con Datos WPS

Puedes pasar datos WPS al generador para crear contexto automático:

```tsx
<ImageGenerator 
  initialData={{
    wpsNumber: "WPS-001",
    company: "WeldTech Solutions",
    process: "TIG Welding",
    material: "Stainless Steel"
  }}
/>
```

El sistema incorporará estos datos en el prompt para generar imágenes más contextualizadas.

## ⚠️ Notas Importantes

1. **Autenticación**: La generación de imágenes requiere que el usuario esté autenticado (NextAuth)
2. **API Key**: Mantén tu API key segura y nunca la expongas en el código del cliente
3. **Rate Limits**: Abacus.AI puede tener límites de tasa, considera implementar rate limiting si es necesario
4. **Deployment ID**: Si no proporcionas un deploymentId, la API usará el endpoint general

## 🐛 Solución de Problemas

### Error: "API key de Abacus.AI no configurada"
- Verifica que `ABACUS_API_KEY` esté en `.env.local`
- Reinicia el servidor de desarrollo después de agregar variables de entorno

### Error: "Error al generar imagen con Abacus.AI"
- Verifica que la API key sea válida
- Revisa los logs del servidor para más detalles
- Asegúrate de que el deploymentId sea correcto si lo estás usando

### La imagen no se muestra
- Verifica que la URL de la imagen sea accesible
- Revisa la consola del navegador para errores CORS
- Asegúrate de que la respuesta de la API incluya una URL válida

## 📚 Referencias

- [Documentación de Abacus.AI](https://abacus.ai/help/api/ref/predict/generateImage)
- [Guía de Prompts de Marca WeldTech](./assets/branding/BRAND_ASSETS_GUIDE.md#9-anexo-prompt-guide-para-generación-de-imágenes-ia)

---

**Última actualización**: Noviembre 2025

