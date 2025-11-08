# 🔗 Configurar Conexión entre GitHub Actions y Vercel

Esta guía explica cómo conectar GitHub Actions con Vercel para notificar el estado de los checks (lint, build, deploy) directamente en Vercel.

---

## 📋 ¿Qué hace esta integración?

La integración permite que:

- ✅ Vercel muestre el estado de los checks de GitHub Actions (lint, build, deploy)
- ✅ Los checks aparezcan en el dashboard de Vercel junto con los despliegues
- ✅ Vercel pueda bloquear despliegues si los checks fallan (opcional)

---

## 🔧 Configuración Automática

El workflow `.github/workflows/deploy-vercel.yml` ya está configurado con las notificaciones de estado a Vercel.

### Checks Configurados

1. **Lint Check**
   - Nombre: `Vercel - weldtech-wnkr: lint`
   - Se ejecuta después de `npm run lint`
   - Notifica el estado (success/failure) a Vercel

2. **Build Check**
   - Nombre: `Vercel - weldtech-wnkr: build`
   - Se ejecuta después de `npm run build`
   - Notifica el estado (success/failure) a Vercel

3. **Deploy Check**
   - Nombre: `Vercel - weldtech-wnkr: deploy`
   - Se ejecuta después del despliegue en Vercel
   - Notifica el estado (success/failure) a Vercel

---

## ✅ Verificación

### Paso 1: Verificar que el Workflow está Activo

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. Verifica que el workflow "Desplegar en Vercel" esté activo
4. Haz un push a `main` o `master` para activar el workflow

### Paso 2: Verificar Notificaciones en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto `weldtech-wnkr`
3. Ve a **Settings** → **Git**
4. Verifica que los checks de GitHub Actions aparezcan en la sección de checks

### Paso 3: Verificar en un Pull Request

1. Crea un Pull Request en GitHub
2. Ve a la pestaña **Checks** en el PR
3. Deberías ver los checks:
   - `Vercel - weldtech-wnkr: lint`
   - `Vercel - weldtech-wnkr: build`
   - `Vercel - weldtech-wnkr: deploy`

---

## 🔍 Cómo Funciona

### Flujo de Ejecución

```
1. Push a main/master o PR
   ↓
2. GitHub Actions inicia el workflow
   ↓
3. Ejecuta lint → Notifica estado a Vercel
   ↓
4. Ejecuta build → Notifica estado a Vercel
   ↓
5. Despliega en Vercel → Notifica estado a Vercel
   ↓
6. Vercel muestra los checks en el dashboard
```

### Código del Workflow

El workflow incluye estos pasos después de cada check importante:

```yaml
- name: Notificar estado de lint a Vercel
  if: always()
  uses: vercel/repository-dispatch/actions/status@v1
  with:
    name: Vercel - weldtech-wnkr: lint
    status: ${{ steps.lint.outcome == 'success' && 'success' || 'failure' }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🛠️ Personalización

### Cambiar el Nombre del Check

Si quieres cambiar el nombre del check, edita el archivo `.github/workflows/deploy-vercel.yml`:

```yaml
- name: Notificar estado de lint a Vercel
  uses: vercel/repository-dispatch/actions/status@v1
  with:
    name: Tu-Nombre-Personalizado: lint  # Cambia esto
    status: ${{ steps.lint.outcome == 'success' && 'success' || 'failure' }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

### Agregar Más Checks

Para agregar más checks, sigue este patrón:

```yaml
- name: Ejecutar test
  id: test
  working-directory: ./nextjs_space
  run: npm test

- name: Notificar estado de test a Vercel
  if: always()
  uses: vercel/repository-dispatch/actions/status@v1
  with:
    name: Vercel - weldtech-wnkr: test
    status: ${{ steps.test.outcome == 'success' && 'success' || 'failure' }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🔐 Permisos Requeridos

El workflow usa `GITHUB_TOKEN` que se genera automáticamente. No necesitas configurar nada adicional.

Sin embargo, si quieres usar un token personalizado:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Crea un nuevo secret llamado `GITHUB_TOKEN` (opcional, ya existe por defecto)
3. El workflow usará automáticamente el token correcto

---

## 🐛 Solución de Problemas

### Los checks no aparecen en Vercel

**Solución:**
1. Verifica que el workflow se esté ejecutando en GitHub Actions
2. Revisa los logs del workflow para ver si hay errores
3. Verifica que el nombre del check sea correcto
4. Asegúrate de que Vercel esté conectado al repositorio de GitHub

### El check siempre muestra "failure"

**Solución:**
1. Revisa los logs del step anterior (lint, build, deploy)
2. Verifica que el step tenga un `id` definido
3. Verifica que el step no tenga `continue-on-error: true` si quieres que falle

### El check no se ejecuta

**Solución:**
1. Verifica que el workflow esté activo en GitHub Actions
2. Verifica que el trigger (`on:`) esté configurado correctamente
3. Verifica que el step tenga `if: always()` para ejecutarse siempre

---

## 📚 Recursos Adicionales

- [Documentación de Vercel Status Checks](https://vercel.com/docs/concepts/git/checks)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Repository Dispatch Action](https://github.com/vercel/repository-dispatch)

---

## ✅ Checklist de Verificación

- [ ] El workflow `.github/workflows/deploy-vercel.yml` existe
- [ ] El workflow incluye notificaciones de estado a Vercel
- [ ] Los checks tienen nombres únicos y descriptivos
- [ ] El workflow se ejecuta correctamente en GitHub Actions
- [ ] Los checks aparecen en Vercel después de un despliegue
- [ ] Los checks aparecen en Pull Requests

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0

