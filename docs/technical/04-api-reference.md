# API Reference - WeldTech Solutions

## Descripción General

La API de WeldTech está construida con Next.js API Routes (App Router). Todos los endpoints están bajo `/api/*` y devuelven respuestas JSON.

---

## Base URL

```
Development: http://localhost:3000/api
Production:  https://tu-dominio.com/api
```

---

## Autenticación

### POST `/api/auth/signup`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Validaciones:**
- `name`: Requerido, string
- `email`: Requerido, formato email válido, único
- `password`: Requerido, mínimo 8 caracteres

**Response (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Usuario Nombre"
  }
}
```

**Errores:**

**400 Bad Request** - Campos faltantes:
```json
{
  "error": "Todos los campos son requeridos"
}
```

**400 Bad Request** - Email ya registrado:
```json
{
  "error": "Este email ya está registrado"
}
```

**400 Bad Request** - Contraseña muy corta:
```json
{
  "error": "La contraseña debe tener al menos 8 caracteres"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Error al registrar usuario"
}
```

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com","password":"Password123!"}'
```

---

### POST `/api/auth/[...nextauth]`

**Gestión de autenticación con NextAuth.js**

Endpoints manejados automáticamente:
- `/api/auth/signin` - Página de login
- `/api/auth/signout` - Cerrar sesión
- `/api/auth/callback/:provider` - OAuth callbacks
- `/api/auth/csrf` - CSRF token
- `/api/auth/session` - Obtener sesión actual
- `/api/auth/providers` - Lista de providers

**Providers Configurados:**
1. **Credentials** (email/password)
2. **Google OAuth** (configurado pero no activo)

**Ejemplo de Login (Credentials):**
```bash
# NextAuth maneja esto automáticamente desde el frontend
# No se llama directamente vía API
```

**Obtener Sesión Actual:**
```bash
GET /api/auth/session
```

**Response:**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Usuario",
    "role": "user"
  },
  "expires": "2024-12-07T12:00:00.000Z"
}
```

Si no hay sesión:
```json
{}
```

---

## Downloads

### POST `/api/downloads/track`

Registra una descarga en el sistema para analytics.

**Headers:**
```
Content-Type: application/json
Cookie: next-auth.session-token=...  (opcional)
```

**Request Body:**
```json
{
  "documentType": "string",
  "documentName": "string",
  "hasWatermark": boolean
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `documentType` | string | Sí | Tipo: "infografia", "wps", "plantilla", etc. |
| `documentName` | string | Sí | Nombre del archivo |
| `hasWatermark` | boolean | No | true si tiene marca de agua (default: detecta automáticamente) |

**Response (200 OK):**
```json
{
  "success": true
}
```

**Errores:**

**400 Bad Request** - Campos faltantes:
```json
{
  "error": "documentType y documentName son requeridos"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Error al registrar descarga"
}
```

**Ejemplo (Usuario Autenticado):**
```bash
curl -X POST http://localhost:3000/api/downloads/track \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "documentType": "infografia",
    "documentName": "infografia_asme_ix.png",
    "hasWatermark": false
  }'
```

**Ejemplo (Usuario Público):**
```bash
curl -X POST http://localhost:3000/api/downloads/track \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "infografia",
    "documentName": "infografia_asme_ix_public.png",
    "hasWatermark": true
  }'
```

**Metadata Capturada Automáticamente:**
- `userId`: Del session (si autenticado)
- `userEmail`: Del session (si autenticado)
- `ipAddress`: De headers `x-forwarded-for` o `x-real-ip`
- `userAgent`: De header `user-agent`
- `createdAt`: Timestamp automático

---

## Códigos de Estado HTTP

| Código | Significado | Uso en WeldTech |
|--------|-------------|-----------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Usuario creado exitosamente |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | No autorizado (sin permisos) |
| 404 | Not Found | Recurso no existe |
| 500 | Internal Server Error | Error del servidor |

---

## Rate Limiting

**Actualmente**: No implementado

**Recomendado para producción**:
- 100 requests/minuto por IP
- 1000 requests/hora por usuario autenticado
- 10 registros/hora por IP

---

## CORS

**Configuración actual**: Same-origin only

**Para habilitar CORS** (si se necesita):

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};
```

---

## Webhooks (Futuro)

No implementados actualmente. Planificados para:
- Notificaciones de nuevos registros
- Alertas de descargas inusuales
- Eventos de sistema

---

## SDK / Client Libraries

No disponibles actualmente. Los endpoints se consumen directamente con `fetch` desde el frontend.

**Ejemplo de uso en componente React:**

```typescript
// Registrar descarga
const trackDownload = async (type: string, name: string) => {
  try {
    const response = await fetch('/api/downloads/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType: type,
        documentName: name,
        hasWatermark: !session?.user
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to track download');
    }
  } catch (error) {
    console.error('Download tracking error:', error);
  }
};
```

---

## Testing

### Postman Collection

Crear colección con:

```json
{
  "info": { "name": "WeldTech API" },
  "item": [
    {
      "name": "Auth - Signup",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/auth/signup",
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Test1234!\"}"
        }
      }
    },
    {
      "name": "Downloads - Track",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/downloads/track",
        "body": {
          "mode": "raw",
          "raw": "{\"documentType\":\"infografia\",\"documentName\":\"test.png\"}"
        }
      }
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" }
  ]
}
```

---

*Última actualización: Noviembre 2025 | Versión: 1.0*

