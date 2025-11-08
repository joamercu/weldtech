# Script para verificar imágenes de defectos
# Verifica que las imágenes generadas existan y que las originales estén respaldadas

Write-Host "=== VERIFICACION DE IMAGENES DE DEFECTOS ===" -ForegroundColor Cyan
Write-Host ""

$basePath = "D:\07-11-25-APP WELDTECH\nextjs_space\public\herramientas"
$defects = @("porosidad", "grietas", "undercut", "escoria", "salpicaduras", "sobreposicion")

Write-Host "=== IMAGENES ORIGINALES ===" -ForegroundColor Yellow
$originales = Get-ChildItem "$basePath\*.jpg" | Where-Object { $defects -contains ($_.BaseName) }
foreach ($img in $originales) {
    $size = [math]::Round($img.Length / 1KB, 2)
    Write-Host "  ✓ $($img.Name) - $size KB - $($img.LastWriteTime)" -ForegroundColor Green
}

Write-Host "`n=== IMAGENES EN RESPALDO ===" -ForegroundColor Yellow
$backupPath = "$basePath\backup\2025-11-08-original"
if (Test-Path $backupPath) {
    $backup = Get-ChildItem "$backupPath\*.jpg"
    foreach ($img in $backup) {
        $size = [math]::Round($img.Length / 1KB, 2)
        Write-Host "  ✓ $($img.Name) - $size KB - $($img.LastWriteTime)" -ForegroundColor Green
    }
} else {
    Write-Host "  ✗ Carpeta de respaldo no encontrada" -ForegroundColor Red
}

Write-Host "`n=== IMAGENES GENERADAS ===" -ForegroundColor Yellow
$generatedPath = "$basePath\generated\abacus-ai"
$totalGeneradas = 0
foreach ($defect in $defects) {
    $defectPath = "$generatedPath\$defect"
    if (Test-Path $defectPath) {
        $images = Get-ChildItem "$defectPath\*.jpg"
        if ($images.Count -gt 0) {
            Write-Host "  ✓ $defect :" -ForegroundColor Green
            foreach ($img in $images) {
                $size = [math]::Round($img.Length / 1KB, 2)
                Write-Host "    - $($img.Name) - $size KB - $($img.LastWriteTime)" -ForegroundColor Cyan
                $totalGeneradas++
            }
        } else {
            Write-Host "  ✗ $defect : No hay imágenes generadas" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✗ $defect : Carpeta no existe" -ForegroundColor Red
    }
}

Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "  Imágenes originales: $($originales.Count)" -ForegroundColor White
Write-Host "  Imágenes en respaldo: $($backup.Count)" -ForegroundColor White
Write-Host "  Imágenes generadas: $totalGeneradas" -ForegroundColor White

Write-Host "`n=== COMPARACION ===" -ForegroundColor Yellow
foreach ($defect in $defects) {
    $original = Get-ChildItem "$basePath\$defect.jpg" -ErrorAction SilentlyContinue
    $backup = Get-ChildItem "$backupPath\$defect.jpg" -ErrorAction SilentlyContinue
    $generated = Get-ChildItem "$generatedPath\$defect\main.jpg" -ErrorAction SilentlyContinue
    
    if ($original -and $backup) {
        if ($original.Length -eq $backup.Length) {
            Write-Host "  ✓ $defect : Original y respaldo son iguales" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ $defect : Original y respaldo son diferentes" -ForegroundColor Yellow
        }
    }
    
    if ($generated) {
        if ($original -and $generated.Length -ne $original.Length) {
            Write-Host "  ✓ $defect : Imagen generada es diferente a la original" -ForegroundColor Green
        } elseif ($original -and $generated.Length -eq $original.Length) {
            Write-Host "  ⚠ $defect : Imagen generada parece ser igual a la original" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ $defect : No hay imagen generada" -ForegroundColor Red
    }
}

