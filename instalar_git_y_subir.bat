@echo off
REM Script para instalar Git y subir el proyecto a GitHub
REM Uso: instalar_git_y_subir.bat

echo ========================================
echo   Instalar Git y Subir Proyecto
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Git está instalado
    git --version
    echo.
    goto :subir_proyecto
)

echo [INFO] Git no está instalado o no está en el PATH
echo.

REM Verificar si Chocolatey está instalado
where choco >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Chocolatey detectado. Puedo instalar Git automáticamente.
    echo.
    set /p INSTALL_GIT="¿Deseas instalar Git ahora? (s/n): "
    if /i "%INSTALL_GIT%"=="s" (
        echo [INFO] Instalando Git...
        choco install git -y
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Git instalado correctamente
            echo [INFO] Por favor, cierra y vuelve a abrir esta ventana para continuar
            echo.
            pause
            exit /b 0
        ) else (
            echo [ERROR] No se pudo instalar Git automáticamente
            echo.
        )
    )
)

echo [INFO] Instrucciones para instalar Git:
echo.
echo Opción 1: Descargar e instalar manualmente
echo   1. Ve a: https://git-scm.com/download/win
echo   2. Descarga el instalador
echo   3. Ejecuta el instalador
echo   4. Asegúrate de seleccionar "Add Git to PATH" durante la instalación
echo   5. Reinicia esta ventana después de instalar
echo.
echo Opción 2: Instalar con Chocolatey (si está instalado)
echo   choco install git -y
echo.
echo Opción 3: Instalar con winget (Windows 10/11)
echo   winget install --id Git.Git -e --source winget
echo.

set /p CONTINUE="¿Deseas continuar con la instalación manual? (s/n): "
if /i not "%CONTINUE%"=="s" (
    echo [INFO] Instalación cancelada
    pause
    exit /b 0
)

REM Intentar instalar con winget
where winget >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Intentando instalar Git con winget...
    winget install --id Git.Git -e --source winget
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Git instalado correctamente
        echo [INFO] Por favor, cierra y vuelve a abrir esta ventana para continuar
        echo.
        pause
        exit /b 0
    )
)

echo.
echo [INFO] Por favor, instala Git manualmente y luego ejecuta:
echo        subir_a_github_con_token.bat
echo.
pause
exit /b 0

:subir_proyecto
echo [INFO] Continuando con el proceso de subida...
echo.
call subir_a_github_con_token.bat

