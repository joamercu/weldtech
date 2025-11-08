// Script de prueba de arranque para verificar que todo funcione correctamente
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('🚀 PRUEBA DE ARRANQUE - WeldTech App');
console.log('========================================\n');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Rutas a probar
const routesToTest = [
  { path: '/', name: 'Página Principal' },
  { path: '/recursos', name: 'Página de Recursos' },
  { path: '/plantillas', name: 'Página de Plantillas' },
  { path: '/infografia', name: 'Página de Infografía' },
  { path: '/herramientas/posiciones', name: 'Herramienta: Posiciones' },
  { path: '/herramientas/defectos', name: 'Herramienta: Defectos' },
  { path: '/herramientas/wps-builder', name: 'Herramienta: WPS Builder' },
  { path: '/herramientas/calificaciones', name: 'Herramienta: Calificaciones' },
  { path: '/auth/login', name: 'Página de Login' },
  { path: '/auth/signup', name: 'Página de Registro' },
];

// Verificar archivos críticos
const criticalFiles = [
  'app/error.tsx',
  'app/global-error.tsx',
  'app/not-found.tsx',
  'app/layout.tsx',
  'app/page.tsx',
  'app/components/recursos-page.tsx',
  'app/recursos/page.tsx',
  'app/api/templates/generate-preview/route.ts',
];

console.log('📁 Verificando archivos críticos...\n');
let filesOk = 0;
let filesMissing = 0;

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
    filesOk++;
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    filesMissing++;
  }
});

console.log(`\n📊 Archivos: ${filesOk} OK, ${filesMissing} faltantes\n`);

// Función para probar una ruta
function testRoute(route) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${route.path}`;
    const startTime = Date.now();
    
    const req = http.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      let status = '✅';
      let statusText = 'OK';
      
      if (res.statusCode >= 400) {
        status = '❌';
        statusText = `ERROR ${res.statusCode}`;
      } else if (res.statusCode >= 300) {
        status = '⚠️';
        statusText = `REDIRECT ${res.statusCode}`;
      }
      
      console.log(`${status} ${route.name.padEnd(35)} | ${res.statusCode} | ${responseTime}ms`);
      resolve({ success: res.statusCode < 400, statusCode: res.statusCode, responseTime });
    });
    
    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${route.name.padEnd(35)} | ERROR | ${responseTime}ms - ${err.message}`);
      resolve({ success: false, error: err.message, responseTime });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      console.log(`⏱️  ${route.name.padEnd(35)} | TIMEOUT | 15000ms`);
      resolve({ success: false, error: 'Timeout', responseTime: 15000 });
    });
  });
}

// Función principal de prueba
async function runTests() {
  console.log('🌐 Verificando que el servidor esté corriendo...\n');
  
  // Primero verificar que el servidor esté corriendo
  try {
    const testReq = http.get(`${BASE_URL}/`, { timeout: 5000 }, () => {
      console.log('✅ Servidor está corriendo en http://localhost:3000\n');
      console.log('📋 Probando rutas principales...\n');
      console.log('Ruta'.padEnd(40) + '| Estado | Tiempo');
      console.log('-'.repeat(60));
      
      // Probar todas las rutas
      Promise.all(routesToTest.map(testRoute)).then(results => {
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        console.log('\n' + '='.repeat(60));
        console.log(`📊 Resultados: ${successCount}/${totalCount} rutas funcionando correctamente`);
        console.log('='.repeat(60));
        
        if (successCount === totalCount) {
          console.log('\n✅ ¡Todas las rutas están funcionando correctamente!');
          process.exit(0);
        } else {
          console.log('\n⚠️  Algunas rutas tienen problemas. Revisa los errores arriba.');
          process.exit(1);
        }
      });
    });
    
    testReq.on('error', (err) => {
      console.log('❌ El servidor NO está corriendo en http://localhost:3000');
      console.log(`   Error: ${err.message}`);
      console.log('\n💡 Ejecuta: cd nextjs_space && npm run dev');
      process.exit(1);
    });
    
  } catch (error) {
    console.log('❌ Error al conectar con el servidor');
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar pruebas
runTests();

