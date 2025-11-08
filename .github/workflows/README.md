# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el despliegue automático de la aplicación WeldTech.

## 📁 Archivos Disponibles

### 1. `deploy-vercel.yml`
Workflow para desplegar automáticamente en Vercel (recomendado para Next.js).

**Características:**
- ✅ Despliegue automático en cada push a `main`/`master`
- ✅ Preview deployments para Pull Requests
- ✅ Build y test automáticos
- ✅ Optimizado para Next.js

### 2. `deploy-github-pages.yml`
Workflow para desplegar en GitHub Pages (solo export estático).

**Características:**
- ✅ Gratis y sin configuración adicional
- ✅ SSL automático
- ⚠️ Solo funciona con export estático

### 3. `deploy-custom-server.yml`
Workflow para desplegar en un servidor personalizado vía SSH.

**Características:**
- ✅ Control total del servidor
- ✅ Despliegue vía SSH
- ✅ Reinicio automático con PM2

## 🚀 Inicio Rápido

1. **Elige un workflow** según tus necesidades
2. **Configura los secrets** necesarios (ver `DEPLOYMENT_GUIDE.md`)
3. **Haz push a `main`** o ejecuta manualmente desde `Actions`

## 📖 Documentación Completa

Consulta [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas de configuración.

## ⚙️ Configuración

Todos los workflows requieren secrets configurados en:
`Settings` → `Secrets and variables` → `Actions`

Ver la guía completa para la lista de secrets requeridos.

