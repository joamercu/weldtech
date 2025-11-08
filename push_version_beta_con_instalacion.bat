@echo off
REM Script mejorado para hacer push de la versión beta
REM Intenta instalar Git si no está disponible

echo ========================================
echo   Push Version Beta - Modo Desarrollo
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Git está instalado
    git --version
    echo.
    goto :ejecutar_push
)

echo [INFO] Git no está instalado o no está en el PATH
echo.

REM Intentar instalar con winget (Windows 10/11)
where winget >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Intentando instalar Git con winget...
    echo.
    winget install --id Git.Git -e --source winget
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Git instalado correctamente
        echo [INFO] Por favor, cierra y vuelve a abrir esta ventana para continuar
        echo.
        pause
        exit /b 0
    )
)

REM Intentar instalar con Chocolatey
where choco >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Intentando instalar Git con Chocolatey...
    echo.
    choco install git -y
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Git instalado correctamente
        echo [INFO] Por favor, cierra y vuelve a abrir esta ventana para continuar
        echo.
        pause
        exit /b 0
    )
)

echo [ERROR] No se pudo instalar Git automáticamente
echo.
echo Por favor, instala Git manualmente:
echo.
echo Opción 1: Descargar e instalar manualmente
echo   1. Ve a: https://git-scm.com/download/win
echo   2. Descarga el instalador
echo   3. Ejecuta el instalador
echo   4. Asegúrate de seleccionar "Add Git to PATH" durante la instalación
echo   5. Reinicia esta ventana después de instalar
echo.
echo Opción 2: Instalar con winget (Windows 10/11)
echo   winget install --id Git.Git -e --source winget
echo.
echo Opción 3: Instalar con Chocolatey
echo   choco install git -y
echo.
echo Después de instalar Git, ejecuta este script nuevamente.
echo.
pause
exit /b 1

:ejecutar_push
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

