# 🔧 Instrucciones para Configurar API Key de Abacus.AI

**Fecha:** 8 de Noviembre de 2025

---

## ⚠️ Problema Detectado

**Error:** API key no configurada  
**Detalles:** La variable `ABACUS_API_KEY` no está configurada en `.env.local`

---

## ✅ Solución

### Opción 1: Usar el Script Automático (Recomendado)

**Windows (PowerShell):**
```powershell
cd nextjs_space
powershell -ExecutionPolicy Bypass -File configurar-abacus-api.ps1
```

**Windows (CMD):**
```cmd
cd nextjs_space
configurar-abacus-api.bat
```

### Opción 2: Configuración Manual

1. **Abrir el archivo `.env.local`** en `nextjs_space/`

2. **Agregar la siguiente línea:**
   ```env
   ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f
   ```

3. **Si el archivo no existe, crearlo** con el siguiente contenido:
   ```env
   # API Key de Abacus.AI
   ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f
   
   # Deployment ID (opcional)
   # ABACUS_DEPLOYMENT_ID=tu_deployment_id_aqui
   ```

4. **Guardar el archivo**

---

## 🔄 Reiniciar el Servidor

**IMPORTANTE:** Después de configurar la API key, debes reiniciar el servidor Next.js para que los cambios surtan efecto.

1. **Detener el servidor actual:**
   - Presionar `Ctrl+C` en la terminal donde está ejecutándose

2. **Iniciar el servidor nuevamente:**
   ```bash
   cd nextjs_space
   npm run dev
   ```

---

## ✅ Verificar Configuración

### Opción 1: Usando la Página Web

1. Acceder a: `http://localhost:3000/admin/generar-imagenes-defectos`
2. Ver el componente "Prueba de Conexión con Abacus.AI"
3. Hacer clic en "Probar Conexión"
4. Verificar que muestre "Conexión Exitosa"

### Opción 2: Verificar Archivo

```powershell
cd nextjs_space
Get-Content .env.local | Select-String "ABACUS"
```

**Resultado esperado:**
```
ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f
```

---

## 📝 Estructura del Archivo .env.local

El archivo `.env.local` debe contener:

```env
# API Key de Abacus.AI
ABACUS_API_KEY=s2_05d59eff71e9485391529e7285d0019f

# Deployment ID (opcional)
# Si tienes un deployment específico configurado en Abacus.AI, agrégalo aquí
# ABACUS_DEPLOYMENT_ID=tu_deployment_id_aqui
```

---

## ⚠️ Notas Importantes

1. **El archivo `.env.local` está en `.gitignore`:** No se subirá al repositorio por seguridad

2. **No compartir la API key:** Mantén la API key segura y no la compartas públicamente

3. **Reiniciar servidor:** Siempre reinicia el servidor después de cambiar variables de entorno

4. **Formato de API key:** Debe empezar con `s2_` para ser válida

---

## 🐛 Solución de Problemas

### Si el archivo no se crea

1. Verificar permisos de escritura en la carpeta `nextjs_space/`
2. Crear el archivo manualmente
3. Agregar la línea de la API key

### Si el servidor no detecta los cambios

1. Detener completamente el servidor
2. Eliminar carpeta `.next` si existe
3. Reiniciar el servidor

### Si sigue mostrando error

1. Verificar que el archivo se llama exactamente `.env.local` (con el punto al inicio)
2. Verificar que no haya espacios extra en la línea
3. Verificar que la API key sea correcta

---

**Última actualización:** 8 de Noviembre de 2025

