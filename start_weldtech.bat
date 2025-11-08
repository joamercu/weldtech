@echo off
REM ================================================================
REM WeldTech Solutions - Acceso Directo desde Raiz
REM ================================================================

echo.
echo Iniciando WeldTech Solutions...
echo.

cd /d "%~dp0\nextjs_space"

if not exist "start_weldtech.bat" (
    echo [ERROR] No se encontro el archivo en nextjs_space\
    pause
    exit /b 1
)

call start_weldtech.bat

