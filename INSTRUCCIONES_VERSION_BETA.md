# 🚀 Instrucciones para Subir la Versión Beta a GitHub

## 📋 Resumen de Cambios

Esta actualización implementa el **botón "Modo Desarrollo"** para la versión beta de la aplicación. Este botón permite a usuarios no registrados desbloquear todas las funcionalidades premium, pero solo está disponible en la versión gratuita de Vercel.

### Archivos Nuevos Creados:

1. **`nextjs_space/lib/vercel-utils.ts`**
   - Utilidades para detectar el entorno de Vercel
   - Funciones: `isVercelEnvironment()`, `isVercelFreeTier()`, `isDevelopmentModeAvailable()`

2. **`nextjs_space/hooks/use-development-mode.ts`**
   - Hook personalizado para gestionar el estado del modo desarrollo
   - Persiste el estado en localStorage
   - Desactiva automáticamente si el usuario se autentica

3. **`nextjs_space/contexts/development-mode-context.tsx`**
   - Contexto React para compartir el estado del modo desarrollo
   - Provider y hook `useDevelopmentModeContext()`

4. **`push_version_beta.bat`**
   - Script batch para subir los cambios a GitHub con mensaje apropiado

### Archivos Modificados:

1. **`nextjs_space/app/components/navbar.tsx`**
   - Agregado botón "Modo Desarrollo" (versión desktop y móvil)
   - Integración con el contexto de modo desarrollo
   - Notificaciones al usuario al activar/desactivar

2. **`nextjs_space/app/providers.tsx`**
   - Integrado `DevelopmentModeProvider` en el árbol de providers

3. **`nextjs_space/app/layout.tsx`**
   - Agregado componente `Toaster` para mostrar notificaciones

---

## 🔧 Opción 1: Usar el Script Automático

### Paso 1: Ejecutar el Script

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```bash
.\push_version_beta.bat
```

El script:
- ✅ Verificará que Git esté instalado
- ✅ Verificará que haya un repositorio Git inicializado
- ✅ Agregará todos los archivos nuevos y modificados
- ✅ Hará commit con un mensaje apropiado para la versión beta
- ✅ Subirá los cambios a GitHub

---

## 🔧 Opción 2: Comandos Manuales

Si prefieres hacerlo manualmente, sigue estos pasos:

### Paso 1: Verificar el Estado

```bash
git status
```

### Paso 2: Agregar Archivos

```bash
git add .
```

O agregar archivos específicos:

```bash
git add nextjs_space/lib/vercel-utils.ts
git add nextjs_space/hooks/use-development-mode.ts
git add nextjs_space/contexts/development-mode-context.tsx
git add nextjs_space/app/components/navbar.tsx
git add nextjs_space/app/providers.tsx
git add nextjs_space/app/layout.tsx
```

### Paso 3: Hacer Commit

```bash
git commit -m "feat(beta): Implementar botón Modo Desarrollo para usuarios no registrados

- Agregar botón 'Modo Desarrollo' en el navbar principal
- Implementar hook useDevelopmentMode para gestionar el estado
- Crear contexto DevelopmentModeContext para compartir estado
- Agregar utilidades para detectar versión gratuita de Vercel
- Integrar Toaster para notificaciones al usuario
- El botón solo está disponible para usuarios no autenticados
- Solo funciona en la versión gratuita de Vercel (.vercel.app)
- Desbloquea todas las funcionalidades premium para usuarios no registrados
- El estado se persiste en localStorage
- Se desactiva automáticamente si el usuario se autentica

Archivos nuevos:
- nextjs_space/lib/vercel-utils.ts
- nextjs_space/hooks/use-development-mode.ts
- nextjs_space/contexts/development-mode-context.tsx

Archivos modificados:
- nextjs_space/app/components/navbar.tsx
- nextjs_space/app/providers.tsx
- nextjs_space/app/layout.tsx"
```

### Paso 4: Verificar la Rama Actual

```bash
git branch --show-current
```

Si no estás en la rama correcta, cambia a la rama deseada:

```bash
git checkout main
# o
git checkout master
# o
git checkout beta
```

### Paso 5: Hacer Push

```bash
git push origin main
```

O si estás en otra rama:

```bash
git push origin <nombre-de-tu-rama>
```

---

## 🔧 Opción 3: Si No Tienes Git Configurado

Si aún no has inicializado el repositorio Git o no tienes el remoto configurado:

### Paso 1: Inicializar Repositorio (si es necesario)

```bash
git init
```

### Paso 2: Configurar el Remoto

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

O si ya tienes un remoto configurado, verifica:

```bash
git remote -v
```

### Paso 3: Seguir con los Pasos de la Opción 2

---

## ✅ Verificación Post-Push

Después de hacer push, verifica:

1. **En GitHub:**
   - Ve a tu repositorio en GitHub
   - Verifica que el commit aparezca en el historial
   - Verifica que los archivos nuevos estén presentes

2. **En Vercel (si está conectado):**
   - Vercel debería detectar automáticamente el push
   - Se iniciará un nuevo despliegue
   - Verifica los logs del despliegue

3. **En la Aplicación:**
   - Una vez desplegado, verifica que el botón "Modo Desarrollo" aparezca
   - Solo debe aparecer para usuarios no autenticados
   - Solo debe funcionar en dominios `.vercel.app`

---

## 🐛 Solución de Problemas

### Error: "Git no está instalado"

**Solución:**
1. Instala Git desde: https://git-scm.com/download/win
2. O usa el script: `instalar_git_y_subir.bat`

### Error: "No hay un repositorio Git inicializado"

**Solución:**
1. Ejecuta: `git init`
2. O usa el script: `subir_a_github_con_token.bat`

### Error: "No hay un repositorio remoto configurado"

**Solución:**
1. Agrega el remoto: `git remote add origin https://github.com/USUARIO/REPO.git`
2. O usa el script: `subir_a_github_con_token.bat`

### Error: "No se pudo hacer push - permisos denegados"

**Solución:**
1. Verifica tus credenciales de GitHub
2. Usa un token de acceso personal si es necesario
3. Configura SSH keys si prefieres usar SSH

### Error: "Hay conflictos con el repositorio remoto"

**Solución:**
1. Haz pull primero: `git pull origin main`
2. Resuelve los conflictos manualmente
3. Vuelve a hacer push

---

## 📝 Notas Importantes

- **El botón "Modo Desarrollo" solo funciona para usuarios NO autenticados**
- **Solo está disponible en la versión gratuita de Vercel** (dominios `.vercel.app`)
- **El estado se persiste en localStorage**, por lo que se mantiene entre sesiones
- **Si un usuario se autentica, el modo desarrollo se desactiva automáticamente**
- **Este es un feature de la versión beta** y puede ser removido en la versión final

---

## 🎯 Próximos Pasos

Después de subir los cambios:

1. ✅ Verifica que el despliegue en Vercel sea exitoso
2. ✅ Prueba el botón "Modo Desarrollo" en la aplicación desplegada
3. ✅ Verifica que las notificaciones funcionen correctamente
4. ✅ Prueba que el modo desarrollo se desactive al autenticarse
5. ✅ Documenta cómo otros componentes pueden usar el modo desarrollo

---

**Última actualización:** Noviembre 2025  
**Versión:** Beta 1.0

