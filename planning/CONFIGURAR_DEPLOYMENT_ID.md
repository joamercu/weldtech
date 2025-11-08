# 🔧 Configurar Deployment ID de Abacus.AI

**Fecha:** 8 de Noviembre de 2025  
**Estado:** ⚠️ Deployment ID requerido

---

## 🔍 Problema Detectado

**Error:** `Missing required parameter 'deploymentId'`  
**Causa:** La API de Abacus.AI requiere tanto `deploymentId` como `deploymentToken` para generar imágenes

### Análisis del Error

- ✅ **Endpoint correcto:** `https://api.abacus.ai/api/v0/generateImage` funciona
- ✅ **API responde:** No es un 404, la API está funcionando
- ✅ **deploymentToken:** Incluido correctamente
- ❌ **deploymentId:** Falta y es requerido

---

## ✅ Solución Implementada

### 1. Validación de Deployment ID

El código ahora valida que `deploymentId` esté configurado antes de hacer la petición:

```typescript
if (!deploymentIdToUse) {
  return NextResponse.json(
    { 
      error: 'Deployment ID requerido',
      details: 'La API de Abacus.AI requiere un deploymentId...',
      suggestion: 'Puede obtener el deploymentId desde el Dashboard de Abacus.AI...'
    },
    { status: 400 }
  );
}
```

### 2. Formato de Petición Actualizado

El código ahora siempre incluye `deploymentId` y `deploymentToken`:

```typescript
{
  body: { 
    deploymentId: deploymentIdToUse,
    deploymentToken: abacusApiKey,
    prompt: fullPrompt
  },
  headers: { 'Content-Type': 'application/json' }
}
```

---

## 🚀 Cómo Obtener el Deployment ID

### Opción 1: Desde el Dashboard de Abacus.AI

1. **Acceder al Dashboard:**
   - Ir a: https://abacus.ai/
   - Iniciar sesión con tu cuenta

2. **Navegar a Deployments:**
   - Buscar la sección "Deployments" o "Deployments"
   - Ver lista de deployments existentes

3. **Obtener el Deployment ID:**
   - Seleccionar el deployment de generación de imágenes
   - Copiar el `deploymentId` (puede ser un UUID o un identificador único)

### Opción 2: Crear un Nuevo Deployment

1. **Usar la API de Abacus.AI:**
   ```bash
   curl -X POST https://api.abacus.ai/api/v0/deployments \
        -H "apiKey: s2_05d59eff71e9485391529e7285d0019f" \
        -H "Content-Type: application/json" \
        -d '{
          "name": "Image Generation Deployment",
          "model": "dall-e-3"
        }'
   ```

2. **Obtener el Deployment ID de la respuesta:**
   - La respuesta incluirá el `deploymentId` creado
   - Guardar este ID para usarlo en las variables de entorno

### Opción 3: Listar Deployments Existentes

1. **Listar deployments:**
   ```bash
   curl -X GET https://api.abacus.ai/api/v0/deployments \
        -H "apiKey: s2_05d59eff71e9485391529e7285d0019f"
   ```

2. **Seleccionar el deployment apropiado:**
   - Buscar un deployment relacionado con generación de imágenes
   - Copiar el `deploymentId` de la respuesta

---

## 🔧 Configurar Deployment ID

### Paso 1: Agregar a .env.local

1. **Abrir el archivo `.env.local`** en `nextjs_space/`

2. **Agregar la variable:**
   ```env
   # API Key de Abacus.AI
   ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f
   
   # Deployment ID (requerido)
   ABACUS_DEPLOYMENT_ID=tu_deployment_id_aqui
   ```

3. **Reemplazar `tu_deployment_id_aqui`** con el `deploymentId` real obtenido

4. **Guardar el archivo**

### Paso 2: Reiniciar el Servidor

Es necesario reiniciar el servidor Next.js para que los cambios surtan efecto:

```bash
# Detener servidor actual (Ctrl+C)
# Iniciar nuevamente
cd nextjs_space
npm run dev
```

---

## ✅ Verificación

### Paso 1: Probar la Conexión

1. **Acceder a:** `http://localhost:3000/admin/generar-imagenes-defectos`
2. **Ver el componente "Prueba de Conexión con Abacus.AI"**
3. **Hacer clic en "Probar Conexión"**
4. **Verificar resultados**

**Si está configurado correctamente:**
- ✅ Conexión exitosa
- ✅ Deployment ID configurado

**Si falta el Deployment ID:**
- ❌ Error: "Deployment ID requerido"
- ⚠️ Mensaje indicando cómo obtenerlo

### Paso 2: Intentar Generar una Imagen

1. **Seleccionar un defecto**
2. **Hacer clic en "Generar Imagen Principal"**
3. **Observar logs del servidor**

**Si funciona correctamente:**
- ✅ Imagen generada
- ✅ URL de imagen retornada

---

## ⚠️ Notas Importantes

1. **Deployment ID es requerido:** La API de Abacus.AI no funcionará sin un `deploymentId` válido

2. **Obtener desde Dashboard:** La forma más fácil es obtenerlo desde el Dashboard de Abacus.AI

3. **Crear nuevo deployment:** Si no tienes un deployment, puedes crear uno usando la API

4. **Reiniciar servidor:** Siempre reinicia el servidor después de cambiar variables de entorno

---

## 📝 Resumen

- ✅ **Código actualizado:** Valida que `deploymentId` esté configurado
- ✅ **Formato correcto:** Incluye `deploymentId` y `deploymentToken` en la petición
- ⚠️ **Deployment ID requerido:** Necesitas obtenerlo desde el Dashboard de Abacus.AI
- 🔧 **Configurar en .env.local:** Agregar `ABACUS_DEPLOYMENT_ID=tu_deployment_id`

---

**Última actualización:** 8 de Noviembre de 2025

