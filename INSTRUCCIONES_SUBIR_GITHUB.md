# 📤 Instrucciones para Subir el Proyecto a GitHub

Esta guía te ayudará a subir tu proyecto WeldTech a tu repositorio de GitHub.

## 🚀 Opción 1: Usar el Script Automático (Recomendado)

### Paso 1: Ejecutar el Script
```bash
# En Windows
subir_a_github.bat
```

El script te guiará paso a paso:
1. Verificará si Git está instalado
2. Inicializará el repositorio si es necesario
3. Configurará el repositorio remoto
4. Agregará todos los archivos
5. Hará commit de los cambios
6. Subirá los cambios a GitHub

## 🚀 Opción 2: Comandos Manuales

### Paso 1: Instalar Git (si no está instalado)

**Windows:**
- Descarga desde: https://git-scm.com/download/win
- O instala con Chocolatey: `choco install git`

**Verificar instalación:**
```bash
git --version
```

### Paso 2: Configurar Git (si es la primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 3: Inicializar el Repositorio

```bash
# Si no hay repositorio git inicializado
git init

# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# O si ya existe, actualizar la URL
git remote set-url origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

### Paso 4: Agregar Archivos

```bash
# Ver qué archivos se van a agregar
git status

# Agregar todos los archivos
git add .

# Verificar qué se agregó
git status
```

### Paso 5: Hacer Commit

```bash
git commit -m "Initial commit: Agregar proyecto WeldTech con workflows de despliegue"
```

### Paso 6: Subir a GitHub

```bash
# Subir a la rama main
git push -u origin main

# O si tu rama principal es master
git push -u origin master
```

## 🔐 Autenticación con GitHub

### Opción 1: GitHub CLI (Recomendado)

```bash
# Instalar GitHub CLI
# Windows: choco install gh
# O descarga desde: https://cli.github.com/

# Autenticarse
gh auth login

# Seguir las instrucciones en pantalla
```

### Opción 2: Token Personal

```bash
# Usar tu token personal
git remote set-url origin https://TU_TOKEN@github.com/TU_USUARIO/TU_REPOSITORIO.git

# O configurar credenciales
git config --global credential.helper store
```

### Opción 3: SSH

```bash
# Generar clave SSH (si no tienes una)
ssh-keygen -t ed25519 -C "tu@email.com"

# Agregar clave a GitHub
# Copia el contenido de ~/.ssh/id_ed25519.pub
# Ve a GitHub → Settings → SSH and GPG keys → New SSH key

# Cambiar URL remota a SSH
git remote set-url origin git@github.com:TU_USUARIO/TU_REPOSITORIO.git
```

## ⚠️ Archivos que NO se Suben

El archivo `.gitignore` está configurado para NO subir:
- ✅ Archivos de entorno (`.env`)
- ✅ Dependencias (`node_modules/`)
- ✅ Builds (`.next/`, `out/`, `dist/`)
- ✅ Bases de datos locales (`prisma/*.db`)
- ✅ Logs (`*.log`)
- ✅ Archivos temporales

**Los workflows de GitHub Actions SÍ se suben** (están en `.github/workflows/`)

## 📋 Verificar que Todo Esté Correcto

### Verificar Archivos Agregados
```bash
git status
```

### Verificar Repositorio Remoto
```bash
git remote -v
```

### Ver Historial de Commits
```bash
git log --oneline
```

## 🔄 Actualizar el Repositorio

Después del primer push, para actualizar cambios futuros:

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

### "No se puede autenticar"
**Solución:** 
- Usa GitHub CLI: `gh auth login`
- O configura un token personal en la URL remota

### "El repositorio remoto no existe"
**Solución:**
1. Ve a GitHub y crea un nuevo repositorio
2. Copia la URL del repositorio
3. Configura el remoto: `git remote add origin URL_DEL_REPOSITORIO`

### "Error: Permission denied"
**Solución:**
- Verifica que tengas permisos de escritura en el repositorio
- Asegúrate de estar autenticado correctamente

### "Error: Failed to push some refs"
**Solución:**
```bash
# Si hay cambios en el remoto que no tienes localmente
git pull origin main --rebase

# Luego intenta push de nuevo
git push
```

## ✅ Verificar Despliegue

Después de subir el proyecto:

1. Ve a tu repositorio en GitHub
2. Verifica que todos los archivos estén presentes
3. Ve a la pestaña `Actions` para ver los workflows
4. Los workflows se ejecutarán automáticamente en cada push

## 📖 Próximos Pasos

Después de subir el proyecto:

1. ✅ Configurar secrets en GitHub (ver `.github/DEPLOYMENT_GUIDE.md`)
2. ✅ Conectar con Vercel (si usas despliegue en Vercel)
3. ✅ Verificar que los workflows funcionen correctamente

## 🔗 Enlaces Útiles

- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub Authentication](https://docs.github.com/en/authentication)

