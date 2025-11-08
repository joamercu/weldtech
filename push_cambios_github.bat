@echo off
REM Script para hacer push de los cambios recientes a GitHub
REM Actualiza: workflow de Vercel con notificaciones de estado

echo ========================================
echo   Push de Cambios a GitHub
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no está instalado o no está en el PATH
    echo.
    echo Por favor instala Git desde: https://git-scm.com/download/win
    echo O ejecuta el script: subir_a_github_con_token.bat
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

echo [INFO] Verificando estado del repositorio...
echo.

REM Verificar si hay cambios
git status --short >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Cambios detectados:
    git status --short
    echo.
) else (
    echo [INFO] No hay cambios para commitear
    echo.
    pause
    exit /b 0
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

REM Hacer commit
echo [INFO] Haciendo commit...
git commit -m "feat: Conectar GitHub Actions con Vercel - Agregar notificaciones de estado de checks (lint, build, deploy)"
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

REM Hacer push
echo [INFO] Subiendo cambios a GitHub (rama: %CURRENT_BRANCH%)...
echo.

git push origin %CURRENT_BRANCH%
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] ========================================
    echo [OK] Cambios subidos exitosamente a GitHub!
    echo [OK] ========================================
    echo.
    echo Los cambios incluyen:
    echo - Workflow de Vercel actualizado con notificaciones de estado
    echo - Documentación de configuración de GitHub Actions + Vercel
    echo - Diagnóstico de problemas de despliegue en Vercel
    echo.
    echo El workflow se ejecutará automáticamente en GitHub Actions
    echo.
) else (
    echo.
    echo [ERROR] No se pudo hacer push
    echo.
    echo Posibles causas:
    echo 1. No tienes permisos para hacer push
    echo 2. El repositorio remoto no está configurado correctamente
    echo 3. Hay conflictos con el repositorio remoto
    echo.
    echo Soluciones:
    echo 1. Verifica tus credenciales de GitHub
    echo 2. Ejecuta: subir_a_github_con_token.bat para configurar el remoto
    echo 3. Intenta hacer pull primero: git pull origin %CURRENT_BRANCH%
    echo.
)

pause

