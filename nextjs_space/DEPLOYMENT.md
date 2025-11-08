# Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar WeldTech Solutions en Vercel de forma gratuita desde GitHub.

## 📋 Requisitos Previos

1. Cuenta de GitHub con el código del proyecto subido
2. Cuenta de Vercel (gratuita)
3. Cuenta de Neon para base de datos PostgreSQL (gratuita)

---

## 🗄️ Paso 1: Crear Base de Datos PostgreSQL en Neon

### 1.1 Crear Cuenta en Neon

1. Ve a [neon.tech](https://neon.tech)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Puedes usar tu cuenta de GitHub para registrarte más rápido

### 1.2 Crear Proyecto

1. Una vez dentro del dashboard, haz clic en "Create Project"
2. Elige un nombre para tu proyecto (ej: "weldtech-production")
3. Selecciona la región más cercana a tus usuarios
4. Haz clic en "Create Project"

### 1.3 Obtener DATABASE_URL

1. En el dashboard de Neon, verás una sección llamada "Connection Details"
2. Copia la **Connection String** que se ve así:
   ```
   postgresql://usuario:password@host.neon.tech/database?sslmode=require
   ```
3. **Guarda esta URL** - la necesitarás en el siguiente paso

### 1.4 Información Importante

- **Plan Gratuito:** 512 MB de almacenamiento (suficiente para desarrollo y uso moderado)
- **Sin límite de tiempo:** El plan gratuito no expira
- **Backups automáticos:** Neon hace backups automáticos de tu base de datos

---

## 📤 Paso 2: Subir Código a GitHub

### 2.1 Crear Repositorio (si no existe)

1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Elige un nombre (ej: "weldtech-solutions")
4. **NO** inicialices con README, .gitignore o licencia (si ya tienes código)
5. Haz clic en "Create repository"

### 2.2 Subir Código

Si ya tienes un repositorio local:

```bash
cd "07-11-25-APP WELDTECH"
git init
git add .
git commit -m "Initial commit - Preparado para despliegue en Vercel"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

Si ya tienes un repositorio con código:

```bash
git add .
git commit -m "Preparado para despliegue en Vercel"
git push
```

---

## 🚀 Paso 3: Conectar con Vercel

### 3.1 Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza a Vercel a acceder a tus repositorios

### 3.2 Importar Proyecto

1. En el dashboard de Vercel, haz clic en "Add New Project"
2. Selecciona tu repositorio de GitHub
3. Si no aparece, haz clic en "Adjust GitHub App Permissions" y selecciona el repositorio

### 3.3 Configurar Proyecto

En la pantalla de configuración:

- **Project Name:** Elige un nombre (ej: "weldtech-solutions")
- **Root Directory:** Cambia a `nextjs_space`
  - Haz clic en "Edit" y escribe: `nextjs_space`
- **Framework Preset:** Next.js (debe detectarse automáticamente)
- **Build Command:** `npm run build` (por defecto)
- **Output Directory:** `.next` (por defecto)
- **Install Command:** `npm install` (por defecto)

### 3.4 Configurar Variables de Entorno

**ANTES de hacer clic en "Deploy"**, haz clic en "Environment Variables" y agrega:

#### Variables Requeridas:

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: La URL que copiaste de Neon
   - Environments: Production, Preview, Development (marca todas)

2. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://tu-proyecto.vercel.app` (se actualizará después del primer deploy)
   - Environments: Production, Preview, Development

3. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: Genera uno con:
     ```bash
     openssl rand -base64 32
     ```
     O usa: https://generate-secret.vercel.app/32
   - Environments: Production, Preview, Development

#### Variables Opcionales:

4. **ABACUS_API_KEY** (si usas generación de imágenes)
   - Key: `ABACUS_API_KEY`
   - Value: `s2_05d59eff71e9485391529e7285d0019f`
   - Environments: Production, Preview, Development

5. **ABACUS_DEPLOYMENT_ID** (opcional)
   - Key: `ABACUS_DEPLOYMENT_ID`
   - Value: (déjalo vacío si no tienes uno)
   - Environments: Production, Preview, Development

6. **GOOGLE_CLIENT_ID** (si usas OAuth con Google)
   - Key: `GOOGLE_CLIENT_ID`
   - Value: Tu Client ID de Google Cloud Console
   - Environments: Production, Preview, Development

7. **GOOGLE_CLIENT_SECRET** (si usas OAuth con Google)
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: Tu Client Secret de Google Cloud Console
   - Environments: Production, Preview, Development

### 3.5 Desplegar

1. Una vez configuradas todas las variables, haz clic en "Deploy"
2. Vercel comenzará a construir tu proyecto
3. Esto puede tardar 2-5 minutos la primera vez
4. Verás el progreso en tiempo real

---

## 🗃️ Paso 4: Ejecutar Migraciones de Base de Datos

Después del primer deploy exitoso, necesitas crear las tablas en tu base de datos de producción.

### Opción A: Desde tu Máquina Local (Recomendado)

1. Crea un archivo `.env.local` temporalmente con:
   ```env
   DATABASE_URL="tu-url-de-neon-aqui"
   ```

2. Ejecuta las migraciones:
   ```bash
   cd nextjs_space
   npx prisma migrate deploy
   ```

3. O si prefieres usar `db push`:
   ```bash
   npx prisma db push
   ```

4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

### Opción B: Desde el Dashboard de Neon

1. Ve al dashboard de Neon
2. Haz clic en "SQL Editor"
3. Ejecuta el siguiente SQL (generado por Prisma):

```sql
-- Este SQL se genera automáticamente con: npx prisma migrate dev
-- Ejecuta primero: npx prisma migrate dev --create-only
-- Luego copia el SQL generado en prisma/migrations/
```

**Nota:** Es más fácil usar la Opción A.

---

## 🔄 Paso 5: Actualizar NEXTAUTH_URL

Después del primer deploy, Vercel te dará una URL como: `https://tu-proyecto.vercel.app`

1. Ve a la configuración del proyecto en Vercel
2. Ve a "Settings" > "Environment Variables"
3. Edita `NEXTAUTH_URL` y cámbiala a tu URL real de Vercel
4. Haz clic en "Save"
5. Ve a "Deployments" y haz clic en los tres puntos del último deploy
6. Selecciona "Redeploy" para aplicar los cambios

---

## ✅ Paso 6: Verificar el Despliegue

1. Visita tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Verifica que la página carga correctamente
3. Prueba crear una cuenta
4. Prueba iniciar sesión
5. Verifica que las funcionalidades principales funcionen

---

## 🔧 Solución de Problemas

### Error: "Prisma Client not generated"

**Solución:** El script `postbuild` debería ejecutarse automáticamente. Si no, verifica que esté en `package.json`:
```json
"postbuild": "prisma generate"
```

### Error: "Database connection failed"

**Solución:**
1. Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
2. Asegúrate de que la URL incluya `?sslmode=require` al final
3. Verifica que la base de datos de Neon esté activa

### Error: "NEXTAUTH_URL not set"

**Solución:**
1. Ve a Vercel > Settings > Environment Variables
2. Asegúrate de que `NEXTAUTH_URL` esté configurada con tu URL de Vercel
3. Haz un redeploy después de cambiar variables de entorno

### Error: "Tables don't exist"

**Solución:**
1. Ejecuta las migraciones como se describe en el Paso 4
2. Verifica que `DATABASE_URL` apunte a la base de datos correcta

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Neon](https://neon.tech/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org)

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en producción. Cada vez que hagas `git push` a la rama principal, Vercel desplegará automáticamente los cambios.

### Despliegues Automáticos

- **Push a `main`:** Despliega a producción
- **Pull Request:** Crea un preview deployment (URL temporal)
- **Push a otras ramas:** Crea un preview deployment

### Monitoreo

- Ve a tu dashboard de Vercel para ver:
  - Logs de despliegues
  - Métricas de rendimiento
  - Errores en tiempo real

---

**¿Necesitas ayuda?** Revisa los logs de Vercel o consulta la documentación oficial.

