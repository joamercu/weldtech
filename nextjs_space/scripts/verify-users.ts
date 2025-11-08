import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifyUsers() {
  console.log('🔍 Verificando usuarios en la base de datos...\n');

  try {
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('❌ No se encontraron usuarios en la base de datos.');
      console.log('💡 Ejecuta: npx tsx scripts/seed.ts');
      return;
    }

    console.log(`✅ Se encontraron ${users.length} usuario(s):\n`);

    for (const user of users) {
      console.log(`📧 Email: ${user.email}`);
      console.log(`   Nombre: ${user.name || 'N/A'}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Contraseña: ${user.password ? '✅ Configurada' : '❌ No configurada'}`);
      console.log(`   Email verificado: ${user.emailVerified ? '✅ Sí' : '❌ No'}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString()}`);
      console.log('');
    }

    // Verificar credenciales específicas
    console.log('🔐 Verificando credenciales de administrador...\n');

    const adminEmail = 'john@doe.com';
    const adminPassword = 'johndoe123';

    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.log(`❌ Usuario admin (${adminEmail}) no encontrado.`);
      return;
    }

    if (!admin.password) {
      console.log(`❌ Usuario admin no tiene contraseña configurada.`);
      return;
    }

    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);

    if (isPasswordValid) {
      console.log(`✅ Credenciales de administrador son válidas:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Contraseña: ${adminPassword}`);
      console.log(`   Rol: ${admin.role}`);
    } else {
      console.log(`❌ La contraseña del administrador no coincide.`);
      console.log(`   Esto puede deberse a que la contraseña fue cambiada o el hash no es correcto.`);
    }

  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUsers();

