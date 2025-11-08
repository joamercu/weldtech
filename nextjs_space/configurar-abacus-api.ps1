# Script para configurar la API key de Abacus.AI en .env.local

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuración de API Key de Abacus.AI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envFile = ".env.local"
$apiKey = "s2_05d59eff71e9485391529e7285d0019f"

# Verificar si el archivo existe
if (Test-Path $envFile) {
    Write-Host "✓ Archivo .env.local encontrado" -ForegroundColor Green
    Write-Host ""
    
    # Leer contenido actual
    $content = Get-Content $envFile
    
    # Verificar si ya existe ABACUS_API_KEY
    $hasApiKey = $content | Select-String -Pattern "ABACUS_API_KEY"
    
    if ($hasApiKey) {
        Write-Host "⚠ La variable ABACUS_API_KEY ya existe en .env.local" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Contenido actual:" -ForegroundColor White
        $hasApiKey | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        Write-Host ""
        
        $update = Read-Host "¿Deseas actualizarla? (S/N)"
        if ($update -eq "S" -or $update -eq "s") {
            # Remover línea antigua
            $newContent = $content | Where-Object { $_ -notmatch "ABACUS_API_KEY" }
            # Agregar nueva línea
            $newContent += "ABACUS_API_KEY=$apiKey"
            # Guardar archivo
            $newContent | Set-Content $envFile
            Write-Host ""
            Write-Host "✓ API Key actualizada correctamente" -ForegroundColor Green
        } else {
            Write-Host "No se realizaron cambios" -ForegroundColor Yellow
        }
    } else {
        # Agregar la nueva variable
        Add-Content -Path $envFile -Value "ABACUS_API_KEY=$apiKey"
        Write-Host ""
        Write-Host "✓ API Key agregada correctamente" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ Archivo .env.local no existe. Creando..." -ForegroundColor Yellow
    Write-Host ""
    # Crear archivo con la API key
    "ABACUS_API_KEY=$apiKey" | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "✓ Archivo .env.local creado con API Key" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuración completada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Reinicia el servidor Next.js para que los cambios surtan efecto" -ForegroundColor Yellow
Write-Host ""

