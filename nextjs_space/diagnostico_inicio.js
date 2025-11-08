// Script de diagnóstico para Next.js
console.log('========================================');
console.log('🔍 DIAGNÓSTICO DE INICIO - WELDTECH');
console.log('========================================\n');

// Verificar Node.js
console.log('📦 Verificando entorno:');
console.log('  Node.js:', process.version);
console.log('  Plataforma:', process.platform);
console.log('  Directorio actual:', process.cwd());
console.log('');

// Verificar archivos críticos
const fs = require('fs');
const path = require('path');

const archivosCriticos = [
  'package.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/error.tsx',
  'app/not-found.tsx',
  'app/global-error.tsx',
  'app/providers.tsx',
  'next.config.js',
  'tsconfig.json',
  '.env'
];

console.log('📁 Verificando archivos críticos:');
archivosCriticos.forEach(archivo => {
  const existe = fs.existsSync(path.join(process.cwd(), archivo));
  const estado = existe ? '✅' : '❌';
  console.log(`  ${estado} ${archivo}`);
});
console.log('');

// Verificar node_modules
const nodeModulesExiste = fs.existsSync(path.join(process.cwd(), 'node_modules'));
console.log('📚 Dependencias:');
console.log(`  ${nodeModulesExiste ? '✅' : '❌'} node_modules ${nodeModulesExiste ? 'existe' : 'NO EXISTE'}`);

if (nodeModulesExiste) {
  const nextExiste = fs.existsSync(path.join(process.cwd(), 'node_modules/next'));
  console.log(`  ${nextExiste ? '✅' : '❌'} Next.js instalado`);
  
  const reactExiste = fs.existsSync(path.join(process.cwd(), 'node_modules/react'));
  console.log(`  ${reactExiste ? '✅' : '❌'} React instalado`);
}
console.log('');

// Verificar variables de entorno
console.log('🔐 Variables de entorno:');
const envExiste = fs.existsSync(path.join(process.cwd(), '.env'));
console.log(`  ${envExiste ? '✅' : '⚠️'} Archivo .env ${envExiste ? 'existe' : 'NO EXISTE'}`);

if (envExiste) {
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`  Variables definidas: ${envVars.length}`);
  } catch (e) {
    console.log('  ⚠️ Error al leer .env');
  }
}
console.log('');

// Verificar puerto
console.log('🌐 Configuración de red:');
const port = process.env.PORT || 3000;
console.log(`  Puerto: ${port}`);
console.log(`  URL: http://localhost:${port}`);
console.log('');

console.log('========================================');
console.log('✅ Diagnóstico completado');
console.log('========================================\n');

