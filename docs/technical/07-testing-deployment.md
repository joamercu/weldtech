# Testing, Deployment y Troubleshooting - WeldTech Solutions

## Parte 1: Testing

### Estado Actual

**Testing no implementado actualmente.** Esta sección documenta la estrategia recomendada.

### Estrategia de Testing Recomendada

#### Unit Tests (Vitest)

**Instalación**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Configuración** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts'
  }
})
```

**Ejemplo de test**:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from '@/components/ui/button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

#### E2E Tests (Playwright)

**Instalación**:
```bash
npm install -D @playwright/test
npx playwright install
```

**Ejemplo**:
```typescript
import { test, expect } from '@playwright/test'

test('user can register', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signup')
  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'Test1234!')
  await page.fill('[name="confirmPassword"]', 'Test1234!')
  await page.click('button:has-text("Crear cuenta")')
  
  await expect(page).toHaveURL('http://localhost:3000/')
})
```

### Testing Manual (Checklist)

Ver detalles en: `SISTEMA_MARCAS_AGUA.md`

---

## Parte 2: Deployment

### Opción 1: Vercel (Recomendado)

**Ventajas**:
- ✅ Deployment automático desde Git
- ✅ Preview deployments para PRs
- ✅ Edge functions globales
- ✅ PostgreSQL integrado (Vercel Postgres)
- ✅ Variables de entorno en dashboard

**Pasos**:

1. **Conectar Repositorio**:
   - Ir a [vercel.com](https://vercel.com)
   - Import Git Repository
   - Seleccionar proyecto

2. **Configurar Variables de Entorno**:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   NEXTAUTH_SECRET=tu-secreto
   ```

3. **Configurar Build**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**:
   - Clic en "Deploy"
   - Vercel construye y despliega automáticamente

5. **Migraciones de DB**:
   ```bash
   # En local, apuntando a DB de producción
   DATABASE_URL="tu-db-prod" npx prisma migrate deploy
   ```

**Custom Domain**:
- Settings → Domains → Add Domain
- Configurar DNS (A/CNAME records)

---

### Opción 2: VPS (Ubuntu/Linux)

**Requisitos**:
- Ubuntu 22.04+
- Node.js 20+
- PostgreSQL 16+
- Nginx
- PM2

**Pasos**:

1. **Setup Servidor**:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Instalar Nginx
sudo apt install nginx

# Instalar PM2
sudo npm install -g pm2
```

2. **Clonar y Configurar**:
```bash
cd /var/www
git clone <repo-url> weldtech
cd weldtech/nextjs_space

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
nano .env  # Editar con valores de producción

# Prisma
npx prisma generate
npx prisma migrate deploy

# Build
npm run build
```

3. **Configurar PM2**:
```bash
# ecosystem.config.js
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

# Iniciar
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

4. **Configurar Nginx**:
```nginx
# /etc/nginx/sites-available/weldtech
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/weldtech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **SSL con Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

### Opción 3: Docker

**Dockerfile**:
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/weldtech
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: weldtech
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Parte 3: Troubleshooting

### Problemas Comunes en Producción

#### 1. "Database connection failed"

**Síntomas**: Error al conectar a PostgreSQL

**Soluciones**:
```bash
# Verificar URL de conexión
echo $DATABASE_URL

# Test conexión
psql $DATABASE_URL

# Verificar firewall/security groups
# Permitir IP del servidor en PostgreSQL host

# Verificar que Prisma Client esté generado
npx prisma generate
```

#### 2. "Module not found" en build

**Síntomas**: Build falla con errores de imports

**Soluciones**:
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json .next
npm install
npm run build

# Verificar paths en tsconfig.json
# Verificar que @/* apunte a ./
```

#### 3. "NextAuth session undefined"

**Síntomas**: `useSession()` siempre retorna null

**Soluciones**:
```bash
# Verificar NEXTAUTH_SECRET configurado
echo $NEXTAUTH_SECRET

# Verificar NEXTAUTH_URL correcto
echo $NEXTAUTH_URL

# Regenerar secret si es necesario
openssl rand -base64 32

# Verificar que SessionProvider esté en layout
```

#### 4. "Prisma Client initialization error"

**Síntomas**: Errores al usar prisma en producción

**Soluciones**:
```bash
# Regenerar cliente
npx prisma generate

# Verificar binaryTargets en schema.prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
}

# Rebuild
npm run build
```

#### 5. "502 Bad Gateway" (Nginx)

**Síntomas**: Nginx no puede conectar a la app

**Soluciones**:
```bash
# Verificar que la app esté corriendo
pm2 list

# Verificar puerto correcto en Nginx config
# Verificar logs
tail -f /var/log/nginx/error.log

# Reiniciar servicios
pm2 restart weldtech
sudo systemctl restart nginx
```

---

### Monitoreo

#### Logs

**Vercel**:
- Dashboard → Project → Logs
- Real-time logging
- Function logs

**PM2**:
```bash
pm2 logs weldtech
pm2 logs weldtech --lines 100
pm2 logs weldtech --err  # Solo errores
```

**Docker**:
```bash
docker-compose logs -f app
```

#### Performance

**Vercel Analytics**:
- Integrado automáticamente
- Web Vitals
- Real User Monitoring

**Custom Logging**:
```typescript
// middleware para logging
export function middleware(request: NextRequest) {
  console.log(`${request.method} ${request.url}`)
  console.log(`User-Agent: ${request.headers.get('user-agent')}`)
  
  return NextResponse.next()
}
```

---

### Rollback

**Vercel**:
- Dashboard → Deployments
- Clic en deployment anterior → "Promote to Production"

**VPS**:
```bash
# Con Git
git log --oneline
git checkout <commit-hash>
npm install
npm run build
pm2 restart weldtech

# Con PM2 snapshots
pm2 save  # Antes de deploy
# Si falla:
pm2 resurrect  # Restaurar estado anterior
```

---

### Checklist Pre-Deployment

- [ ] Todos los tests pasan
- [ ] Build exitoso localmente
- [ ] Variables de entorno configuradas
- [ ] Database migrations aplicadas
- [ ] Secrets rotados (NEXTAUTH_SECRET)
- [ ] SSL/HTTPS configurado
- [ ] Backup de base de datos
- [ ] Monitoring configurado
- [ ] Rollback plan definido

---

*Última actualización: Noviembre 2025 | Versión: 1.0*

