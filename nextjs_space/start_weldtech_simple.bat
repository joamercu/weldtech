@echo off
REM ================================================================
REM WeldTech Solutions - Inicio Rapido
REM ================================================================

cd /d "%~dp0"

echo Iniciando WeldTech Solutions...
echo.

REM Abrir navegador despues de 5 segundos
start /B cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

REM Iniciar servidor
npm run dev

pause

