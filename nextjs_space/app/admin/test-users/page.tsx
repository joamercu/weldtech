'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Loader2, CheckCircle2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestUser {
  id?: string;
  email: string;
  name: string;
  role: string;
  emailVerified?: boolean;
  createdAt?: string;
}

interface TestUsersResponse {
  enabled: boolean;
  users: TestUser[];
  total: number;
  expected: number;
}

interface CreateResponse {
  success: boolean;
  summary: {
    created: number;
    updated: number;
    skipped: number;
    total: number;
  };
  results: Array<{
    email: string;
    status: string;
    message: string;
  }>;
  users: Array<{
    email: string;
    name: string;
    role: string;
    password: string;
  }>;
}

export default function TestUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [data, setData] = useState<TestUsersResponse | null>(null);
  const [credentials, setCredentials] = useState<CreateResponse['users'] | null>(null);

  // Verificar autenticación y permisos
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    // Verificar si es admin (esto debería verificarse en el servidor también)
    if ((session.user as any)?.role !== 'admin') {
      toast({
        title: 'Acceso denegado',
        description: 'Solo los administradores pueden acceder a esta página.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    loadTestUsers();
  }, [session, status, router, toast]);

  const loadTestUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/test-users');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar usuarios de prueba');
      }

      const data = await response.json();
      setData(data);
    } catch (error: any) {
      console.error('Error al cargar usuarios de prueba:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar usuarios de prueba',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestUsers = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/admin/test-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear usuarios de prueba');
      }

      const result: CreateResponse = await response.json();
      setCredentials(result.users);
      
      toast({
        title: 'Usuarios de prueba creados',
        description: `${result.summary.created} creados, ${result.summary.updated} actualizados, ${result.summary.skipped} omitidos`,
      });

      // Recargar lista
      await loadTestUsers();
    } catch (error: any) {
      console.error('Error al crear usuarios de prueba:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al crear usuarios de prueba',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Error al cargar datos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usuarios de Prueba</h1>
              <p className="text-gray-600 mt-2">Gestiona los usuarios de prueba del sistema</p>
            </div>
            <button
              onClick={createTestUsers}
              disabled={creating || !data.enabled}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Crear/Actualizar Usuarios
                </>
              )}
            </button>
          </div>

          {!data.enabled && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">Usuarios de prueba deshabilitados</p>
              </div>
              <p className="text-yellow-700 text-sm mt-2">
                Los usuarios de prueba solo están disponibles en desarrollo o cuando están habilitados en Edge Config.
              </p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total: {data.total} / {data.expected}</span>
              <span>Estado: {data.enabled ? '✅ Habilitado' : '❌ Deshabilitado'}</span>
            </div>
          </div>

          {credentials && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Credenciales de Usuarios de Prueba:</h3>
              <div className="space-y-2">
                {credentials.map((user) => (
                  <div key={user.email} className="text-sm">
                    <span className="font-medium text-green-900">{user.name} ({user.role}):</span>
                    <span className="text-green-700 ml-2">{user.email} / {user.password}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {data.users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay usuarios de prueba creados</p>
                <p className="text-sm mt-2">Haz clic en "Crear/Actualizar Usuarios" para crearlos</p>
              </div>
            ) : (
              data.users.map((user) => (
                <div
                  key={user.id || user.email}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                        {user.emailVerified && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {user.emailVerified ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verificado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600 text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>No verificado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

