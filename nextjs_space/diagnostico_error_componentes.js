// Script de diagnóstico para el error "missing required error components"
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('🔍 DIAGNÓSTICO: ERROR DE COMPONENTES');
console.log('========================================');
console.log('');

// 1. Verificar componentes de error
console.log('📁 PASO 1: Verificando componentes de error...');
const componentesError = [
  { archivo: 'app/error.tsx', requerido: true, debeSerClient: true },
  { archivo: 'app/global-error.tsx', requerido: false, debeSerClient: true },
  { archivo: 'app/not-found.tsx', requerido: false, debeSerClient: false }
];

let todosExisten = true;
let todosCorrectos = true;

componentesError.forEach(({ archivo, requerido, debeSerClient }) => {
  const ruta = path.join(process.cwd(), archivo);
  const existe = fs.existsSync(ruta);
  
  if (existe) {
    const contenido = fs.readFileSync(ruta, 'utf8');
    const tieneExportDefault = contenido.includes('export default');
    const tieneUseClient = contenido.includes("'use client'") || contenido.includes('"use client"');
    const esCorrecto = tieneExportDefault && (!debeSerClient || tieneUseClient);
    
    console.log(`  ✅ ${archivo}:`);
    console.log(`     - Existe: ${existe}`);
    console.log(`     - Tiene export default: ${tieneExportDefault}`);
    if (debeSerClient) {
      console.log(`     - Tiene 'use client': ${tieneUseClient}`);
    }
    console.log(`     - Estructura correcta: ${esCorrecto ? '✅' : '❌'}`);
    
    if (!esCorrecto) {
      todosCorrectos = false;
    }
  } else {
    console.log(`  ${requerido ? '❌' : '⚠️'} ${archivo}: ${requerido ? 'NO EXISTE (REQUERIDO)' : 'NO EXISTE (OPCIONAL)'}`);
    if (requerido) {
      todosExisten = false;
    }
  }
});

console.log('');

// 2. Verificar cache de Next.js
console.log('📦 PASO 2: Verificando cache de Next.js...');
const cachePaths = [
  { ruta: '.next', nombre: 'Cache de Next.js' },
  { ruta: 'node_modules/.cache', nombre: 'Cache de node_modules' },
  { ruta: '.turbo', nombre: 'Cache de Turbo' }
];

cachePaths.forEach(({ ruta, nombre }) => {
  const existe = fs.existsSync(path.join(process.cwd(), ruta));
  if (existe) {
    console.log(`  ⚠️ ${nombre} existe (puede causar problemas)`);
  } else {
    console.log(`  ✅ ${nombre} no existe`);
  }
});

console.log('');

// 3. Verificar dependencias críticas
console.log('📚 PASO 3: Verificando dependencias críticas...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencias = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const dependenciasCriticas = [
    { nombre: 'next', version: '14.2.33' },
    { nombre: 'react', version: '18.2.0' },
    { nombre: 'react-dom', version: '18.2.0' },
    { nombre: 'framer-motion', version: '10.18.0' },
    { nombre: 'lucide-react', version: '^0.446.0' }
  ];
  
  dependenciasCriticas.forEach(({ nombre, version }) => {
    const versionInstalada = dependencias[nombre];
    if (versionInstalada) {
      console.log(`  ✅ ${nombre}: ${versionInstalada}`);
    } else {
      console.log(`  ❌ ${nombre}: NO INSTALADO`);
      todosCorrectos = false;
    }
  });
} else {
  console.log('  ❌ package.json no encontrado');
  todosCorrectos = false;
}

console.log('');

// 4. Resumen y recomendaciones
console.log('========================================');
console.log('📊 RESUMEN DEL DIAGNÓSTICO');
console.log('========================================');
console.log('');

if (todosExisten && todosCorrectos) {
  console.log('✅ Todos los componentes de error están correctos');
  console.log('');
  console.log('🔧 RECOMENDACIONES:');
  console.log('  1. Limpiar cache de Next.js:');
  console.log('     - Eliminar carpeta .next');
  console.log('     - Eliminar node_modules/.cache');
  console.log('     - Eliminar .turbo (si existe)');
  console.log('  2. Reinstalar dependencias:');
  console.log('     - npm install');
  console.log('  3. Reconstruir el proyecto:');
  console.log('     - npm run build');
  console.log('  4. Reiniciar el servidor de desarrollo:');
  console.log('     - npm run dev');
} else {
  console.log('❌ Se encontraron problemas:');
  if (!todosExisten) {
    console.log('  - Faltan componentes de error requeridos');
  }
  if (!todosCorrectos) {
    console.log('  - Algunos componentes tienen problemas de estructura');
  }
  console.log('');
  console.log('🔧 SOLUCIÓN:');
  console.log('  1. Ejecutar: solucionar_error_componentes.bat');
  console.log('  2. O seguir los pasos manuales del diagnóstico');
}

console.log('');
console.log('========================================');

