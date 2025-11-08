# MD2Word API - WeldTech Solutions

🔧 **Herramienta profesional de conversión de Markdown a Word con branding corporativo**

Convierte documentos Markdown (.md) a archivos Word (.docx) aplicando automáticamente la imagen corporativa de WeldTech Solutions: colores, tipografía, logos y plantillas profesionales.

---

## 📋 Características

- ✅ **Conversión MD → DOCX** con sintaxis Markdown completa
- 🎨 **Branding automático** basado en Manual de Imagen Corporativa
- 📄 **Portadas profesionales** con información del proyecto
- 📊 **Tablas de control de versiones** personalizables
- 🔤 **Tipografía corporativa** (Montserrat/Inter)
- 🎯 **Headers y footers** con logo y numeración
- 🌐 **Soporte bilingüe** (Español/Inglés)
- 🚀 **Dos interfaces**: REST API y CLI
- 🔧 **Multi-marca**: Sistema extensible para múltiples identidades

---

## 🚀 Instalación

### Requisitos Previos

- **Python 3.9+**
- **Pandoc** (convertidor de documentos)

#### Instalar Pandoc

**Windows:**
```powershell
winget install --id JohnMacFarlane.Pandoc
```

**Linux:**
```bash
sudo apt install pandoc
```

**macOS:**
```bash
brew install pandoc
```

### Instalar Dependencias Python

```bash
cd md2word-api
pip install -r requirements.txt
```

---

## 📖 Uso

### 🖥️ Interfaz CLI (Línea de Comandos)

#### Convertir un documento

```bash
python cli/converter_cli.py convert documento.md -t "Mi Documento" -p "Proyecto X"
```

#### Opciones completas

```bash
python cli/converter_cli.py convert INPUT.md \
  --config config.yaml \          # Config personalizado
  --output output.docx \           # Archivo de salida
  --brand weldtech \               # Marca a aplicar
  --title "Título" \               # Título del documento
  --subtitle "Subtítulo" \         # Subtítulo
  --project "Proyecto XYZ" \       # Nombre del proyecto
  --client "Cliente S.A." \        # Nombre del cliente
  --author "Juan Pérez" \          # Autor
  --version "2.0"                  # Versión
```

#### Listar marcas disponibles

```bash
python cli/converter_cli.py list-brands
```

#### Ver información de una marca

```bash
python cli/converter_cli.py show-brand weldtech
```

#### Validar configuración

```bash
python cli/converter_cli.py validate mi_config.yaml
```

#### Información del sistema

```bash
python cli/converter_cli.py info
```

---

### 🌐 REST API

#### Iniciar el servidor

**Modo desarrollo:**
```bash
cd api
python main.py
```
o
```bash
uvicorn api.main:app --reload --port 8000
```

**Modo producción:**
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Endpoints disponibles

##### 1. Health Check
```bash
curl http://localhost:8000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "service": "md2word-api",
  "version": "1.0.0",
  "timestamp": "2025-11-07T10:30:00"
}
```

##### 2. Listar marcas
```bash
curl http://localhost:8000/brands
```

**Respuesta:**
```json
["weldtech"]
```

##### 3. Información de marca
```bash
curl http://localhost:8000/brands/weldtech
```

**Respuesta:**
```json
{
  "name": "WeldTech Solutions",
  "tagline": "Transformando normativas complejas...",
  "colors": 3,
  "fonts": ["headings", "body"],
  "assets_path": "assets/weldtech"
}
```

##### 4. Convertir documento
```bash
curl -X POST http://localhost:8000/convert \
  -F "md_file=@documento.md" \
  -F "brand=weldtech" \
  -F "title=Mi Documento" \
  -F "project=Proyecto XYZ" \
  -F "client=Cliente S.A." \
  -o output.docx
```

**Con configuración personalizada:**
```bash
curl -X POST http://localhost:8000/convert \
  -F "md_file=@documento.md" \
  -F "config_file=@mi_config.yaml" \
  -F "brand=weldtech" \
  -o output.docx
```

##### 5. Validar configuración
```bash
curl -X POST http://localhost:8000/validate \
  -F "config_file=@config.yaml"
```

#### Documentación interactiva

Una vez iniciado el servidor, accede a:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 📁 Estructura del Proyecto

```
md2word-api/
├── api/                        # REST API
│   ├── main.py                 # FastAPI application
│   ├── routes/                 # Endpoints adicionales
│   └── middleware/             # Middleware (auth, etc.)
│
├── cli/                        # Interfaz CLI
│   └── converter_cli.py        # Comandos Click
│
├── core/                       # Motor principal
│   ├── converter.py            # Lógica de conversión
│   ├── brand_manager.py        # Gestión de marcas
│   └── template_engine.py      # Sistema de plantillas
│
├── templates/                  # Plantillas de marca
│   └── weldtech/
│       └── config.yaml         # Config WeldTech
│
├── assets/                     # Assets visuales
│   └── weldtech/
│       ├── logo.png
│       ├── hero_background.png
│       └── ...
│
├── config/                     # Configuraciones
│   └── document_config.yaml    # Config por defecto
│
├── examples/                   # Ejemplos de uso
│
├── requirements.txt            # Dependencias
└── README.md                   # Esta documentación
```

---

## ⚙️ Configuración

### Archivo de Configuración de Documento

Ejemplo de `config/document_config.yaml`:

```yaml
document:
  title: "Guía de Cualificación de Soldadores"
  subtitle: "ASME Section IX"
  project: "Proyecto Constructor Naval"
  client: "Astilleros LATAM S.A."
  author: "WeldTech Solutions"
  version: "1.0"
  revision: "RA-00"
  date: "2025-11-07"
  confidentiality: "DOCUMENTO TÉCNICO - CONFIDENCIAL"

version_control:
  - version: "1.0"
    date: "2025-11-07"
    author: "WeldTech Team"
    description: "Versión inicial"

metadata:
  language: "es"              # es/en
  include_toc: true           # Tabla de contenido
  toc_depth: 3
  number_sections: true
  paper_size: "A4"
  orientation: "portrait"
```

### Crear una Nueva Marca

1. Crear directorio: `templates/mi_marca/`
2. Crear `config.yaml` con estructura similar a `templates/weldtech/config.yaml`
3. Añadir assets en `assets/mi_marca/`
4. Usar: `--brand mi_marca`

---

## 🎨 Personalización

### Colores WeldTech

Basado en el Manual de Imagen Corporativa:

| Color | Hex | Uso |
|-------|-----|-----|
| **Dark Steel** | `#0F1216` | Fondos, textos primarios |
| **Weld Orange** | `#FF7A00` | CTAs, highlights, títulos |
| **Precision Blue** | `#2AA1FF` | Enlaces, subtítulos |
| **Steel Gray** | `#6B7280` | Textos secundarios |
| **Light Steel** | `#E5E7EB` | Fondos alternativos |

### Tipografía

- **Montserrat** (Bold 700, SemiBold 600, Medium 500) - Títulos
- **Inter** (Regular 400, Medium 500, SemiBold 600) - Cuerpo

---

## 🔧 Desarrollo

### Agregar nuevos endpoints

Editar `api/routes/convert.py` o crear nuevos archivos en `api/routes/`.

### Extender el motor de conversión

Editar `core/converter.py` para añadir nuevas funcionalidades de formato.

### Personalizar plantillas

Modificar `core/template_engine.py` para cambiar el diseño de portadas, headers, etc.

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Conversión básica

```bash
python cli/converter_cli.py convert manual.md
```

Genera: `manual.docx` con branding WeldTech por defecto.

### Ejemplo 2: Conversión personalizada

```bash
python cli/converter_cli.py convert guia.md \
  -t "Guía de Inspección Visual" \
  -s "Según AWS D1.1" \
  -p "Proyecto Puente Metro" \
  -c "Gobierno Municipal" \
  -v "2.5" \
  -o documentos/guia_inspeccion.docx
```

### Ejemplo 3: Múltiples conversiones

```bash
for file in docs/*.md; do
  python cli/converter_cli.py convert "$file" -b weldtech
done
```

### Ejemplo 4: Usar API desde Python

```python
import requests

url = "http://localhost:8000/convert"

files = {
    'md_file': open('documento.md', 'rb')
}

data = {
    'brand': 'weldtech',
    'title': 'Mi Documento',
    'project': 'Proyecto ABC',
    'version': '1.0'
}

response = requests.post(url, files=files, data=data)

with open('output.docx', 'wb') as f:
    f.write(response.content)

print("✓ Documento generado: output.docx")
```

---

## 🐛 Solución de Problemas

### Error: "Pandoc no encontrado"

**Solución:** Instala Pandoc (ver sección Instalación)

### Error: "Marca 'X' no encontrada"

**Solución:** Verifica que exista `templates/X/config.yaml`

Lista marcas disponibles:
```bash
python cli/converter_cli.py list-brands
```

### Error: "Asset faltante"

**Solución:** Verifica que los assets estén en `assets/MARCA/`:
- logo.png
- hero_background.png (opcional)

### Error al convertir tablas

**Solución:** Asegúrate de usar sintaxis Markdown correcta:

```markdown
| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |
```

---

## 📄 Licencia

© 2025 WeldTech Solutions. Todos los derechos reservados.

---

## 🤝 Soporte

Para soporte técnico o consultas:

- **Email:** support@weldtech.solutions
- **Documentación completa:** http://localhost:8000/docs (con API corriendo)

---

## 🔄 Versiones

### v1.0.0 (2025-11-07)
- ✅ Conversión MD → DOCX con branding
- ✅ API REST completa
- ✅ CLI interactiva con Rich
- ✅ Sistema multi-marca
- ✅ Plantillas WeldTech
- ✅ Soporte ES/EN

---

## 🚀 Roadmap

- [ ] Conversión por lotes (batch)
- [ ] Marcas de agua configurables
- [ ] Exportación a PDF
- [ ] Plantillas adicionales (RDP, custom)
- [ ] Sistema de plugins
- [ ] Integración con Git
- [ ] Autenticación JWT
- [ ] Dashboard web

---

**¡Hecho con 💙 por WeldTech Solutions!**

