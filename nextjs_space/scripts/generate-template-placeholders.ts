/**
 * Script para generar plantillas Excel placeholder
 * Crea las tres plantillas principales (WPS, PQR, WPQ) con características básicas
 */

import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates', 'source');

// Asegurar que el directorio existe
if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Crea plantilla WPS (QW-482)
 */
async function createWPSTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'WeldTech Solutions';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Hoja 1: Portada
  const portadaSheet = workbook.addWorksheet('Portada');
  portadaSheet.columns = [
    { width: 30 },
    { width: 40 },
  ];

  portadaSheet.getCell('A1').value = 'WPS - Welding Procedure Specification';
  portadaSheet.getCell('A1').font = { size: 16, bold: true };
  portadaSheet.mergeCells('A1:B1');

  portadaSheet.getRow(3).values = ['WPS Number:', ''];
  portadaSheet.getRow(4).values = ['Company:', 'WeldTech Solutions'];
  portadaSheet.getRow(5).values = ['Date:', new Date().toLocaleDateString()];
  portadaSheet.getRow(6).values = ['Prepared By:', ''];
  portadaSheet.getRow(7).values = ['Standard:', 'ASME IX QW-482 / AWS D1.1'];

  // Hoja 2: Variables de Soldadura
  const variablesSheet = workbook.addWorksheet('Variables_Soldadura');
  variablesSheet.columns = [
    { width: 25 },
    { width: 30 },
    { width: 20 },
  ];

  variablesSheet.getCell('A1').value = 'Variables de Soldadura';
  variablesSheet.getCell('A1').font = { size: 14, bold: true };
  variablesSheet.mergeCells('A1:C1');

  const variablesHeaders = ['Variable', 'Valor', 'Unidad'];
  variablesSheet.getRow(3).values = variablesHeaders;
  variablesSheet.getRow(3).font = { bold: true };

  const variables = [
    ['Proceso', 'GTAW', ''],
    ['Tipo de Proceso', 'Manual', ''],
    ['Tipo de Junta', 'Butt Joint', ''],
    ['Ángulo de Ranura', '60', '°'],
    ['Abertura de Raíz', '2', 'mm'],
    ['Espesor Base Material', '6-25', 'mm'],
    ['P-Number', 'P-1', ''],
    ['F-Number', 'F-6', ''],
  ];

  variables.forEach((row, index) => {
    variablesSheet.getRow(4 + index).values = row;
  });

  // Hoja 3: Parámetros Eléctricos
  const parametrosSheet = workbook.addWorksheet('Parametros_Electricos');
  parametrosSheet.columns = [
    { width: 25 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  parametrosSheet.getCell('A1').value = 'Parámetros Eléctricos';
  parametrosSheet.getCell('A1').font = { size: 14, bold: true };
  parametrosSheet.mergeCells('A1:D1');

  const paramHeaders = ['Parámetro', 'Mínimo', 'Máximo', 'Unidad'];
  parametrosSheet.getRow(3).values = paramHeaders;
  parametrosSheet.getRow(3).font = { bold: true };

  const parametros = [
    ['Amperaje', 90, 120, 'A'],
    ['Voltaje', 22, 26, 'V'],
    ['Velocidad de Avance', 12, 18, 'cm/min'],
  ];

  parametros.forEach((row, index) => {
    parametrosSheet.getRow(4 + index).values = row;
  });

  // Fórmula de Heat Input
  parametrosSheet.getCell('A7').value = 'Heat Input (kJ/mm)';
  parametrosSheet.getCell('B7').value = { formula: '=(B4*B5)/(B6*60)' }; // Min: (Amp*Volt)/(Speed*60)
  parametrosSheet.getCell('C7').value = { formula: '=(C4*C5)/(C6*60)' }; // Max: (Amp*Volt)/(Speed*60)
  parametrosSheet.getCell('D7').value = 'kJ/mm';

  // Hoja 4: DataLists (oculta) - Para dropdowns
  const dataListsSheet = workbook.addWorksheet('DataLists');
  dataListsSheet.state = 'hidden';

  // P-Numbers
  dataListsSheet.getColumn('A').values = ['P-Number', 'P-1', 'P-3', 'P-4', 'P-5', 'P-8', 'P-9', 'P-11'];
  
  // F-Numbers
  dataListsSheet.getColumn('B').values = ['F-Number', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7'];
  
  // Procesos
  dataListsSheet.getColumn('C').values = ['Proceso', 'SMAW', 'GTAW', 'GMAW', 'FCAW', 'SAW'];

  // Guardar
  const filePath = path.join(TEMPLATES_DIR, 'WPS_Template_v1.0.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log('✅ WPS Template creado:', filePath);
}

/**
 * Crea plantilla PQR (QW-483)
 */
async function createPQRTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'WeldTech Solutions';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Hoja 1: Portada
  const portadaSheet = workbook.addWorksheet('Portada');
  portadaSheet.columns = [
    { width: 30 },
    { width: 40 },
  ];

  portadaSheet.getCell('A1').value = 'PQR - Procedure Qualification Record';
  portadaSheet.getCell('A1').font = { size: 16, bold: true };
  portadaSheet.mergeCells('A1:B1');

  portadaSheet.getRow(3).values = ['PQR Number:', ''];
  portadaSheet.getRow(4).values = ['WPS Number:', ''];
  portadaSheet.getRow(5).values = ['Date:', new Date().toLocaleDateString()];
  portadaSheet.getRow(6).values = ['Standard:', 'ASME IX QW-483'];

  // Hoja 2: Parámetros As-Welded
  const parametrosSheet = workbook.addWorksheet('Parametros_AsWelded');
  parametrosSheet.columns = [
    { width: 25 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  parametrosSheet.getCell('A1').value = 'Parámetros As-Welded';
  parametrosSheet.getCell('A1').font = { size: 14, bold: true };
  parametrosSheet.mergeCells('A1:D1');

  const paramHeaders = ['Parámetro', 'Valor', 'Unidad', 'Notas'];
  parametrosSheet.getRow(3).values = paramHeaders;
  parametrosSheet.getRow(3).font = { bold: true };

  const parametros = [
    ['Amperaje', 105, 'A', ''],
    ['Voltaje', 24, 'V', ''],
    ['Velocidad de Avance', 15, 'cm/min', ''],
    ['Heat Input', '', 'kJ/mm', ''],
  ];

  parametros.forEach((row, index) => {
    parametrosSheet.getRow(4 + index).values = row;
  });

  // Fórmula de Heat Input
  parametrosSheet.getCell('B7').value = { formula: '=(B4*B5)/(B6*60)' };
  parametrosSheet.getCell('B7').numFmt = '0.00';

  // Hoja 3: Ensayos
  const ensayosSheet = workbook.addWorksheet('Ensayos');
  ensayosSheet.columns = [
    { width: 25 },
    { width: 20 },
    { width: 20 },
    { width: 30 },
  ];

  ensayosSheet.getCell('A1').value = 'Resultados de Ensayos';
  ensayosSheet.getCell('A1').font = { size: 14, bold: true };
  ensayosSheet.mergeCells('A1:D1');

  const ensayosHeaders = ['Ensayo', 'Resultado', 'Requisito', 'Estado'];
  ensayosSheet.getRow(3).values = ensayosHeaders;
  ensayosSheet.getRow(3).font = { bold: true };

  const ensayos = [
    ['Tensión', '', 'Min 415 MPa', ''],
    ['Impacto Charpy', '', 'Min 27 J @ -20°C', ''],
    ['Dureza', '', 'Max 250 HB', ''],
    ['Macrografía', '', 'Aceptable', ''],
    ['Fractura', '', 'Aceptable', ''],
  ];

  ensayos.forEach((row, index) => {
    ensayosSheet.getRow(4 + index).values = row;
  });

  // Guardar
  const filePath = path.join(TEMPLATES_DIR, 'PQR_Template_v1.0.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log('✅ PQR Template creado:', filePath);
}

/**
 * Crea plantilla WPQ (QW-484)
 */
async function createWPQTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'WeldTech Solutions';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Hoja 1: Portada
  const portadaSheet = workbook.addWorksheet('Portada');
  portadaSheet.columns = [
    { width: 30 },
    { width: 40 },
  ];

  portadaSheet.getCell('A1').value = 'WPQ - Welder Performance Qualification';
  portadaSheet.getCell('A1').font = { size: 16, bold: true };
  portadaSheet.mergeCells('A1:B1');

  portadaSheet.getRow(3).values = ['WPQ Number:', ''];
  portadaSheet.getRow(4).values = ['Welder Name:', ''];
  portadaSheet.getRow(5).values = ['Welder ID:', ''];
  portadaSheet.getRow(6).values = ['Date:', new Date().toLocaleDateString()];
  portadaSheet.getRow(7).values = ['Standard:', 'ASME IX QW-484 / AWS D1.1'];

  // Hoja 2: Rangos Cualificados
  const rangosSheet = workbook.addWorksheet('Rangos_Cualificados');
  rangosSheet.columns = [
    { width: 25 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  rangosSheet.getCell('A1').value = 'Rangos Cualificados (Tabla QW-451)';
  rangosSheet.getCell('A1').font = { size: 14, bold: true };
  rangosSheet.mergeCells('A1:D1');

  const rangosHeaders = ['Variable', 'Mínimo', 'Máximo', 'Unidad'];
  rangosSheet.getRow(3).values = rangosHeaders;
  rangosSheet.getRow(3).font = { bold: true };

  const rangos = [
    ['Espesor Base Material', 6, 25, 'mm'],
    ['Diámetro Tubo', 50, 200, 'mm'],
    ['Posición', 'PA, PF, PE', '', ''],
  ];

  rangos.forEach((row, index) => {
    rangosSheet.getRow(4 + index).values = row;
  });

  // Hoja 3: Continuidad
  const continuidadSheet = workbook.addWorksheet('Continuidad');
  continuidadSheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
  ];

  continuidadSheet.getCell('A1').value = 'Registro de Continuidad';
  continuidadSheet.getCell('A1').font = { size: 14, bold: true };
  continuidadSheet.mergeCells('A1:C1');

  continuidadSheet.getRow(3).values = ['Fecha Calificación', 'Fecha Vencimiento', 'Estado'];
  continuidadSheet.getRow(3).font = { bold: true };

  continuidadSheet.getRow(4).values = [new Date().toLocaleDateString(), '', 'Vigente'];
  
  // Fórmula para calcular fecha de vencimiento (6 meses después)
  continuidadSheet.getCell('B4').value = { formula: '=EDATE(A4,6)' };
  continuidadSheet.getCell('B4').numFmt = 'dd/mm/yyyy';

  // Alerta de vencimiento
  continuidadSheet.getCell('D4').value = { formula: '=IF(B4<TODAY(),"VENCIDO","VIGENTE")' };
  continuidadSheet.getCell('D4').font = { color: { argb: 'FFFF0000' } };

  // Guardar
  const filePath = path.join(TEMPLATES_DIR, 'WPQ_Template_v1.0.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log('✅ WPQ Template creado:', filePath);
}

/**
 * Función principal
 */
async function generateAllTemplates() {
  console.log('🚀 Generando plantillas Excel placeholder...\n');

  try {
    await createWPSTemplate();
    await createPQRTemplate();
    await createWPQTemplate();

    console.log('\n✅ Todas las plantillas han sido creadas exitosamente!');
    console.log('\n📁 Ubicación: public/templates/source/');
    console.log('\n📋 Plantillas creadas:');
    console.log('   - WPS_Template_v1.0.xlsx (ASME IX QW-482 / AWS D1.1)');
    console.log('   - PQR_Template_v1.0.xlsx (ASME IX QW-483)');
    console.log('   - WPQ_Template_v1.0.xlsx (ASME IX QW-484 / AWS D1.1)');
    console.log('\n💡 Nota: Estas son plantillas placeholder básicas.');
    console.log('   Puedes mejorarlas agregando más características según tus necesidades.');
  } catch (error) {
    console.error('❌ Error al generar plantillas:', error);
    process.exit(1);
  }
}

// Ejecutar
generateAllTemplates();

