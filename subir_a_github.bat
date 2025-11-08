@echo off
REM Script para subir el proyecto a GitHub
REM Uso: subir_a_github.bat

echo ========================================
echo   Subir Proyecto a GitHub
echo ========================================
echo.

REM Verificar si Git está instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no está instalado o no está en el PATH
    echo.
    echo Por favor instala Git desde: https://git-scm.com/download/win
    echo O agrega Git al PATH de Windows
    echo.
    pause
    exit /b 1
)

echo [OK] Git está instalado
echo.

REM Verificar si hay un repositorio git inicializado
if not exist ".git" (
    echo [INFO] Inicializando repositorio Git...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo inicializar el repositorio
        pause
        exit /b 1
    )
    echo [OK] Repositorio inicializado
    echo.
)

REM Verificar si hay un remote configurado
git remote -v >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No hay repositorio remoto configurado
    echo.
    set /p GITHUB_REPO="Ingresa la URL de tu repositorio de GitHub (ej: https://github.com/usuario/repo.git): "
    if "%GITHUB_REPO%"=="" (
        echo [ERROR] URL de repositorio requerida
        pause
        exit /b 1
    )
    git remote add origin "%GITHUB_REPO%"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo agregar el repositorio remoto
        pause
        exit /b 1
    )
    echo [OK] Repositorio remoto configurado
    echo.
) else (
    echo [INFO] Repositorio remoto ya está configurado:
    git remote -v
    echo.
    set /p CONFIRM="¿Deseas cambiar el repositorio remoto? (s/n): "
    if /i "%CONFIRM%"=="s" (
        set /p GITHUB_REPO="Ingresa la nueva URL del repositorio: "
        git remote set-url origin "%GITHUB_REPO%"
        echo [OK] Repositorio remoto actualizado
        echo.
    )
)

REM Verificar estado
echo [INFO] Verificando estado del repositorio...
git status
echo.

REM Agregar todos los archivos
echo [INFO] Agregando archivos al staging...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudieron agregar los archivos
    pause
    exit /b 1
)
echo [OK] Archivos agregados
echo.

REM Verificar si hay cambios para commitear
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo [INFO] No hay cambios para commitear
    echo.
) else (
    echo [INFO] Archivos listos para commit:
    git status --short
    echo.
    set /p COMMIT_MSG="Ingresa el mensaje del commit (o presiona Enter para usar mensaje por defecto): "
    if "%COMMIT_MSG%"=="" (
        set COMMIT_MSG=Initial commit: Agregar proyecto WeldTech con workflows de despliegue
    )
    
    REM Hacer commit
    echo.
    echo [INFO] Haciendo commit...
    git commit -m "%COMMIT_MSG%"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo hacer el commit
        pause
        exit /b 1
    )
    echo [OK] Commit realizado
    echo.
)

REM Verificar si hay commits para hacer push
git log origin/main..HEAD >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Hay commits locales para subir
    echo.
) else (
    git log origin/master..HEAD >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] Hay commits locales para subir
        echo.
    ) else (
        echo [INFO] No hay commits nuevos para subir
        echo.
    )
)

REM Preguntar si hacer push
set /p DO_PUSH="¿Deseas subir los cambios a GitHub? (s/n): "
if /i not "%DO_PUSH%"=="s" (
    echo [INFO] Push cancelado
    pause
    exit /b 0
)

REM Determinar la rama principal
git branch --show-current >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
) else (
    set CURRENT_BRANCH=main
)

REM Intentar push
echo.
echo [INFO] Subiendo cambios a GitHub (rama: %CURRENT_BRANCH%)...
echo [INFO] Esto puede requerir autenticación...
echo.

REM Intentar push a main primero, luego master
git push -u origin %CURRENT_BRANCH% 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] ========================================
    echo [OK] Proyecto subido exitosamente a GitHub!
    echo [OK] ========================================
    echo.
) else (
    echo.
    echo [ERROR] No se pudo hacer push automáticamente
    echo.
    echo Posibles causas:
    echo 1. No estás autenticado con GitHub
    echo 2. No tienes permisos para escribir en el repositorio
    echo 3. El repositorio remoto no existe
    echo.
    echo Soluciones:
    echo 1. Autentícate con: git config --global user.name "Tu Nombre"
    echo 2. Autentícate con: git config --global user.email "tu@email.com"
    echo 3. Usa GitHub CLI: gh auth login
    echo 4. O usa un token personal: git remote set-url origin https://TU_TOKEN@github.com/usuario/repo.git
    echo.
    echo Puedes intentar hacer push manualmente con:
    echo   git push -u origin %CURRENT_BRANCH%
    echo.
)

pause
