# Guía de Logs de Autenticación - WeldTech Solutions

## Descripción General

Esta guía explica cómo acceder y leer los logs de autenticación en WeldTech Solutions. Los logs registran todos los intentos de login (exitosos y fallidos) con información detallada para auditoría y seguridad.

---

## ¿Dónde Ver los Logs?

### 1. Consola del Servidor (Tiempo Real)

Los logs de autenticación se muestran en **tiempo real** en la consola donde ejecutas el servidor Next.js.

**Ubicación**: La terminal/consola donde ejecutas `npm run dev`

**Cómo verlos**:
1. Inicia el servidor con `npm run dev` o usa el script `iniciar_con_logs.bat`
2. Los logs aparecerán automáticamente cuando ocurran intentos de login
3. Los logs se muestran en formato JSON estructurado

---

## Iniciar Servidor con Logs Detallados

### Opción 1: Script Automático (Recomendado)

Usa el script incluido que configura todas las variables de entorno necesarias:

```bash
# En Windows
iniciar_con_logs.bat

# O manualmente
npm run dev
```

Este script configura:
- `NODE_ENV=development`
- `DEBUG=*`
- `NEXT_DEBUG=1`
- `NEXTAUTH_DEBUG=true`

### Opción 2: Manualmente

Si prefieres iniciar manualmente, configura estas variables de entorno:

**Windows (PowerShell)**:
```powershell
$env:NODE_ENV="development"
$env:DEBUG="*"
$env:NEXT_DEBUG="1"
$env:NEXTAUTH_DEBUG="true"
npm run dev
```

**Windows (CMD)**:
```cmd
set NODE_ENV=development
set DEBUG=*
set NEXT_DEBUG=1
set NEXTAUTH_DEBUG=true
npm run dev
```

**Linux/Mac**:
```bash
NODE_ENV=development DEBUG=* NEXT_DEBUG=1 NEXTAUTH_DEBUG=true npm run dev
```

---

## Formato de los Logs

### Logs de Intentos de Login (Credentials)

Los logs de autenticación con email/password tienen el siguiente formato:

#### Intento de Login (Inicio)
```json
🔍 [AUTH] Intento de login: {
  "timestamp": "2025-01-11T10:30:45.123Z",
  "type": "attempt",
  "email": "usuario@ejemplo.com",
  "ip": "192.168.1.100"
}
```

#### Login Exitoso
```json
✅ [AUTH] Login exitoso: {
  "timestamp": "2025-01-11T10:30:45.456Z",
  "type": "success",
  "email": "usuario@ejemplo.com",
  "ip": "192.168.1.100"
}
```

#### Login Fallido
```json
❌ [AUTH] Login fallido: {
  "timestamp": "2025-01-11T10:30:45.789Z",
  "type": "failure",
  "email": "usuario@ejemplo.com",
  "reason": "Contraseña incorrecta",
  "ip": "192.168.1.100"
}
```

### Logs de OAuth (Google)

```json
✅ [AUTH] Login OAuth exitoso: {
  "timestamp": "2025-01-11T10:30:45.123Z",
  "type": "oauth_success",
  "provider": "google",
  "email": "usuario@gmail.com",
  "userId": "clx1234567890"
}
```

### Logs del Cliente (Navegador)

Los logs del cliente aparecen en la **consola del navegador** (F12 → Console):

```javascript
🔍 [CLIENT] Intento de login iniciado: {
  email: "usuario@ejemplo.com",
  timestamp: "2025-01-11T10:30:45.123Z"
}
```

---

## Tipos de Logs

### Prefijos de Logs

- **`[AUTH]`**: Logs del servidor (NextAuth)
- **`[CLIENT]`**: Logs del navegador (cliente)
- **`[NEXTAUTH]`**: Logs internos de NextAuth (solo con `NEXTAUTH_DEBUG=true`)

### Tipos de Eventos

| Tipo | Descripción | Prefijo |
|------|-------------|---------|
| `attempt` | Intento de login iniciado | 🔍 |
| `success` | Login exitoso | ✅ |
| `failure` | Login fallido | ❌ |
| `oauth_success` | Login OAuth exitoso | ✅ |

### Razones de Fallo Comunes

| Razón | Descripción |
|-------|-------------|
| `Credenciales faltantes` | Email o contraseña no proporcionados |
| `Usuario no encontrado` | El email no existe en la base de datos |
| `Usuario sin contraseña configurada` | Usuario existe pero no tiene contraseña |
| `Contraseña incorrecta` | La contraseña no coincide |

---

## Información Registrada

Cada log de autenticación incluye:

1. **Timestamp**: Fecha y hora exacta del evento (ISO 8601)
2. **Email**: Dirección de correo del usuario que intenta iniciar sesión
3. **Tipo**: Tipo de evento (attempt, success, failure)
4. **IP**: Dirección IP del cliente (si está disponible)
5. **Razón**: Motivo del fallo (solo en logs de fallo)

---

## Ejemplos de Uso

### Ejemplo 1: Monitorear Intentos de Login

1. Inicia el servidor con logs:
   ```bash
   iniciar_con_logs.bat
   ```

2. Intenta iniciar sesión desde la aplicación

3. Observa los logs en la consola:
   ```
   🔍 [AUTH] Intento de login: {"timestamp":"...","type":"attempt","email":"test@ejemplo.com","ip":"127.0.0.1"}
   ✅ [AUTH] Login exitoso: {"timestamp":"...","type":"success","email":"test@ejemplo.com","ip":"127.0.0.1"}
   ```

### Ejemplo 2: Detectar Intentos Fallidos

Si ves múltiples logs de fallo para el mismo email:

```
❌ [AUTH] Login fallido: {"email":"test@ejemplo.com","reason":"Contraseña incorrecta",...}
❌ [AUTH] Login fallido: {"email":"test@ejemplo.com","reason":"Contraseña incorrecta",...}
❌ [AUTH] Login fallido: {"email":"test@ejemplo.com","reason":"Contraseña incorrecta",...}
```

Esto puede indicar:
- Usuario olvidó su contraseña
- Posible ataque de fuerza bruta
- Necesidad de resetear contraseña

### Ejemplo 3: Verificar Login OAuth

Para logins con Google:

```
✅ [AUTH] Login OAuth exitoso: {"provider":"google","email":"usuario@gmail.com",...}
```

---

## Filtrado de Logs

### En la Consola

Puedes usar herramientas de terminal para filtrar logs:

**Windows (PowerShell)**:
```powershell
npm run dev | Select-String "[AUTH]"
```

**Linux/Mac**:
```bash
npm run dev | grep "\[AUTH\]"
```

### Solo Errores

Para ver solo intentos fallidos:

**Windows (PowerShell)**:
```powershell
npm run dev | Select-String "❌"
```

**Linux/Mac**:
```bash
npm run dev | grep "❌"
```

---

## Logs en Producción

### Consideraciones

⚠️ **Importante**: Los logs actuales solo se muestran en consola y no se persisten en archivos.

Para producción, se recomienda:

1. **Sistema de logging estructurado**:
   - Winston o Pino para Node.js
   - Guardar logs en archivos o servicio de logging

2. **Servicios de logging**:
   - Sentry para error tracking
   - LogRocket para sesiones de usuario
   - Datadog o New Relic para monitoreo

3. **Persistencia**:
   - Guardar logs en base de datos
   - Enviar a servicio de logging en la nube
   - Rotar logs automáticamente

### Ejemplo de Configuración Futura

```typescript
// lib/logger.ts (futuro)
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/auth.log' }),
    new winston.transports.Console()
  ]
});
```

---

## Troubleshooting

### No Veo Logs

**Problema**: Los logs no aparecen en la consola

**Soluciones**:
1. Verifica que el servidor esté corriendo
2. Asegúrate de que `NEXTAUTH_DEBUG=true` esté configurado
3. Revisa que estés mirando la consola correcta (servidor, no navegador)
4. Intenta iniciar con `iniciar_con_logs.bat`

### IP Aparece como "N/A"

**Problema**: La IP siempre muestra "N/A"

**Causa**: El servidor no puede obtener la IP del cliente

**Soluciones**:
- En desarrollo local, esto es normal (IP será 127.0.0.1 o N/A)
- En producción con proxy reverso, configura headers `X-Forwarded-For`
- En Vercel/Netlify, la IP se obtiene automáticamente

### Logs Muy Verbosos

**Problema**: Demasiados logs dificultan encontrar información relevante

**Solución**: Filtra por prefijo `[AUTH]`:
```bash
npm run dev | grep "\[AUTH\]"
```

---

## Seguridad

### Información Sensible

⚠️ **Advertencia**: Los logs contienen información sensible:
- Direcciones de email
- Direcciones IP
- Timestamps de actividad

**Recomendaciones**:
- No compartir logs públicamente
- Rotar logs regularmente
- Cumplir con GDPR/privacidad si aplica
- En producción, considerar enmascarar emails parcialmente

### Ejemplo de Enmascaramiento

```typescript
// Enmascarar email en logs (futuro)
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const masked = local.substring(0, 2) + '***' + '@' + domain;
  return masked;
}
```

---

## Próximos Pasos

1. **Implementar persistencia de logs**: Guardar logs en base de datos o archivos
2. **Dashboard de logs**: Interfaz web para ver logs de autenticación
3. **Alertas automáticas**: Notificar sobre múltiples intentos fallidos
4. **Analytics**: Analizar patrones de login y seguridad

---

## Referencias

- [Documentación de NextAuth](https://next-auth.js.org/configuration/options#logger)
- [Guía de Administrador](../user-guide/06-admin-guide.md)
- [Documentación Técnica](../technical/README.md)

---

*Última actualización: Enero 2025*  
*Versión: 1.0*

