# Script de Respaldo de Imágenes de Defectos
# Fecha: 2025-11-08

$backupDir = "backup\2025-11-08-original"
$images = @(
    "porosidad.jpg",
    "grietas.jpg",
    "undercut.jpg",
    "escoria.jpg",
    "salpicaduras.jpg",
    "sobreposicion.jpg"
)

# Crear directorio de respaldo si no existe
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Directorio de respaldo creado: $backupDir" -ForegroundColor Green
}

# Copiar cada imagen
$copied = 0
foreach ($image in $images) {
    if (Test-Path $image) {
        Copy-Item $image -Destination "$backupDir\$image" -Force
        Write-Host "✓ Copiado: $image" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "✗ No encontrado: $image" -ForegroundColor Red
    }
}

Write-Host "`nRespaldo completado: $copied de $($images.Count) imágenes copiadas" -ForegroundColor Cyan

