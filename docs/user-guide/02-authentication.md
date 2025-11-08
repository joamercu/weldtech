# Autenticación y Registro - WeldTech Solutions

## Descripción General

WeldTech Solutions ofrece un sistema de autenticación seguro que te permite descargar contenido sin marcas de agua y acceder a funcionalidades adicionales.

---

## ✨ Beneficios de Registrarse

### Completamente Gratis

- ✅ Sin costo inicial
- ✅ Sin suscripciones
- ✅ Sin pagos ocultos
- ✅ Gratis para siempre

### Beneficios Principales

1. **Descargas Sin Marca de Agua**
   - Todas tus descargas serán limpias y profesionales
   - Sin identificadores "DESCARGA PÚBLICA"
   - Listas para presentar en proyectos

2. **Acceso Completo**
   - Todas las herramientas interactivas
   - Todas las plantillas
   - Todas las infografías

3. **Historial de Descargas** _(Próximamente)_
   - Rastrea tus descargas
   - Re-descarga fácilmente

4. **Soporte Prioritario** _(Próximamente)_
   - Respuestas más rápidas
   - Asistencia personalizada

---

## Crear una Cuenta

### Paso 1: Acceder al Formulario de Registro

1. En la barra de navegación superior, haz clic en **"Registrarse"**
2. Serás redirigido a la página de registro

### Paso 2: Completar el Formulario

Completa los siguientes campos:

#### Campo: Nombre Completo
- **Descripción**: Tu nombre y apellido
- **Requerido**: Sí
- **Ejemplo**: `Juan Pérez`
- **Formato**: Texto libre

#### Campo: Correo Electrónico
- **Descripción**: Tu dirección de email
- **Requerido**: Sí
- **Ejemplo**: `juan.perez@empresa.com`
- **Validación**: Debe ser un email válido
- **Nota**: Este será tu nombre de usuario para iniciar sesión

#### Campo: Contraseña
- **Descripción**: Crea una contraseña segura
- **Requerido**: Sí
- **Requisitos**:
  - Mínimo 8 caracteres
  - Se recomienda incluir:
    - Letras mayúsculas y minúsculas
    - Números
    - Caracteres especiales (!@#$%^&*)
- **Ejemplo**: `Soldador2024!`

#### Campo: Confirmar Contraseña
- **Descripción**: Ingresa la misma contraseña nuevamente
- **Requerido**: Sí
- **Validación**: Debe coincidir exactamente con la contraseña

### Paso 3: Revisar Beneficios

En el formulario verás un resumen de beneficios:

```
✓ Descargas sin marca de agua
✓ Acceso a todas las herramientas
✓ Gratis para siempre
```

### Paso 4: Crear Cuenta

1. Haz clic en el botón **"Crear cuenta gratis"**
2. El sistema validará los datos:
   - Email único (no registrado previamente)
   - Contraseña con requisitos mínimos
   - Campos completados correctamente

### Paso 5: Acceso Automático

- ✅ Tu cuenta se crea exitosamente
- ✅ Se inicia sesión automáticamente
- ✅ Serás redirigido a la página principal
- ✅ Verás tu nombre en la barra de navegación

---

## Iniciar Sesión

### Paso 1: Acceder al Formulario de Login

1. En la barra de navegación, haz clic en **"Entrar"**
2. Serás redirigido a la página de inicio de sesión

### Paso 2: Ingresar Credenciales

#### Correo Electrónico
- Ingresa el email que usaste al registrarte
- Ejemplo: `juan.perez@empresa.com`

#### Contraseña
- Ingresa tu contraseña
- Es **sensible a mayúsculas y minúsculas**

### Paso 3: Iniciar Sesión

1. Haz clic en **"Iniciar sesión"**
2. El sistema verificará tus credenciales
3. Si son correctas:
   - ✅ Serás redirigido a la página principal
   - ✅ Tu sesión permanecerá activa
   - ✅ Verás tu nombre en la barra superior

### Errores Comunes

#### "Email o contraseña incorrectos"

**Causas posibles:**
- Email escrito incorrectamente
- Contraseña incorrecta
- Cuenta no existe

**Soluciones:**
1. Verifica que el email esté escrito correctamente
2. Verifica que la contraseña no tenga mayúsculas/minúsculas incorrectas
3. Si olvidaste tu contraseña: _(función próximamente)_
4. Si no tienes cuenta, [Regístrate](#crear-una-cuenta)

---

## Gestión de Sesión

### Tu Perfil

Una vez iniciada la sesión, verás tu información en la barra de navegación:

```
[Avatar] Juan Pérez ▼
```

### Menú de Usuario

Haz clic en tu nombre para ver el menú desplegable:

```
┌─────────────────────────┐
│ Juan Pérez              │
│ juan.perez@empresa.com  │
├─────────────────────────┤
│ [Cerrar sesión]         │
└─────────────────────────┘
```

### Cerrar Sesión

1. Haz clic en tu nombre en la barra superior
2. Selecciona **"Cerrar sesión"**
3. Tu sesión se cerrará inmediatamente
4. Serás redirigido a la página principal
5. Las descargas volverán a incluir marca de agua (hasta que inicies sesión nuevamente)

---

## Cuentas de Prueba

Para fines de prueba, están disponibles las siguientes cuentas:

| Tipo | Email | Contraseña | Rol |
|------|-------|------------|-----|
| Usuario Test | test@weldtech.com | Soldador123! | Usuario |
| Ingeniero | ingeniero@weldtech.com | Ingeniero2024! | Usuario |
| Inspector | inspector@weldtech.com | Inspector2024! | Usuario |
| Admin | john@doe.com | johndoe123 | Administrador |

⚠️ **Nota**: Estas cuentas son solo para testing. Se recomienda crear tu propia cuenta.

---

## Seguridad

### Protección de Contraseñas

- 🔐 Todas las contraseñas se almacenan **encriptadas** con bcrypt
- 🔐 Nunca se guardan en texto plano
- 🔐 Ni siquiera los administradores pueden ver tu contraseña

### Sesiones Seguras

- 🔒 Sesiones manejadas con NextAuth.js
- 🔒 Tokens seguros
- 🔒 Protección contra CSRF
- 🔒 Cookies HTTP-only

### Mejores Prácticas

1. **Usa una contraseña única** para WeldTech
2. **No compartas tu contraseña** con nadie
3. **Cierra sesión** en computadoras compartidas
4. **Revisa tu actividad** regularmente _(próximamente)_

---

## Preguntas Frecuentes

### ¿Necesito verificar mi email?

Actualmente, la verificación de email **no es requerida**. Puedes comenzar a usar tu cuenta inmediatamente después de registrarte.

### ¿Puedo cambiar mi contraseña?

La función de cambio de contraseña estará disponible próximamente.

### ¿Qué pasa si olvido mi contraseña?

La función de recuperación de contraseña estará disponible próximamente. Por ahora:
- Asegúrate de recordar tu contraseña
- Guárdala en un administrador de contraseñas seguro

### ¿Puedo usar Google/Facebook para iniciar sesión?

Actualmente solo está disponible el registro con email y contraseña. El login social (OAuth) puede agregarse en el futuro.

### ¿Mi información está segura?

Sí. Implementamos las mejores prácticas de seguridad:
- Encriptación de contraseñas
- Conexiones HTTPS
- Protección de datos personales
- Cumplimiento de estándares de seguridad

### ¿Puedo eliminar mi cuenta?

Para eliminar tu cuenta, contacta a soporte a través de WhatsApp: +57 313 369 1591

---

## Solución de Problemas

### No puedo registrarme

**Problema**: "Este email ya está registrado"

**Solución**: 
- El email ya tiene una cuenta asociada
- Intenta [iniciar sesión](#iniciar-sesión) en su lugar
- Si olvidaste tu contraseña, usa la recuperación _(próximamente)_

---

**Problema**: "La contraseña debe tener al menos 8 caracteres"

**Solución**:
- Asegúrate de que tu contraseña tenga 8 o más caracteres
- Ejemplo válido: `Soldadura2024!`

---

**Problema**: "Las contraseñas no coinciden"

**Solución**:
- Verifica que ambos campos de contraseña sean exactamente iguales
- Ten cuidado con mayúsculas/minúsculas
- Copia y pega si es necesario

### No puedo iniciar sesión

**Problema**: "Email o contraseña incorrectos"

**Solución**:
1. Verifica que el email esté escrito correctamente
2. Verifica que la contraseña sea correcta (sensible a mayúsculas)
3. Limpia la caché del navegador
4. Intenta en modo incógnito
5. Si persiste, contacta a soporte

### Mi sesión se cerró sola

**Causas posibles**:
- Sesión expirada (después de inactividad prolongada)
- Limpieza de cookies del navegador
- Actualización del navegador

**Solución**:
- Simplemente inicia sesión nuevamente
- Tus datos permanecen seguros

---

## Próximos Pasos

Ahora que tienes tu cuenta:

1. ✅ **Descarga infografías sin marca de agua** - [Ver Guía](03-infographic.md)
2. 🔧 **Explora las herramientas** - [Ver Guía](04-tools.md)
3. 📄 **Descarga plantillas** - [Ver Guía](05-templates.md)

---

## Soporte

¿Necesitas ayuda adicional?

- 💬 **WhatsApp**: +57 313 369 1591
- 📄 **FAQ General**: [Ver FAQ](07-faq.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

