@echo off
REM Script para configurar la API key de Abacus.AI en .env.local
echo ========================================
echo Configuracion de API Key de Abacus.AI
echo ========================================
echo.

set "ENV_FILE=.env.local"
set "API_KEY=s2_05d59eff71e9485391529e7285d0019f"

REM Verificar si el archivo existe
if exist "%ENV_FILE%" (
    echo Archivo .env.local encontrado
    echo.
    
    REM Verificar si ya existe ABACUS_API_KEY
    findstr /C:"ABACUS_API_KEY" "%ENV_FILE%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo La variable ABACUS_API_KEY ya existe en .env.local
        echo.
        echo Contenido actual:
        findstr /C:"ABACUS_API_KEY" "%ENV_FILE%"
        echo.
        echo Deseas actualizarla? (S/N)
        set /p UPDATE="> "
        if /i "%UPDATE%"=="S" (
            REM Crear archivo temporal sin la linea antigua
            findstr /V /C:"ABACUS_API_KEY" "%ENV_FILE%" > "%ENV_FILE%.tmp"
            REM Agregar la nueva linea
            echo ABACUS_API_KEY=%API_KEY% >> "%ENV_FILE%.tmp"
            REM Reemplazar archivo original
            move /Y "%ENV_FILE%.tmp" "%ENV_FILE%" >nul
            echo.
            echo ✓ API Key actualizada correctamente
        ) else (
            echo No se realizaron cambios
        )
    ) else (
        REM Agregar la nueva variable
        echo ABACUS_API_KEY=%API_KEY% >> "%ENV_FILE%"
        echo.
        echo ✓ API Key agregada correctamente
    )
) else (
    echo Archivo .env.local no existe. Creando...
    echo.
    echo ABACUS_API_KEY=%API_KEY% > "%ENV_FILE%"
    echo ✓ Archivo .env.local creado con API Key
)

echo.
echo ========================================
echo Configuracion completada
echo ========================================
echo.
echo IMPORTANTE: Reinicia el servidor Next.js para que los cambios surtan efecto
echo.
pause

