@echo off
REM ================================================================
REM WeldTech Solutions - Iniciar con Logs Detallados
REM ================================================================

echo.
echo ========================================
echo   WELDTECH - INICIO CON DIAGNOSTICO
echo ========================================
echo.

cd /d "%~dp0"

echo [DIAGNOSTICO] Ejecutando diagnostico...
node diagnostico_inicio.js
echo.

echo [INFO] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo [OK] Cache eliminado
) else (
    echo [INFO] No hay cache para eliminar
)
echo.

echo [INFO] Iniciando servidor Next.js con logs detallados...
echo [INFO] URL: http://localhost:3000
echo [INFO] Presiona CTRL+C para detener
echo.
echo ========================================
echo   LOGS DEL SERVIDOR (tiempo real)
echo ========================================
echo.

REM Iniciar con variables de entorno para debug
set NODE_ENV=development
set DEBUG=*
set NEXT_DEBUG=1
set NEXTAUTH_DEBUG=true

echo [INFO] Variables de entorno configuradas:
echo   - NODE_ENV=development
echo   - DEBUG=*
echo   - NEXT_DEBUG=1
echo   - NEXTAUTH_DEBUG=true
echo.

npm run dev

pause

