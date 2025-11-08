@echo off
REM ================================================================
REM Abrir Documentacion API en el Navegador
REM ================================================================

echo Abriendo documentacion en el navegador...
start http://localhost:8000/docs

echo.
echo Si el servidor no esta corriendo, ejecuta: start_api.bat
timeout /t 2 >nul

