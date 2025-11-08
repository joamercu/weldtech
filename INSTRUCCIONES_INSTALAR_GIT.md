# 📥 Instalar Git y Subir Proyecto a GitHub

## 🚀 Opción 1: Instalación Rápida con winget (Windows 10/11)

```powershell
# Abre PowerShell como Administrador
winget install --id Git.Git -e --source winget
```

Después de instalar, **cierra y vuelve a abrir** la terminal.

## 🚀 Opción 2: Instalación con Chocolatey

```powershell
# Abre PowerShell como Administrador
choco install git -y
```

Después de instalar, **cierra y vuelve a abrir** la terminal.

## 🚀 Opción 3: Instalación Manual (Recomendada)

### Paso 1: Descargar Git

1. Ve a: https://git-scm.com/download/win
2. Descarga el instalador (64-bit Git for Windows Setup)
3. Ejecuta el instalador

### Paso 2: Configurar la Instalación

Durante la instalación, asegúrate de:

1. ✅ **Seleccionar "Add Git to PATH"** (muy importante)
2. ✅ Usar "Git from the command line and also from 3rd-party software"
3. ✅ Seleccionar "Use bundled OpenSSH"
4. ✅ Seleccionar "Use the OpenSSL library"
5. ✅ Seleccionar "Checkout Windows-style, commit Unix-style line endings"
6. ✅ Seleccionar "Use MinTTY"

### Paso 3: Verificar Instalación

Después de instalar, **cierra y vuelve a abrir** la terminal y ejecuta:

```bash
git --version
```

Deberías ver algo como: `git version 2.xx.x`

## ✅ Después de Instalar Git

### Paso 1: Configurar Git (Primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 2: Subir el Proyecto

```bash
# Ejecutar el script
subir_a_github_con_token.bat
```

O usar el script combinado:

```bash
instalar_git_y_subir.bat
```

## 🔍 Verificar si Git está Instalado

```bash
# Verificar versión
git --version

# Verificar ubicación
where git
```

## 🆘 Problemas Comunes

### "Git no está en el PATH"

**Solución:**
1. Busca "Variables de entorno" en Windows
2. Edita la variable `Path`
3. Agrega la ruta de Git (normalmente: `C:\Program Files\Git\cmd`)
4. Reinicia la terminal

### "No puedo ejecutar el script"

**Solución:**
```powershell
# En PowerShell, ejecuta:
.\subir_a_github_con_token.bat

# O en CMD:
subir_a_github_con_token.bat
```

### "Error de permisos"

**Solución:**
- Ejecuta la terminal como Administrador
- O instala Git sin permisos de administrador

## 📖 Próximos Pasos

Después de instalar Git y subir el proyecto:

1. ✅ Configurar secrets en GitHub (ver `.github/DEPLOYMENT_GUIDE.md`)
2. ✅ Conectar con Vercel (si usas despliegue en Vercel)
3. ✅ Verificar que los workflows funcionen

## 🔗 Enlaces Útiles

- [Git para Windows](https://git-scm.com/download/win)
- [Documentación de Git](https://git-scm.com/doc)
- [Guía de GitHub](https://docs.github.com/)

