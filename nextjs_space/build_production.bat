@echo off
REM ================================================================
REM Compilar WeldTech Solutions para Produccion
REM ================================================================

echo.
echo ========================================
echo   Build de Produccion
echo   WeldTech Solutions
echo ========================================
echo.

cd /d "%~dp0"

echo [INFO] Verificando dependencias...
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias primero...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Compilando para produccion...
echo [INFO] Esto puede tardar varios minutos...
echo.

npm run build

if errorlevel 1 (
    echo.
    echo [ERROR] Error al compilar
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD COMPLETADO
echo ========================================
echo.
echo [OK] Aplicacion compilada exitosamente
echo.
echo Para iniciar en modo produccion:
echo   npm run start
echo.
pause

