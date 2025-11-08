# WeldTech Solutions

<div align="center">

![WeldTech Logo](nextjs_space/public/logo/weldtech-horizontal-full-color.png)

**Plataforma Gratuita de Recursos Técnicos para Profesionales de Soldadura**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](#) • [Documentación](docs/) • [Guía de Usuario](docs/user-guide/) • [Docs Técnicos](docs/technical/)

</div>

---

## 📋 Descripción

WeldTech Solutions es una plataforma web completa que proporciona recursos técnicos **gratuitos** para profesionales de soldadura, inspectores CWI/CSWIP, ingenieros de soldadura y soldadores.

### ✨ Características Principales

- 📊 **Infografías Bilingües (EN-ES)**: 13 reglas fundamentales de calificación de soldadores según ASME IX, AWS D1.1 e ISO 9606
- 🧮 **Herramientas Interactivas**: Calculadoras, comparadores y guías técnicas
- 📄 **Plantillas Profesionales**: WPS, PQR, WPQ y más en formato Excel/PDF
- 🔐 **Sistema de Autenticación**: Descargas sin marca de agua para usuarios registrados
- 📱 **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil

---

## 🚀 Quick Start

### Para Usuarios

1. **Visita la plataforma**: [URL de producción]
2. **Crea una cuenta gratuita**: Registro en 30 segundos
3. **Descarga sin marca de agua**: Todos los recursos disponibles

### Para Desarrolladores

```bash
# Clonar repositorio
git clone https://github.com/joamercu/
cd "07-11-25-APP WELDTECH/nextjs_space"

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# Setup base de datos
npx prisma db push
npx prisma generate

# Ejecutar en desarrollo
npm run dev
```

Ver [Guía de Setup Completa](docs/technical/02-setup-development.md)

---

## 🎯 Features

### Herramientas Interactivas

| Herramienta | Descripción | Estado |
|-------------|-------------|--------|
| **Calculadora de Rangos** | Calcula rangos de espesor/diámetro cualificados | ✅ Activo |
| **Comparador de Normas** | Compara ASME IX vs AWS D1.1 vs ISO 9606 | ✅ Activo |
| **Guía de Defectos** | 14 defectos comunes con causas y soluciones | ✅ Activo |
| **Equivalencia de Posiciones** | Tabla ISO ↔ AWS/ASME | ✅ Activo |
| **Qualification Tracker** | Gestión de certificaciones de soldadores | ✅ Activo |
| **WPS Builder** | Constructor de WPS interactivo | 🚧 Próximamente |

### Plantillas Descargables

- ✅ WPS (Welding Procedure Specification)
- ✅ PQR (Procedure Qualification Record)
- ✅ WPQ (Welder Performance Qualification)
- ✅ Checklist de Auditoría (50+ puntos)
- ✅ Matriz de Trazabilidad WPS-PQR-WPQ

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Shadcn/ui
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6
- **Authentication**: NextAuth.js 4

### Features
- **PDF Generation**: jsPDF
- **Canvas**: html2canvas
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

---

## 📁 Estructura del Proyecto

```
07-11-25-APP WELDTECH/
├── nextjs_space/              # Aplicación Next.js principal
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── components/        # Componentes React
│   │   ├── herramientas/      # Páginas de herramientas
│   │   └── ...
│   ├── components/ui/         # Componentes Shadcn/ui
│   ├── lib/                   # Utilidades y configuraciones
│   ├── prisma/                # Schema de base de datos
│   └── public/                # Assets estáticos
├── docs/                      # 📚 Documentación completa
│   ├── user-guide/            # Guías para usuarios
│   ├── technical/             # Documentación técnica
│   ├── diagrams/              # Diagramas Mermaid
│   └── assets/                # Assets de documentación
├── assets/                    # Assets del proyecto
├── planning/                  # Documentos de planificación
└── README.md                  # Este archivo
```

---

## 📖 Documentación

### 📘 Guías Corporativas y de Negocio

- [**Guía Integral de Servicios**](docs/GUIA_INTEGRAL_WELDTECH.md) ⭐ **NUEVO**
  - Portafolio completo de servicios
  - Lista de verificación de diagnóstico (50+ items)
  - Planes de calidad personalizados
  - Casos de éxito con métricas reales
  - Proceso de onboarding paso a paso
- [Resumen Ejecutivo](docs/GUIA_RESUMEN_EJECUTIVO.md) - Versión rápida de la guía

### Para Usuarios Finales

- [Guía de Inicio Rápido](docs/user-guide/01-getting-started.md)
- [Autenticación y Registro](docs/user-guide/02-authentication.md)
- [Uso de Infografías](docs/user-guide/03-infographic.md)
- [Herramientas Interactivas](docs/user-guide/04-tools.md)
- [Plantillas Descargables](docs/user-guide/05-templates.md)
- [Preguntas Frecuentes (FAQ)](docs/user-guide/07-faq.md)

### Para Administradores

- [Guía de Administrador](docs/user-guide/06-admin-guide.md)

### Para Desarrolladores

- [Arquitectura del Sistema](docs/technical/01-architecture.md)
- [Setup de Desarrollo](docs/technical/02-setup-development.md)
- [Database Schema](docs/technical/03-database-schema.md)
- [API Reference](docs/technical/04-api-reference.md)
- [Componentes](docs/technical/05-components.md)
- [Flujos y Styling](docs/technical/06-flows-styling.md)
- [Testing y Deployment](docs/technical/07-testing-deployment.md)

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT sessions con HTTP-only cookies
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)
- ✅ Variables de entorno para secretos

---

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Conectar repositorio en vercel.com
# Configurar variables de entorno
# Deploy automático en cada push
```

### VPS

```bash
# Ubuntu 22.04+, Node.js 20+, PostgreSQL 16+
npm run build
pm2 start npm -- start
# Configurar Nginx + SSL
```

Ver [Guía de Deployment Completa](docs/technical/07-testing-deployment.md)

---

## 🤝 Contribuir

Actualmente el proyecto está en fase de desarrollo activo. Las contribuciones son bienvenidas en forma de:

- 🐛 Reportes de bugs
- 💡 Sugerencias de features
- 📝 Mejoras en documentación
- 🌐 Traducciones adicionales

---

## 📞 Soporte

- **WhatsApp**: +57 313 369 1591
- **Documentación**: [docs/](docs/)
- **FAQ**: [docs/user-guide/07-faq.md](docs/user-guide/07-faq.md)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **ASME**, **AWS** e **ISO** por las normas de referencia
- **Comunidad de soldadura** por feedback valioso
- **Next.js**, **Prisma** y el ecosistema React

---

## 📊 Stats del Proyecto

- **Documentación**: 26 archivos Markdown completos
- **Componentes**: 11 componentes principales + 40+ UI components
- **API Endpoints**: 3 endpoints activos
- **Líneas de código**: ~8,000+ líneas
- **Idiomas**: Español e Inglés

---

<div align="center">

**Hecho con ❤️ para la comunidad de soldadura**

[⬆ Volver arriba](#weldtech-solutions)

</div>
