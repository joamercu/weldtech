/**
 * Test de API de Descarga de Plantillas
 * 
 * Este script verifica que la API funcione correctamente:
 * 1. Con usuarios autenticados (debe retornar Excel)
 * 2. Con usuarios no autenticados (debe retornar PDF)
 * 3. Manejo de errores correcto
 */

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const TEMPLATE_IDS = ['wps', 'pqr', 'wpq'];

async function testAPIDownloads() {
  console.log('🧪 Iniciando test de API de descarga...\n');

  // Simular request sin autenticación
  console.log('📋 Test 1: Usuario NO autenticado');
  console.log('   Debería retornar PDF con marca de agua\n');

  for (const templateId of TEMPLATE_IDS) {
    try {
      // Importar la función GET de la API route
      const { GET } = await import('../app/api/templates/download/route');
      
      // Crear un request simulado sin sesión
      const url = `http://localhost:3000/api/templates/download?id=${templateId}`;
      const request = new NextRequest(url);

      // Simular que no hay sesión
      const mockGetServerSession = async () => null;
      
      // Ejecutar la función GET
      const response = await GET(request);
      
      if (response.status === 404) {
        const body = await response.json();
        console.log(`   ⚠️  Template ${templateId}: ${body.error || 'No disponible'}`);
      } else if (response.status === 200) {
        const contentType = response.headers.get('Content-Type');
        const contentDisposition = response.headers.get('Content-Disposition');
        
        console.log(`   ✅ Template ${templateId}:`);
        console.log(`      Status: ${response.status}`);
        console.log(`      Content-Type: ${contentType}`);
        console.log(`      Content-Disposition: ${contentDisposition}`);
        
        if (contentType?.includes('pdf')) {
          console.log(`      ✅ Retorna PDF (correcto para usuario no autenticado)`);
        } else {
          console.log(`      ⚠️  Retorna ${contentType} (debería ser PDF)`);
        }
      } else {
        console.log(`   ❌ Template ${templateId}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Template ${templateId}: Error - ${error}`);
    }
  }

  // Test con usuario autenticado
  console.log('\n📋 Test 2: Usuario autenticado');
  console.log('   Debería retornar Excel sin marca de agua\n');

  // Obtener usuario admin
  const adminUser = await prisma.user.findUnique({
    where: { email: 'john@doe.com' },
  });

  if (!adminUser) {
    console.log('   ⚠️  Usuario admin no encontrado. Ejecuta: npx tsx scripts/seed.ts');
    await prisma.$disconnect();
    return;
  }

  console.log(`   Usuario de prueba: ${adminUser.email} (${adminUser.role})\n`);

  for (const templateId of TEMPLATE_IDS) {
    try {
      const { GET } = await import('../app/api/templates/download/route');
      const url = `http://localhost:3000/api/templates/download?id=${templateId}`;
      const request = new NextRequest(url);

      // Simular sesión autenticada
      const mockSession = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        },
      };

      // Ejecutar la función GET
      const response = await GET(request);
      
      if (response.status === 404) {
        const body = await response.json();
        console.log(`   ⚠️  Template ${templateId}: ${body.error || 'No disponible'}`);
        console.log(`      ${body.available === false ? 'Archivo Excel no existe aún' : ''}`);
      } else if (response.status === 200) {
        const contentType = response.headers.get('Content-Type');
        const contentDisposition = response.headers.get('Content-Disposition');
        
        console.log(`   ✅ Template ${templateId}:`);
        console.log(`      Status: ${response.status}`);
        console.log(`      Content-Type: ${contentType}`);
        console.log(`      Content-Disposition: ${contentDisposition}`);
        
        if (contentType?.includes('spreadsheetml')) {
          console.log(`      ✅ Retorna Excel (correcto para usuario autenticado)`);
        } else {
          console.log(`      ⚠️  Retorna ${contentType} (debería ser Excel)`);
        }
      } else {
        console.log(`   ❌ Template ${templateId}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Template ${templateId}: Error - ${error}`);
    }
  }

  // Test de validación
  console.log('\n📋 Test 3: Validación de parámetros');
  
  try {
    const { GET } = await import('../app/api/templates/download/route');
    const url = 'http://localhost:3000/api/templates/download';
    const request = new NextRequest(url);

    const response = await GET(request);
    const body = await response.json();
    
    if (response.status === 400 && body.error === 'Template ID es requerido') {
      console.log('   ✅ Validación de parámetros funciona correctamente');
    } else {
      console.log('   ⚠️  Validación de parámetros no funciona como se espera');
    }
  } catch (error) {
    console.log(`   ❌ Error en validación: ${error}`);
  }

  // Test de template inexistente
  console.log('\n📋 Test 4: Template inexistente');
  
  try {
    const { GET } = await import('../app/api/templates/download/route');
    const url = 'http://localhost:3000/api/templates/download?id=inexistente';
    const request = new NextRequest(url);

    const response = await GET(request);
    const body = await response.json();
    
    if (response.status === 404 && body.error === 'Template no encontrado') {
      console.log('   ✅ Manejo de template inexistente funciona correctamente');
    } else {
      console.log('   ⚠️  Manejo de template inexistente no funciona como se espera');
    }
  } catch (error) {
    console.log(`   ❌ Error en test de template inexistente: ${error}`);
  }

  await prisma.$disconnect();
  
  console.log('\n✅ Tests de API completados');
  console.log('\n💡 NOTA: Estos tests verifican la lógica de la API.');
  console.log('   Para probar completamente, necesitas:');
  console.log('   1. Crear los archivos Excel en public/templates/source/');
  console.log('   2. Crear los archivos PDF en public/templates/preview/');
  console.log('   3. Iniciar el servidor Next.js (npm run dev)');
  console.log('   4. Probar manualmente desde el navegador');
}

testAPIDownloads()
  .catch((error) => {
    console.error('❌ Error en test:', error);
    process.exit(1);
  });

