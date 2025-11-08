#!/bin/bash

# Script para configurar secrets de GitHub Actions manualmente
# 
# Uso:
#   bash .github/scripts/setup-secrets.sh
#
# Requiere:
#   - gh CLI instalado (https://cli.github.com/)
#   - Autenticado con: gh auth login

set -e

echo "🔐 Configurador de Secrets para GitHub Actions"
echo ""
echo "Este script te guiará para configurar los secrets necesarios."
echo ""

# Verificar que gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) no está instalado"
    echo "   Instálalo desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
    echo "⚠️  No estás autenticado con GitHub CLI"
    echo "   Ejecuta: gh auth login"
    exit 1
fi

# Obtener información del repositorio
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    read -p "👤 Usuario/Organización de GitHub: " OWNER
    read -p "📦 Nombre del repositorio: " REPO_NAME
    REPO="$OWNER/$REPO_NAME"
else
    echo "📦 Repositorio detectado: $REPO"
fi

echo ""
echo "📋 Secrets disponibles para configurar:"
echo ""
echo "1. VERCEL_TOKEN"
echo "2. VERCEL_ORG_ID"
echo "3. VERCEL_PROJECT_ID"
echo "4. DATABASE_URL"
echo "5. NEXTAUTH_URL"
echo "6. NEXTAUTH_SECRET"
echo "7. NEXT_PUBLIC_API_URL"
echo "8. SSH_HOST (para servidor personalizado)"
echo "9. SSH_USERNAME (para servidor personalizado)"
echo "10. SSH_PRIVATE_KEY (para servidor personalizado)"
echo "11. SSH_PORT (para servidor personalizado)"
echo "12. Configurar todos los secrets de Vercel"
echo "13. Salir"
echo ""

read -p "Selecciona una opción (1-13): " OPTION

case $OPTION in
    1)
        read -sp "Token de Vercel: " VALUE
        echo ""
        gh secret set VERCEL_TOKEN --repo "$REPO" --body "$VALUE"
        echo "✅ VERCEL_TOKEN configurado correctamente"
        ;;
    2)
        read -p "ID de Organización Vercel: " VALUE
        gh secret set VERCEL_ORG_ID --repo "$REPO" --body "$VALUE"
        echo "✅ VERCEL_ORG_ID configurado correctamente"
        ;;
    3)
        read -p "ID de Proyecto Vercel: " VALUE
        gh secret set VERCEL_PROJECT_ID --repo "$REPO" --body "$VALUE"
        echo "✅ VERCEL_PROJECT_ID configurado correctamente"
        ;;
    4)
        read -sp "URL de Base de Datos: " VALUE
        echo ""
        gh secret set DATABASE_URL --repo "$REPO" --body "$VALUE"
        echo "✅ DATABASE_URL configurado correctamente"
        ;;
    5)
        read -p "URL de NextAuth (ej: https://tu-app.vercel.app): " VALUE
        gh secret set NEXTAUTH_URL --repo "$REPO" --body "$VALUE"
        echo "✅ NEXTAUTH_URL configurado correctamente"
        ;;
    6)
        read -sp "Secret de NextAuth (o presiona Enter para generar uno): " VALUE
        echo ""
        if [ -z "$VALUE" ]; then
            VALUE=$(openssl rand -base64 32)
            echo "   ✅ Secret generado: ${VALUE:0:20}..."
        fi
        gh secret set NEXTAUTH_SECRET --repo "$REPO" --body "$VALUE"
        echo "✅ NEXTAUTH_SECRET configurado correctamente"
        ;;
    7)
        read -p "URL de API Pública (opcional): " VALUE
        if [ -n "$VALUE" ]; then
            gh secret set NEXT_PUBLIC_API_URL --repo "$REPO" --body "$VALUE"
            echo "✅ NEXT_PUBLIC_API_URL configurado correctamente"
        else
            echo "⏭️  Omitido"
        fi
        ;;
    8)
        read -p "Host SSH: " VALUE
        gh secret set SSH_HOST --repo "$REPO" --body "$VALUE"
        echo "✅ SSH_HOST configurado correctamente"
        ;;
    9)
        read -p "Usuario SSH: " VALUE
        gh secret set SSH_USERNAME --repo "$REPO" --body "$VALUE"
        echo "✅ SSH_USERNAME configurado correctamente"
        ;;
    10)
        echo "Pega tu clave privada SSH (presiona Ctrl+D cuando termines):"
        VALUE=$(cat)
        gh secret set SSH_PRIVATE_KEY --repo "$REPO" --body "$VALUE"
        echo "✅ SSH_PRIVATE_KEY configurado correctamente"
        ;;
    11)
        read -p "Puerto SSH (default: 22): " VALUE
        VALUE=${VALUE:-22}
        gh secret set SSH_PORT --repo "$REPO" --body "$VALUE"
        echo "✅ SSH_PORT configurado correctamente"
        ;;
    12)
        echo ""
        echo "Configurando todos los secrets de Vercel..."
        echo ""
        
        read -sp "Token de Vercel: " VERCEL_TOKEN
        echo ""
        gh secret set VERCEL_TOKEN --repo "$REPO" --body "$VERCEL_TOKEN"
        echo "✅ VERCEL_TOKEN configurado"
        
        read -p "ID de Organización Vercel: " VERCEL_ORG_ID
        gh secret set VERCEL_ORG_ID --repo "$REPO" --body "$VERCEL_ORG_ID"
        echo "✅ VERCEL_ORG_ID configurado"
        
        read -p "ID de Proyecto Vercel: " VERCEL_PROJECT_ID
        gh secret set VERCEL_PROJECT_ID --repo "$REPO" --body "$VERCEL_PROJECT_ID"
        echo "✅ VERCEL_PROJECT_ID configurado"
        
        read -sp "URL de Base de Datos: " DATABASE_URL
        echo ""
        gh secret set DATABASE_URL --repo "$REPO" --body "$DATABASE_URL"
        echo "✅ DATABASE_URL configurado"
        
        read -p "URL de NextAuth (ej: https://tu-app.vercel.app): " NEXTAUTH_URL
        gh secret set NEXTAUTH_URL --repo "$REPO" --body "$NEXTAUTH_URL"
        echo "✅ NEXTAUTH_URL configurado"
        
        read -sp "Secret de NextAuth (o presiona Enter para generar uno): " NEXTAUTH_SECRET
        echo ""
        if [ -z "$NEXTAUTH_SECRET" ]; then
            NEXTAUTH_SECRET=$(openssl rand -base64 32)
            echo "   ✅ Secret generado: ${NEXTAUTH_SECRET:0:20}..."
        fi
        gh secret set NEXTAUTH_SECRET --repo "$REPO" --body "$NEXTAUTH_SECRET"
        echo "✅ NEXTAUTH_SECRET configurado"
        
        read -p "URL de API Pública (opcional, presiona Enter para omitir): " NEXT_PUBLIC_API_URL
        if [ -n "$NEXT_PUBLIC_API_URL" ]; then
            gh secret set NEXT_PUBLIC_API_URL --repo "$REPO" --body "$NEXT_PUBLIC_API_URL"
            echo "✅ NEXT_PUBLIC_API_URL configurado"
        else
            echo "⏭️  NEXT_PUBLIC_API_URL omitido"
        fi
        
        echo ""
        echo "✅ Todos los secrets de Vercel configurados correctamente"
        ;;
    13)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 ¡Listo! El secret ha sido configurado."
echo "   Puedes verificar los secrets en: https://github.com/$REPO/settings/secrets/actions"

