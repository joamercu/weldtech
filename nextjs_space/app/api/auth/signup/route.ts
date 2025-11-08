
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parsear el body del request
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error al parsear JSON del request:', parseError);
      return NextResponse.json(
        { error: 'Formato de datos inválido. Por favor verifica los datos enviados.' },
        { status: 400 }
      );
    }

    const { email, password, name } = body;

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Error al consultar la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error al verificar el usuario. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Error al hashear la contraseña:', hashError);
      return NextResponse.json(
        { error: 'Error al procesar la contraseña. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }

    // Crear usuario
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'user',
        },
      });
    } catch (createError: any) {
      console.error('Error al crear usuario:', createError);
      
      // Manejar errores específicos de Prisma
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error al crear el usuario. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inesperado en signup:', error);
    
    // Proporcionar más detalles del error en desarrollo
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Detalles del error:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    // En desarrollo, devolver más información del error
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Error al registrar usuario. Por favor intenta nuevamente.',
          details: errorMessage
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al registrar usuario. Por favor intenta nuevamente.' },
      { status: 500 }
    );
  }
}
