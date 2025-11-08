# 🔧 Solución: "Failed to collect page data for /api/auth/[...nextauth]" en Vercel

**Error:** `Error: Failed to collect page data for /api/auth/[...nextauth]`

---

## 🔍 Diagnóstico

Este error ocurre porque Next.js intenta recopilar datos de la página de NextAuth durante el build, pero NextAuth intenta inicializarse y conectarse a Prisma, lo que puede fallar durante el build.

**Problema:**
- Next.js intenta pre-renderizar o recopilar datos de la ruta `/api/auth/[...nextauth]` durante el build
- NextAuth intenta inicializarse y usar Prisma Client durante el build
- Prisma Client puede no estar disponible o la base de datos puede no estar accesible durante el build

---

## ✅ Solución Implementada

### Cambio 1: Hacer la ruta de NextAuth dinámica

He agregado configuración a la ruta de NextAuth para evitar la recopilación de datos durante el build:

```typescript
// app/api/auth/[...nextauth]/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

**¿Por qué?**
- `dynamic = 'force-dynamic'` le dice a Next.js que esta ruta es completamente dinámica y no debe intentar pre-renderizarla o recopilar datos durante el build
- `runtime = 'nodejs'` asegura que la ruta se ejecute en el servidor Node.js

### Cambio 2: Hacer GoogleProvider opcional

He hecho que GoogleProvider solo se configure si las credenciales están disponibles:

```typescript
providers: [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [GoogleProvider({ ... })]
    : []),
  CredentialsProvider({ ... }),
]
```

**¿Por qué?**
- Evita errores si las credenciales de Google no están configuradas durante el build
- La aplicación seguirá funcionando con solo CredentialsProvider

### Cambio 3: Secret con fallback

He agregado un fallback para `NEXTAUTH_SECRET`:

```typescript
secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
```

**¿Por qué?**
- Evita errores si `NEXTAUTH_SECRET` no está disponible durante el build
- **IMPORTANTE:** Asegúrate de configurar `NEXTAUTH_SECRET` en Vercel para producción

---

## 📋 Pasos para Aplicar la Solución

### Paso 1: Verificar Cambios

Los cambios ya están aplicados en:
- `nextjs_space/app/api/auth/[...nextauth]/route.ts`
- `nextjs_space/lib/auth.ts`

### Paso 2: Hacer Push de los Cambios

```bash
git add nextjs_space/app/api/auth/[...nextauth]/route.ts
git add nextjs_space/lib/auth.ts
git commit -m "fix: Hacer ruta de NextAuth dinámica para evitar errores en build"
git push origin main
```

### Paso 3: Verificar Variables de Entorno en Vercel

1. Ve a Vercel Dashboard: https://vercel.com/dashboard
2. Selecciona tu proyecto `weldtech-wnkr`
3. Ve a **Settings** → **Environment Variables**
4. Verifica que estas variables estén configuradas:
   - `DATABASE_URL` (Production, Preview, Development)
   - `NEXTAUTH_URL` (Production, Preview, Development)
   - `NEXTAUTH_SECRET` (Production, Preview, Development)
   - `GOOGLE_CLIENT_ID` (opcional, solo si usas OAuth con Google)
   - `GOOGLE_CLIENT_SECRET` (opcional, solo si usas OAuth con Google)

### Paso 4: Re-desplegar

1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos (⋯) del último despliegue
3. Selecciona **Redeploy**
4. Espera a que termine el despliegue

---

## 🔍 Verificación

### Verificar que el Build Funciona

En los logs de Vercel, deberías ver:

1. **Durante el build:**
   ```
   Building...
   ✓ Compiled successfully
   ```

2. **No deberías ver:**
   ```
   Error: Failed to collect page data for /api/auth/[...nextauth]
   ```

### Verificar que NextAuth Funciona en Runtime

1. Visita tu URL de Vercel: `https://weldtech-wnkr.vercel.app`
2. Ve a `/auth/login`
3. Intenta iniciar sesión
4. Verifica que la autenticación funcione correctamente

---

## 🐛 Solución de Problemas

### Error: "NEXTAUTH_SECRET is not set"

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `NEXTAUTH_SECRET` si no está configurada
3. Genera un secreto con: `openssl rand -base64 32`
4. O usa: https://generate-secret.vercel.app/32
5. Haz un redeploy

### Error: "DATABASE_URL is not set"

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `DATABASE_URL` si no está configurada
3. Asegúrate de que esté marcada para Production, Preview y Development
4. Haz un redeploy

### Error: "Prisma Client not generated"

**Solución:**
1. Verifica que `prebuild` esté en `package.json`:
   ```json
   "prebuild": "prisma generate"
   ```
2. Verifica que Prisma Client se genere durante el build (deberías verlo en los logs)
3. Haz un redeploy

---

## 📚 Información Adicional

### ¿Por qué `force-dynamic`?

- Las rutas de API de Next.js son dinámicas por defecto, pero Next.js puede intentar analizarlas durante el build
- `force-dynamic` le dice explícitamente a Next.js que esta ruta es dinámica y no debe intentar pre-renderizarla
- Esto evita que Next.js intente recopilar datos de la ruta durante el build

### ¿Por qué hacer GoogleProvider opcional?

- Si las credenciales de Google no están configuradas, NextAuth fallará al inicializar
- Hacer el provider opcional permite que la aplicación funcione con solo CredentialsProvider
- Esto es útil durante el desarrollo o si no usas OAuth con Google

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] `dynamic = 'force-dynamic'` está en `route.ts`
- [ ] `runtime = 'nodejs'` está en `route.ts`
- [ ] `DATABASE_URL` está configurada en Vercel
- [ ] `NEXTAUTH_URL` está configurada en Vercel
- [ ] `NEXTAUTH_SECRET` está configurada en Vercel
- [ ] `prebuild` está en `package.json` (no `postbuild`)
- [ ] Root Directory está configurado como `nextjs_space`
- [ ] Se hizo un redeploy después de los cambios
- [ ] Los logs muestran que el build fue exitoso

---

## 🎯 Configuración Final Recomendada

### app/api/auth/[...nextauth]/route.ts
```typescript
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

### lib/auth.ts
```typescript
secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
providers: [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [GoogleProvider({ ... })]
    : []),
  CredentialsProvider({ ... }),
]
```

### Vercel Settings → Environment Variables
```
DATABASE_URL=postgresql://... (Production, Preview, Development)
NEXTAUTH_URL=https://weldtech-wnkr.vercel.app (Production, Preview, Development)
NEXTAUTH_SECRET=... (Production, Preview, Development)
GOOGLE_CLIENT_ID=... (opcional)
GOOGLE_CLIENT_SECRET=... (opcional)
```

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

