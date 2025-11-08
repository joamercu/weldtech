@echo off
REM ================================================================
REM WeldTech Solutions - Solucionar Error "Missing Required Error Components"
REM ================================================================

echo.
echo ========================================
echo   SOLUCIONANDO ERROR DE COMPONENTES
echo ========================================
echo.

cd /d "%~dp0"

echo [PASO 1/7] Ejecutando diagnostico...
node diagnostico_error_componentes.js
echo.

echo [PASO 2/7] Deteniendo todos los procesos de Node.js...
taskkill /F /IM node.exe >NUL 2>&1
if %ERRORLEVEL%==0 (
    echo [OK] Procesos detenidos
) else (
    echo [INFO] No hay procesos para detener
)
timeout /t 3 /nobreak >NUL

echo.
echo [PASO 3/7] Verificando componentes de error...
if exist "app\error.tsx" (
    echo [OK] app\error.tsx existe
) else (
    echo [ERROR] app\error.tsx NO EXISTE - REQUERIDO
    echo [CREANDO] app\error.tsx...
    goto :crear_error
)

if exist "app\global-error.tsx" (
    echo [OK] app\global-error.tsx existe
) else (
    echo [ADVERTENCIA] app\global-error.tsx NO EXISTE - OPCIONAL
)

if exist "app\not-found.tsx" (
    echo [OK] app\not-found.tsx existe
) else (
    echo [ADVERTENCIA] app\not-found.tsx NO EXISTE - OPCIONAL
)

echo.
echo [PASO 4/7] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next" >NUL 2>&1
    echo [OK] Cache .next eliminado
) else (
    echo [INFO] No hay cache .next
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" >NUL 2>&1
    echo [OK] Cache node_modules eliminado
) else (
    echo [INFO] No hay cache node_modules
)

if exist ".turbo" (
    rmdir /s /q ".turbo" >NUL 2>&1
    echo [OK] Cache .turbo eliminado
) else (
    echo [INFO] No hay cache .turbo
)

timeout /t 2 /nobreak >NUL

echo.
echo [PASO 5/7] Verificando dependencias...
if exist "node_modules" (
    echo [OK] node_modules existe
) else (
    echo [INSTALANDO] Dependencias faltantes...
    call npm install
)

echo.
echo [PASO 6/7] Verificando sintaxis de TypeScript...
if exist "node_modules\.bin\tsc.cmd" (
    echo [VERIFICANDO] Sintaxis de componentes...
    call npx tsc --noEmit --skipLibCheck app\error.tsx >NUL 2>&1
    if %ERRORLEVEL%==0 (
        echo [OK] error.tsx sintaxis correcta
    ) else (
        echo [ADVERTENCIA] error.tsx puede tener errores de sintaxis
    )
) else (
    echo [INFO] TypeScript no disponible para verificación
)

echo.
echo [PASO 7/7] Iniciando servidor en puerto 3000...
echo [INFO] URL: http://localhost:3000
echo [INFO] Presiona CTRL+C para detener
echo.
echo ========================================
echo   SERVIDOR INICIANDO...
echo ========================================
echo.

REM Esperar 5 segundos y abrir navegador
start /B cmd /c "timeout /t 5 /nobreak >NUL && start http://localhost:3000"

REM Iniciar servidor
npm run dev

pause
exit /b

:crear_error
echo [CREANDO] app\error.tsx...
(
echo 'use client'
echo.
echo import { useEffect } from 'react'
echo import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
echo import Link from 'next/link'
echo import { motion } from 'framer-motion'
echo.
echo export default function Error^({
echo   error,
echo   reset,
echo }: {
echo   error: Error ^& { digest?: string }
echo   reset: ^(^) =^> void
echo }^) {
echo   useEffect^(^() =^> {
echo     console.error^('Error:', error^)
echo   }, [error]^)
echo.
echo   return ^(
echo     ^<div className="min-h-screen bg-[#0F1216] flex items-center justify-center p-4"^>
echo       ^<motion.div
echo         initial={{ opacity: 0, y: 20 }}
echo         animate={{ opacity: 1, y: 0 }}
echo         transition={{ duration: 0.5 }}
echo         className="max-w-md w-full text-center space-y-6"
echo       ^>
echo         ^<div className="flex justify-center"^>
echo           ^<div className="p-4 bg-red-500/10 rounded-full"^>
echo             ^<AlertTriangle className="w-12 h-12 text-red-500" /^>
echo           ^</div^>
echo         ^</div^>
echo         ^<div className="space-y-2"^>
echo           ^<h1 className="text-3xl font-bold text-white"^>Algo salió mal^</h1^>
echo           ^<p className="text-gray-400"^>Ocurrió un error inesperado. Por favor, intenta nuevamente.^</p^>
echo           {error.digest ^&^& ^(
echo             ^<p className="text-xs text-gray-500 mt-2"^>ID de error: {error.digest}^</p^>
echo           ^)^}
echo         ^</div^>
echo         ^<div className="flex flex-col sm:flex-row gap-3 justify-center"^>
echo           ^<button
echo             onClick={reset}
echo             className="px-6 py-3 bg-[#FF7A00] hover:bg-[#FF8A1A] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
echo           ^>
echo             ^<RefreshCw className="w-4 h-4" /^>
echo             Intentar de nuevo
echo           ^</button^>
echo           ^<Link
echo             href="/"
echo             className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
echo           ^>
echo             ^<Home className="w-4 h-4" /^>
echo             Ir al inicio
echo           ^</Link^>
echo         ^</div^>
echo       ^</motion.div^>
echo     ^</div^>
echo   ^)
echo }
) > app\error.tsx
echo [OK] app\error.tsx creado
goto :eof

:crear_global_error
echo [CREANDO] app\global-error.tsx...
echo [INFO] Este archivo es opcional, continuando...
goto :eof

:crear_not_found
echo [CREANDO] app\not-found.tsx...
echo [INFO] Este archivo es opcional, continuando...
goto :eof

