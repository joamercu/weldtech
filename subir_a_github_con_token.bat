@echo off
REM Script para subir el proyecto a GitHub usando token
REM Uso: subir_a_github_con_token.bat

echo ========================================
echo   Subir Proyecto a GitHub (con Token)
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no está instalado o no está en el PATH
    echo.
    echo Por favor instala Git desde: https://git-scm.com/download/win
    echo O agrega Git al PATH de Windows
    echo.
    pause
    exit /b 1
)

echo [OK] Git está instalado
echo.

REM Token de GitHub (configura tu token aquí)
set GITHUB_TOKEN=TU_TOKEN_DE_GITHUB_AQUI

REM Solicitar información del repositorio
echo [INFO] Necesito la información de tu repositorio de GitHub
echo.
set /p GITHUB_USER="Ingresa tu usuario de GitHub: "
if "%GITHUB_USER%"=="" (
    echo [ERROR] Usuario de GitHub requerido
    pause
    exit /b 1
)

set /p GITHUB_REPO="Ingresa el nombre de tu repositorio: "
if "%GITHUB_REPO%"=="" (
    echo [ERROR] Nombre de repositorio requerido
    pause
    exit /b 1
)

REM Construir URL del repositorio con token
set REPO_URL=https://%GITHUB_TOKEN%@github.com/%GITHUB_USER%/%GITHUB_REPO%.git

echo.
echo [INFO] Repositorio: %GITHUB_USER%/%GITHUB_REPO%
echo [INFO] URL: https://github.com/%GITHUB_USER%/%GITHUB_REPO%.git
echo.

REM Verificar si hay un repositorio git inicializado
if not exist ".git" (
    echo [INFO] Inicializando repositorio Git...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo inicializar el repositorio
        pause
        exit /b 1
    )
    echo [OK] Repositorio inicializado
    echo.
)

REM Configurar repositorio remoto
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo configurar el repositorio remoto
    pause
    exit /b 1
)
echo [OK] Repositorio remoto configurado
echo.

REM Configurar usuario de Git si no está configurado
git config user.name >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    git config user.name "%GITHUB_USER%"
    echo [OK] Usuario de Git configurado: %GITHUB_USER%
)

git config user.email >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set /p GITHUB_EMAIL="Ingresa tu email de GitHub (opcional): "
    if not "%GITHUB_EMAIL%"=="" (
        git config user.email "%GITHUB_EMAIL%"
        echo [OK] Email de Git configurado
    )
)

REM Agregar todos los archivos
echo [INFO] Agregando archivos al staging...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudieron agregar los archivos
    pause
    exit /b 1
)
echo [OK] Archivos agregados
echo.

REM Verificar si hay cambios para commitear
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo [INFO] No hay cambios para commitear
    echo.
) else (
    echo [INFO] Archivos listos para commit:
    git status --short
    echo.
    
    REM Hacer commit
    echo [INFO] Haciendo commit...
    git commit -m "Initial commit: Agregar proyecto WeldTech con workflows de despliegue"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo hacer el commit
        pause
        exit /b 1
    )
    echo [OK] Commit realizado
    echo.
)

REM Determinar la rama principal
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="" (
    set CURRENT_BRANCH=main
    git checkout -b main >nul 2>&1
)

REM Intentar push
echo [INFO] Subiendo cambios a GitHub (rama: %CURRENT_BRANCH%)...
echo.

git push -u origin %CURRENT_BRANCH%
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] ========================================
    echo [OK] Proyecto subido exitosamente a GitHub!
    echo [OK] ========================================
    echo.
    echo Repositorio: https://github.com/%GITHUB_USER%/%GITHUB_REPO%
    echo.
) else (
    echo.
    echo [ERROR] No se pudo hacer push automáticamente
    echo.
    echo Posibles causas:
    echo 1. El repositorio no existe en GitHub
    echo 2. El token no tiene permisos suficientes
    echo 3. Hay conflictos con el repositorio remoto
    echo.
    echo Soluciones:
    echo 1. Crea el repositorio en GitHub primero
    echo 2. Verifica que el token tenga permisos de escritura
    echo 3. Intenta hacer push manualmente: git push -u origin %CURRENT_BRANCH%
    echo.
)

REM Limpiar token de la URL remota (por seguridad)
git remote set-url origin https://github.com/%GITHUB_USER%/%GITHUB_REPO%.git
echo [INFO] Token removido de la configuración remota (por seguridad)
echo.

pause

