/**
 * Script para generar plantilla Excel de WPS con datos de ejemplo
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Datos de ejemplo para la plantilla WPS
const wpsExample = {
  wpsNumber: 'WPS-001',
  company: 'WeldTech Solutions',
  date: '2025-11-07',
  preparedBy: 'Carlos Martínez - Inspector CWI',
  process: 'GTAW',
  processType: 'Manual',
  jointType: 'Butt Joint',
  grooveAngle: '60°',
  rootOpening: '2mm',
  rootFaceThickness: '1.5mm',
  backingType: 'Ceramic Backing',
  baseMaterialSpec: 'ASTM A36',
  baseMaterialType: 'Grade 70',
  baseMaterialThickness: '6mm - 25mm',
  pNumber: 'P-1',
  fillerMetalSpec: 'AWS A5.18',
  fillerMetalClassification: 'ER70S-6',
  fillerMetalSize: '2.4mm',
  fNumber: 'F-6',
  aNumber: 'A-1',
  currentType: 'DC',
  polarity: 'DCEP',
  amperageRange: '90-120 A',
  voltageRange: '22-26 V',
  travelSpeed: '12-18 cm/min',
  heatInput: '1.0-2.5 kJ/mm',
  position: 'PA, PF, PE',
  groovePosition: 'All',
  filletPosition: 'All',
  preheatTemp: '150°C',
  interpassTemp: 'Max 250°C',
  pwhtRequired: 'No',
  pwhtTemp: '',
  pwhtTime: '',
  shieldingGasType: 'Ar',
  shieldingGasFlow: '15-20 L/min',
  backingGas: 'Argon',
  backingGasFlow: '10-15 L/min',
  beadType: 'Stringer',
  oscillation: 'None',
  cleaning: 'Wire Brush',
  peening: 'None'
};

// Crear workbook
const wb = XLSX.utils.book_new();

// Convertir datos a formato array para worksheet
const wsData = [
  // Headers (primera fila)
  Object.keys(wpsExample),
  // Datos de ejemplo (segunda fila)
  Object.values(wpsExample)
];

// Crear worksheet
const ws = XLSX.utils.aoa_to_sheet(wsData);

// Ajustar anchos de columna
const colWidths = Object.keys(wpsExample).map(() => ({ wch: 20 }));
ws['!cols'] = colWidths;

// Agregar worksheet al workbook
XLSX.utils.book_append_sheet(wb, ws, 'WPS Data');

// Crear segunda hoja con instrucciones
const instructionsData = [
  ['INSTRUCCIONES DE USO - PLANTILLA WPS'],
  [''],
  ['Esta plantilla Excel permite cargar datos WPS rápidamente en el formulario.'],
  [''],
  ['COLUMNAS REQUERIDAS:'],
  ['- wpsNumber: Número único del WPS (Ej: WPS-001)'],
  ['- company: Nombre de la empresa'],
  ['- date: Fecha en formato YYYY-MM-DD'],
  ['- preparedBy: Nombre del inspector/ingeniero'],
  ['- process: Proceso de soldadura (SMAW, GMAW, GTAW, FCAW, SAW)'],
  [''],
  ['NOTAS:'],
  ['- La primera fila DEBE contener los nombres exactos de las columnas'],
  ['- Los datos deben estar en la segunda fila'],
  ['- Puede modificar los valores de ejemplo según sus necesidades'],
  ['- Para importar: WPS Builder > Cargar Plantilla Excel'],
  [''],
  ['EJEMPLO INCLUIDO:'],
  ['La hoja "WPS Data" contiene un ejemplo completo que puede usar como referencia.'],
  [''],
  ['SOPORTE:'],
  ['Para más información visite: www.weldtech.com']
];

const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
wsInstructions['!cols'] = [{ wch: 80 }];
XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instrucciones');

// Asegurar que el directorio existe
const outputDir = path.join(__dirname, '..', 'public', 'templates');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Guardar archivo
const outputPath = path.join(outputDir, 'plantilla_wps_ejemplo.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Plantilla Excel generada exitosamente:');
console.log(`   ${outputPath}`);
console.log('\n📊 Contenido:');
console.log('   - Hoja 1: WPS Data (ejemplo con todos los campos)');
console.log('   - Hoja 2: Instrucciones de uso');

