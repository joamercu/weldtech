# Esquema de Base de Datos - WeldTech Solutions

## Descripción General

WeldTech utiliza **PostgreSQL** como base de datos relacional y **Prisma** como ORM. El esquema está optimizado para autenticación (NextAuth.js) y tracking de descargas.

---

## Diagrama Entidad-Relación

```
┌─────────────┐         ┌──────────────┐
│    User     │ 1     * │   Account    │
│             │◄────────│              │
│ id (PK)     │         │ id (PK)      │
│ email       │         │ userId (FK)  │
│ password    │         │ provider     │
│ name        │         │ ...          │
│ role        │         └──────────────┘
│ createdAt   │
└─────────────┘
       │
       │ 1
       │
       │ *
┌─────────────┐
│   Session   │
│             │
│ id (PK)     │
│ userId (FK) │
│ expires     │
│ ...         │
└─────────────┘

       │
       │ 1
       │
       │ *
┌─────────────┐
│  Download   │
│             │
│ id (PK)     │
│ userId (FK) │
│ docType     │
│ hasWatermark│
│ createdAt   │
└─────────────┘
```

---

## Modelos

### User

**Propósito**: Almacena información de usuarios registrados.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  downloads     Download[]
}
```

#### Campos

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Identificador único del usuario |
| `name` | String? | Nullable | Nombre completo |
| `email` | String | Unique | Email (usado para login) |
| `emailVerified` | DateTime? | Nullable | Fecha de verificación de email |
| `password` | String? | Nullable | Hash bcrypt de contraseña |
| `image` | String? | Nullable | URL de foto de perfil |
| `role` | String | Default: "user" | Rol: "user" o "admin" |
| `createdAt` | DateTime | Auto | Fecha de creación |
| `updatedAt` | DateTime | Auto | Fecha de última actualización |

#### Relaciones

- **1:N** con `Account` (un usuario puede tener múltiples cuentas OAuth)
- **1:N** con `Session` (un usuario puede tener múltiples sesiones)
- **1:N** con `Download` (un usuario puede tener múltiples descargas)

#### Índices

```sql
-- Automático por @unique
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Automático por @id
CREATE UNIQUE INDEX "User_pkey" ON "User"("id");
```

#### Queries Comunes

```typescript
// Buscar usuario por email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Crear nuevo usuario
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    name: 'Nuevo Usuario',
    password: hashedPassword,
    role: 'user'
  }
});

// Obtener usuarios con descargas
const usersWithDownloads = await prisma.user.findMany({
  include: {
    downloads: true
  }
});

// Actualizar rol
await prisma.user.update({
  where: { id: userId },
  data: { role: 'admin' }
});
```

---

### Account

**Propósito**: Almacena cuentas OAuth vinculadas a usuarios (NextAuth).

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

#### Campos Clave

| Campo | Descripción |
|-------|-------------|
| `provider` | Proveedor OAuth (e.g., "google") |
| `providerAccountId` | ID del usuario en el proveedor |
| `access_token` | Token de acceso OAuth |
| `refresh_token` | Token de refresco OAuth |
| `userId` | FK a User |

#### Restricciones

- **Unique**: `[provider, providerAccountId]` - Un usuario no puede vincular la misma cuenta OAuth dos veces
- **Cascade Delete**: Si se elimina el User, se eliminan sus Accounts

---

### Session

**Propósito**: Almacena sesiones de usuario (usado por NextAuth para sessions basadas en database, aunque actualmente usa JWT).

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Campos

| Campo | Descripción |
|-------|-------------|
| `sessionToken` | Token único de sesión |
| `userId` | FK a User |
| `expires` | Fecha de expiración |

**Nota**: Actualmente no se usa activamente porque NextAuth está configurado con `strategy: 'jwt'` (sesiones sin base de datos).

---

### VerificationToken

**Propósito**: Tokens para verificación de email y reset de contraseña (NextAuth).

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

#### Campos

| Campo | Descripción |
|-------|-------------|
| `identifier` | Email o identificador del usuario |
| `token` | Token de verificación único |
| `expires` | Fecha de expiración del token |

**Uso actual**: No implementado todavía (futuro: verificación de email).

---

### Download

**Propósito**: Tracking de todas las descargas realizadas en la plataforma.

```prisma
model Download {
  id           String   @id @default(cuid())
  userId       String?
  userEmail    String?
  documentType String
  documentName String
  hasWatermark Boolean  @default(true)
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([documentType])
  @@index([createdAt])
}
```

#### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String (PK) | ID único de la descarga |
| `userId` | String? | FK a User (null si es descarga pública) |
| `userEmail` | String? | Email del usuario (cache) |
| `documentType` | String | Tipo: "infografia", "wps", "plantilla", etc. |
| `documentName` | String | Nombre específico del documento |
| `hasWatermark` | Boolean | `true` si tiene marca de agua, `false` si no |
| `ipAddress` | String? | IP del cliente (para analytics) |
| `userAgent` | String? | User-Agent del navegador |
| `createdAt` | DateTime | Fecha y hora de descarga |

#### Relaciones

- **N:1** con `User` (muchas descargas pueden pertenecer a un usuario)
- **SetNull**: Si se elimina el usuario, `userId` se establece en `null` pero la descarga se conserva

#### Índices

```sql
-- Índice en userId (para queries por usuario)
CREATE INDEX "Download_userId_idx" ON "Download"("userId");

-- Índice en documentType (para queries por tipo)
CREATE INDEX "Download_documentType_idx" ON "Download"("documentType");

-- Índice en createdAt (para queries por fecha)
CREATE INDEX "Download_createdAt_idx" ON "Download"("createdAt");
```

#### Queries Comunes

```typescript
// Registrar descarga (usuario autenticado)
await prisma.download.create({
  data: {
    userId: session.user.id,
    userEmail: session.user.email,
    documentType: 'infografia',
    documentName: 'infografia_asme_ix.png',
    hasWatermark: false,
    ipAddress: req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent']
  }
});

// Registrar descarga (público)
await prisma.download.create({
  data: {
    userId: null,
    userEmail: null,
    documentType: 'infografia',
    documentName: 'infografia_asme_ix_public.png',
    hasWatermark: true,
    ipAddress: ipAddr,
    userAgent: userAgent
  }
});

// Obtener descargas del último mes
const downloads = await prisma.download.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  },
  include: {
    user: {
      select: {
        name: true,
        email: true
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});

// Estadísticas por tipo de documento
const stats = await prisma.download.groupBy({
  by: ['documentType'],
  _count: {
    id: true
  }
});
```

---

## Optimizaciones de Performance

### Índices Existentes

1. **User.email**: Unique index (login rápido)
2. **Download.userId**: Index (queries por usuario)
3. **Download.documentType**: Index (queries por tipo)
4. **Download.createdAt**: Index (queries por fecha)

### Índices Recomendados (Futuro)

Si el volumen de datos crece:

```sql
-- Índice compuesto para queries comunes
CREATE INDEX idx_downloads_user_date 
ON "Download"("userId", "createdAt" DESC);

-- Índice para queries de watermark
CREATE INDEX idx_downloads_watermark 
ON "Download"("hasWatermark", "createdAt" DESC);

-- Índice para queries de analytics
CREATE INDEX idx_downloads_type_date 
ON "Download"("documentType", "createdAt" DESC);
```

### Connection Pooling

Prisma maneja automáticamente un pool de conexiones:

```typescript
// lib/db.ts
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
});
```

**Configuración por defecto**:
- Pool size: 10 conexiones
- Timeout: 10s
- Ajustable vía `DATABASE_URL`:
```
postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20
```

---

## Migraciones

### Historial de Migraciones

Actualmente el proyecto usa `prisma db push` (sin migraciones formales).

**Para entorno de producción**, se recomienda usar migraciones:

```bash
# Crear primera migración
npx prisma migrate dev --name init

# Crear migración para cambios
npx prisma migrate dev --name add_new_field

# Aplicar migraciones en producción
npx prisma migrate deploy
```

### Ejemplo de Migración

**Agregar campo `lastLogin` a User**:

```prisma
model User {
  // ... campos existentes
  lastLogin DateTime?
}
```

```bash
npx prisma migrate dev --name add_last_login
```

Genera SQL:
```sql
ALTER TABLE "User" ADD COLUMN "lastLogin" TIMESTAMP(3);
```

---

## Backup y Restauración

### Backup Completo

```bash
pg_dump -h localhost -U postgres -d weldtech -F c -b -v -f backup_$(date +%Y%m%d).dump
```

### Backup Solo Datos

```bash
pg_dump -h localhost -U postgres -d weldtech --data-only -f data_$(date +%Y%m%d).sql
```

### Backup Solo Schema

```bash
pg_dump -h localhost -U postgres -d weldtech --schema-only -f schema_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
# Desde archivo .dump
pg_restore -h localhost -U postgres -d weldtech -v backup_20241107.dump

# Desde archivo .sql
psql -h localhost -U postgres -d weldtech -f backup_20241107.sql
```

---

## Seguridad

### Encriptación de Contraseñas

```typescript
import bcrypt from 'bcryptjs';

// Hash contraseña (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar contraseña
const isValid = await bcrypt.compare(password, hashedPassword);
```

### SQL Injection Protection

Prisma previene SQL injection automáticamente usando queries parametrizadas:

```typescript
// ✅ Seguro (Prisma)
await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ Inseguro (raw SQL sin sanitización)
await prisma.$queryRaw`SELECT * FROM User WHERE email = '${userInput}'`;

// ✅ Seguro (raw SQL con parámetros)
await prisma.$queryRaw`SELECT * FROM User WHERE email = ${userInput}`;
```

### Sensitive Data

**Nunca almacenar en texto plano**:
- ❌ Contraseñas (usar bcrypt hash)
- ❌ Tokens de API
- ❌ Datos de pago

**Datos que SÍ se pueden almacenar**:
- ✅ Emails
- ✅ Nombres
- ✅ Metadata pública
- ✅ Timestamps

---

## Queries Avanzadas

### Join con Aggregation

```typescript
// Usuarios con conteo de descargas
const usersWithCounts = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    _count: {
      select: {
        downloads: true
      }
    }
  },
  orderBy: {
    downloads: {
      _count: 'desc'
    }
  },
  take: 10
});
```

### Filtering Complex

```typescript
// Descargas del último mes con marca de agua
const recentPublicDownloads = await prisma.download.findMany({
  where: {
    AND: [
      {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      {
        hasWatermark: true
      },
      {
        documentType: {
          in: ['infografia', 'plantilla']
        }
      }
    ]
  }
});
```

### Transactions

```typescript
// Crear usuario y primera descarga en transacción
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email: 'new@example.com',
      name: 'New User',
      password: hashedPassword
    }
  });
  
  const download = await tx.download.create({
    data: {
      userId: user.id,
      documentType: 'infografia',
      documentName: 'welcome.pdf',
      hasWatermark: false
    }
  });
  
  return { user, download };
});
```

---

## Monitoring y Mantenimiento

### Tamaño de Tablas

```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Queries Lentas

Habilitar logging en Prisma:

```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    console.log(`Slow query (${e.duration}ms):`, e.query);
  }
});
```

### Vacuum y Analyze

```sql
-- Limpiar y optimizar
VACUUM ANALYZE;

-- Por tabla específica
VACUUM ANALYZE "Download";
```

---

## Documentos Relacionados

- [Arquitectura](01-architecture.md)
- [API Reference](04-api-reference.md)
- [Setup de Desarrollo](02-setup-development.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

