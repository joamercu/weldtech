"""
Gestor de Configuración de Marca
=================================

Maneja la carga y validación de configuraciones de marca
desde archivos YAML.
"""

import yaml
from pathlib import Path
from typing import Optional, Dict, Any, List
import logging

from .converter import BrandConfig

logger = logging.getLogger(__name__)


class BrandManager:
    """
    Gestor de marcas que carga configuraciones desde YAML
    y valida que todos los assets necesarios existan.
    """
    
    def __init__(self, templates_dir: Optional[Path] = None, assets_dir: Optional[Path] = None):
        """
        Inicializa el gestor de marcas.
        
        Args:
            templates_dir: Directorio de plantillas (por defecto: templates/)
            assets_dir: Directorio de assets (por defecto: assets/)
        """
        # Obtener directorio base del proyecto
        base_dir = Path(__file__).parent.parent
        
        self.templates_dir = Path(templates_dir) if templates_dir else base_dir / 'templates'
        self.assets_dir = Path(assets_dir) if assets_dir else base_dir / 'assets'
        
        self.current_brand: Optional[str] = None
        self.current_config: Optional[BrandConfig] = None
    
    def list_available_brands(self) -> List[str]:
        """
        Lista todas las marcas disponibles.
        
        Returns:
            Lista de nombres de marcas
        """
        if not self.templates_dir.exists():
            logger.warning(f"Directorio de plantillas no existe: {self.templates_dir}")
            return []
        
        brands = []
        for item in self.templates_dir.iterdir():
            if item.is_dir():
                config_file = item / 'config.yaml'
                if config_file.exists():
                    brands.append(item.name)
        
        return brands
    
    def load_brand(self, brand_name: str) -> BrandConfig:
        """
        Carga la configuración de una marca específica.
        
        Args:
            brand_name: Nombre de la marca (ej: 'weldtech')
        
        Returns:
            Objeto BrandConfig con la configuración cargada
        
        Raises:
            FileNotFoundError: Si no se encuentra la configuración
            ValueError: Si la configuración es inválida
        """
        brand_dir = self.templates_dir / brand_name
        config_file = brand_dir / 'config.yaml'
        
        if not config_file.exists():
            raise FileNotFoundError(
                f"No se encontró configuración para la marca '{brand_name}' "
                f"en {config_file}"
            )
        
        logger.info(f"Cargando configuración de marca: {brand_name}")
        
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config_dict = yaml.safe_load(f)
            
            # Validar estructura básica
            self._validate_config(config_dict, brand_name)
            
            # Crear objeto BrandConfig
            brand_config = BrandConfig(config_dict)
            
            # Guardar referencia
            self.current_brand = brand_name
            self.current_config = brand_config
            
            logger.info(f"✓ Configuración de {brand_name} cargada exitosamente")
            
            return brand_config
            
        except yaml.YAMLError as e:
            raise ValueError(f"Error al parsear YAML de {brand_name}: {e}")
        except Exception as e:
            raise ValueError(f"Error al cargar configuración de {brand_name}: {e}")
    
    def _validate_config(self, config: Dict[str, Any], brand_name: str):
        """
        Valida la estructura de la configuración.
        
        Args:
            config: Diccionario de configuración
            brand_name: Nombre de la marca
        
        Raises:
            ValueError: Si faltan campos requeridos
        """
        required_sections = ['brand', 'colors', 'fonts', 'typography', 'assets']
        
        for section in required_sections:
            if section not in config:
                raise ValueError(
                    f"Configuración de {brand_name} incompleta: "
                    f"falta la sección '{section}'"
                )
        
        # Validar sección brand
        if 'name' not in config['brand']:
            raise ValueError(
                f"Configuración de {brand_name}: falta 'name' en sección 'brand'"
            )
        
        # Validar que existan colores primarios
        if 'primary' not in config['colors']:
            raise ValueError(
                f"Configuración de {brand_name}: falta 'primary' en sección 'colors'"
            )
        
        # Validar assets
        required_assets = ['logo']
        for asset in required_assets:
            if asset not in config['assets']:
                logger.warning(
                    f"Configuración de {brand_name}: asset '{asset}' no especificado"
                )
    
    def get_colors(self) -> Dict[str, Any]:
        """
        Obtiene la paleta de colores de la marca actual.
        
        Returns:
            Diccionario con colores organizados por categoría
        """
        if not self.current_config:
            raise ValueError("No hay marca cargada. Usa load_brand() primero.")
        
        return self.current_config.colors
    
    def get_fonts(self) -> Dict[str, Any]:
        """
        Obtiene la configuración de fuentes de la marca actual.
        
        Returns:
            Diccionario con familias y pesos de fuentes
        """
        if not self.current_config:
            raise ValueError("No hay marca cargada. Usa load_brand() primero.")
        
        return self.current_config.fonts
    
    def get_assets_path(self, brand_name: Optional[str] = None) -> Path:
        """
        Obtiene el path al directorio de assets de una marca.
        
        Args:
            brand_name: Nombre de la marca (usa la actual si no se especifica)
        
        Returns:
            Path al directorio de assets
        """
        brand = brand_name or self.current_brand
        
        if not brand:
            raise ValueError("No hay marca especificada")
        
        return self.assets_dir / brand
    
    def validate_assets(self, brand_name: Optional[str] = None) -> bool:
        """
        Verifica que todos los assets requeridos existan.
        
        Args:
            brand_name: Nombre de la marca (usa la actual si no se especifica)
        
        Returns:
            True si todos los assets existen, False en caso contrario
        """
        if not self.current_config and not brand_name:
            raise ValueError("No hay marca cargada. Usa load_brand() primero.")
        
        if brand_name and brand_name != self.current_brand:
            # Cargar temporalmente la marca para validar
            temp_config = self.load_brand(brand_name)
            assets = temp_config.assets
        else:
            assets = self.current_config.assets
        
        missing_assets = []
        
        for asset_name, asset_path in assets.items():
            if not asset_path:
                continue
            
            # Convertir path relativo a absoluto
            full_path = Path(asset_path)
            if not full_path.is_absolute():
                full_path = Path(__file__).parent.parent / asset_path
            
            if not full_path.exists():
                missing_assets.append(asset_path)
                logger.warning(f"Asset faltante: {asset_path}")
        
        if missing_assets:
            logger.error(
                f"Assets faltantes para {self.current_brand}: "
                f"{', '.join(missing_assets)}"
            )
            return False
        
        logger.info(f"✓ Todos los assets de {self.current_brand} están disponibles")
        return True
    
    def get_brand_info(self, brand_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Obtiene información resumida de una marca.
        
        Args:
            brand_name: Nombre de la marca (usa la actual si no se especifica)
        
        Returns:
            Diccionario con información de la marca
        """
        if not self.current_config and not brand_name:
            raise ValueError("No hay marca cargada")
        
        if brand_name and brand_name != self.current_brand:
            config = self.load_brand(brand_name)
        else:
            config = self.current_config
        
        return {
            'name': config.brand.get('name', 'Sin nombre'),
            'tagline': config.brand.get('tagline', ''),
            'colors': len(config.colors.get('primary', {})),
            'fonts': list(config.fonts.keys()),
            'assets_path': str(self.get_assets_path(brand_name or self.current_brand))
        }
    
    def create_default_config(self, brand_name: str, output_path: Optional[Path] = None) -> Path:
        """
        Crea un archivo de configuración por defecto para una nueva marca.
        
        Args:
            brand_name: Nombre de la nueva marca
            output_path: Path donde guardar el config (opcional)
        
        Returns:
            Path del archivo creado
        """
        if not output_path:
            output_path = self.templates_dir / brand_name / 'config.yaml'
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        default_config = {
            'brand': {
                'name': brand_name.title(),
                'tagline': 'Tu tagline aquí'
            },
            'colors': {
                'primary': {
                    'main': '#0F1216',
                    'accent': '#FF7A00'
                },
                'secondary': {
                    'gray': '#6B7280',
                    'light': '#E5E7EB'
                }
            },
            'fonts': {
                'headings': {
                    'family': 'Arial',
                    'weights': [600, 700]
                },
                'body': {
                    'family': 'Arial',
                    'weights': [400, 500]
                }
            },
            'typography': {
                'h1': {'size': 48, 'weight': 700, 'color': 'accent'},
                'h2': {'size': 36, 'weight': 600, 'color': 'main'},
                'h3': {'size': 28, 'weight': 500, 'color': 'gray'},
                'body': {'size': 16, 'weight': 400, 'color': 'main'}
            },
            'assets': {
                'logo': f'assets/{brand_name}/logo.png',
                'hero_background': f'assets/{brand_name}/hero_background.jpg'
            }
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            yaml.dump(default_config, f, default_flow_style=False, allow_unicode=True)
        
        logger.info(f"✓ Configuración por defecto creada: {output_path}")
        
        return output_path

