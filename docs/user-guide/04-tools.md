# Herramientas Interactivas - WeldTech Solutions

## Descripción General

WeldTech Solutions ofrece un conjunto completo de herramientas interactivas diseñadas para facilitar el trabajo diario de inspectores, ingenieros de soldadura y soldadores. Todas las herramientas son de **uso gratuito** y accesibles sin registro (aunque registrarse elimina marcas de agua en las descargas).

---

## Acceso a las Herramientas

### Desde el Menú Principal

**Opción 1: Centro de Recursos**
1. Haz clic en **"Recursos"** en la barra de navegación
2. Verás todas las herramientas disponibles en formato de tarjetas
3. Haz clic en la herramienta que necesites

**Opción 2: Menú Desplegable "Herramientas"**
1. Haz clic en **"Herramientas ▼"** en la barra de navegación
2. Selecciona la herramienta del menú desplegable:
   - Equivalencia de Posiciones
   - Guía de Defectos
   - WPS Builder
   - Qualification Tracker

---

## 🧮 Calculadora de Rangos de Calificación

### Descripción

Herramienta que calcula automáticamente los rangos de espesor y diámetro cualificados según la norma seleccionada (ASME IX, AWS D1.1, ISO 9606).

### ¿Para Qué Sirve?

- Determinar el rango de validez de una calificación
- Verificar si un soldador está cualificado para un espesor específico
- Calcular rangos de diámetro para tuberías
- Planificar calificaciones de soldadores

### Cómo Usar

#### Paso 1: Seleccionar Norma

Elige una de las siguientes normas:
- **ASME IX** (QW-451/QW-452)
- **AWS D1.1** (Tablas 4.11, 4.12)
- **ISO 9606-1**

#### Paso 2: Seleccionar Tipo de Junta

- **Placa (Plate/Groove)**: Para soldaduras en placas planas
- **Tubería (Pipe)**: Para soldaduras en tuberías

#### Paso 3: Ingresar Datos

**Para Placas:**
- Espesor de calificación (T): El espesor soldado durante la prueba
- Ejemplo: `12 mm` o `0.5 inch`

**Para Tuberías:**
- Espesor de calificación (T): Espesor de pared de la tubería
- Diámetro de calificación (D): Diámetro exterior de la tubería
- Ejemplo: T = `6 mm`, D = `100 mm`

#### Paso 4: Calcular

1. Haz clic en el botón **"Calcular Rangos"**
2. El sistema procesará los datos según la norma seleccionada
3. Verás los resultados inmediatamente

### Interpretación de Resultados

#### Rango de Espesor

**Ejemplo de resultado (ASME IX)**:
```
Espesor de calificación: 12 mm
Rango cualificado: 6 mm a 24 mm
```

**Significado**: El soldador puede soldar placas o tuberías con espesor entre 6 mm y 24 mm.

#### Rango de Diámetro

**Ejemplo de resultado (ASME IX)**:
```
Diámetro de calificación: 100 mm
Rango cualificado: Todos los diámetros ≥ 75 mm
```

**Significado**: El soldador está cualificado para cualquier tubería con diámetro igual o mayor a 75 mm.

### Notas Importantes

⚠️ **Limitaciones de la Calculadora**:
- Calcula solo rangos básicos
- No considera variables esenciales adicionales
- Consulta siempre la norma completa para casos especiales
- Requiere verificación de inspector calificado

✅ **Casos de Uso Recomendados**:
- Verificación rápida en campo
- Planificación preliminar
- Material educativo
- Validación de rangos conocidos

---

## ⚖️ Comparador de Normas

### Descripción

Herramienta que muestra una comparación lado a lado de requisitos entre ASME IX, AWS D1.1 e ISO 9606.

### ¿Para Qué Sirve?

- Entender diferencias clave entre normas
- Planificar calificaciones multi-norma
- Capacitación de personal
- Auditorías y verificación de cumplimiento

### Categorías Comparadas

#### 1. Variables Esenciales
Compara qué variables considera cada norma como "esenciales" para recalificación.

#### 2. Rangos de Espesor
Muestra las fórmulas de cálculo de rangos para cada norma.

#### 3. Rangos de Diámetro
Diferencias en cómo cada norma trata el rango de diámetros cualificados.

#### 4. Nomenclatura de Posiciones
Compara la nomenclatura (1G, 2G vs PA, PB, etc.).

#### 5. Calificación de Posiciones
Qué posiciones califican al soldar en una posición específica.

#### 6. Validez de Calificación
Períodos de validez y requisitos de renovación.

#### 7. Continuidad
Requisitos de mantenimiento de calificaciones.

#### 8. Métodos de Ensayo
Pruebas requeridas por cada norma.

#### 9. Criterios de Aceptación Visual
Límites permitidos para defectos visuales.

#### 10. Re-examen
Políticas de re-examen después de fallar.

#### 11. WPS Requirement
Requisitos de especificación de procedimiento.

#### 12. Documentación
Formatos y requisitos de documentación.

### Cómo Usar

#### Paso 1: Filtrar por Categoría

Usa los botones de filtro en la parte superior:
- **Todas las Categorías**: Muestra todo
- **Variables Esenciales**: Solo variables
- **Rangos**: Solo cálculos de rangos
- **Posiciones**: Solo información de posiciones
- **Validez**: Solo períodos de validez
- **Testing**: Solo métodos de ensayo

#### Paso 2: Buscar

Usa la barra de búsqueda para encontrar términos específicos:
- Ejemplo: "espesor"
- Ejemplo: "6G"
- Ejemplo: "bend"

#### Paso 3: Leer la Comparación

La tabla muestra tres columnas:
```
| Categoría | ASME IX | AWS D1.1 | ISO 9606 |
```

### Uso Práctico

**Ejemplo de Uso**:

**Situación**: Un cliente requiere calificación según ASME IX pero tu empresa usaAWS D1.1.

**Solución**:
1. Filtra por "Variables Esenciales"
2. Compara qué variables son diferentes
3. Identifica requisitos adicionales
4. Planifica calificación que cumpla ambas normas

### Exportar Comparación

1. Haz clic en el botón **"Descargar PDF"**
2. Se generará un PDF con la comparación completa
3. Incluye todas las categorías visibles
4. Formato profesional con branding WeldTech

---

## 🔄 Tabla de Equivalencias de Posiciones

### Descripción

Herramienta visual que muestra la conversión entre nomenclaturas de posiciones de soldadura (AWS/ASME ↔ ISO/EN).

### ¿Para Qué Sirve?

- Convertir entre nomenclaturas ISO y AWS
- Entender qué posición ISO corresponde a qué posición AWS
- Visualizar cada posición con imágenes
- Capacitación de soldadores internacionales

### Posiciones Incluidas

#### Posiciones de Groove (Ranura)

| ISO | AWS/ASME | Descripción | Dificultad |
|-----|----------|-------------|------------|
| PA | 1G | Plana (Flat) | Fácil |
| PC | 2G | Horizontal | Media |
| PF | 3G Uphill | Vertical Ascendente | Media |
| PG | 3G Downhill | Vertical Descendente | Media |
| PE | 4G | Sobrecabeza (Overhead) | Difícil |

#### Posiciones de Fillet (Filete)

| ISO | AWS/ASME | Descripción | Dificultad |
|-----|----------|-------------|------------|
| PA | 1F | Filete Plano | Fácil |
| PB | 2F | Filete Horizontal | Fácil |
| PF | 3F | Filete Vertical | Media |
| PD | 4F | Filete Sobrecabeza | Difícil |

#### Posiciones de Pipe (Tubería)

| ISO | AWS/ASME | Descripción | Dificultad |
|-----|----------|-------------|------------|
| PH | 5G Uphill | Tubería Vertical | Difícil |
| PJ | 6G Uphill | Tubería Inclinada 45° | Muy Difícil |

### Cómo Usar

#### Vista de Pestañas

Selecciona una pestaña:
- **Todas**: Muestra todas las posiciones
- **Groove**: Solo posiciones de ranura
- **Fillet**: Solo posiciones de filete
- **Pipe**: Solo posiciones de tubería

#### Búsqueda

Usa la barra de búsqueda para encontrar una posición específica:
- Busca por código: "1G", "PA", "6G"
- Busca por descripción: "vertical", "overhead"

#### Filtro por Dificultad

Filtra posiciones por nivel de dificultad:
- **Fácil** (Verde): 1G, 1F, PA, PB
- **Media** (Amarillo): 2G, 3G, PC, PF, PG
- **Difícil** (Naranja): 4G, 5G, PE, PH
- **Muy Difícil** (Rojo): 6G, PJ

#### Visualización

Cada tarjeta de posición muestra:
- Código ISO
- Código AWS/ASME
- Descripción detallada
- Imagen ilustrativa (si disponible)
- Badge de nivel de dificultad
- Tipo de junta (Groove/Fillet/Pipe)

### Consejos Técnicos por Posición

La herramienta incluye consejos prácticos:

**1G (PA - Plana)**:
- Posición más fácil
- Buena para principiantes
- Control de velocidad constante

**3G (PF - Vertical)**:
- Soldadura ascendente (uphill)
- Control de temperatura del charco
- Técnica de látigo o tejido

**6G (PJ - Inclinada)**:
- Posición más difícil
- Cubre todas las demás posiciones
- Requiere máximo control y experiencia

---

## 🔍 Guía de Defectos de Soldadura

### Descripción

Catálogo visual completo de defectos comunes en soldadura con causas, prevención y soluciones.

### ¿Para Qué Sirve?

- Identificar defectos visualmente
- Entender causas raíz
- Implementar medidas preventivas
- Capacitar a soldadores y técnicos
- Guiar reparaciones

### Defectos Incluidos (14 Total)

#### Defectos de Alta Severidad 🔴

**1. Porosidad**
- Categoría: Interno
- Detección: RT, VT, UT

**2. Grietas**
- Categoría: Interno
- Tipos: Caliente, frío, HAZ, cráter
- Detección: VT, PT, MT, UT, RT

**3. Falta de Fusión**
- Categoría: Interno
- Detección: RT, UT

**4. Falta de Penetración**
- Categoría: Interno
- Detección: RT, VT (desde raíz)

#### Defectos de Severidad Media 🟡

**5. Socavado (Undercut)**
- Categoría: Superficial
- Límites: Según norma (típicamente <1mm)

**6. Sobremonta Excesiva**
- Categoría: Dimensional
- Afecta: Esfuerzos, concentración

**7. Solapamiento (Overlap)**
- Categoría: Superficial
- Común en: SMAW, FCAW

**8. Inclusiones de Escoria**
- Categoría: Interno
- Detección: RT, UT

**9. Desalineamiento**
- Categoría: Dimensional
- Límites: Según especificación

#### Defectos de Baja Severidad 🟢

**10. Salpicaduras**
- Categoría: Superficial
- Cosmético: Usualmente aceptable

**11. Empalmes Defectuosos**
- Categoría: Superficial
- Prevención: Técnica de start/stop

**12. Mordeduras**
- Categoría: Superficial/Dimensional

**13. Concavidad Excesiva**
- Categoría: Dimensional

**14. Falta de Llenado**
- Categoría: Dimensional

### Cómo Usar

#### Paso 1: Navegar por Defectos

Desplázate por la lista de tarjetas de defectos. Cada tarjeta muestra:
- Nombre del defecto
- Imagen real del defecto
- Badge de severidad (Alto/Medio/Bajo)
- Categoría (Superficial/Interno/Dimensional)
- Descripción breve

#### Paso 2: Ver Detalles

Haz clic en una tarjeta para ver información detallada:

**Modal de Detalles Incluye**:

1. **Descripción Completa**
   - Qué es el defecto
   - Cómo se manifiesta
   - Características visuales

2. **Causas** (Top 5)
   - Causas más comunes
   - Factores contribuyentes
   - Condiciones que favorecen el defecto

3. **Prevención** (Mejores Prácticas)
   - Medidas preventivas
   - Parámetros recomendados
   - Preparación adecuada
   - Técnicas correctas

4. **Remedios** (Soluciones)
   - Cómo reparar el defecto
   - Procedimientos de reparación
   - Verificaciones post-reparación

5. **Detección** (Métodos de Ensayo)
   - VT (Visual Testing)
   - PT (Penetrant Testing)
   - MT (Magnetic Testing)
   - RT (Radiographic Testing)
   - UT (Ultrasonic Testing)

#### Paso 3: Filtrar por Categoría

Usa los botones de filtro:
- **Todos**: Muestra todos los defectos
- **Superficial**: Solo defectos visibles en superficie
- **Interno**: Solo defectos internos (requieren NDT)
- **Dimensional**: Solo defectos de forma/dimensión

#### Paso 4: Filtrar por Severidad

Usa los botones de severidad:
- **Alto**: Defectos críticos (inaceptables)
- **Medio**: Defectos que requieren evaluación
- **Bajo**: Defectos menores (usualmente cosméticos)

### Descargar Guía

1. Haz clic en el botón **"Descargar Guía PDF"**
2. Se genera un PDF completo con:
   - Todos los defectos filtrados
   - Imágenes incluidas
   - Información completa por defecto
   - Formato profesional

### Casos de Uso

**Para Inspectores**:
- Identificación rápida de defectos en campo
- Referencia para criterios de aceptación
- Material de capacitación

**Para Soldadores**:
- Entender qué causa defectos
- Aprender a prevenir problemas
- Mejorar técnica

**Para Ingenieros**:
- Análisis de causas raíz
- Desarrollo de procedimientos
- Especificación de criterios de aceptación

---

## 🔧 WPS Builder _(Próximamente)_

### Descripción

Constructor interactivo de Especificaciones de Procedimiento de Soldadura (WPS).

### Funcionalidades Planificadas

- Wizard paso a paso para crear WPS
- Selección de variables esenciales
- Validación automática según norma
- Export a PDF/Excel
- Biblioteca de WPS guardados

**Estado**: En desarrollo  
**Disponibilidad**: Q1 2026 (estimado)

---

## 📊 Qualification Tracker

### Descripción

Sistema de gestión y seguimiento de calificaciones de soldadores.

### ¿Para Qué Sirve?

- Gestionar calificaciones de múltiples soldadores
- Rastrear fechas de expiración
- Alertas de renovaciones próximas
- Historial de calificaciones
- Reportes de cumplimiento

### Funcionalidades

#### Dashboard Principal

Visualiza:
- **Total de soldadores** en el sistema
- **Calificaciones activas**
- **Calificaciones por vencer** (próximos 30 días)
- **Calificaciones expiradas**

#### Gestión de Calificaciones

**Agregar Nueva Calificación**:
1. Haz clic en **"+ Agregar Calificación"**
2. Completa el formulario:
   - Nombre del soldador
   - ID del soldador
   - Norma (ASME IX, AWS D1.1, ISO 9606)
   - Proceso (SMAW, GTAW, GMAW, etc.)
   - Posición(es) cualificada(s)
   - Material
   - Fecha de certificación
   - Fecha de expiración
   - Agencia de testing
   - Notas adicionales
3. Haz clic en **"Guardar"**

**Editar Calificación**:
1. Busca la calificación en la lista
2. Haz clic en el botón de **editar** (lápiz)
3. Modifica los campos necesarios
4. Guarda los cambios

**Eliminar Calificación**:
1. Haz clic en el botón de **eliminar** (basura)
2. Confirma la acción

#### Estados de Calificación

🟢 **Activa**: Calificación vigente (más de 30 días para expirar)  
🟡 **Por vencer**: Expira en 30 días o menos  
🔴 **Expirada**: Ya pasó la fecha de expiración

#### Búsqueda y Filtros

**Búsqueda**:
- Por nombre de soldador
- Por ID de soldador
- Por proceso
- Por norma

**Filtros**:
- Estado: Todas / Activas / Por vencer / Expiradas
- Proceso: Todos / SMAW / GTAW / GMAW / FCAW / SAW
- Norma: Todas / ASME IX / AWS D1.1 / ISO 9606

#### Reportes

**Generar Reporte PDF**:
1. Aplica los filtros deseados
2. Haz clic en **"Exportar PDF"**
3. Se descarga un reporte profesional con:
   - Lista de calificaciones filtradas
   - Información detallada
   - Estado actual
   - Alertas de vencimiento

### Casos de Uso

**Para QC Managers**:
- Vista general de todas las calificaciones
- Planificación de renovaciones
- Auditorías internas
- Compliance reporting

**Para Coordinadores de Proyecto**:
- Verificar disponibilidad de soldadores cualificados
- Asignar soldadores según calificaciones
- Evitar trabajos con calificaciones expiradas

**Para Recursos Humanos**:
- Tracking de certificaciones
- Planificación de capacitaciones
- Renovaciones programadas

---

## Mejores Prácticas

### Uso Diario

1. **Verifica antes de trabajar**: Usa la calculadora de rangos antes de cada soldadura crítica
2. **Compara normas**: Cuando trabajas con múltiples normas, consulta el comparador
3. **Prevén defectos**: Revisa la guía de defectos al inicio de proyectos complejos
4. **Mantén registros**: Usa el Qualification Tracker para todas las calificaciones

### Capacitación

- Usa las herramientas como material didáctico
- Comparte PDFs exportados con el equipo
- Realiza ejercicios prácticos con la calculadora
- Estudia defectos antes de inspecciones

### Integración en QMS

- Referencia las herramientas en procedimientos internos
- Incluye capturas de pantalla en WPS/PQR
- Usa reportes del tracker en auditorías
- Integra con sistemas de gestión existentes

---

## Limitaciones y Disclaimers

⚠️ **Importante**:

- Las herramientas son de **referencia** y **educativas**
- NO reemplazan la consulta de normas oficiales
- Requieren verificación por inspector calificado
- Los resultados son orientativos
- Cada proyecto puede tener requisitos específicos adicionales
- La responsabilidad final recae en personal calificado

✅ **Uso recomendado**:
- Planificación preliminar
- Verificación rápida
- Capacitación
- Material de apoyo

---

## Soporte

¿Problemas con las herramientas?

- 💬 **WhatsApp**: +57 313 369 1591
- 📄 **FAQ**: [Ver Preguntas Frecuentes](07-faq.md)
- 📧 **Email**: Próximamente

---

## Próximos Pasos

1. 📄 **Descarga plantillas profesionales** - [Ver Guía](05-templates.md)
2. 👨‍💼 **Si eres administrador** - [Ver Guía Admin](06-admin-guide.md)
3. ❓ **Preguntas frecuentes** - [Ver FAQ](07-faq.md)

---

*Última actualización: Noviembre 2025*  
*Versión: 1.0*

