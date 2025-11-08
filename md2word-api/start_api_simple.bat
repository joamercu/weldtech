@echo off
REM ================================================================
REM MD2Word API - Inicio Rapido
REM ================================================================

cd /d "%~dp0"

echo Iniciando MD2Word API...
echo.

REM Abrir navegador despues de 3 segundos
start /B cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8000/docs"

REM Iniciar servidor
python -m uvicorn api.main:app --reload

pause

