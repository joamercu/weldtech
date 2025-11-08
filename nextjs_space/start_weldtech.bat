@echo off
REM ================================================================
REM WeldTech Solutions - Iniciar Aplicacion Web
REM ================================================================

echo.
echo ========================================
echo   WeldTech Solutions Web App
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si existe node_modules
if not exist "node_modules\" (
    echo [ADVERTENCIA] No se encontraron dependencias instaladas
    echo [INFO] Instalando dependencias de Node.js...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Error al instalar dependencias
        echo [INFO] Asegurate de tener Node.js instalado: https://nodejs.org/
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas correctamente
    echo.
)

echo [INFO] Iniciando servidor de desarrollo...
echo [INFO] URL: http://localhost:3000
echo.
echo [CTRL+C para detener el servidor]
echo.

REM Esperar 5 segundos y abrir navegador en segundo plano
start /B cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

REM Iniciar servidor Next.js
call npm run dev

REM Si el servidor se detiene
echo.
echo [INFO] Servidor detenido
pause

