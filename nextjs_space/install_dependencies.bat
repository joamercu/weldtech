@echo off
REM ================================================================
REM Instalar Dependencias de WeldTech Solutions
REM ================================================================

echo.
echo ========================================
echo   Instalando Dependencias
echo   WeldTech Solutions
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado o no esta en el PATH
    echo [INFO] Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js detectado
node --version
echo.

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no esta disponible
    pause
    exit /b 1
)

echo [INFO] npm detectado
npm --version
echo.

echo [INFO] Instalando dependencias...
echo [INFO] Esto puede tardar unos minutos...
echo.

npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo [OK] Todas las dependencias instaladas correctamente
echo.
echo Proximos pasos:
echo   1. Ejecuta: start_weldtech.bat
echo   2. O ejecuta: npm run dev
echo.
echo La aplicacion se abrira en: http://localhost:3000
echo.
pause

