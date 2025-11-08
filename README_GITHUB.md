# 🚀 Guía Rápida: Subir Proyecto a GitHub

## ⚡ Opción Rápida (Recomendada)

### Usar el Script con Token

1. **Ejecuta el script:**
   ```bash
   subir_a_github_con_token.bat
   ```

2. **Ingresa la información:**
   - Tu usuario de GitHub
   - El nombre de tu repositorio

3. **¡Listo!** El script hará todo automáticamente.

## 📋 Requisitos Previos

### 1. Instalar Git

**Windows:**
- Descarga desde: https://git-scm.com/download/win
- O instala con Chocolatey: `choco install git`

**Verificar instalación:**
```bash
git --version
```

### 2. Crear Repositorio en GitHub

1. Ve a https://github.com
2. Click en el botón `+` → `New repository`
3. Ingresa el nombre del repositorio (ej: `weldtech-app`)
4. **NO** inicialices con README, .gitignore o licencia
5. Click en `Create repository`

## 🎯 Pasos para Subir el Proyecto

### Opción 1: Script Automático (Más Fácil)

```bash
# Ejecutar script con token
subir_a_github_con_token.bat
```

### Opción 2: Script Interactivo

```bash
# Ejecutar script interactivo
subir_a_github.bat
```

### Opción 3: Comandos Manuales

```bash
# 1. Inicializar repositorio (si no está inicializado)
git init

# 2. Agregar repositorio remoto
git remote add origin https://TU_TOKEN@github.com/TU_USUARIO/TU_REPOSITORIO.git

# 3. Agregar archivos
git add .

# 4. Hacer commit
git commit -m "Initial commit: Agregar proyecto WeldTech"

# 5. Subir a GitHub
git push -u origin main
```

## 🔐 Usar tu Token de GitHub

El script `subir_a_github_con_token.bat` ya incluye tu token. Si prefieres usar comandos manuales:

```bash
# Reemplaza TU_TOKEN con tu token
git remote add origin https://TU_TOKEN@github.com/TU_USUARIO/TU_REPOSITORIO.git
```

**⚠️ IMPORTANTE:** 
- No compartas tu token públicamente
- No lo commitees al repositorio
- El script automáticamente remueve el token de la configuración después del push

## ✅ Verificar que Todo Funcionó

1. **Ve a tu repositorio en GitHub:**
   - https://github.com/TU_USUARIO/TU_REPOSITORIO

2. **Verifica que los archivos estén presentes:**
   - Deberías ver todos los archivos del proyecto
   - Especialmente `.github/workflows/` con los workflows de despliegue

3. **Verifica los workflows:**
   - Ve a la pestaña `Actions`
   - Deberías ver los workflows disponibles

## 🔄 Actualizar el Repositorio (Después del Primer Push)

Para subir cambios futuros:

```bash
# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push
```

## 🆘 Problemas Comunes

### "Git no está instalado"
**Solución:** Instala Git desde https://git-scm.com/download/win

### "El repositorio no existe"
**Solución:** Crea el repositorio en GitHub primero antes de hacer push

### "Error: Permission denied"
**Solución:** 
- Verifica que el token sea correcto
- Asegúrate de que el repositorio exista
- Verifica que tengas permisos de escritura

### "Error: Failed to push some refs"
**Solución:**
```bash
# Si hay cambios en el remoto
git pull origin main --rebase
git push
```

## 📖 Documentación Completa

Para más detalles, consulta:
- `INSTRUCCIONES_SUBIR_GITHUB.md` - Guía completa
- `.github/DEPLOYMENT_GUIDE.md` - Guía de despliegue
- `.github/QUICK_START.md` - Inicio rápido

## 🎉 Próximos Pasos

Después de subir el proyecto:

1. ✅ **Configurar Secrets en GitHub**
   - Ve a: `Settings` → `Secrets and variables` → `Actions`
   - Agrega los secrets necesarios (ver `.github/DEPLOYMENT_GUIDE.md`)

2. ✅ **Conectar con Vercel** (si usas despliegue en Vercel)
   - Ve a https://vercel.com
   - Importa tu repositorio de GitHub

3. ✅ **Verificar Workflows**
   - Ve a la pestaña `Actions` en GitHub
   - Los workflows se ejecutarán automáticamente en cada push

