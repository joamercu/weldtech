# 🚀 Activar Despliegue en GitHub

## ✅ Paso 1: Habilitar GitHub Pages

1. **Ve a tu repositorio:**
   - https://github.com/joamercu/weldtech

2. **Habilita GitHub Pages:**
   - Click en `Settings` (en la parte superior del repositorio)
   - En el menú lateral, click en `Pages`
   - En "Source", selecciona: `GitHub Actions`
   - Click en `Save`

3. **Verifica la URL:**
   - Tu sitio estará disponible en: `https://joamercu.github.io/weldtech`
   - (Puede tardar unos minutos en estar disponible)

---

## ✅ Paso 2: Activar Workflow de Despliegue

### Opción A: Ejecutar Manualmente

1. **Ve a la pestaña `Actions`:**
   - En tu repositorio, click en `Actions`

2. **Selecciona el workflow:**
   - Click en "Desplegar en GitHub Pages" (en el menú lateral)

3. **Ejecuta el workflow:**
   - Click en `Run workflow`
   - Selecciona la rama `master`
   - Click en `Run workflow`

4. **Espera a que complete:**
   - El workflow construirá y desplegará tu aplicación
   - Puede tardar 5-10 minutos

### Opción B: Automático (Push a main/master)

El workflow se ejecutará automáticamente cuando:
- Hagas push a la rama `main` o `master`
- El workflow está configurado en `.github/workflows/deploy-github-pages.yml`

---

## ✅ Paso 3: Verificar Despliegue

1. **Ve a `Settings` → `Pages`:**
   - Verás el estado del despliegue
   - Verás la URL de tu sitio

2. **Ve a la pestaña `Actions`:**
   - Verás el estado del workflow
   - Click en el workflow para ver los logs

3. **Visita tu sitio:**
   - URL: `https://joamercu.github.io/weldtech`
   - (Puede tardar unos minutos en estar disponible)

---

## 🔧 Configuración Adicional

### Si quieres usar un dominio personalizado:

1. Ve a `Settings` → `Pages`
2. En "Custom domain", ingresa tu dominio
3. Configura los registros DNS según las instrucciones

### Si quieres cambiar la rama:

1. Ve a `Settings` → `Pages`
2. En "Source", selecciona la rama que desees
3. Click en `Save`

---

## 📋 Checklist

- [ ] GitHub Pages habilitado
- [ ] Source configurado como "GitHub Actions"
- [ ] Workflow ejecutado (manual o automático)
- [ ] Despliegue completado exitosamente
- [ ] Sitio accesible en la URL

---

## 🆘 Problemas Comunes

### "Workflow no aparece"
- Verifica que el archivo `.github/workflows/deploy-github-pages.yml` exista
- Verifica que esté en la rama `master` o `main`

### "Error: Build failed"
- Revisa los logs en la pestaña `Actions`
- Verifica que todas las dependencias estén en `package.json`

### "Sitio no carga"
- Espera unos minutos (puede tardar en propagarse)
- Verifica que el despliegue haya completado exitosamente
- Revisa los logs del workflow

---

## 📖 Documentación Relacionada

- `DESPLEGAR_GITHUB_PAGES.md` - Guía completa de despliegue
- `.github/DEPLOYMENT_GUIDE.md` - Guía completa de despliegue
- `.github/workflows/deploy-github-pages.yml` - Workflow de despliegue

---

## 🎉 ¡Listo!

Una vez completado, tu aplicación estará disponible en:
**https://joamercu.github.io/weldtech**

