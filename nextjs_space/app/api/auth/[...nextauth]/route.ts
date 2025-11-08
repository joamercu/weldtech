import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// Evitar recopilación de datos durante el build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Inicializar handler de manera lazy solo cuando se llame
let handler: ReturnType<typeof NextAuth> | null = null;

function getHandler() {
  if (!handler) {
    handler = NextAuth(authOptions);
  }
  return handler;
}

// Exportar handlers como funciones para inicialización lazy
export async function GET(req: NextRequest, context: any) {
  const handler = getHandler();
  return handler(req as any, context);
}

export async function POST(req: NextRequest, context: any) {
  const handler = getHandler();
  return handler(req as any, context);
}
