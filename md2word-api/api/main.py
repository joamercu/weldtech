"""
API REST para Conversión de Markdown a Word
============================================

FastAPI application que expone endpoints para convertir
documentos Markdown a Word con branding corporativo.
"""

import os
import shutil
import tempfile
import yaml
from pathlib import Path
from typing import Optional, List
from datetime import datetime
import logging

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importar módulos core
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.converter import DocumentConverter, BrandConfig, DocumentConfig
from core.brand_manager import BrandManager
from core.template_engine import TemplateEngine

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title="MD2Word API - WeldTech Solutions",
    description="API para conversión de documentos Markdown a Word con branding corporativo",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar gestor de marcas
brand_manager = BrandManager()

# Directorio temporal para archivos
TEMP_DIR = Path(tempfile.gettempdir()) / "md2word-api"
TEMP_DIR.mkdir(exist_ok=True)


# Modelos Pydantic
class ConversionResponse(BaseModel):
    """Respuesta de conversión exitosa"""
    status: str
    message: str
    output_file: str
    download_url: str


class BrandInfo(BaseModel):
    """Información de una marca"""
    name: str
    tagline: str
    colors: int
    fonts: List[str]
    assets_path: str


class HealthResponse(BaseModel):
    """Respuesta de health check"""
    status: str
    service: str
    version: str
    timestamp: str


# Utilidades
def cleanup_temp_file(file_path: Path):
    """Elimina un archivo temporal"""
    try:
        if file_path.exists():
            file_path.unlink()
            logger.info(f"Archivo temporal eliminado: {file_path}")
    except Exception as e:
        logger.warning(f"No se pudo eliminar archivo temporal {file_path}: {e}")


def save_upload_file(upload_file: UploadFile, destination: Path) -> Path:
    """Guarda un archivo subido"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return destination
    finally:
        upload_file.file.close()


# Endpoints
@app.get("/", response_model=dict)
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "service": "MD2Word API - WeldTech Solutions",
        "version": "1.0.0",
        "status": "running",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "brands": "/brands",
            "convert": "/convert",
            "batch": "/convert/batch",
            "validate": "/validate"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check del servicio"""
    return HealthResponse(
        status="ok",
        service="md2word-api",
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )


@app.get("/brands", response_model=List[str])
async def list_brands():
    """Lista todas las marcas disponibles"""
    try:
        brands = brand_manager.list_available_brands()
        logger.info(f"Marcas disponibles: {brands}")
        return brands
    except Exception as e:
        logger.error(f"Error al listar marcas: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/brands/{brand_name}", response_model=BrandInfo)
async def get_brand_info(brand_name: str):
    """Obtiene información detallada de una marca"""
    try:
        info = brand_manager.get_brand_info(brand_name)
        return BrandInfo(**info)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Marca '{brand_name}' no encontrada"
        )
    except Exception as e:
        logger.error(f"Error al obtener info de marca {brand_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/convert", response_model=ConversionResponse)
async def convert_markdown(
    background_tasks: BackgroundTasks,
    md_file: UploadFile = File(..., description="Archivo Markdown (.md)"),
    brand: str = Form("weldtech", description="Marca a aplicar"),
    config_file: Optional[UploadFile] = File(None, description="Config YAML personalizado (opcional)"),
    title: Optional[str] = Form(None, description="Título del documento"),
    subtitle: Optional[str] = Form(None, description="Subtítulo"),
    project: Optional[str] = Form(None, description="Nombre del proyecto"),
    client: Optional[str] = Form(None, description="Nombre del cliente"),
    author: Optional[str] = Form("WeldTech Solutions", description="Autor"),
    version: Optional[str] = Form("1.0", description="Versión"),
):
    """
    Convierte un archivo Markdown a Word con branding corporativo.
    
    - **md_file**: Archivo Markdown a convertir (requerido)
    - **brand**: Marca a aplicar (por defecto: weldtech)
    - **config_file**: Archivo YAML de configuración personalizado (opcional)
    - **title**, **subtitle**, **project**, **client**: Metadatos del documento
    - **author**, **version**: Información de autoría
    """
    
    # Validar extensión del archivo
    if not md_file.filename.endswith('.md'):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe tener extensión .md"
        )
    
    # Validar tamaño (10MB máximo)
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    
    try:
        # Crear nombres de archivos temporales
        temp_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        input_path = TEMP_DIR / f"{temp_id}_input.md"
        output_path = TEMP_DIR / f"{temp_id}_output.docx"
        
        # Guardar archivo Markdown
        logger.info(f"Guardando archivo MD: {md_file.filename}")
        save_upload_file(md_file, input_path)
        
        # Cargar configuración de marca
        logger.info(f"Cargando marca: {brand}")
        try:
            brand_config = brand_manager.load_brand(brand)
        except FileNotFoundError:
            raise HTTPException(
                status_code=404,
                detail=f"Marca '{brand}' no encontrada"
            )
        
        # Cargar o crear configuración de documento
        if config_file:
            logger.info("Usando configuración personalizada")
            config_path = TEMP_DIR / f"{temp_id}_config.yaml"
            save_upload_file(config_file, config_path)
            
            with open(config_path, 'r', encoding='utf-8') as f:
                doc_config_dict = yaml.safe_load(f)
            
            config_path.unlink()  # Limpiar config temporal
        else:
            # Usar config por defecto
            default_config = Path(__file__).parent.parent / 'config' / 'document_config.yaml'
            with open(default_config, 'r', encoding='utf-8') as f:
                doc_config_dict = yaml.safe_load(f)
        
        # Sobrescribir con parámetros del formulario si se proporcionan
        if title:
            doc_config_dict['document']['title'] = title
        if subtitle:
            doc_config_dict['document']['subtitle'] = subtitle
        if project:
            doc_config_dict['document']['project'] = project
        if client:
            doc_config_dict['document']['client'] = client
        if author:
            doc_config_dict['document']['author'] = author
        if version:
            doc_config_dict['document']['version'] = version
        
        # Actualizar fecha
        doc_config_dict['document']['date'] = datetime.now().strftime('%Y-%m-%d')
        
        doc_config = DocumentConfig(doc_config_dict)
        
        # Realizar conversión
        logger.info("Iniciando conversión...")
        converter = DocumentConverter(
            input_file=input_path,
            output_file=output_path,
            brand_config=brand_config,
            doc_config=doc_config
        )
        
        success = converter.convert()
        
        if not success or not output_path.exists():
            raise HTTPException(
                status_code=500,
                detail="Error durante la conversión del documento"
            )
        
        # Aplicar plantilla completa
        logger.info("Aplicando plantilla corporativa...")
        from docx import Document
        doc = Document(str(output_path))
        
        template_engine = TemplateEngine(brand_config, doc_config)
        doc = template_engine.apply_full_template(doc)
        
        doc.save(str(output_path))
        
        logger.info(f"✓ Conversión completada: {output_path}")
        
        # Programar limpieza de archivos temporales (después de 1 hora)
        background_tasks.add_task(cleanup_temp_file, input_path)
        # No limpiar el output inmediatamente, se limpiará al descargarlo
        
        # Retornar archivo
        return FileResponse(
            path=str(output_path),
            filename=f"{Path(md_file.filename).stem}.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            background=background_tasks
        )
        
    except HTTPException:
        # Re-lanzar excepciones HTTP
        raise
    except Exception as e:
        logger.error(f"Error durante la conversión: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@app.post("/convert/batch")
async def convert_batch(
    md_files: List[UploadFile] = File(..., description="Múltiples archivos Markdown"),
    brand: str = Form("weldtech", description="Marca a aplicar"),
):
    """
    Convierte múltiples archivos Markdown a Word.
    
    Retorna un archivo ZIP con todos los documentos convertidos.
    """
    # TODO: Implementar conversión por lotes
    raise HTTPException(
        status_code=501,
        detail="Conversión por lotes no implementada aún"
    )


@app.post("/validate")
async def validate_config(
    config_file: UploadFile = File(..., description="Archivo YAML de configuración")
):
    """
    Valida un archivo de configuración sin realizar conversión.
    """
    try:
        # Guardar temporalmente
        temp_path = TEMP_DIR / f"validate_{datetime.now().timestamp()}.yaml"
        save_upload_file(config_file, temp_path)
        
        # Intentar parsear
        with open(temp_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Limpiar
        temp_path.unlink()
        
        # Validar estructura básica
        required_sections = ['document', 'metadata']
        missing = [s for s in required_sections if s not in config]
        
        if missing:
            return JSONResponse(
                status_code=400,
                content={
                    "valid": False,
                    "errors": [f"Falta sección: {s}" for s in missing]
                }
            )
        
        return {
            "valid": True,
            "message": "Configuración válida",
            "sections": list(config.keys())
        }
        
    except yaml.YAMLError as e:
        return JSONResponse(
            status_code=400,
            content={
                "valid": False,
                "errors": [f"Error de YAML: {str(e)}"]
            }
        )
    except Exception as e:
        logger.error(f"Error validando config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/templates")
async def list_templates():
    """Lista todas las plantillas disponibles (alias de /brands)"""
    return await list_brands()


# Manejo de errores global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones"""
    logger.error(f"Error no manejado: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Error interno del servidor",
            "detail": str(exc)
        }
    )


# Evento de inicio
@app.on_event("startup")
async def startup_event():
    """Evento de inicio de la aplicación"""
    logger.info("=" * 60)
    logger.info("MD2Word API - WeldTech Solutions")
    logger.info("Version: 1.0.0")
    logger.info("=" * 60)
    
    # Listar marcas disponibles
    brands = brand_manager.list_available_brands()
    logger.info(f"Marcas disponibles: {brands}")
    
    # Crear directorio temporal si no existe
    TEMP_DIR.mkdir(exist_ok=True, parents=True)
    logger.info(f"Directorio temporal: {TEMP_DIR}")
    
    logger.info("API lista para recibir peticiones")


# Evento de cierre
@app.on_event("shutdown")
async def shutdown_event():
    """Evento de cierre de la aplicación"""
    logger.info("Cerrando API...")
    
    # Limpiar archivos temporales viejos
    try:
        for file in TEMP_DIR.glob("*"):
            if file.is_file():
                age = datetime.now().timestamp() - file.stat().st_mtime
                if age > 3600:  # Más de 1 hora
                    file.unlink()
                    logger.info(f"Archivo temporal limpiado: {file}")
    except Exception as e:
        logger.warning(f"Error limpiando archivos temporales: {e}")


# Entry point para uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

