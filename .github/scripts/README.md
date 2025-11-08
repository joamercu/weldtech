# Scripts de Configuración

Este directorio contiene scripts útiles para configurar y gestionar el despliegue.

## 📁 Scripts Disponibles

### `setup-secrets.sh`
Script interactivo para configurar secrets de GitHub Actions usando GitHub CLI.

**Requisitos:**
- GitHub CLI instalado (`gh`)
- Autenticado con `gh auth login`

**Uso:**
```bash
bash .github/scripts/setup-secrets.sh
```

**Características:**
- ✅ Interfaz interactiva
- ✅ Configuración individual o masiva
- ✅ Generación automática de NEXTAUTH_SECRET
- ✅ Soporte para todos los secrets necesarios

### `setup-secrets.js`
Script alternativo en Node.js para configurar secrets vía API de GitHub.

**Requisitos:**
- Node.js instalado
- Paquete `tweetsodium`: `npm install tweetsodium`
- Token de GitHub en variable de entorno `GITHUB_TOKEN`

**Uso:**
```bash
export GITHUB_TOKEN=tu_token_github
node .github/scripts/setup-secrets.js
```

## 🔐 Configuración Manual

Si prefieres configurar los secrets manualmente:

1. Ve a tu repositorio en GitHub
2. Click en `Settings` → `Secrets and variables` → `Actions`
3. Click en `New repository secret`
4. Agrega cada secret con su nombre y valor

## 📋 Secrets Requeridos

### Para Vercel:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL` (opcional)

### Para Servidor Personalizado:
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `SSH_PORT` (opcional, default: 22)
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL` (opcional)

## ⚠️ Seguridad

- **NUNCA** commitees tokens o secrets en el repositorio
- **NUNCA** compartas tokens públicamente
- Usa siempre los secrets de GitHub Actions para valores sensibles
- Rota los tokens periódicamente

