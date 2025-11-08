# Guía de Administrador - WeldTech Solutions

## Descripción General

Esta guía está dirigida a administradores del sistema WeldTech Solutions que necesitan gestionar usuarios, monitorear uso, y mantener la plataforma.

⚠️ **Nota**: Algunas funciones administrativas están en desarrollo. Esta guía documenta tanto funcionalidades actuales como planificadas.

---

## Requisitos Previos

### Acceso Administrativo

Para ser administrador necesitas:
- ✅ Cuenta con rol `admin` en la base de datos
- ✅ Conocimiento técnico básico
- ✅ Acceso a la base de datos (PostgreSQL)
- ✅ Acceso al servidor/hosting

### Cuentas Administrativas

**Cuenta de prueba admin**:
- Email: `john@doe.com`
- Contraseña: `johndoe123`
- Rol: `admin`

---

## Panel de Administración _(En Desarrollo)_

### Estado Actual

Actualmente, la plataforma **no tiene panel administrativo visual**. La administración se realiza a través de:
1. Acceso directo a la base de datos
2. Consultas SQL
3. Scripts de mantenimiento

### Funcionalidades Planificadas

**Dashboard Administrativo** (Q1 2026):
- Vista general de métricas
- Gestión de usuarios
- Analytics y reportes
- Configuración del sistema

---

## Gestión de Usuarios

### Ver Todos los Usuarios

**Método actual: Consulta SQL**

```sql
SELECT 
  id,
  name,
  email,
  role,
  "createdAt",
  "updatedAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

**Información mostrada**:
- ID único del usuario
- Nombre completo
- Email
- Rol (user/admin)
- Fecha de registro
- Última actualización

### Crear Usuario Manualmente

**Método actual: SQL + bcrypt**

1. **Generar hash de contraseña**:

```javascript
// Usando Node.js y bcrypt
const bcrypt = require('bcryptjs');
const password = 'MiContraseña123!';
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);
```

2. **Insertar usuario en DB**:

```sql
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Nombre Apellido',
  'email@ejemplo.com',
  '$2a$10$...', -- Hash de la contraseña
  'user', -- o 'admin'
  NOW(),
  NOW()
);
```

### Cambiar Rol de Usuario

**De usuario a administrador**:

```sql
UPDATE "User"
SET role = 'admin', "updatedAt" = NOW()
WHERE email = 'usuario@ejemplo.com';
```

**De administrador a usuario**:

```sql
UPDATE "User"
SET role = 'user', "updatedAt" = NOW()
WHERE email = 'admin@ejemplo.com';
```

### Eliminar Usuario

⚠️ **Precaución**: Esta acción es permanente.

```sql
-- Ver descargas del usuario primero
SELECT * FROM "Download" WHERE "userId" = 'user-id-here';

-- Eliminar usuario (las descargas se conservan con userId = NULL)
DELETE FROM "User" WHERE id = 'user-id-here';
```

### Resetear Contraseña

**Método actual: SQL + bcrypt**

1. Generar nuevo hash (ver sección "Crear Usuario")
2. Actualizar en DB:

```sql
UPDATE "User"
SET password = '$2a$10$...', "updatedAt" = NOW()
WHERE email = 'usuario@ejemplo.com';
```

---

## Estadísticas de Descargas

### Consultas Útiles

#### Total de Descargas

```sql
SELECT COUNT(*) as total_descargas
FROM "Download";
```

#### Descargas por Tipo de Documento

```sql
SELECT 
  "documentType",
  COUNT(*) as cantidad
FROM "Download"
GROUP BY "documentType"
ORDER BY cantidad DESC;
```

#### Descargas con/sin Marca de Agua

```sql
SELECT 
  "hasWatermark",
  COUNT(*) as cantidad
FROM "Download"
GROUP BY "hasWatermark";
```

**Resultados esperados**:
- `true`: Descargas públicas (con marca)
- `false`: Descargas autenticadas (sin marca)

#### Descargas por Usuario

```sql
SELECT 
  u.name,
  u.email,
  COUNT(d.id) as total_descargas
FROM "User" u
LEFT JOIN "Download" d ON u.id = d."userId"
GROUP BY u.id, u.name, u.email
ORDER BY total_descargas DESC
LIMIT 10;
```

#### Descargas Recientes (últimas 24h)

```sql
SELECT 
  d."documentType",
  d."documentName",
  d."hasWatermark",
  d."createdAt",
  u.name as usuario,
  u.email
FROM "Download" d
LEFT JOIN "User" u ON d."userId" = u.id
WHERE d."createdAt" >= NOW() - INTERVAL '24 hours'
ORDER BY d."createdAt" DESC;
```

#### Descargas por Fecha

```sql
SELECT 
  DATE(d."createdAt") as fecha,
  COUNT(*) as descargas
FROM "Download" d
WHERE d."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY DATE(d."createdAt")
ORDER BY fecha DESC;
```

#### IPs Más Activas

```sql
SELECT 
  "ipAddress",
  COUNT(*) as descargas
FROM "Download"
WHERE "ipAddress" IS NOT NULL
GROUP BY "ipAddress"
ORDER BY descargas DESC
LIMIT 20;
```

### Exportar Estadísticas

**Método: psql export**

```bash
# Exportar a CSV
psql -h localhost -U postgres -d weldtech \
  -c "COPY (SELECT * FROM \"Download\" WHERE \"createdAt\" >= NOW() - INTERVAL '30 days') TO STDOUT WITH CSV HEADER" \
  > descargas_ultimos_30_dias.csv
```

---

## Monitoreo de Uso de Herramientas

### Usuarios Activos

```sql
SELECT 
  COUNT(DISTINCT "userId") as usuarios_unicos_con_descargas
FROM "Download"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
  AND "userId" IS NOT NULL;
```

### Tasa de Conversión (Público → Registrado)

```sql
WITH stats AS (
  SELECT 
    SUM(CASE WHEN "hasWatermark" = true THEN 1 ELSE 0 END) as descargas_publicas,
    SUM(CASE WHEN "hasWatermark" = false THEN 1 ELSE 0 END) as descargas_autenticadas,
    COUNT(*) as total
  FROM "Download"
  WHERE "createdAt" >= NOW() - INTERVAL '30 days'
)
SELECT 
  descargas_publicas,
  descargas_autenticadas,
  total,
  ROUND((descargas_autenticadas::numeric / total * 100), 2) as porcentaje_autenticados
FROM stats;
```

### Nuevos Registros por Día

```sql
SELECT 
  DATE("createdAt") as fecha,
  COUNT(*) as nuevos_usuarios
FROM "User"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY DATE("createdAt")
ORDER BY fecha DESC;
```

---

## Gestión de Contenido

### Actualizar Infografías

**Ubicación de archivos**:
```
/public/images/infografia/
  ├── documentacion.png
  ├── ensayos.png
  ├── espesor-diametro.png
  ├── hero-portada.png
  ├── juntas.png
  ├── posiciones.png
  └── procesos.png
```

**Proceso de actualización**:
1. Prepara nuevas imágenes con **mismo nombre**
2. Optimiza tamaño (recomendado: TinyPNG)
3. Reemplaza archivos en `/public/images/infografia/`
4. Limpia cache del CDN (si aplica)
5. Verifica en navegador (Ctrl+F5 para forzar recarga)

### Actualizar Imágenes de Herramientas

**Ubicación de imágenes de defectos**:
```
/public/herramientas/
  ├── escoria.jpg
  ├── grietas.jpg
  ├── porosidad.jpg
  ├── posicion-5g.jpg
  ├── posicion-6g.jpg
  ├── ... (etc)
```

**Proceso**: Igual que infografías

### Actualizar Logos

**Ubicación**:
```
/public/logo/
  ├── weldtech-horizontal-full-color.png
  ├── weldtech-symbol-only.jpg
  └── weldtech-vertical-full-color.png
```

**Importante**: Mantén los nombres exactos para no romper referencias en código.

---

## Configuración del Sistema

### Variables de Entorno

**Archivo**: `/nextjs_space/.env`

**Variables críticas**:

```env
# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/weldtech"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="genera-un-secreto-seguro-aqui"

# Opcional: Email (futuro)
EMAIL_SERVER=""
EMAIL_FROM=""
```

**Generar NEXTAUTH_SECRET**:

```bash
openssl rand -base64 32
```

### Configuración de Marca de Agua

**Archivo**: `/nextjs_space/lib/watermark.ts`

**Personalizar texto**:

```typescript
const watermarkText = "DESCARGA PÚBLICA - WeldTech Solutions";
```

**Ajustar estilo**:

```typescript
ctx.font = 'bold 48px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
ctx.rotate(-45 * Math.PI / 180);
```

---

## Respaldo de Base de Datos

### Backup Manual

**Método 1: pg_dump (recomendado)**

```bash
# Backup completo
pg_dump -h localhost -U postgres -d weldtech -F c -b -v -f backup_weldtech_$(date +%Y%m%d).dump

# Backup solo esquema
pg_dump -h localhost -U postgres -d weldtech --schema-only -f schema_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump -h localhost -U postgres -d weldtech --data-only -f data_$(date +%Y%m%d).sql
```

**Método 2: Prisma (desarrollo)**

```bash
# Exportar schema
npx prisma db pull

# Generar seed con datos
# (requiere script personalizado)
```

### Restaurar Backup

```bash
# Desde archivo .dump
pg_restore -h localhost -U postgres -d weldtech -v backup_weldtech_20241107.dump

# Desde archivo .sql
psql -h localhost -U postgres -d weldtech -f backup_20241107.sql
```

### Automatizar Backups

**Script de backup automático** (`backup.sh`):

```bash
#!/bin/bash
BACKUP_DIR="/backups/weldtech"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="weldtech_$DATE.dump"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Backup
pg_dump -h localhost -U postgres -d weldtech -F c -b -v -f "$BACKUP_DIR/$FILENAME"

# Comprimir
gzip "$BACKUP_DIR/$FILENAME"

# Eliminar backups mayores a 30 días
find $BACKUP_DIR -name "*.dump.gz" -mtime +30 -delete

echo "Backup completado: $FILENAME.gz"
```

**Configurar cron** (Linux/Mac):

```bash
# Editar crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/weldtech_backup.log 2>&1
```

---

## Seguridad

### Mejores Prácticas

**1. Contraseñas Seguras**
- Mínimo 12 caracteres para admins
- Combinar mayúsculas, minúsculas, números, símbolos
- Cambiar cada 90 días

**2. Acceso a Base de Datos**
- No exponer puerto 5432 públicamente
- Usar firewall (solo IPs específicas)
- Conexiones SSL/TLS obligatorias

**3. Variables de Entorno**
- NUNCA commitear `.env` a Git
- Usar variables de entorno en producción (Vercel/Netlify)
- Rotar secretos periódicamente

**4. Actualizaciones**
- Mantener Next.js actualizado
- Actualizar dependencias mensualmente
- Revisar avisos de seguridad de npm

**5. Logs**
- Monitorear logs de acceso
- Alertas de intentos fallidos de login
- Revisar descargas anómalas

### Auditoría de Seguridad

**Checklist mensual**:

- [ ] Revisar usuarios con rol `admin`
- [ ] Verificar accesos a base de datos
- [ ] Revisar logs de Next.js
- [ ] Actualizar dependencias
- [ ] Verificar backups funcionan
- [ ] Rotar NEXTAUTH_SECRET (cada 6 meses)
- [ ] Revisar contraseñas débiles de usuarios
- [ ] Verificar certificados SSL vigentes

---

## Mantenimiento

### Limpieza de Datos

**Eliminar sesiones expiradas** (automático, pero puedes forzar):

```sql
DELETE FROM "Session"
WHERE "expires" < NOW();
```

**Archivar descargas antiguas** (>1 año):

```sql
-- Crear tabla de archivo
CREATE TABLE "DownloadArchive" AS
SELECT * FROM "Download"
WHERE "createdAt" < NOW() - INTERVAL '1 year';

-- Eliminar de tabla principal
DELETE FROM "Download"
WHERE "createdAt" < NOW() - INTERVAL '1 year';
```

### Optimización de Base de Datos

```sql
-- Analizar y optimizar
VACUUM ANALYZE;

-- Reindexar
REINDEX DATABASE weldtech;

-- Ver tamaño de tablas
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitoreo de Performance

**Consultas lentas**:

```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Solución de Problemas Comunes

### Los usuarios no pueden registrarse

**Posibles causas**:
1. **Base de datos offline**: Verificar conexión
2. **Prisma Client desactualizado**: Ejecutar `npx prisma generate`
3. **Variables de entorno incorrectas**: Revisar `.env`

**Solución**:
```bash
# Verificar conexión a DB
npx prisma db push

# Regenerar cliente
npx prisma generate

# Reiniciar servidor
npm run dev
```

### Las descargas no se trackean

**Verificar**:
```sql
SELECT COUNT(*) FROM "Download" WHERE "createdAt" >= NOW() - INTERVAL '1 hour';
```

Si es 0, revisar:
1. API route `/api/downloads/track`
2. Console del navegador (errores)
3. Logs del servidor

### Marca de agua no se aplica

**Verificar**:
1. Archivo `lib/watermark.ts` existe
2. Canvas se renderiza correctamente
3. Usuario NO está autenticado (para testing)

---

## Roadmap de Funcionalidades Admin

### Corto Plazo (3 meses)

- [ ] Panel admin visual básico
- [ ] Dashboard con métricas en tiempo real
- [ ] Gestión de usuarios UI
- [ ] Export de reportes CSV/PDF

### Medio Plazo (6 meses)

- [ ] Analytics avanzado (Google Analytics integration)
- [ ] Sistema de notificaciones admin
- [ ] Gestión de contenido visual (CMS ligero)
- [ ] Logs detallados de actividad

### Largo Plazo (12 meses)

- [ ] Sistema de roles granular
- [ ] API para integraciones externas
- [ ] Multi-tenancy (múltiples empresas)
- [ ] White-label customization

---

## Contacto y Soporte

### Soporte Técnico

Para asistencia técnica administrativa:
- 💬 **WhatsApp**: +57 313 369 1591
- 📧 **Email**: Próximamente

### Reportar Bugs

Para reportar problemas técnicos:
1. Describe el problema detalladamente
2. Incluye pasos para reproducir
3. Adjunta logs si es posible
4. Indica ambiente (desarrollo/producción)

---

## Próximos Pasos

1. ❓ **Preguntas frecuentes** - [Ver FAQ](07-faq.md)
2. 📖 **Documentación técnica** - [Ver Docs Técnicos](../technical/README.md)
3. 🔧 **Setup de desarrollo** - [Ver Guía](../technical/02-setup-development.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

