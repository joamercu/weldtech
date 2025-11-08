# 🔐 Configuración Rápida con Token de GitHub

## ⚠️ IMPORTANTE: Seguridad del Token

El token que has proporcionado (`ghp_...`) es **sensible** y debe ser protegido:

- ❌ **NUNCA** lo commitees al repositorio
- ❌ **NUNCA** lo compartas públicamente
- ✅ Úsalo solo para configurar secrets
- ✅ Revócalo después de usarlo si es necesario

## 🚀 Opción 1: Usar GitHub CLI (Recomendado)

### Paso 1: Instalar GitHub CLI
```bash
# Windows (PowerShell como Administrador)
choco install gh

# O descarga desde: https://cli.github.com/
```

### Paso 2: Autenticarse con el Token
```bash
# Autenticarse con el token
gh auth login --with-token <<< "TU_TOKEN_DE_GITHUB_AQUI"

# O manualmente
echo "TU_TOKEN_DE_GITHUB_AQUI" | gh auth login --with-token
```

### Paso 3: Configurar Secrets
```bash
# Ejecutar el script interactivo
bash .github/scripts/setup-secrets.sh
```

## 🚀 Opción 2: Usar Script Node.js

### Paso 1: Instalar Dependencias
```bash
cd .github/scripts
npm install tweetsodium
```

### Paso 2: Configurar Token
```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN="TU_TOKEN_DE_GITHUB_AQUI"

# Linux/macOS
export GITHUB_TOKEN="TU_TOKEN_DE_GITHUB_AQUI"
```

### Paso 3: Ejecutar Script
```bash
node setup-secrets.js
```

## 🚀 Opción 3: Configuración Manual (Más Segura)

### Paso 1: Ir a GitHub
1. Ve a tu repositorio en GitHub
2. Click en `Settings` → `Secrets and variables` → `Actions`

### Paso 2: Agregar Secrets Manualmente
Para cada secret necesario, click en `New repository secret` y agrega:

**Secrets Requeridos para Vercel:**
- `VERCEL_TOKEN` - Token de Vercel
- `VERCEL_ORG_ID` - ID de tu organización en Vercel
- `VERCEL_PROJECT_ID` - ID de tu proyecto en Vercel
- `DATABASE_URL` - URL de tu base de datos
- `NEXTAUTH_URL` - URL de tu aplicación (ej: `https://tu-app.vercel.app`)
- `NEXTAUTH_SECRET` - Secret para NextAuth (genera uno con: `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_URL` - URL de tu API (opcional)

## 🔑 Obtener Tokens de Vercel

### Token de Vercel:
1. Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click en `Create Token`
3. Copia el token generado

### IDs de Vercel:
1. Ve a tu proyecto en Vercel
2. Click en `Settings` → `General`
3. Encuentra:
   - **Team ID** → Este es tu `VERCEL_ORG_ID`
   - **Project ID** → Este es tu `VERCEL_PROJECT_ID`

## ✅ Verificar Configuración

1. Ve a la pestaña `Actions` en GitHub
2. Deberías ver los workflows disponibles
3. Haz un push a `main` o ejecuta manualmente un workflow
4. Revisa los logs para verificar que todo funciona

## 🔒 Revocar Token (Opcional)

Si quieres revocar el token después de usarlo:

1. Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Encuentra el token
3. Click en `Revoke`

## 📖 Documentación Completa

Para más detalles, consulta:
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Guía completa
- [QUICK_START.md](../QUICK_START.md) - Inicio rápido
- [workflows/README.md](../workflows/README.md) - Información de workflows

