
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

// Función helper para formatear logs de autenticación
function logAuthAttempt(
  type: 'attempt' | 'success' | 'failure',
  email: string,
  reason?: string,
  ip?: string
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    email,
    reason,
    ip: ip || 'N/A',
  };

  if (type === 'success') {
    console.log('✅ [AUTH] Login exitoso:', JSON.stringify(logEntry));
  } else if (type === 'failure') {
    console.error('❌ [AUTH] Login fallido:', JSON.stringify(logEntry));
  } else {
    console.log('🔍 [AUTH] Intento de login:', JSON.stringify(logEntry));
  }
}

// Función helper para obtener el adapter de manera lazy
function getAdapter() {
  // Solo inicializar PrismaAdapter si no estamos en build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return undefined;
  }
  try {
    return PrismaAdapter(prisma);
  } catch (error) {
    console.warn('⚠️ [AUTH] PrismaAdapter no disponible durante el build:', error);
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    // Solo configurar GoogleProvider si las credenciales están disponibles
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          // Obtener IP del request si está disponible
          const ip = req?.headers?.['x-forwarded-for'] || 
                     req?.headers?.['x-real-ip'] || 
                     (req as any)?.socket?.remoteAddress || 
                     'N/A';

          if (!credentials?.email || !credentials?.password) {
            logAuthAttempt('failure', credentials?.email || 'N/A', 'Credenciales faltantes', ip as string);
            throw new Error('Email y contraseña son requeridos');
          }

          logAuthAttempt('attempt', credentials.email, undefined, ip as string);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            logAuthAttempt('failure', credentials.email, 'Usuario no encontrado', ip as string);
            throw new Error('Email o contraseña incorrectos');
          }

          if (!user.password) {
            logAuthAttempt('failure', credentials.email, 'Usuario sin contraseña configurada', ip as string);
            throw new Error('Email o contraseña incorrectos');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            logAuthAttempt('failure', credentials.email, 'Contraseña incorrecta', ip as string);
            throw new Error('Email o contraseña incorrectos');
          }

          logAuthAttempt('success', credentials.email, undefined, ip as string);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          // El logging ya se hizo arriba, solo re-lanzamos el error
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Error al autenticar. Por favor intenta nuevamente.');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log para OAuth (Google)
      if (account?.provider === 'google') {
        const timestamp = new Date().toISOString();
        console.log('✅ [AUTH] Login OAuth exitoso:', JSON.stringify({
          timestamp,
          type: 'oauth_success',
          provider: 'google',
          email: user.email,
          userId: user.id,
        }));
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
      }
      // Store OAuth provider info in token if available
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
  debug: process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_DEBUG === 'true',
  logger: {
    error(code, metadata) {
      console.error('❌ [NEXTAUTH] Error:', code, metadata);
    },
    warn(code) {
      console.warn('⚠️ [NEXTAUTH] Warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NEXTAUTH_DEBUG === 'true') {
        console.log('🔍 [NEXTAUTH] Debug:', code, metadata);
      }
    },
  },
};
