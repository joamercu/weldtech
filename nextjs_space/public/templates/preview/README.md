# Templates Preview (PDF)

Esta carpeta contiene los PDFs con marca de agua para usuarios no registrados.

## Archivos que deben estar aquí:

- WPS_Template_Preview.pdf
- PQR_Template_Preview.pdf
- WPQ_Template_Preview.pdf
- Checklist_Auditoria_Preview.pdf
- Matriz_Trazabilidad_Preview.pdf

## Generación:

Estos PDFs se generan desde los archivos Excel usando el script:
```bash
node scripts/templates/generate-previews.js
```

## Importante:

⚠️ Regenerar cada vez que se actualice un template Excel.
⚠️ Verificar que marca de agua sea visible.
