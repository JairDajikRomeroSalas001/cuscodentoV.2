# Script de backup de base de datos MySQL (Windows)
# Uso: .\scripts\backup.ps1

param(
    [string]$DbHost = "localhost",
    [string]$DbUser = "kusko_user",
    [string]$DbPassword = "StrongPassword123!",
    [string]$DbName = "kusko_dento_prod"
)

$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "backup_${Timestamp}.sql"

# Crear directorio si no existe
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host "🔄 Iniciando backup de $DbName..." -ForegroundColor Cyan
Write-Host "📁 Guardando en: $BackupFile" -ForegroundColor Cyan

# Construir comando mysqldump
$MySqlDumpCmd = @(
    "mysqldump",
    "--host=$DbHost",
    "--user=$DbUser",
    "--password=$DbPassword",
    "--single-transaction",
    "--quick",
    "--lock-tables=false",
    "--result-file=$BackupFile",
    "$DbName"
) -join " "

# Ejecutar mysqldump
Invoke-Expression $MySqlDumpCmd

if ($LASTEXITCODE -eq 0) {
    $FileSize = (Get-Item $BackupFile).Length / 1MB
    Write-Host "✅ Backup exitoso!" -ForegroundColor Green
    Write-Host "📊 Tamaño: $([Math]::Round($FileSize, 2)) MB" -ForegroundColor Green
    Write-Host "📋 Archivo: $(Split-Path $BackupFile -Leaf)" -ForegroundColor Green
    
    # Comprimir backup
    Write-Host "📦 Comprimiendo..." -ForegroundColor Cyan
    $CompressedFile = "$BackupFile.gz"
    
    # Usar 7-Zip si está disponible, si no, usar Compress-Archive nativo
    $SevenZipPath = "C:\Program Files\7-Zip\7z.exe"
    if (Test-Path $SevenZipPath) {
        & $SevenZipPath a -tgzip -sdel $CompressedFile $BackupFile | Out-Null
    } else {
        # PowerShell nativo (requiere PS 5.0+)
        Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip" -Force
        Remove-Item $BackupFile
        Write-Host "⚠️  Comprimido como ZIP (7-Zip no encontrado)" -ForegroundColor Yellow
    }
    
    $CompressedSize = (Get-Item $CompressedFile).Length / 1MB
    Write-Host "✅ Compresión exitosa" -ForegroundColor Green
    Write-Host "📊 Tamaño comprimido: $([Math]::Round($CompressedSize, 2)) MB" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "💾 INSTRUCCIONES DE RESTORE:" -ForegroundColor Cyan
    Write-Host "   1. Descomprimir: 7z x $CompressedFile"
    Write-Host "   2. Restaurar: mysql -h $DbHost -u $DbUser -p $DbName < $BackupFile"
} else {
    Write-Host "❌ Error durante el backup" -ForegroundColor Red
    exit 1
}
