# 🔧 Configurar Edge Config de Vercel

Edge Config de Vercel permite almacenar configuración global de baja latencia que se puede actualizar sin necesidad de redeploy. Esta guía explica cómo configurar Edge Config para el "Modo Desarrollo" y otras funcionalidades.

## 📋 Requisitos Previos

1. Tener un proyecto desplegado en Vercel
2. Tener acceso al dashboard de Vercel
3. Tener Edge Config creado en Vercel

## 🚀 Paso 1: Crear Edge Config en Vercel

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Storage** → **Edge Config**
4. Haz clic en **Create Edge Config**
5. Asigna un nombre (ej: `weldtech-config`)
6. Copia el **Connection String** que se genera

## 🔑 Paso 2: Configurar Variables de Entorno

En tu proyecto de Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

### EDGE_CONFIG
- **Key:** `EDGE_CONFIG`
- **Value:** `https://edge-config.vercel.com/ecfg_xxxxx` (tu Connection String sin el token)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### EDGE_CONFIG_TOKEN
- **Key:** `EDGE_CONFIG_TOKEN`
- **Value:** Tu token de Edge Config (del Connection String)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**Ejemplo:**
```
Connection String completo: https://edge-config.vercel.com/ecfg_vte7cvzrmqx9ishiankmpfodfibx?token=86f5e096-7180-45b4-a912-7472f30f2d09

EDGE_CONFIG=https://edge-config.vercel.com/ecfg_vte7cvzrmqx9ishiankmpfodfibx
EDGE_CONFIG_TOKEN=86f5e096-7180-45b4-a912-7472f30f2d09
```

## 📝 Paso 3: Configurar Datos en Edge Config

En el dashboard de Vercel, ve a **Storage** → **Edge Config** → Tu configuración → **Edit**

Agrega la siguiente estructura JSON:

```json
{
  "developmentMode": {
    "enabled": true,
    "allowedDomains": [
      ".vercel.app",
      "localhost",
      "127.0.0.1"
    ],
    "message": "Modo Desarrollo activado desde Edge Config"
  },
  "app": {
    "greeting": "hello world",
    "maintenance": false,
    "features": {
      "developmentMode": true,
      "premiumFeatures": true,
      "testUsers": true
    }
  }
}
```

### Explicación de Campos

#### developmentMode
- **enabled** (boolean): Habilita o deshabilita el Modo Desarrollo globalmente
- **allowedDomains** (array): Lista de dominios permitidos para el Modo Desarrollo
- **message** (string, opcional): Mensaje personalizado cuando se activa el Modo Desarrollo

#### app
- **greeting** (string): Saludo personalizado de la aplicación
- **maintenance** (boolean): Modo de mantenimiento
- **features** (object): Control de features individuales
  - **developmentMode** (boolean): Habilita el Modo Desarrollo
  - **premiumFeatures** (boolean): Habilita funcionalidades premium
  - **testUsers** (boolean): Habilita la creación de usuarios de prueba desde la interfaz de administración

## 🔄 Paso 4: Actualizar Configuración

Puedes actualizar la configuración en Edge Config en cualquier momento sin necesidad de redeploy:

1. Ve a **Storage** → **Edge Config** → Tu configuración
2. Haz clic en **Edit**
3. Modifica el JSON
4. Haz clic en **Save**
5. Los cambios se aplicarán inmediatamente (con cache de 60 segundos)

## 🧪 Paso 5: Probar la Configuración

### Verificar desde la API

```bash
# Obtener toda la configuración
curl "https://edge-config.vercel.com/ecfg_xxxxx?token=TU_TOKEN"

# Obtener solo developmentMode
curl "https://edge-config.vercel.com/ecfg_xxxxx/developmentMode?token=TU_TOKEN"
```

### Verificar desde la Aplicación

1. Abre la aplicación desplegada
2. El botón "Modo Desarrollo" debería aparecer si:
   - `developmentMode.enabled` es `true`
   - El dominio está en `allowedDomains`
   - El usuario NO está autenticado

## 📚 Uso en el Código

### Consultar Edge Config desde el Servidor

```typescript
import { getEdgeConfig, isDevelopmentModeEnabledInEdgeConfig } from '@/lib/edge-config';

// Obtener toda la configuración
const config = await getEdgeConfig();

// Obtener solo developmentMode
const devMode = await getEdgeConfig('developmentMode');

// Verificar si está habilitado
const enabled = await isDevelopmentModeEnabledInEdgeConfig();
```

### Consultar Edge Config desde el Cliente

```typescript
// La aplicación consulta automáticamente Edge Config a través de la API
// No necesitas hacer nada adicional, el hook useDevelopmentMode lo maneja
```

## 🔒 Seguridad

- ✅ El token de Edge Config **NUNCA** se expone al cliente
- ✅ Todas las consultas pasan por la API route `/api/edge-config`
- ✅ El token solo existe en variables de entorno del servidor
- ✅ Edge Config valida el token en cada solicitud

## 🐛 Solución de Problemas

### Error: "EDGE_CONFIG no está configurado"

**Solución:**
1. Verifica que `EDGE_CONFIG` esté configurado en Vercel
2. Verifica que el valor sea la URL completa sin el token

### Error: "EDGE_CONFIG_TOKEN no está configurado"

**Solución:**
1. Verifica que `EDGE_CONFIG_TOKEN` esté configurado en Vercel
2. Verifica que el token sea correcto

### Error: "Error al obtener configuración"

**Solución:**
1. Verifica que Edge Config esté creado en Vercel
2. Verifica que el Connection String sea correcto
3. Verifica que el token sea válido
4. Verifica que la estructura JSON sea válida

### El Modo Desarrollo no aparece

**Solución:**
1. Verifica que `developmentMode.enabled` sea `true`
2. Verifica que el dominio esté en `allowedDomains`
3. Verifica que el usuario NO esté autenticado
4. Verifica los logs de la consola del navegador

## 📖 Referencias

- [Documentación de Edge Config](https://vercel.com/docs/storage/edge-config)
- [API de Edge Config](https://vercel.com/docs/storage/edge-config/edge-config-api)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

