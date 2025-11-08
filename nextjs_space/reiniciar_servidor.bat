@echo off
REM ================================================================
REM WeldTech Solutions - Reiniciar Servidor Limpiamente
REM ================================================================

echo.
echo ========================================
echo   REINICIANDO SERVIDOR WELDTECH
echo ========================================
echo.

cd /d "%~dp0"

echo [PASO 1/4] Deteniendo procesos de Node.js...
taskkill /F /IM node.exe >NUL 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Procesos detenidos
) else (
    echo [INFO] No hay procesos para detener
)
timeout /t 2 /nobreak >NUL

echo.
echo [PASO 2/4] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next" >NUL 2>&1
    echo [OK] Cache eliminado
) else (
    echo [INFO] No hay cache para eliminar
)

echo.
echo [PASO 3/4] Ejecutando diagnostico...
node diagnostico_inicio.js
echo.

echo [PASO 4/4] Iniciando servidor en puerto 3000...
echo [INFO] URL: http://localhost:3000
echo [INFO] Presiona CTRL+C para detener
echo.
echo ========================================
echo   SERVIDOR INICIANDO...
echo ========================================
echo.

REM Esperar 5 segundos y abrir navegador
start /B cmd /c "timeout /t 5 /nobreak >NUL && start http://localhost:3000"

REM Iniciar servidor
npm run dev

pause

