@echo off
REM ================================================================
REM Abrir WeldTech Solutions en el Navegador
REM ================================================================

echo Abriendo WeldTech Solutions en el navegador...
start http://localhost:3000

echo.
echo Si el servidor no esta corriendo, ejecuta: start_weldtech.bat
timeout /t 2 >nul

