@echo off
REM ================================================================
REM Instalar Dependencias del Proyecto
REM ================================================================

echo.
echo ========================================
echo   Instalando Dependencias
echo   MD2Word API - WeldTech Solutions
echo ========================================
echo.

cd /d "%~dp0"

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no esta instalado o no esta en el PATH
    echo [INFO] Descarga Python desde: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [INFO] Python detectado
python --version
echo.

REM Preguntar si crear entorno virtual
echo Deseas crear un entorno virtual? (Recomendado)
echo [1] Si, crear entorno virtual
echo [2] No, instalar en el sistema
echo.
choice /C 12 /N /M "Elige una opcion (1 o 2): "

if errorlevel 2 goto :install_system
if errorlevel 1 goto :create_venv

:create_venv
echo.
echo [INFO] Creando entorno virtual...
python -m venv venv

if errorlevel 1 (
    echo [ERROR] Error al crear entorno virtual
    pause
    exit /b 1
)

echo [INFO] Activando entorno virtual...
call venv\Scripts\activate.bat

echo [INFO] Entorno virtual activado
goto :install_deps

:install_system
echo.
echo [INFO] Instalando en el sistema...

:install_deps
echo.
echo [INFO] Instalando dependencias desde requirements.txt...
echo.
pip install -r requirements.txt

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
echo   1. Ejecuta: start_api.bat (para iniciar la API)
echo   2. O usa: python cli/converter_cli.py --help (para CLI)
echo.
pause

