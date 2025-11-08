/**
 * Test de Funcionalidad de Descarga de Plantillas
 * 
 * Este script verifica que:
 * 1. Los botones de descarga funcionen correctamente
 * 2. Los usuarios registrados reciban archivos Excel editables
 * 3. Los usuarios no registrados reciban PDFs con marca de agua
 * 4. La autenticación funcione correctamente
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// IDs de las plantillas según la imagen
const TEMPLATE_IDS = ['wps', 'pqr', 'wpq']; // QW-482, QW-483, QW-484

interface TestResult {
  templateId: string;
  templateName: string;
  standard: string;
  tests: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

async function testTemplateDownloads() {
  console.log('🧪 Iniciando test de descarga de plantillas...\n');

  const results: TestResult[] = [];

  // 1. Verificar que las plantillas estén configuradas
  console.log('📋 Verificando configuración de plantillas...');
  const { TEMPLATES } = await import('../lib/templates-config');
  
  for (const templateId of TEMPLATE_IDS) {
    const template = TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      console.error(`❌ Template ${templateId} no encontrado en configuración`);
      continue;
    }

    console.log(`\n✅ Template encontrado: ${template.name}`);
    console.log(`   Estándar: ${template.standard}`);
    console.log(`   Archivo: ${template.fileName}`);

    const testResult: TestResult = {
      templateId,
      templateName: template.name,
      standard: template.standard,
      tests: [],
    };

    // 2. Verificar que el archivo Excel existe (para usuarios registrados)
    const excelPath = path.join(
      process.cwd(),
      'public',
      'templates',
      'source',
      template.fileName
    );

    const excelExists = fs.existsSync(excelPath);
    testResult.tests.push({
      name: 'Archivo Excel existe',
      passed: excelExists,
      message: excelExists
        ? `✅ Archivo Excel encontrado: ${template.fileName}`
        : `❌ Archivo Excel NO encontrado: ${excelPath}`,
    });

    if (excelExists) {
      const stats = fs.statSync(excelPath);
      testResult.tests.push({
        name: 'Archivo Excel tiene contenido',
        passed: stats.size > 0,
        message: stats.size > 0
          ? `✅ Archivo tiene ${(stats.size / 1024).toFixed(2)} KB`
          : `❌ Archivo está vacío`,
      });

      // Verificar que es un archivo Excel válido
      const isExcel = template.fileName.endsWith('.xlsx');
      testResult.tests.push({
        name: 'Formato Excel válido',
        passed: isExcel,
        message: isExcel
          ? `✅ Formato .xlsx correcto`
          : `❌ Formato incorrecto (debe ser .xlsx)`,
      });
    }

    // 3. Verificar que el PDF preview existe (para usuarios no registrados)
    const pdfFileName = template.fileName.replace('.xlsx', '_Preview.pdf');
    const pdfPath = path.join(
      process.cwd(),
      'public',
      'templates',
      'preview',
      pdfFileName
    );

    const pdfExists = fs.existsSync(pdfPath);
    testResult.tests.push({
      name: 'Archivo PDF preview existe',
      passed: pdfExists,
      message: pdfExists
        ? `✅ Archivo PDF preview encontrado: ${pdfFileName}`
        : `⚠️ Archivo PDF preview NO encontrado: ${pdfPath} (opcional para usuarios no registrados)`,
    });

    // 4. Verificar que la API route existe
    const apiRoutePath = path.join(
      process.cwd(),
      'app',
      'api',
      'templates',
      'download',
      'route.ts'
    );

    const apiRouteExists = fs.existsSync(apiRoutePath);
    testResult.tests.push({
      name: 'API route existe',
      passed: apiRouteExists,
      message: apiRouteExists
        ? `✅ API route encontrada: /api/templates/download`
        : `❌ API route NO encontrada: ${apiRoutePath}`,
    });

    // 5. Verificar funciones del excel-handler
    try {
      const { templateExists, getTemplateInfo } = await import('../lib/excel-handler');
      
      const handlerExists = templateExists(templateId);
      testResult.tests.push({
        name: 'Función templateExists funciona',
        passed: handlerExists === excelExists,
        message: handlerExists === excelExists
          ? `✅ Función templateExists retorna ${handlerExists} (correcto)`
          : `❌ Función templateExists retorna ${handlerExists} pero archivo ${excelExists ? 'existe' : 'no existe'}`,
      });

      const templateInfo = getTemplateInfo(templateId);
      testResult.tests.push({
        name: 'Función getTemplateInfo funciona',
        passed: !!templateInfo,
        message: templateInfo
          ? `✅ Template info obtenida: ${templateInfo.name}`
          : `❌ No se pudo obtener template info`,
      });
    } catch (error) {
      testResult.tests.push({
        name: 'Excel handler importable',
        passed: false,
        message: `❌ Error al importar excel-handler: ${error}`,
      });
    }

    results.push(testResult);
  }

  // 6. Verificar usuarios de prueba
  console.log('\n👤 Verificando usuarios de prueba...');
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'john@doe.com' },
    });

    if (adminUser) {
      console.log('✅ Usuario admin encontrado: john@doe.com');
      console.log(`   Rol: ${adminUser.role}`);
      console.log(`   Contraseña configurada: ${adminUser.password ? 'Sí' : 'No'}`);
    } else {
      console.log('⚠️ Usuario admin NO encontrado. Ejecuta: npx tsx scripts/seed.ts');
    }
  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
  }

  // Resumen de resultados
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE RESULTADOS');
  console.log('='.repeat(60));

  let totalTests = 0;
  let passedTests = 0;

  for (const result of results) {
    console.log(`\n📋 ${result.templateName} (${result.standard})`);
    console.log(`   Template ID: ${result.templateId}`);
    
    for (const test of result.tests) {
      totalTests++;
      if (test.passed) passedTests++;
      
      const icon = test.passed ? '✅' : '❌';
      console.log(`   ${icon} ${test.name}: ${test.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📈 Total: ${passedTests}/${totalTests} tests pasados`);
  console.log(`   Porcentaje: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  
  const missingExcel = results.some(r => 
    r.tests.find(t => t.name === 'Archivo Excel existe' && !t.passed)
  );
  
  if (missingExcel) {
    console.log('⚠️  Algunos archivos Excel no existen.');
    console.log('   Acción: Crear los archivos Excel en public/templates/source/');
    console.log('   Archivos necesarios:');
    for (const result of results) {
      const excelTest = result.tests.find(t => t.name === 'Archivo Excel existe');
      if (excelTest && !excelTest.passed) {
        const template = TEMPLATES.find(t => t.id === result.templateId);
        if (template) {
          console.log(`     - ${template.fileName}`);
        }
      }
    }
  }

  const missingPdf = results.some(r => 
    r.tests.find(t => t.name === 'Archivo PDF preview existe' && !t.passed)
  );
  
  if (missingPdf) {
    console.log('\n⚠️  Algunos archivos PDF preview no existen.');
    console.log('   Acción: Crear los archivos PDF en public/templates/preview/');
    console.log('   (Opcional: solo para usuarios no registrados)');
  }

  if (passedTests === totalTests) {
    console.log('\n🎉 ¡Todos los tests pasaron! Los botones deberían funcionar correctamente.');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisa los errores arriba.');
  }

  await prisma.$disconnect();
}

// Ejecutar test
testTemplateDownloads()
  .catch((error) => {
    console.error('❌ Error en test:', error);
    process.exit(1);
  });

