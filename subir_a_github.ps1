# Script PowerShell para subir el proyecto a GitHub
# Uso: .\subir_a_github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Subir Proyecto a GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Actualizar PATH para incluir Git
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verificar si Git está instalado
try {
    $gitVersion = git --version 2>&1
    Write-Host "[OK] Git está instalado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Git desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Token de GitHub (configura tu token aquí)
$GITHUB_TOKEN = "TU_TOKEN_DE_GITHUB_AQUI"

# Solicitar información del repositorio
Write-Host "[INFO] Necesito la información de tu repositorio de GitHub" -ForegroundColor Yellow
Write-Host ""

$GITHUB_USER = Read-Host "Ingresa tu usuario de GitHub"
if ([string]::IsNullOrWhiteSpace($GITHUB_USER)) {
    Write-Host "[ERROR] Usuario de GitHub requerido" -ForegroundColor Red
    exit 1
}

$GITHUB_REPO = Read-Host "Ingresa el nombre de tu repositorio"
if ([string]::IsNullOrWhiteSpace($GITHUB_REPO)) {
    Write-Host "[ERROR] Nombre de repositorio requerido" -ForegroundColor Red
    exit 1
}

# Construir URL del repositorio con token
$REPO_URL = "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

Write-Host ""
Write-Host "[INFO] Repositorio: ${GITHUB_USER}/${GITHUB_REPO}" -ForegroundColor Cyan
Write-Host "[INFO] URL: https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git" -ForegroundColor Cyan
Write-Host ""

# Verificar si hay un repositorio git inicializado
if (-not (Test-Path ".git")) {
    Write-Host "[INFO] Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] No se pudo inicializar el repositorio" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Repositorio inicializado" -ForegroundColor Green
    Write-Host ""
}

# Configurar repositorio remoto
Write-Host "[INFO] Configurando repositorio remoto..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin $REPO_URL
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo configurar el repositorio remoto" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Repositorio remoto configurado" -ForegroundColor Green
Write-Host ""

# Configurar usuario de Git si no está configurado
$currentUser = git config user.name 2>$null
if ([string]::IsNullOrWhiteSpace($currentUser)) {
    git config user.name $GITHUB_USER
    Write-Host "[OK] Usuario de Git configurado: $GITHUB_USER" -ForegroundColor Green
}

$currentEmail = git config user.email 2>$null
if ([string]::IsNullOrWhiteSpace($currentEmail)) {
    $GITHUB_EMAIL = Read-Host "Ingresa tu email de GitHub (opcional, presiona Enter para omitir)"
    if (-not [string]::IsNullOrWhiteSpace($GITHUB_EMAIL)) {
        git config user.email $GITHUB_EMAIL
        Write-Host "[OK] Email de Git configurado" -ForegroundColor Green
    }
}

# Agregar todos los archivos
Write-Host "[INFO] Agregando archivos al staging..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudieron agregar los archivos" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Archivos agregados" -ForegroundColor Green
Write-Host ""

# Verificar si hay cambios para commitear
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[INFO] No hay cambios para commitear" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[INFO] Archivos listos para commit:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Hacer commit
    Write-Host "[INFO] Haciendo commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Agregar proyecto WeldTech con workflows de despliegue"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] No se pudo hacer el commit" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Commit realizado" -ForegroundColor Green
    Write-Host ""
}

# Determinar la rama principal
$currentBranch = git branch --show-current 2>$null
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git checkout -b main 2>$null
}

# Intentar push
Write-Host "[INFO] Subiendo cambios a GitHub (rama: $currentBranch)..." -ForegroundColor Yellow
Write-Host ""

git push -u origin $currentBranch
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] ========================================" -ForegroundColor Green
    Write-Host "[OK] Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
    Write-Host "[OK] ========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repositorio: https://github.com/${GITHUB_USER}/${GITHUB_REPO}" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] No se pudo hacer push automáticamente" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Yellow
    Write-Host "1. El repositorio no existe en GitHub" -ForegroundColor Yellow
    Write-Host "2. El token no tiene permisos suficientes" -ForegroundColor Yellow
    Write-Host "3. Hay conflictos con el repositorio remoto" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Yellow
    Write-Host "1. Crea el repositorio en GitHub primero" -ForegroundColor Yellow
    Write-Host "2. Verifica que el token tenga permisos de escritura" -ForegroundColor Yellow
    Write-Host "3. Intenta hacer push manualmente: git push -u origin $currentBranch" -ForegroundColor Yellow
    Write-Host ""
}

# Limpiar token de la URL remota (por seguridad)
git remote set-url origin "https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git"
Write-Host "[INFO] Token removido de la configuración remota (por seguridad)" -ForegroundColor Green
Write-Host ""

Write-Host "Presiona Enter para continuar..."
Read-Host

