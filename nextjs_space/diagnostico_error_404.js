// Script de diagnóstico para el error 404 y "missing required error components"
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('🔍 DIAGNÓSTICO: ERROR 404 Y COMPONENTES');
console.log('========================================\n');

// 1. Verificar puertos en uso
console.log('📡 PASO 1: Verificando puertos en uso...');
const puertos = [3000, 3001, 3002, 3003, 3004, 3005];
const puertosEnUso = [];

function verificarPuerto(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve({ port, status: res.statusCode, activo: true });
    });
    
    req.on('error', () => {
      resolve({ port, status: null, activo: false });
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ port, status: null, activo: false });
    });
  });
}

async function verificarPuertos() {
  for (const port of puertos) {
    const resultado = await verificarPuerto(port);
    if (resultado.activo) {
      console.log(`  ✅ Puerto ${port}: ACTIVO (Status: ${resultado.status})`);
      puertosEnUso.push(port);
    } else {
      console.log(`  ❌ Puerto ${port}: No responde`);
    }
  }
  console.log('');
}

// 2. Verificar componentes de error
console.log('📁 PASO 2: Verificando componentes de error...');
const componentesError = [
  'app/error.tsx',
  'app/not-found.tsx',
  'app/global-error.tsx'
];

componentesError.forEach(archivo => {
  const ruta = path.join(process.cwd(), archivo);
  const existe = fs.existsSync(ruta);
  if (existe) {
    const contenido = fs.readFileSync(ruta, 'utf8');
    const tieneExportDefault = contenido.includes('export default');
    const tieneUseClient = contenido.includes("'use client'") || contenido.includes('"use client"');
    console.log(`  ✅ ${archivo}:`);
    console.log(`     - Existe: ${existe}`);
    console.log(`     - Tiene export default: ${tieneExportDefault}`);
    console.log(`     - Tiene 'use client': ${tieneUseClient}`);
  } else {
    console.log(`  ❌ ${archivo}: NO EXISTE`);
  }
});
console.log('');

// 3. Verificar layout.tsx
console.log('📄 PASO 3: Verificando layout.tsx...');
const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const tieneProviders = layoutContent.includes('Providers');
  const tieneDynamic = layoutContent.includes('export const dynamic');
  const forceStatic = layoutContent.includes('force-static');
  
  console.log(`  ✅ Layout existe`);
  console.log(`     - Tiene Providers: ${tieneProviders}`);
  console.log(`     - Tiene dynamic: ${tieneDynamic}`);
  console.log(`     - Force-static activo: ${forceStatic}`);
} else {
  console.log(`  ❌ Layout NO EXISTE`);
}
console.log('');

// 4. Verificar page.tsx
console.log('📄 PASO 4: Verificando page.tsx...');
const pagePath = path.join(process.cwd(), 'app/page.tsx');
if (fs.existsSync(pagePath)) {
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  const tieneExportDefault = pageContent.includes('export default');
  console.log(`  ✅ Page existe`);
  console.log(`     - Tiene export default: ${tieneExportDefault}`);
} else {
  console.log(`  ❌ Page NO EXISTE`);
}
console.log('');

// 5. Verificar caché
console.log('🗑️ PASO 5: Verificando caché...');
const cachePath = path.join(process.cwd(), '.next');
if (fs.existsSync(cachePath)) {
  console.log(`  ⚠️ Caché .next existe`);
  console.log(`     - Recomendación: Eliminar caché y reiniciar`);
} else {
  console.log(`  ✅ No hay caché`);
}
console.log('');

// 6. Resumen y recomendaciones
console.log('========================================');
console.log('📊 RESUMEN Y RECOMENDACIONES');
console.log('========================================\n');

console.log('🔧 PROBLEMA DETECTADO:');
console.log('  - El navegador intenta conectarse a localhost:3000');
console.log('  - El servidor puede estar en otro puerto (3002, 3003, etc.)');
console.log('  - Hay un script haciendo peticiones repetidas con setTimeout');
console.log('');

console.log('✅ SOLUCIÓN:');
console.log('  1. Verifica en qué puerto está corriendo el servidor');
console.log('  2. Abre el navegador en el puerto correcto');
console.log('  3. Si el servidor está en 3002, usa: http://localhost:3002');
console.log('  4. Detén todos los servidores y reinicia en el puerto 3000');
console.log('');

// Ejecutar verificaciones
verificarPuertos().then(() => {
  console.log('========================================');
  console.log('✅ Diagnóstico completado');
  console.log('========================================\n');
  
  if (puertosEnUso.length > 0) {
    console.log(`🌐 Servidor activo en puerto(s): ${puertosEnUso.join(', ')}`);
    console.log(`   Abre el navegador en: http://localhost:${puertosEnUso[0]}`);
  } else {
    console.log('⚠️ No se encontró ningún servidor activo');
    console.log('   Ejecuta: npm run dev');
  }
});

