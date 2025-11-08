// Script para monitorear el servidor Next.js en tiempo real
const http = require('http');

console.log('========================================');
console.log('🔍 MONITOREO DE SERVIDOR - WELDTECH');
console.log('========================================\n');

// Función para verificar el estado del servidor
function verificarServidor() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log(`[${new Date().toLocaleTimeString()}] Estado del servidor:`);
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  Headers:`, res.headers);
      console.log('');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Servidor respondiendo correctamente');
          console.log(`  Tamaño de respuesta: ${data.length} bytes`);
        } else {
          console.log(`⚠️ Servidor respondió con código: ${res.statusCode}`);
        }
        resolve({ statusCode: res.statusCode, dataLength: data.length });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error al conectar: ${err.message}`);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout al conectar'));
    });
  });
}

// Verificar cada 5 segundos
console.log('Iniciando monitoreo cada 5 segundos...');
console.log('Presiona CTRL+C para detener\n');

const intervalo = setInterval(() => {
  verificarServidor().catch(err => {
    console.log(`[${new Date().toLocaleTimeString()}] Error: ${err.message}`);
  });
}, 5000);

// Verificar inmediatamente
verificarServidor().catch(err => {
  console.log(`Error inicial: ${err.message}`);
});

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n\nDeteniendo monitoreo...');
  clearInterval(intervalo);
  process.exit(0);
});

