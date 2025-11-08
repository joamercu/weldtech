@echo off
REM ================================================================
REM MD2Word API - Iniciar Servidor y Abrir Navegador
REM WeldTech Solutions
REM ================================================================

echo.
echo ========================================
echo   MD2Word API - WeldTech Solutions
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar si existe un entorno virtual y activarlo
if exist "venv\Scripts\activate.bat" (
    echo [INFO] Activando entorno virtual...
    call venv\Scripts\activate.bat
) else if exist ".venv\Scripts\activate.bat" (
    echo [INFO] Activando entorno virtual...
    call .venv\Scripts\activate.bat
) else (
    echo [ADVERTENCIA] No se encontro entorno virtual
    echo [INFO] Usando Python del sistema...
)

echo.
echo [INFO] Verificando dependencias...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo [ERROR] FastAPI no esta instalado
    echo [INFO] Instalando dependencias...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
)

echo [INFO] Dependencias OK
echo.
echo [INFO] Iniciando servidor API...
echo [INFO] URL: http://localhost:8000
echo [INFO] Documentacion: http://localhost:8000/docs
echo.
echo [CTRL+C para detener el servidor]
echo.

REM Esperar 3 segundos y abrir navegador en segundo plano
start /B cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8000/docs"

REM Iniciar servidor uvicorn
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

REM Si el servidor se detiene
echo.
echo [INFO] Servidor detenido
pause

