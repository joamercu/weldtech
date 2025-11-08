# Setup de Desarrollo - WeldTech Solutions

## Requisitos Previos

### Software Requerido

| Software | Versión Mínima | Versión Recomendada | Descarga |
|----------|----------------|---------------------|----------|
| **Node.js** | 18.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 | 10.x | Incluido con Node.js |
| **PostgreSQL** | 14.0 | 16.x | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | 2.30.0 | Latest | [git-scm.com](https://git-scm.com/) |

### Software Opcional

| Software | Propósito |
|----------|-----------|
| **VS Code** | Editor recomendado con extensiones |
| **Postman** | Testing de API endpoints |
| **pgAdmin 4** | GUI para PostgreSQL |

---

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd 07-11-25-APP WELDTECH

# O si ya tienes la carpeta
cd "07-11-25-APP WELDTECH"
```

### 2. Instalar Dependencias

```bash
# Navega a la carpeta del proyecto Next.js
cd nextjs_space

# Instala todas las dependencias
npm install

# Esto instalará ~150+ paquetes y tomará 2-5 minutos
```

**Posibles errores**:
- **`EACCES` permission denied**: Usa `sudo npm install` (Linux/Mac) o ejecuta como administrador (Windows)
- **`ERESOLVE` dependency conflict**: Usa `npm install --legacy-peer-deps`

### 3. Configurar PostgreSQL

#### Opción A: Instalación Local

**Windows**:
1. Descarga el instalador desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecuta el instalador
3. Durante la instalación:
   - Puerto: `5432` (por defecto)
   - Password del superusuario `postgres`: **Anota esta contraseña**
4. Verifica instalación:
```bash
psql --version
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS**:
```bash
# Usando Homebrew
brew install postgresql@16
brew services start postgresql@16
```

#### Opción B: Docker (Recomendado para Desarrollo)

```bash
# Crea un contenedor PostgreSQL
docker run --name weldtech-postgres \
  -e POSTGRES_PASSWORD=tu_contraseña_segura \
  -e POSTGRES_DB=weldtech \
  -p 5432:5432 \
  -d postgres:16

# Verifica que esté corriendo
docker ps
```

#### Crear la Base de Datos

```bash
# Conecta a PostgreSQL
psql -U postgres

# En el prompt de psql:
CREATE DATABASE weldtech;
\c weldtech
\q
```

### 4. Configurar Variables de Entorno

#### Crear archivo `.env`

En la carpeta `nextjs_space/`, crea un archivo `.env`:

```bash
cd nextjs_space
touch .env  # Linux/Mac
# O crea manualmente en Windows
```

#### Contenido del `.env`

```env
# Database
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/weldtech"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secreto-aqui"

# OAuth (Opcional - para Google login)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Environment
NODE_ENV="development"
```

**Generar `NEXTAUTH_SECRET`**:

```bash
# Opción 1: OpenSSL (Linux/Mac)
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online (https://generate-secret.vercel.app/)
```

**Ejemplo de `DATABASE_URL` completo**:
```
postgresql://usuario:contraseña@host:puerto/base_de_datos

# Ejemplos:
# Local: postgresql://postgres:password123@localhost:5432/weldtech
# Docker: postgresql://postgres:mypassword@localhost:5432/weldtech
# Remoto: postgresql://user:pass@db.example.com:5432/weldtech
```

### 5. Configurar Prisma y Base de Datos

#### Generar Cliente de Prisma

```bash
# Genera el cliente de Prisma basado en schema.prisma
npx prisma generate
```

#### Crear Tablas en la Base de Datos

```bash
# Push del schema a la base de datos
npx prisma db push

# Alternativamente, usa migraciones (recomendado para producción):
npx prisma migrate dev --name init
```

**Output esperado**:
```
✔ Generated Prisma Client
✔ The database is now in sync with the schema
```

#### Verificar la Base de Datos

```bash
# Abre Prisma Studio (GUI para ver la DB)
npx prisma studio

# Se abrirá en http://localhost:5555
# Verás las tablas: User, Session, Account, Download, VerificationToken
```

### 6. Seed de Datos de Prueba (Opcional)

```bash
# Ejecuta el seed script
npm run seed

# O directamente:
npx tsx --require dotenv/config scripts/seed.ts
```

**Qué crea el seed**:
- 4 usuarios de prueba con contraseñas hasheadas
- Datos de ejemplo para testing

**Usuarios creados**:
```
john@doe.com          / johndoe123        (admin)
test@weldtech.com     / Soldador123!     (user)
ingeniero@weldtech.com / Ingeniero2024!  (user)
inspector@weldtech.com / Inspector2024!  (user)
```

### 7. Ejecutar en Desarrollo

```bash
# Inicia el servidor de desarrollo
npm run dev

# O con puerto específico:
PORT=3001 npm run dev
```

**Output esperado**:
```
▲ Next.js 14.2.28
- Local:        http://localhost:3000
- Ready in 3.2s
```

**Abre tu navegador**: `http://localhost:3000`

---

## Verificación de Instalación

### Checklist

- [ ] Node.js instalado (`node --version` muestra v18+)
- [ ] PostgreSQL corriendo (`psql --version` funciona)
- [ ] Base de datos `weldtech` creada
- [ ] Archivo `.env` configurado correctamente
- [ ] `npm install` completado sin errores
- [ ] `npx prisma generate` exitoso
- [ ] `npx prisma db push` exitoso
- [ ] `npm run dev` corre sin errores
- [ ] `http://localhost:3000` carga correctamente
- [ ] Puedes navegar por la aplicación
- [ ] Puedes crear una cuenta de prueba
- [ ] Puedes iniciar sesión

---

## Scripts Disponibles

### Desarrollo

```bash
# Inicia servidor de desarrollo (hot reload)
npm run dev

# Inicia servidor en puerto específico
PORT=3001 npm run dev
```

### Build

```bash
# Crea build de producción
npm run build

# Verifica el build (errors, warnings)
npm run build -- --no-lint

# Inicia servidor de producción (después del build)
npm start
```

### Database

```bash
# Genera cliente de Prisma
npx prisma generate

# Push schema a DB (sin migraciones)
npx prisma db push

# Crea migración
npx prisma migrate dev --name nombre_migracion

# Ejecuta migraciones en producción
npx prisma migrate deploy

# Reset DB (⚠️ Elimina todos los datos)
npx prisma migrate reset

# Abre Prisma Studio
npx prisma studio

# Pull schema desde DB existente
npx prisma db pull

# Seed de datos
npm run seed
```

### Lint y Format

```bash
# Ejecuta ESLint
npm run lint

# Fix problemas automáticamente
npm run lint -- --fix
```

### Testing

```bash
# Testing no configurado actualmente
# Se puede añadir Jest, Vitest, Playwright
```

---

## Estructura de Archivos Clave

### Configuración

```
nextjs_space/
├── .env                    # Variables de entorno (NO commitear)
├── .env.example            # Template de .env (commitear)
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── next.config.js          # Configuración Next.js
├── tailwind.config.ts      # Configuración Tailwind
├── postcss.config.js       # PostCSS config
└── components.json         # Shadcn/ui config
```

### Source Code

```
app/
├── layout.tsx              # Root layout (común a todas las páginas)
├── page.tsx                # Homepage
├── globals.css             # Estilos globales
├── providers.tsx           # Context providers (NextAuth, etc.)
├── api/                    # API routes
├── auth/                   # Auth pages
├── components/             # React components
├── herramientas/           # Tool pages
├── infografia/             # Infographic page
├── plantillas/             # Templates page
└── recursos/               # Resources page
```

### Database

```
prisma/
└── schema.prisma           # Database schema (models, relations)
```

### Utilities

```
lib/
├── auth.ts                 # NextAuth configuration
├── db.ts                   # Prisma client instance
├── types.ts                # TypeScript types
├── utils.ts                # Helper functions
└── watermark.ts            # Watermark logic
```

---

## Desarrollo de Features

### Agregar Nueva Página

```bash
# Crea nueva página
mkdir -p app/nueva-pagina
touch app/nueva-pagina/page.tsx
```

```tsx
// app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  return (
    <div>
      <h1>Nueva Página</h1>
    </div>
  )
}

// Accesible en: http://localhost:3000/nueva-pagina
```

### Agregar Nuevo API Endpoint

```bash
# Crea nuevo endpoint
mkdir -p app/api/mi-endpoint
touch app/api/mi-endpoint/route.ts
```

```typescript
// app/api/mi-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}

// Accesible en: POST/GET http://localhost:3000/api/mi-endpoint
```

### Agregar Nuevo Modelo de DB

```prisma
// prisma/schema.prisma
model NuevoModelo {
  id        String   @id @default(cuid())
  campo1    String
  campo2    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
# Aplicar cambios
npx prisma db push
npx prisma generate
```

---

## Troubleshooting

### Error: "Cannot connect to database"

**Síntomas**:
```
Error: Can't reach database server at localhost:5432
```

**Soluciones**:
1. Verifica que PostgreSQL esté corriendo:
```bash
# Linux
sudo systemctl status postgresql

# Mac
brew services list

# Windows
# Services → PostgreSQL → Status: Running

# Docker
docker ps | grep postgres
```

2. Verifica el `DATABASE_URL` en `.env`
3. Verifica credenciales de DB
4. Verifica puerto (5432 por defecto)

### Error: "Module not found"

**Síntomas**:
```
Error: Cannot find module '@/components/ui/button'
```

**Soluciones**:
```bash
# Re-instala dependencias
rm -rf node_modules package-lock.json
npm install

# Verifica tsconfig.json tiene paths correctos
```

### Error: "NEXTAUTH_SECRET must be provided"

**Solución**:
```bash
# Genera un secreto
openssl rand -base64 32

# Añádelo a .env
NEXTAUTH_SECRET="el-secreto-generado"
```

### Error: "prisma.user is not a function"

**Solución**:
```bash
# Regenera el cliente de Prisma
npx prisma generate

# Reinicia el servidor
npm run dev
```

### Puerto 3000 ya en uso

**Solución**:
```bash
# Opción 1: Usa otro puerto
PORT=3001 npm run dev

# Opción 2: Mata el proceso en puerto 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build falla en producción

**Síntomas**:
```
Error: Type error in app/components/...
```

**Soluciones**:
1. Verifica que no haya errores de TypeScript:
```bash
npx tsc --noEmit
```

2. Fija errores de tipo
3. Rebuildsee:
```bash
npm run build
```

---

## Extensiones VS Code Recomendadas

### Esenciales

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "bradlc.vscode-tailwindcss",        // Tailwind IntelliSense
    "prisma.prisma",                    // Prisma
    "ms-vscode.vscode-typescript-next"  // TypeScript
  ]
}
```

### Opcionales

- **GitHub Copilot**: AI code suggestions
- **GitLens**: Git supercharged
- **Error Lens**: Inline errors
- **Path Intellisense**: Auto-complete paths
- **Import Cost**: Show import sizes

---

## Configuración de VS Code

### `.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Mejores Prácticas

### Git Workflow

```bash
# Crea branch para nueva feature
git checkout -b feature/nueva-feature

# Haz commits descriptivos
git commit -m "feat: añade calculadora de rangos"

# Push a remoto
git push origin feature/nueva-feature

# Crea Pull Request para review
```

### Commits Semánticos

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma, etc.
refactor: refactorización de código
test: añadir tests
chore: actualizar dependencias
```

### Code Style

- Usa TypeScript strict mode
- Nombres de componentes en PascalCase
- Nombres de funciones en camelCase
- Nombres de archivos en kebab-case
- Props interfaces con nombre del componente + "Props"

```tsx
// ✅ Bueno
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ Malo
export default function button(props: any) {
  return <button onClick={props.click}>{props.text}</button>
}
```

---

## Próximos Pasos

1. 📖 **Estudia la arquitectura**: [Architecture Guide](01-architecture.md)
2. 🗄️ **Entiende la base de datos**: [Database Schema](03-database-schema.md)
3. 🔌 **Explora los endpoints API**: [API Reference](04-api-reference.md)
4. 🧩 **Revisa los componentes**: [Components Guide](05-components.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

