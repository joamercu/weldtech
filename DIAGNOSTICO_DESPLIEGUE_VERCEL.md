# 🔧 Diagnóstico y Solución de Problemas de Despliegue en Vercel

**Proyecto:** WeldTech Solutions  
**URL del Despliegue:** https://vercel.com/joamercus-projects/weldtech-wnkr/A6GHpWj1LSAwREiCS85UF2RApyfS  
**Fecha:** Noviembre 2025

---

## 🔍 Problemas Comunes y Soluciones

### 1. ⚠️ Root Directory No Configurado Correctamente

**Problema:** Vercel está buscando el proyecto en la raíz del repositorio, pero el proyecto Next.js está en `nextjs_space/`.

**Solución:**

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Haz clic en tu proyecto `weldtech-wnkr`
3. Ve a **Settings** → **General**
4. Busca la sección **Root Directory**
5. Cambia el valor a: `nextjs_space`
6. Haz clic en **Save**
7. Ve a **Deployments** y haz clic en **Redeploy** en el último despliegue

**Verificación:**
- El Root Directory debe ser: `nextjs_space`
- Framework Preset debe ser: `Next.js`
- Build Command debe ser: `npm run build`
- Output Directory debe ser: `.next`

---

### 2. 🔑 Variables de Entorno Faltantes o Incorrectas

**Problema:** Faltan variables de entorno necesarias para el funcionamiento de la aplicación.

**Variables Requeridas:**

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: Tu URL de conexión a PostgreSQL (Neon)
   - Format: `postgresql://usuario:password@host.neon.tech/database?sslmode=require`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://weldtech-wnkr.vercel.app` (o tu URL de Vercel)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: Genera uno con: `openssl rand -base64 32`
   - O usa: https://generate-secret.vercel.app/32
   - Environments: ✅ Production, ✅ Preview, ✅ Development

**Variables Opcionales (si las usas):**

4. **ABACUS_API_KEY** (si usas generación de imágenes)
   - Key: `ABACUS_API_KEY`
   - Value: Tu API key de Abacus.AI
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **NEXT_PUBLIC_GA_MEASUREMENT_ID** (si usas Google Analytics)
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: Tu ID de medición de Google Analytics
   - Environments: ✅ Production, ✅ Preview, ✅ Development

**Cómo Configurar:**

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable con su valor
4. Marca los ambientes donde se usará (Production, Preview, Development)
5. Haz clic en **Save**
6. Ve a **Deployments** y haz **Redeploy**

---

### 3. 🗄️ Prisma Client No Generado Durante el Build

**Problema:** El cliente de Prisma no se genera automáticamente durante el build en Vercel.

**Solución:**

El `package.json` ya tiene el script `postbuild` configurado:
```json
"postbuild": "prisma generate"
```

Si aún así falla, verifica:

1. **Verifica que Prisma esté instalado:**
   ```json
   "prisma": "6.7.0",
   "@prisma/client": "6.7.0"
   ```

2. **Verifica que el schema de Prisma exista:**
   - Debe estar en: `nextjs_space/prisma/schema.prisma`

3. **Agrega un script de prebuild (opcional):**
   ```json
   "prebuild": "prisma generate"
   ```

4. **Verifica que DATABASE_URL esté disponible durante el build:**
   - Asegúrate de que `DATABASE_URL` esté configurada en Vercel
   - Prisma necesita la URL para generar el cliente

---

### 4. 🏗️ Errores de Build

**Problema:** El build falla con errores de TypeScript, imports o dependencias.

**Soluciones:**

#### A. Verificar Build Localmente

```bash
cd nextjs_space
npm install
npm run build
```

Si el build local funciona, el problema es de configuración en Vercel.

#### B. Limpiar y Reinstalar Dependencias

```bash
cd nextjs_space
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

#### C. Verificar Errores de TypeScript

El `next.config.js` tiene:
```javascript
typescript: {
  ignoreBuildErrors: false,
}
```

Si hay errores de TypeScript, corrígelos o cambia temporalmente a `true` para diagnosticar.

#### D. Verificar Imports y Rutas

- Verifica que todos los imports usen rutas relativas o el alias `@/*`
- Verifica que no haya imports circulares
- Verifica que los archivos existan en las rutas especificadas

---

### 5. 🚫 Error 404 NOT_FOUND

**Problema:** La aplicación devuelve error 404 al acceder.

**Causas Posibles:**

1. **Root Directory incorrecto** (ver Solución 1)
2. **Build falló** - Revisa los logs de Vercel
3. **Rutas no configuradas** - Verifica que `app/page.tsx` y `app/layout.tsx` existan
4. **Output Directory incorrecto** - Debe ser `.next`

**Solución:**

1. Verifica los logs de despliegue en Vercel
2. Asegúrate de que el build fue exitoso
3. Verifica que `app/page.tsx` exista
4. Verifica que `app/layout.tsx` exista
5. Verifica que el Root Directory esté configurado como `nextjs_space`

---

### 6. 🔄 Problemas con Migraciones de Base de Datos

**Problema:** Las tablas no existen en la base de datos de producción.

**Solución:**

1. **Ejecuta las migraciones localmente apuntando a la DB de producción:**
   ```bash
   cd nextjs_space
   # Crea un .env.local temporal con DATABASE_URL de producción
   echo "DATABASE_URL=tu-url-de-neon" > .env.local
   npx prisma migrate deploy
   # O si prefieres:
   npx prisma db push
   ```

2. **O ejecuta las migraciones desde el dashboard de Neon:**
   - Ve al dashboard de Neon
   - Haz clic en "SQL Editor"
   - Ejecuta el SQL generado por Prisma (en `prisma/migrations/`)

---

## 📋 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Root Directory configurado como `nextjs_space`
- [ ] Framework Preset configurado como `Next.js`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] `DATABASE_URL` configurada en Vercel
- [ ] `NEXTAUTH_URL` configurada con la URL de Vercel
- [ ] `NEXTAUTH_SECRET` configurado
- [ ] Último despliegue fue exitoso (verifica en Deployments)
- [ ] No hay errores en los logs de Vercel
- [ ] Build local funciona correctamente
- [ ] Las migraciones de base de datos están aplicadas

---

## 🔍 Cómo Revisar los Logs de Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Haz clic en tu proyecto `weldtech-wnkr`
3. Ve a la pestaña **Deployments**
4. Haz clic en el despliegue más reciente
5. Revisa la pestaña **Logs** para ver errores de build o runtime
6. Revisa la pestaña **Build Logs** para ver errores durante el build

---

## 🛠️ Solución Rápida: Re-desplegar

Si nada funciona, intenta re-desplegar:

1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos (⋯) del último despliegue
3. Selecciona **Redeploy**
4. Espera a que termine el despliegue
5. Verifica que el estado sea "Ready"

---

## 📞 Pasos de Diagnóstico Detallado

### Paso 1: Verificar Configuración en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **General**
4. Verifica:
   - Root Directory: `nextjs_space`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Paso 2: Verificar Variables de Entorno

1. Ve a **Settings** → **Environment Variables**
2. Verifica que todas las variables requeridas estén configuradas
3. Verifica que estén marcadas para los ambientes correctos

### Paso 3: Revisar Logs del Último Despliegue

1. Ve a **Deployments**
2. Haz clic en el despliegue más reciente
3. Revisa los logs para identificar errores específicos

### Paso 4: Probar Build Localmente

```bash
cd nextjs_space
npm install
npm run build
```

Si el build local funciona, el problema es de configuración en Vercel.

### Paso 5: Verificar Estructura del Proyecto

Asegúrate de que existan:
- `nextjs_space/package.json`
- `nextjs_space/next.config.js`
- `nextjs_space/tsconfig.json`
- `nextjs_space/app/layout.tsx`
- `nextjs_space/app/page.tsx`
- `nextjs_space/prisma/schema.prisma`

---

## 🎯 Configuración Recomendada para Vercel

### Settings → General

```
Root Directory: nextjs_space
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 20.x (o la última LTS)
```

### Settings → Environment Variables

```
DATABASE_URL=postgresql://... (Production, Preview, Development)
NEXTAUTH_URL=https://weldtech-wnkr.vercel.app (Production, Preview, Development)
NEXTAUTH_SECRET=tu-secreto-generado (Production, Preview, Development)
```

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Troubleshooting Vercel](https://vercel.com/docs/troubleshooting)
- [Prisma en Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## 🆘 Si el Problema Persiste

1. **Revisa los logs detallados** en Vercel
2. **Prueba el build localmente** para aislar el problema
3. **Verifica la configuración** paso a paso usando el checklist
4. **Consulta la documentación** de Vercel y Next.js
5. **Contacta al soporte de Vercel** si es necesario

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

