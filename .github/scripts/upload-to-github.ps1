# Script para subir el proyecto a GitHub
# Requiere: GitHub CLI (gh) instalado y autenticado

Write-Host "🚀 Subiendo proyecto a GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar si GitHub CLI está instalado
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instálalo desde: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "O usa Git directamente:" -ForegroundColor Yellow
    Write-Host "  1. Instala Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "  2. Ejecuta los comandos manualmente (ver INSTRUCCIONES.md)" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticación
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No estás autenticado con GitHub CLI" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Autenticándose con el token proporcionado..." -ForegroundColor Cyan
    
    $token = "TU_TOKEN_DE_GITHUB_AQUI"
    echo $token | gh auth login --with-token
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al autenticarse" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Autenticado correctamente" -ForegroundColor Green
Write-Host ""

# Obtener información del repositorio
Write-Host "📦 Configurando repositorio..." -ForegroundColor Cyan

$repoName = Read-Host "Nombre del repositorio (o presiona Enter para usar el nombre del directorio actual)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = Split-Path -Leaf (Get-Location)
}

$repoOwner = Read-Host "Usuario/Organización de GitHub (o presiona Enter para usar tu usuario)"
if ([string]::IsNullOrWhiteSpace($repoOwner)) {
    $repoOwner = (gh api user -q .login)
    Write-Host "   Usando: $repoOwner" -ForegroundColor Gray
}

$fullRepo = "$repoOwner/$repoName"

# Verificar si el repositorio existe
Write-Host ""
Write-Host "🔍 Verificando si el repositorio existe..." -ForegroundColor Cyan
$repoExists = gh repo view $fullRepo 2>&1

if ($LASTEXITCODE -ne 0) {
    # Crear repositorio
    Write-Host "📝 El repositorio no existe. Creándolo..." -ForegroundColor Yellow
    
    $isPrivate = Read-Host "¿Quieres que el repositorio sea privado? (S/n)"
    $privateFlag = if ($isPrivate -eq "S" -or $isPrivate -eq "s") { "--private" } else { "--public" }
    
    gh repo create $fullRepo $privateFlag --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repositorio creado y código subido correctamente" -ForegroundColor Green
        Write-Host "   URL: https://github.com/$fullRepo" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error al crear el repositorio" -ForegroundColor Red
        exit 1
    }
} else {
    # Repositorio existe, solo hacer push
    Write-Host "✅ El repositorio ya existe" -ForegroundColor Green
    Write-Host ""
    Write-Host "📤 Subiendo cambios..." -ForegroundColor Cyan
    
    # Verificar si git está inicializado
    if (-not (Test-Path .git)) {
        Write-Host "   Inicializando repositorio Git local..." -ForegroundColor Yellow
        git init
        git remote add origin "https://github.com/$fullRepo.git"
    } else {
        # Verificar si el remoto existe
        $remoteExists = git remote get-url origin 2>&1
        if ($LASTEXITCODE -ne 0) {
            git remote add origin "https://github.com/$fullRepo.git"
        } else {
            git remote set-url origin "https://github.com/$fullRepo.git"
        }
    }
    
    # Agregar todos los archivos
    Write-Host "   Agregando archivos..." -ForegroundColor Yellow
    git add .
    
    # Commit
    $commitMessage = Read-Host "Mensaje de commit (o presiona Enter para usar mensaje por defecto)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Initial commit: WeldTech application"
    }
    
    Write-Host "   Haciendo commit..." -ForegroundColor Yellow
    git commit -m $commitMessage
    
    # Push
    Write-Host "   Subiendo a GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -ne 0) {
        # Intentar con master
        git push -u origin master
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Código subido correctamente" -ForegroundColor Green
        Write-Host "   URL: https://github.com/$fullRepo" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error al subir el código" -ForegroundColor Red
        Write-Host "   Intenta ejecutar manualmente:" -ForegroundColor Yellow
        Write-Host "   git push -u origin main" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 ¡Proyecto subido exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Configura los secrets en GitHub Actions" -ForegroundColor White
Write-Host "   2. Revisa los workflows en la pestaña Actions" -ForegroundColor White
Write-Host "   3. Haz push a main para activar el despliegue automático" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulta .github/DEPLOYMENT_GUIDE.md para más información" -ForegroundColor Gray

