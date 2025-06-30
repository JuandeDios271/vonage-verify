#!/bin/bash

IMAGE_NAME=vonage-verify:latest

echo "🔍 Escaneando imagen con docker scan (Snyk)..."
docker scan "$IMAGE_NAME"

echo ""
echo "🔍 Escaneando imagen con Trivy..."
if ! command -v trivy &> /dev/null; then
  echo "⚠️  Trivy no está instalado. Puedes instalarlo desde: https://github.com/aquasecurity/trivy"
  exit 1
fi

trivy image --severity HIGH,CRITICAL "$IMAGE_NAME"