# 🚀 Desplegar en GitHub Pages

Esta guía te ayudará a desplegar tu aplicación WeldTech en GitHub Pages.

## 📋 Opciones de Despliegue

### Opción 1: GitHub Pages (Export Estático)

**Ventajas:**
- ✅ Gratis
- ✅ SSL automático
- ✅ Integrado con GitHub

**Limitaciones:**
- ⚠️ Solo funciona con export estático (sin API routes del servidor)
- ⚠️ No soporta Prisma directamente
- ⚠️ Requiere configuración adicional para bases de datos

### Opción 2: GitHub Actions + Vercel (Recomendado)

**Ventajas:**
- ✅ Optimizado para Next.js
- ✅ Soporte completo de API routes
- ✅ Base de datos integrada
- ✅ Despliegue automático

---

## 🚀 Opción 1: Desplegar en GitHub Pages

### Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio: https://github.com/joamercu/weldtech
2. Click en `Settings` → `Pages`
3. En "Source", selecciona: `GitHub Actions`
4. Click en `Save`

### Paso 2: Configurar Next.js para Export Estático

El workflow `.github/workflows/deploy-github-pages.yml` ya está configurado para hacer esto automáticamente.

### Paso 3: Activar el Workflow

1. Ve a la pestaña `Actions` en GitHub
2. Selecciona el workflow "Desplegar en GitHub Pages"
3. Click en `Run workflow`
4. Selecciona la rama `master` o `main`
5. Click en `Run workflow`

### Paso 4: Verificar Despliegue

1. Ve a `Settings` → `Pages`
2. Verás la URL de tu sitio: `https://joamercu.github.io/weldtech`
3. El despliegue puede tardar unos minutos

---

## 🚀 Opción 2: Desplegar en Vercel (Recomendado)

### Paso 1: Conectar con Vercel

1. Ve a https://vercel.com
2. Click en "Add New Project"
3. Selecciona tu repositorio: `joamercu/weldtech`
4. Click en "Import"

### Paso 2: Configurar Proyecto

**Configuración importante:**
- **Root Directory:** `nextjs_space`
- **Framework Preset:** `Next.js`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Paso 3: Configurar Variables de Entorno

Antes de desplegar, agrega estas variables:

1. **DATABASE_URL**
   - URL de tu base de datos PostgreSQL
   - Puedes usar Neon (gratis): https://neon.tech

2. **NEXTAUTH_URL**
   - Será: `https://tu-proyecto.vercel.app`
   - Se actualiza después del primer deploy

3. **NEXTAUTH_SECRET**
   - Genera uno con: `openssl rand -base64 32`
   - O usa: https://generate-secret.vercel.app/32

### Paso 4: Desplegar

1. Click en "Deploy"
2. Vercel construirá y desplegará automáticamente
3. Obtendrás una URL como: `https://weldtech.vercel.app`

---

## 🔧 Activar Workflows de GitHub Actions

### Workflow 1: Despliegue en Vercel

1. Ve a: `Settings` → `Secrets and variables` → `Actions`
2. Agrega los siguientes secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

3. El workflow se ejecutará automáticamente en cada push a `main` o `master`

### Workflow 2: Despliegue en GitHub Pages

1. Ya está configurado en `.github/workflows/deploy-github-pages.yml`
2. Solo necesitas habilitar GitHub Pages (ver Opción 1)
3. El workflow se ejecutará automáticamente

---

## ✅ Verificar Despliegue

### GitHub Pages:
- URL: `https://joamercu.github.io/weldtech`
- Verifica en: `Settings` → `Pages`

### Vercel:
- URL: `https://tu-proyecto.vercel.app`
- Verifica en: Dashboard de Vercel

---

## 🆘 Problemas Comunes

### "Workflow no se ejecuta"
- Verifica que el workflow esté en `.github/workflows/`
- Verifica que estés haciendo push a `main` o `master`

### "Error: Secret not found"
- Verifica que todos los secrets estén configurados
- Revisa los nombres de los secrets (deben coincidir exactamente)

### "Error: Build failed"
- Revisa los logs en la pestaña `Actions`
- Verifica que todas las dependencias estén en `package.json`

---

## 📖 Documentación Completa

- `.github/DEPLOYMENT_GUIDE.md` - Guía completa de despliegue
- `.github/QUICK_START.md` - Inicio rápido
- `nextjs_space/DEPLOYMENT.md` - Guía específica de Vercel

