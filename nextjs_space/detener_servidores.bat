@echo off
REM ================================================================
REM WeldTech Solutions - Detener todos los servidores Next.js
REM ================================================================

echo.
echo ========================================
echo   DETENIENDO SERVIDORES NEXT.JS
echo ========================================
echo.

echo [INFO] Buscando procesos de Node.js...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [INFO] Procesos de Node.js encontrados
    echo [INFO] Deteniendo procesos...
    taskkill /F /IM node.exe >NUL 2>&1
    if %ERRORLEVEL%==0 (
        echo [OK] Procesos de Node.js detenidos
    ) else (
        echo [INFO] No se encontraron procesos para detener
    )
) else (
    echo [INFO] No hay procesos de Node.js corriendo
)

echo.
echo [INFO] Verificando puertos...
netstat -ano | findstr ":3000 :3001 :3002 :3003 :3004 :3005" >NUL
if %ERRORLEVEL%==0 (
    echo [INFO] Algunos puertos aún están en uso
) else (
    echo [OK] Todos los puertos están libres
)

echo.
echo [OK] Limpieza completada
echo.
pause

