#!/bin/bash
# Script de backup de base de datos MySQL
# Uso: ./scripts/backup.sh

DB_HOST="${DB_HOST:-localhost}"
DB_USER="${DB_USER:-kusko_user}"
DB_PASSWORD="${DB_PASSWORD:-StrongPassword123!}"
DB_NAME="${DB_NAME:-kusko_dento_prod}"
BACKUP_DIR="./backups"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

# Generar nombre de archivo con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"

echo "🔄 Iniciando backup de $DB_NAME..."
echo "📁 Guardando en: $BACKUP_FILE"

# Ejecutar mysqldump
mysqldump \
  --host="$DB_HOST" \
  --user="$DB_USER" \
  --password="$DB_PASSWORD" \
  --single-transaction \
  --quick \
  --lock-tables=false \
  --result-file="$BACKUP_FILE" \
  "$DB_NAME"

if [ $? -eq 0 ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Backup exitoso!"
  echo "📊 Tamaño: $FILE_SIZE"
  echo "📋 Archivo: $(basename $BACKUP_FILE)"
  
  # Comprimir backup
  echo "📦 Comprimiendo..."
  gzip "$BACKUP_FILE"
  
  COMPRESSED_FILE="${BACKUP_FILE}.gz"
  COMPRESSED_SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
  echo "✅ Compresión exitosa"
  echo "📊 Tamaño comprimido: $COMPRESSED_SIZE"
  
  echo ""
  echo "💾 INSTRUCCIONES DE RESTORE:"
  echo "   gunzip $COMPRESSED_FILE"
  echo "   mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < $BACKUP_FILE"
else
  echo "❌ Error durante el backup"
  exit 1
fi
