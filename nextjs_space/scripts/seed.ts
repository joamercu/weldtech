
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes (solo en desarrollo)
  await prisma.download.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // Usuario admin por defecto (john@doe.com) - requerido para testing
  const adminPassword = await bcrypt.hash('johndoe123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'Admin Test',
      role: 'admin',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario admin creado:', admin.email);

  // Usuario de prueba 1 - Soldador registrado
  const userPassword1 = await bcrypt.hash('Soldador123!', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'test@weldtech.com',
      password: userPassword1,
      name: 'Usuario Prueba',
      role: 'user',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario de prueba 1 creado:', user1.email);

  // Usuario de prueba 2 - Ingeniero de soldadura
  const userPassword2 = await bcrypt.hash('Ingeniero2024!', 10);
  const user2 = await prisma.user.create({
    data: {
      email: 'ingeniero@weldtech.com',
      password: userPassword2,
      name: 'Carlos Martínez',
      role: 'user',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario de prueba 2 creado:', user2.email);

  // Usuario de prueba 3 - Inspector de calidad
  const userPassword3 = await bcrypt.hash('Inspector2024!', 10);
  const user3 = await prisma.user.create({
    data: {
      email: 'inspector@weldtech.com',
      password: userPassword3,
      name: 'Ana García',
      role: 'user',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Usuario de prueba 3 creado:', user3.email);

  // Crear algunas descargas de ejemplo
  await prisma.download.createMany({
    data: [
      {
        userId: user1.id,
        userEmail: user1.email,
        documentType: 'infografia',
        documentName: 'Infografía Técnica de Soldadura',
        hasWatermark: false,
      },
      {
        userId: user2.id,
        userEmail: user2.email,
        documentType: 'wps',
        documentName: 'WPS-SMAW-CS-001',
        hasWatermark: false,
      },
      {
        userEmail: 'anonimo@example.com',
        documentType: 'infografia',
        documentName: 'Infografía Técnica de Soldadura',
        hasWatermark: true,
      },
    ],
  });
  console.log('✅ Descargas de ejemplo creadas');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Usuarios de prueba:');
  console.log('   1. Admin: john@doe.com / johndoe123');
  console.log('   2. Usuario: test@weldtech.com / Soldador123!');
  console.log('   3. Ingeniero: ingeniero@weldtech.com / Ingeniero2024!');
  console.log('   4. Inspector: inspector@weldtech.com / Inspector2024!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
