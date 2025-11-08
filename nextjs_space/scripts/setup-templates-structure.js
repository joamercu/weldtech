/**
 * Script de Setup - Estructura de Plantillas
 * Crea todas las carpetas necesarias para el sistema de plantillas
 * 
 * Uso: node scripts/setup-templates-structure.js
 */

const fs = require('fs');
const path = require('path');

// Colores para output en consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✓ Creado: ${dirPath}`, 'green');
    return true;
  } else {
    log(`○ Ya existe: ${dirPath}`, 'yellow');
    return false;
  }
}

function main() {
  log('\n🚀 Iniciando setup de estructura de plantillas...', 'blue');
  log('=' .repeat(50), 'blue');

  const baseDir = process.cwd();
  let createdCount = 0;

  // Definir carpetas a crear
  const directories = [
    // Carpetas de plantillas
    'public/templates',
    'public/templates/source',
    'public/templates/preview',
    'public/templates/guides',
    
    // Carpetas de API
    'app/api/templates',
    'app/api/templates/download',
    'app/api/templates/generate-preview',
    
    // Carpetas de scripts
    'scripts/templates',
    
    // Carpetas de lib (si no existen)
    'lib',
  ];

  directories.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (createDirectoryIfNotExists(fullPath)) {
      createdCount++;
    }
  });

  // Crear archivos README en carpetas clave
  const readmeTemplates = {
    'public/templates/source/README.md': `# Templates Source (Excel)

Esta carpeta contiene los archivos Excel originales de las plantillas.

## Archivos que deben estar aquí:

- WPS_Template_v1.0.xlsx
- PQR_Template_v1.0.xlsx
- WPQ_Template_v1.0.xlsx
- Checklist_Auditoria_v1.0.xlsx
- Matriz_Trazabilidad_v1.0.xlsx

## Importante:

⚠️ Estos archivos son la fuente master. NO modificar directamente.
⚠️ Para hacer cambios, crear una copia, editarla, y reemplazar.
⚠️ Estos archivos se sirven SOLO a usuarios autenticados.
`,
    'public/templates/preview/README.md': `# Templates Preview (PDF)

Esta carpeta contiene los PDFs con marca de agua para usuarios no registrados.

## Archivos que deben estar aquí:

- WPS_Template_Preview.pdf
- PQR_Template_Preview.pdf
- WPQ_Template_Preview.pdf
- Checklist_Auditoria_Preview.pdf
- Matriz_Trazabilidad_Preview.pdf

## Generación:

Estos PDFs se generan desde los archivos Excel usando el script:
\`\`\`bash
node scripts/templates/generate-previews.js
\`\`\`

## Importante:

⚠️ Regenerar cada vez que se actualice un template Excel.
⚠️ Verificar que marca de agua sea visible.
`,
    'public/templates/guides/README.md': `# Guías de Uso

Esta carpeta contiene las guías de uso en PDF para cada plantilla.

## Archivos que deben estar aquí:

- WPS_Guia_Uso.pdf
- PQR_Guia_Uso.pdf
- WPQ_Guia_Uso.pdf
- Checklist_Guia_Uso.pdf
- Matriz_Guia_Uso.pdf
- Pack_Plantillas_Guia_General.pdf

## Contenido de cada guía:

1. Introducción
2. Instrucciones de llenado
3. Fórmulas y cálculos automáticos
4. Ejemplos completos
5. Errores comunes
6. Referencias normativas
`,
  };

  log('\n📄 Creando archivos README...', 'blue');
  Object.entries(readmeTemplates).forEach(([filePath, content]) => {
    const fullPath = path.join(baseDir, filePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content, 'utf8');
      log(`✓ Creado: ${filePath}`, 'green');
      createdCount++;
    } else {
      log(`○ Ya existe: ${filePath}`, 'yellow');
    }
  });

  // Resumen final
  log('\n' + '=' .repeat(50), 'blue');
  log(`\n✅ Setup completado!`, 'green');
  log(`📁 ${createdCount} carpetas/archivos creados`, 'green');
  log(`\n📋 Siguiente paso:`, 'blue');
  log(`1. Crear las plantillas Excel en public/templates/source/`, 'reset');
  log(`2. Generar PDFs preview con marca de agua`, 'reset');
  log(`3. Crear guías de uso en PDF`, 'reset');
  log(`4. Implementar API de descarga (app/api/templates/download/route.ts)`, 'reset');
  log(`\n📚 Ver documentación completa en: planning/PLAN_PLANTILLAS_PROFESIONALES.md\n`, 'blue');
}

// Ejecutar
try {
  main();
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
}

