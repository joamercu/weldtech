import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getEdgeConfig } from '@/lib/edge-config';

const prisma = new PrismaClient();

/**
 * API Route para gestionar usuarios de prueba
 * 
 * GET /api/admin/test-users - Lista usuarios de prueba
 * POST /api/admin/test-users - Crea usuarios de prueba
 * 
 * Requiere autenticación y rol de admin
 */
export const dynamic = 'force-dynamic';

// Lista de usuarios de prueba predefinidos
const TEST_USERS = [
  {
    email: 'john@doe.com',
    password: 'johndoe123',
    name: 'Admin Test',
    role: 'admin' as const,
  },
  {
    email: 'test@weldtech.com',
    password: 'Soldador123!',
    name: 'Usuario Prueba',
    role: 'user' as const,
  },
  {
    email: 'ingeniero@weldtech.com',
    password: 'Ingeniero2024!',
    name: 'Carlos Martínez',
    role: 'user' as const,
  },
  {
    email: 'inspector@weldtech.com',
    password: 'Inspector2024!',
    name: 'Ana García',
    role: 'user' as const,
  },
];

/**
 * Verifica si el usuario actual tiene permisos de admin
 */
async function checkAdminPermission(): Promise<{ authorized: boolean; session: any }> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { authorized: false, session: null };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  });

  const isAdmin = user?.role === 'admin';
  
  return { authorized: isAdmin, session };
}

/**
 * Verifica si los usuarios de prueba están habilitados en Edge Config
 */
async function areTestUsersEnabled(): Promise<boolean> {
  try {
    const config = await getEdgeConfig('app');
    
    if (!config || !config.features) {
      // Si Edge Config no está configurado, permitir solo en desarrollo
      return process.env.NODE_ENV === 'development';
    }
    
    return config.features.testUsers === true || process.env.NODE_ENV === 'development';
  } catch (error) {
    console.error('[API Test Users] Error al verificar Edge Config:', error);
    // En caso de error, permitir solo en desarrollo
    return process.env.NODE_ENV === 'development';
  }
}

/**
 * GET - Lista usuarios de prueba
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar permisos
    const { authorized } = await checkAdminPermission();
    if (!authorized) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de admin.' },
        { status: 403 }
      );
    }

    // Verificar si los usuarios de prueba están habilitados
    const enabled = await areTestUsersEnabled();
    if (!enabled) {
      return NextResponse.json(
        { error: 'Los usuarios de prueba no están habilitados en este entorno.' },
        { status: 403 }
      );
    }

    // Obtener usuarios de prueba de la base de datos
    const testUserEmails = TEST_USERS.map(u => u.email);
    const users = await prisma.user.findMany({
      where: {
        email: { in: testUserEmails },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({
      enabled,
      users,
      total: users.length,
      expected: TEST_USERS.length,
    });
  } catch (error) {
    console.error('[API Test Users] Error al listar usuarios:', error);
    return NextResponse.json(
      { error: 'Error al listar usuarios de prueba' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crea o actualiza usuarios de prueba
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar permisos
    const { authorized } = await checkAdminPermission();
    if (!authorized) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de admin.' },
        { status: 403 }
      );
    }

    // Verificar si los usuarios de prueba están habilitados
    const enabled = await areTestUsersEnabled();
    if (!enabled) {
      return NextResponse.json(
        { error: 'Los usuarios de prueba no están habilitados en este entorno.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action = 'create' } = body; // 'create' o 'update'

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const results: Array<{ email: string; status: string; message: string }> = [];

    for (const userData of TEST_USERS) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (existingUser) {
          if (action === 'update') {
            // Actualizar contraseña y datos
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            await prisma.user.update({
              where: { email: userData.email },
              data: {
                password: hashedPassword,
                name: userData.name,
                role: userData.role,
                emailVerified: new Date(),
              },
            });
            updatedCount++;
            results.push({
              email: userData.email,
              status: 'updated',
              message: `Usuario actualizado: ${userData.email}`,
            });
          } else {
            skippedCount++;
            results.push({
              email: userData.email,
              status: 'skipped',
              message: `Usuario ya existe: ${userData.email}`,
            });
          }
        } else {
          // Crear nuevo usuario
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          await prisma.user.create({
            data: {
              email: userData.email,
              password: hashedPassword,
              name: userData.name,
              role: userData.role,
              emailVerified: new Date(),
            },
          });
          createdCount++;
          results.push({
            email: userData.email,
            status: 'created',
            message: `Usuario creado: ${userData.email}`,
          });
        }
      } catch (error: any) {
        console.error(`[API Test Users] Error procesando usuario ${userData.email}:`, error);
        skippedCount++;
        results.push({
          email: userData.email,
          status: 'error',
          message: `Error: ${error.message || 'Error desconocido'}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: TEST_USERS.length,
      },
      results,
      users: TEST_USERS.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role,
        password: u.password, // Solo para referencia, no se debe exponer en producción
      })),
    });
  } catch (error) {
    console.error('[API Test Users] Error al crear usuarios:', error);
    return NextResponse.json(
      { error: 'Error al crear usuarios de prueba' },
      { status: 500 }
    );
  }
}

