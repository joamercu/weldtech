# Guía de Despliegue Automático con GitHub Actions

Esta guía explica cómo configurar el despliegue automático de la aplicación WeldTech usando GitHub Actions.

## 📋 Opciones de Despliegue

El repositorio incluye tres workflows diferentes según tus necesidades:

### 1. 🚀 Despliegue en Vercel (Recomendado)

**Archivo:** `.github/workflows/deploy-vercel.yml`

**Ventajas:**
- ✅ Optimizado para Next.js
- ✅ Despliegue automático en cada push
- ✅ Preview deployments para PRs
- ✅ SSL automático
- ✅ CDN global
- ✅ Base de datos integrada (Vercel Postgres)

**Configuración:**

1. **Crear cuenta en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub

2. **Obtener tokens de Vercel:**
   ```bash
   # Instalar Vercel CLI localmente
   npm install -g vercel
   
   # Iniciar sesión
   vercel login
   
   # Obtener tokens
   vercel link
   ```

3. **Configurar Secrets en GitHub:**
   - Ve a: `Settings` → `Secrets and variables` → `Actions`
   - Agrega los siguientes secrets:
     - `VERCEL_TOKEN`: Token de autenticación de Vercel
     - `VERCEL_ORG_ID`: ID de tu organización en Vercel
     - `VERCEL_PROJECT_ID`: ID del proyecto en Vercel
     - `DATABASE_URL`: URL de conexión a la base de datos
     - `NEXTAUTH_URL`: URL de tu aplicación (ej: `https://tu-app.vercel.app`)
     - `NEXTAUTH_SECRET`: Secreto para NextAuth (genera uno con: `openssl rand -base64 32`)
     - `NEXT_PUBLIC_API_URL`: URL de tu API (si aplica)

4. **Activar el workflow:**
   - El workflow se ejecutará automáticamente en cada push a `main` o `master`
   - También puedes ejecutarlo manualmente desde la pestaña `Actions`

---

### 2. 📄 Despliegue en GitHub Pages

**Archivo:** `.github/workflows/deploy-github-pages.yml`

**Ventajas:**
- ✅ Gratis
- ✅ Integrado con GitHub
- ✅ SSL automático

**Limitaciones:**
- ⚠️ Solo funciona con export estático (sin API routes del servidor)
- ⚠️ No soporta Prisma directamente
- ⚠️ Requiere configuración adicional para bases de datos

**Configuración:**

1. **Habilitar GitHub Pages:**
   - Ve a: `Settings` → `Pages`
   - Source: `GitHub Actions`

2. **Configurar Secrets (opcional):**
   - `DATABASE_URL`: Solo si necesitas generar Prisma Client
   - `NEXT_PUBLIC_API_URL`: URL de tu API externa

3. **Nota importante:**
   - Este workflow exporta la aplicación como sitio estático
   - Las API routes de Next.js no funcionarán
   - Considera usar una API externa o Vercel Serverless Functions

---

### 3. 🖥️ Despliegue en Servidor Personalizado

**Archivo:** `.github/workflows/deploy-custom-server.yml`

**Ventajas:**
- ✅ Control total del servidor
- ✅ Personalización completa
- ✅ Soporte completo de Next.js

**Configuración:**

1. **Preparar servidor:**
   ```bash
   # Instalar Node.js 20+
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Instalar PM2
   sudo npm install -g pm2
   
   # Crear directorio
   sudo mkdir -p /var/www/weldtech/nextjs_space
   sudo chown -R $USER:$USER /var/www/weldtech
   ```

2. **Configurar SSH:**
   ```bash
   # Generar clave SSH en tu máquina local
   ssh-keygen -t ed25519 -C "github-actions"
   
   # Copiar clave pública al servidor
   ssh-copy-id usuario@tu-servidor.com
   ```

3. **Configurar Secrets en GitHub:**
   - `SSH_HOST`: IP o dominio de tu servidor
   - `SSH_USERNAME`: Usuario SSH
   - `SSH_PRIVATE_KEY`: Clave privada SSH (contenido completo)
   - `SSH_PORT`: Puerto SSH (opcional, default: 22)
   - `DATABASE_URL`: URL de conexión a la base de datos
   - `NEXTAUTH_URL`: URL de tu aplicación
   - `NEXTAUTH_SECRET`: Secreto para NextAuth
   - `NEXT_PUBLIC_API_URL`: URL de tu API

4. **Configurar PM2 en el servidor:**
   ```bash
   cd /var/www/weldtech/nextjs_space
   
   # Crear ecosystem.config.js
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'weldtech',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/weldtech/nextjs_space',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Iniciar aplicación
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

---

## 🔐 Configuración de Secrets

### Cómo agregar Secrets en GitHub:

1. Ve a tu repositorio en GitHub
2. Click en `Settings` → `Secrets and variables` → `Actions`
3. Click en `New repository secret`
4. Agrega cada secret con su nombre y valor

### Secrets Requeridos (según el workflow):

#### Para Vercel:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL` (opcional)

#### Para GitHub Pages:
- `DATABASE_URL` (opcional, solo para Prisma generate)
- `NEXT_PUBLIC_API_URL` (opcional)

#### Para Servidor Personalizado:
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `SSH_PORT` (opcional)
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL` (opcional)

---

## 🚀 Ejecutar Despliegue

### Automático:
- Push a `main` o `master` → Despliegue automático
- Pull Request → Preview deployment (solo Vercel)

### Manual:
1. Ve a la pestaña `Actions` en GitHub
2. Selecciona el workflow que deseas ejecutar
3. Click en `Run workflow`
4. Selecciona la rama y click en `Run workflow`

---

## 📊 Monitoreo

### Ver estado de despliegues:
- Pestaña `Actions` en GitHub
- Dashboard de Vercel (si usas Vercel)
- Logs de PM2 en servidor (si usas servidor personalizado)

### Verificar despliegue exitoso:
```bash
# Verificar en Vercel
curl https://tu-app.vercel.app

# Verificar en GitHub Pages
curl https://tu-usuario.github.io/tu-repo

# Verificar en servidor personalizado
curl http://tu-servidor.com:3000
```

---

## 🔧 Troubleshooting

### Error: "Prisma Client not generated"
**Solución:** Asegúrate de que `DATABASE_URL` esté configurado en secrets

### Error: "Build failed"
**Solución:** 
- Revisa los logs en la pestaña `Actions`
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm run build` localmente para identificar errores

### Error: "SSH connection failed"
**Solución:**
- Verifica que la clave SSH sea correcta
- Asegúrate de que el servidor permita conexiones SSH
- Verifica el puerto SSH

### Error: "Vercel deployment failed"
**Solución:**
- Verifica que los tokens de Vercel sean válidos
- Asegúrate de que el proyecto esté vinculado en Vercel
- Revisa los logs en el dashboard de Vercel

---

## 📝 Notas Adicionales

- Los workflows están configurados para ejecutarse en Node.js 20
- El build se ejecuta en el directorio `nextjs_space/`
- Las migraciones de Prisma se ejecutan automáticamente en el servidor personalizado
- Los preview deployments solo están disponibles en Vercel

---

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Asegúrate de que el código compile localmente
4. Consulta la documentación de Next.js y Vercel

