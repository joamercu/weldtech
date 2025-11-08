# 📤 Instrucciones para Subir el Proyecto a GitHub

## 🚀 Opción 1: Usar GitHub CLI (Recomendado - Más Fácil)

### Paso 1: Instalar GitHub CLI
```powershell
# Con Chocolatey (como Administrador)
choco install gh

# O descarga desde: https://cli.github.com/
```

### Paso 2: Autenticarse
```powershell
# Usar tu token de GitHub
gh auth login --with-token <<< "TU_TOKEN_DE_GITHUB_AQUI"

# O autenticarse interactivamente
gh auth login
```

### Paso 3: Ejecutar Script Automático
```powershell
# Ejecutar el script de PowerShell
powershell -ExecutionPolicy Bypass -File .github/scripts/upload-to-github.ps1
```

El script te guiará paso a paso para:
- ✅ Crear el repositorio (si no existe)
- ✅ Inicializar Git (si no está inicializado)
- ✅ Agregar todos los archivos
- ✅ Hacer commit y push

---

## 🚀 Opción 2: Usar Git Manualmente

### Paso 1: Instalar Git
Descarga e instala Git desde: https://git-scm.com/download/win

### Paso 2: Inicializar Repositorio
```bash
# Inicializar Git
git init

# Configurar usuario (si no está configurado)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Paso 3: Crear Repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Ingresa el nombre del repositorio
3. Elige si será público o privado
4. **NO** inicialices con README, .gitignore o licencia
5. Click en "Create repository"

### Paso 4: Conectar y Subir
```bash
# Agregar remoto (reemplaza con tu usuario y repositorio)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# O si usas SSH
git remote add origin git@github.com:TU-USUARIO/TU-REPOSITORIO.git

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: WeldTech application"

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Opción 3: Usar Token de GitHub con Git

Si prefieres usar el token directamente con Git:

### Paso 1: Configurar Remoto con Token
```bash
# Reemplaza TU-USUARIO, TU-REPOSITORIO y TU_TOKEN
git remote add origin https://TU_TOKEN@github.com/TU-USUARIO/TU-REPOSITORIO.git
```

### Paso 2: Subir Código
```bash
git add .
git commit -m "Initial commit: WeldTech application"
git branch -M main
git push -u origin main
```

---

## ⚠️ Archivos que NO se Suben

El proyecto incluye un `.gitignore` que excluye:
- `node_modules/` - Dependencias de Node.js
- `.next/` - Build de Next.js
- `.env` - Variables de entorno (sensibles)
- `*.db` - Bases de datos locales
- `__pycache__/` - Cache de Python
- Archivos temporales y logs

**Importante:** Asegúrate de que `.env` no se suba al repositorio.

---

## ✅ Verificar que se Subió Correctamente

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. Verifica que `.github/workflows/` contenga los workflows
4. Ve a la pestaña `Actions` para ver los workflows disponibles

---

## 🔧 Troubleshooting

### Error: "git no se reconoce"
**Solución:** Instala Git desde https://git-scm.com/download/win

### Error: "gh no se reconoce"
**Solución:** Instala GitHub CLI desde https://cli.github.com/

### Error: "Permission denied"
**Solución:** 
- Verifica que el token sea válido
- Asegúrate de tener permisos en el repositorio
- Intenta autenticarte nuevamente

### Error: "Repository not found"
**Solución:**
- Verifica que el repositorio exista
- Asegúrate de tener acceso al repositorio
- Crea el repositorio primero en GitHub

### Error: "Large files"
**Solución:**
- Verifica que archivos grandes estén en `.gitignore`
- Considera usar Git LFS para archivos grandes

---

## 📋 Checklist Antes de Subir

- [ ] Git está instalado y configurado
- [ ] El repositorio existe en GitHub (o se creará automáticamente)
- [ ] `.env` está en `.gitignore` (no se subirá)
- [ ] `node_modules/` está en `.gitignore`
- [ ] Has revisado qué archivos se van a subir (`git status`)
- [ ] Tienes el token de GitHub o estás autenticado

---

## 🎯 Después de Subir

1. **Configurar Secrets:**
   - Ve a `Settings` → `Secrets and variables` → `Actions`
   - Agrega los secrets necesarios (ver `DEPLOYMENT_GUIDE.md`)

2. **Activar Workflows:**
   - Los workflows se activarán automáticamente en cada push
   - Puedes ejecutarlos manualmente desde la pestaña `Actions`

3. **Verificar Despliegue:**
   - Revisa los logs en `Actions`
   - Verifica que el despliegue se complete correctamente

---

## 📖 Documentación Relacionada

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa de despliegue
- [QUICK_START.md](./QUICK_START.md) - Inicio rápido
- [scripts/README.md](./scripts/README.md) - Scripts disponibles

