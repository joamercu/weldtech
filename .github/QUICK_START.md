# 🚀 Inicio Rápido - Despliegue Automático

Guía rápida para configurar el despliegue automático en 5 minutos.

## Opción 1: Usar GitHub CLI (Recomendado)

### Paso 1: Instalar GitHub CLI
```bash
# Windows (con Chocolatey)
choco install gh

# macOS
brew install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### Paso 2: Autenticarse
```bash
gh auth login
```

### Paso 3: Configurar Secrets
```bash
# Usar el script interactivo
bash .github/scripts/setup-secrets.sh
```

O configurar manualmente:
```bash
# Token de Vercel
gh secret set VERCEL_TOKEN --repo tu-usuario/tu-repo

# ID de Organización
gh secret set VERCEL_ORG_ID --repo tu-usuario/tu-repo

# ID de Proyecto
gh secret set VERCEL_PROJECT_ID --repo tu-usuario/tu-repo

# Base de datos
gh secret set DATABASE_URL --repo tu-usuario/tu-repo

# NextAuth
gh secret set NEXTAUTH_URL --repo tu-usuario/tu-repo
gh secret set NEXTAUTH_SECRET --repo tu-usuario/tu-repo
```

## Opción 2: Configuración Manual en GitHub

### Paso 1: Ir a Settings
1. Ve a tu repositorio en GitHub
2. Click en `Settings`
3. Click en `Secrets and variables` → `Actions`

### Paso 2: Agregar Secrets
Para cada secret:
1. Click en `New repository secret`
2. Ingresa el nombre (ej: `VERCEL_TOKEN`)
3. Ingresa el valor
4. Click en `Add secret`

### Paso 3: Verificar
Los secrets aparecerán en la lista (sin mostrar sus valores).

## 🔑 Obtener Tokens de Vercel

### Token de Vercel:
1. Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click en `Create Token`
3. Copia el token generado

### ID de Organización y Proyecto:
1. Ve a tu proyecto en Vercel
2. Click en `Settings` → `General`
3. Encuentra:
   - **Team ID** (esto es tu `VERCEL_ORG_ID`)
   - **Project ID** (esto es tu `VERCEL_PROJECT_ID`)

## ✅ Verificar Configuración

1. Ve a la pestaña `Actions` en GitHub
2. Deberías ver los workflows disponibles
3. Haz un push a `main` o ejecuta manualmente un workflow
4. Revisa los logs para verificar que todo funciona

## 🎯 Próximos Pasos

- ✅ Configurar todos los secrets
- ✅ Hacer push a `main` para activar el despliegue
- ✅ Revisar el despliegue en Vercel
- ✅ Configurar dominio personalizado (opcional)

## 📖 Documentación Completa

Para más detalles, consulta:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa
- [workflows/README.md](./workflows/README.md) - Información de workflows

## 🆘 Problemas Comunes

### "Workflow no se ejecuta"
- Verifica que el workflow esté en `.github/workflows/`
- Verifica que estés haciendo push a `main` o `master`

### "Error: Secret not found"
- Verifica que todos los secrets estén configurados
- Revisa los nombres de los secrets (deben coincidir exactamente)

### "Error: Vercel deployment failed"
- Verifica que los tokens de Vercel sean válidos
- Asegúrate de que el proyecto esté vinculado en Vercel

