@echo off
REM Script para hacer push de la versión beta con el botón "Modo Desarrollo"
REM Versión Beta: Implementación del Modo Desarrollo para usuarios no registrados

echo ========================================
echo   Push Version Beta - Modo Desarrollo
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

REM Hacer commit con mensaje apropiado para versión beta
echo [INFO] Haciendo commit para versión beta...
git commit -m "feat(beta): Implementar botón Modo Desarrollo para usuarios no registrados

- Agregar botón 'Modo Desarrollo' en el navbar principal
- Implementar hook useDevelopmentMode para gestionar el estado
- Crear contexto DevelopmentModeContext para compartir estado
- Agregar utilidades para detectar versión gratuita de Vercel
- Integrar Toaster para notificaciones al usuario
- El botón solo está disponible para usuarios no autenticados
- Solo funciona en la versión gratuita de Vercel (.vercel.app)
- Desbloquea todas las funcionalidades premium para usuarios no registrados
- El estado se persiste en localStorage
- Se desactiva automáticamente si el usuario se autentica

Archivos nuevos:
- nextjs_space/lib/vercel-utils.ts
- nextjs_space/hooks/use-development-mode.ts
- nextjs_space/contexts/development-mode-context.tsx

Archivos modificados:
- nextjs_space/app/components/navbar.tsx
- nextjs_space/app/providers.tsx
- nextjs_space/app/layout.tsx"

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
    echo [OK] Version Beta subida exitosamente a GitHub!
    echo [OK] ========================================
    echo.
    echo Los cambios incluyen:
    echo - Botón "Modo Desarrollo" en el navbar
    echo - Hook useDevelopmentMode para gestionar estado
    echo - Contexto DevelopmentModeContext para compartir estado
    echo - Utilidades para detectar versión gratuita de Vercel
    echo - Integración de Toaster para notificaciones
    echo.
    echo Características:
    echo - Solo visible para usuarios no autenticados
    echo - Solo disponible en versión gratuita de Vercel
    echo - Desbloquea funcionalidades premium
    echo - Estado persistente en localStorage
    echo - Se desactiva automáticamente al autenticarse
    echo.
    echo El despliegue en Vercel se ejecutará automáticamente
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

