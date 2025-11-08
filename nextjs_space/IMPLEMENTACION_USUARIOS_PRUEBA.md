# 👥 Implementación de Usuarios de Prueba

Esta guía explica cómo usar la funcionalidad de usuarios de prueba implementada en la aplicación.

## 📋 Descripción

La aplicación incluye una funcionalidad completa para gestionar usuarios de prueba desde la interfaz de administración. Los usuarios de prueba permiten probar la aplicación sin necesidad de crear usuarios reales.

## 🚀 Características

- ✅ Crear usuarios de prueba desde la interfaz web
- ✅ Actualizar usuarios de prueba existentes
- ✅ Listar usuarios de prueba creados
- ✅ Control mediante Edge Config (habilitar/deshabilitar)
- ✅ Solo accesible para administradores
- ✅ Seguridad: requiere autenticación y rol de admin

## 👤 Usuarios de Prueba Predefinidos

La aplicación incluye 4 usuarios de prueba predefinidos:

| Tipo | Email | Contraseña | Rol |
|------|-------|------------|-----|
| Admin | john@doe.com | johndoe123 | admin |
| Usuario | test@weldtech.com | Soldador123! | user |
| Ingeniero | ingeniero@weldtech.com | Ingeniero2024! | user |
| Inspector | inspector@weldtech.com | Inspector2024! | user |

## 🔧 Configuración

### Paso 1: Habilitar en Edge Config

1. Ve a tu dashboard de Vercel
2. Ve a **Storage** → **Edge Config** → Tu configuración
3. Edita la configuración y agrega:

```json
{
  "app": {
    "features": {
      "testUsers": true
    }
  }
}
```

**Nota:** Si `testUsers` no está configurado o es `false`, los usuarios de prueba solo estarán disponibles en desarrollo (`NODE_ENV=development`).

### Paso 2: Acceder a la Página de Administración

1. Inicia sesión como administrador (john@doe.com / johndoe123)
2. Ve a: `/admin/test-users`
3. Verás la lista de usuarios de prueba y podrás crearlos/actualizarlos

## 📝 Uso

### Crear Usuarios de Prueba

1. Inicia sesión como administrador
2. Ve a `/admin/test-users`
3. Haz clic en "Crear/Actualizar Usuarios"
4. Los usuarios se crearán automáticamente si no existen
5. Si ya existen, se actualizarán con las contraseñas predefinidas

### Ver Usuarios de Prueba

La página `/admin/test-users` muestra:
- Lista de usuarios de prueba creados
- Estado de verificación de email
- Rol de cada usuario
- Total de usuarios creados vs esperados

### Credenciales

Después de crear los usuarios, se mostrarán las credenciales en la página:
- Email de cada usuario
- Contraseña de cada usuario
- Nombre y rol

## 🔒 Seguridad

### Permisos Requeridos

- ✅ Autenticación: El usuario debe estar autenticado
- ✅ Rol de Admin: El usuario debe tener rol `admin`
- ✅ Edge Config: Los usuarios de prueba deben estar habilitados en Edge Config (o estar en desarrollo)

### Validaciones

- Solo usuarios con rol `admin` pueden acceder a `/admin/test-users`
- Solo usuarios con rol `admin` pueden crear/actualizar usuarios de prueba
- Los usuarios de prueba solo se pueden crear si están habilitados en Edge Config o en desarrollo

## 🛠️ API Endpoints

### GET `/api/admin/test-users`

Lista los usuarios de prueba creados.

**Autenticación:** Requerida (rol admin)

**Response:**
```json
{
  "enabled": true,
  "users": [
    {
      "id": "clxxx...",
      "email": "john@doe.com",
      "name": "Admin Test",
      "role": "admin",
      "emailVerified": true,
      "createdAt": "2025-11-XX..."
    }
  ],
  "total": 4,
  "expected": 4
}
```

### POST `/api/admin/test-users`

Crea o actualiza usuarios de prueba.

**Autenticación:** Requerida (rol admin)

**Request Body:**
```json
{
  "action": "create" // o "update"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "created": 2,
    "updated": 2,
    "skipped": 0,
    "total": 4
  },
  "results": [
    {
      "email": "john@doe.com",
      "status": "created",
      "message": "Usuario creado: john@doe.com"
    }
  ],
  "users": [
    {
      "email": "john@doe.com",
      "name": "Admin Test",
      "role": "admin",
      "password": "johndoe123"
    }
  ]
}
```

## 🧪 Testing

### Probar la Funcionalidad

1. Inicia sesión como admin: `john@doe.com / johndoe123`
2. Ve a `/admin/test-users`
3. Haz clic en "Crear/Actualizar Usuarios"
4. Verifica que los usuarios se creen correctamente
5. Prueba iniciar sesión con cada usuario de prueba

### Verificar Usuarios

```bash
# Desde la raíz del proyecto
cd nextjs_space

# Ejecutar script de verificación
npm run test:users:script
```

## 📚 Archivos Relacionados

- `app/api/admin/test-users/route.ts` - API route para gestionar usuarios de prueba
- `app/admin/test-users/page.tsx` - Página de administración
- `scripts/seed-production.ts` - Script para crear usuarios de prueba desde CLI
- `scripts/test-users-production.ts` - Script para verificar usuarios de prueba

## 🐛 Solución de Problemas

### Error: "No autorizado. Se requiere rol de admin."

**Solución:**
1. Verifica que estés autenticado
2. Verifica que tu usuario tenga rol `admin`
3. Si no tienes rol admin, contacta a un administrador

### Error: "Los usuarios de prueba no están habilitados en este entorno."

**Solución:**
1. Verifica que `testUsers` esté habilitado en Edge Config
2. O ejecuta en desarrollo: `NODE_ENV=development`
3. Verifica la configuración de Edge Config en Vercel

### Los usuarios no se crean

**Solución:**
1. Verifica que la base de datos esté accesible
2. Verifica que `DATABASE_URL` esté configurada correctamente
3. Verifica los logs del servidor para ver errores específicos
4. Verifica que las tablas de Prisma existan (ejecuta `npx prisma db push`)

## 📖 Referencias

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org/)
- [Configurar Edge Config](./CONFIGURAR_EDGE_CONFIG.md)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

