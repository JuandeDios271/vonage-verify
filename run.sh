#!/bin/bash
echo "🚀 Preparando entorno para levantar backend..."

# Verificar si la carpeta logs/ existe
if [ ! -d "logs" ]; then
  echo "📂 Carpeta logs/ no encontrada. Creándola..."
  mkdir logs
  sudo chown -R 1000:1000 logs
else
  echo "✅ Carpeta logs/ ya existe"
fi

# Levantar backend
echo "🚀 Levantando backend con Docker..."
docker compose up -d --build