@echo off
REM ================================================================
REM WeldTech Solutions - Solucionar Error 404 y Componentes
REM ================================================================

echo.
echo ========================================
echo   SOLUCIONANDO ERROR 404
echo ========================================
echo.

cd /d "%~dp0"

echo [PASO 1/5] Deteniendo todos los procesos de Node.js...
taskkill /F /IM node.exe >NUL 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Procesos detenidos
) else (
    echo [INFO] No hay procesos para detener
)
timeout /t 3 /nobreak >NUL

echo.
echo [PASO 2/5] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next" >NUL 2>&1
    echo [OK] Cache .next eliminado
) else (
    echo [INFO] No hay cache .next
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" >NUL 2>&1
    echo [OK] Cache node_modules eliminado
) else (
    echo [INFO] No hay cache node_modules
)
timeout /t 2 /nobreak >NUL

echo.
echo [PASO 3/5] Ejecutando diagnostico...
node diagnostico_error_404.js
echo.

echo [PASO 4/5] Verificando componentes de error...
if exist "app\error.tsx" (
    echo [OK] app\error.tsx existe
) else (
    echo [ERROR] app\error.tsx NO EXISTE
)

if exist "app\not-found.tsx" (
    echo [OK] app\not-found.tsx existe
) else (
    echo [ERROR] app\not-found.tsx NO EXISTE
)

if exist "app\global-error.tsx" (
    echo [OK] app\global-error.tsx existe
) else (
    echo [ERROR] app\global-error.tsx NO EXISTE
)
echo.

echo [PASO 5/5] Iniciando servidor en puerto 3000...
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

