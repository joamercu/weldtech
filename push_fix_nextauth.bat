@echo off
REM Script para hacer push del fix de NextAuth
REM Cambio: Hacer ruta de NextAuth dinámica para evitar errores en build

echo ========================================
echo   Push Fix: NextAuth Build Error
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no está instalado o no está en el PATH
    echo.
    echo Por favor ejecuta el script: subir_a_github_con_token.bat
    echo O instala Git desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git está instalado
echo.

REM Verificar si hay un repositorio git
if not exist ".git" (
    echo [ERROR] No hay un repositorio Git inicializado
    echo.
    echo Por favor ejecuta primero: subir_a_github_con_token.bat
    echo.
    pause
    exit /b 1
)

echo [INFO] Agregando archivos modificados...
git add nextjs_space/app/api/auth/[...nextauth]/route.ts
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo agregar route.ts
    pause
    exit /b 1
)

git add nextjs_space/lib/auth.ts
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo agregar auth.ts
    pause
    exit /b 1
)

echo [OK] Archivos agregados
echo.

echo [INFO] Haciendo commit...
git commit -m "fix: Hacer ruta de NextAuth dinámica para evitar errores en build"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo hacer el commit
    pause
    exit /b 1
)
echo [OK] Commit realizado
echo.

REM Determinar la rama actual
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
if "%CURRENT_BRANCH%"=="" (
    set CURRENT_BRANCH=main
)

echo [INFO] Rama actual: %CURRENT_BRANCH%
echo.

REM Verificar si hay un remoto configurado
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No hay un repositorio remoto configurado
    echo.
    echo Por favor ejecuta: subir_a_github_con_token.bat
    echo.
    pause
    exit /b 1
)

echo [INFO] Subiendo cambios a GitHub (rama: %CURRENT_BRANCH%)...
echo.

git push origin %CURRENT_BRANCH%
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] ========================================
    echo [OK] Cambios subidos exitosamente a GitHub!
    echo [OK] ========================================
    echo.
    echo Cambios realizados:
    echo - route.ts: Agregada configuracion dynamic y runtime
    echo - auth.ts: GoogleProvider opcional y secret con fallback
    echo.
    echo Esto soluciona el error:
    echo "Failed to collect page data for /api/auth/[...nextauth]"
    echo.
    echo El workflow de Vercel se ejecutara automaticamente.
    echo.
) else (
    echo.
    echo [ERROR] No se pudo hacer push
    echo.
    echo Posibles causas:
    echo 1. No tienes permisos para hacer push
    echo 2. El repositorio remoto no esta configurado correctamente
    echo 3. Hay conflictos con el repositorio remoto
    echo.
    echo Soluciones:
    echo 1. Verifica tus credenciales de GitHub
    echo 2. Ejecuta: subir_a_github_con_token.bat para configurar el remoto
    echo 3. Intenta hacer pull primero: git pull origin %CURRENT_BRANCH%
    echo.
)

pause

