"""
Interfaz de Línea de Comandos (CLI)
====================================

Herramienta CLI para conversión de documentos Markdown a Word
con branding corporativo usando Click.
"""

import sys
import yaml
from pathlib import Path
from typing import Optional
import logging

import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import print as rprint

# Añadir directorio padre al path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.converter import DocumentConverter, BrandConfig, DocumentConfig
from core.brand_manager import BrandManager
from core.template_engine import TemplateEngine
from docx import Document as DocxDocument

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s: %(message)s'
)

# Console de Rich para output bonito
console = Console()


@click.group()
@click.version_option(version="1.0.0", prog_name="MD2Word CLI")
def cli():
    """
    WeldTech MD2Word Converter CLI
    
    Herramienta de conversión de Markdown a Word con branding corporativo.
    """
    pass


@cli.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option(
    '--config', '-c',
    type=click.Path(exists=True),
    help='Archivo YAML de configuración personalizado'
)
@click.option(
    '--output', '-o',
    type=click.Path(),
    help='Archivo de salida (por defecto: mismo nombre con .docx)'
)
@click.option(
    '--brand', '-b',
    default='weldtech',
    help='Plantilla de marca a usar (por defecto: weldtech)'
)
@click.option('--title', '-t', help='Título del documento')
@click.option('--subtitle', '-s', help='Subtítulo del documento')
@click.option('--project', '-p', help='Nombre del proyecto')
@click.option('--client', help='Nombre del cliente')
@click.option('--author', '-a', default='WeldTech Solutions', help='Autor del documento')
@click.option('--version', '-v', default='1.0', help='Versión del documento')
@click.option(
    '--no-template',
    is_flag=True,
    help='Solo convertir sin aplicar plantilla corporativa'
)
def convert(
    input_file: str,
    config: Optional[str],
    output: Optional[str],
    brand: str,
    title: Optional[str],
    subtitle: Optional[str],
    project: Optional[str],
    client: Optional[str],
    author: str,
    version: str,
    no_template: bool
):
    """
    Convierte un archivo Markdown a Word con branding corporativo.
    
    Ejemplo:
    
        md2word convert documento.md -b weldtech -t "Mi Documento"
    """
    
    try:
        input_path = Path(input_file)
        output_path = Path(output) if output else input_path.with_suffix('.docx')
        
        console.print("\n[bold blue]WeldTech MD2Word Converter[/bold blue]\n")
        console.print(f"Archivo de entrada: [cyan]{input_path}[/cyan]")
        console.print(f"Archivo de salida: [cyan]{output_path}[/cyan]")
        console.print(f"Marca: [cyan]{brand}[/cyan]\n")
        
        # Cargar gestor de marcas
        brand_manager = BrandManager()
        
        with console.status("[bold green]Cargando configuración de marca..."):
            try:
                brand_config = brand_manager.load_brand(brand)
                console.print(f"OK - Marca [bold]{brand}[/bold] cargada exitosamente")
            except FileNotFoundError:
                console.print(f"[bold red]ERROR:[/bold red] Marca '{brand}' no encontrada")
                console.print("\nMarcas disponibles:")
                for b in brand_manager.list_available_brands():
                    console.print(f"  - {b}")
                sys.exit(1)
        
        # Cargar configuración de documento
        if config:
            console.print(f"Usando configuracion: [cyan]{config}[/cyan]")
            with open(config, 'r', encoding='utf-8') as f:
                doc_config_dict = yaml.safe_load(f)
        else:
            # Usar configuración por defecto
            default_config = Path(__file__).parent.parent / 'config' / 'document_config.yaml'
            with open(default_config, 'r', encoding='utf-8') as f:
                doc_config_dict = yaml.safe_load(f)
        
        # Sobrescribir con parámetros CLI
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
        
        doc_config = DocumentConfig(doc_config_dict)
        
        # Mostrar información del documento
        console.print("\n[bold]Información del documento:[/bold]")
        console.print(f"  Titulo: [cyan]{doc_config.title}[/cyan]")
        if doc_config.subtitle:
            console.print(f"  Subtitulo: [cyan]{doc_config.subtitle}[/cyan]")
        if doc_config.project:
            console.print(f"  Proyecto: [cyan]{doc_config.project}[/cyan]")
        console.print(f"  Version: [cyan]{doc_config.version}[/cyan]")
        console.print()
        
        # Realizar conversión
        with console.status("[bold green]Convirtiendo documento..."):
            converter = DocumentConverter(
                input_file=input_path,
                output_file=output_path,
                brand_config=brand_config,
                doc_config=doc_config
            )
            
            success = converter.convert()
            
            if not success:
                console.print("[bold red]ERROR durante la conversion[/bold red]")
                sys.exit(1)
        
        console.print("OK - Conversion basica completada")
        
        # Aplicar plantilla corporativa (si no se deshabilitó)
        if not no_template:
            with console.status("[bold green]Aplicando plantilla corporativa..."):
                doc = DocxDocument(str(output_path))
                
                template_engine = TemplateEngine(brand_config, doc_config)
                doc = template_engine.apply_full_template(doc)
                
                doc.save(str(output_path))
            
            console.print("OK - Plantilla corporativa aplicada")
        
        # Mensaje de éxito
        console.print(f"\n[bold green]EXITO - Conversion completada![/bold green]")
        console.print(f"Archivo generado: [bold cyan]{output_path}[/bold cyan]\n")
        
    except Exception as e:
        console.print(f"\n[bold red]ERROR:[/bold red] {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)


@cli.command()
def list_brands():
    """Lista todas las marcas/plantillas disponibles."""
    
    try:
        brand_manager = BrandManager()
        brands = brand_manager.list_available_brands()
        
        console.print("\n[bold blue]Marcas Disponibles[/bold blue]\n")
        
        if not brands:
            console.print("[yellow]ADVERTENCIA: No se encontraron marcas configuradas.[/yellow]")
            console.print("\nUbicación de plantillas:")
            console.print(f"  {brand_manager.templates_dir}")
            return
        
        # Crear tabla
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Marca", style="cyan", no_wrap=True)
        table.add_column("Nombre", style="white")
        table.add_column("Colores", justify="center")
        table.add_column("Fuentes", style="green")
        
        for brand in brands:
            try:
                info = brand_manager.get_brand_info(brand)
                table.add_row(
                    brand,
                    info['name'],
                    str(info['colors']),
                    ", ".join(info['fonts'][:2])  # Primeras 2 fuentes
                )
            except Exception as e:
                table.add_row(brand, "[red]Error al cargar[/red]", "-", "-")
        
        console.print(table)
        console.print()
        
    except Exception as e:
        console.print(f"[bold red]ERROR:[/bold red] {e}")
        sys.exit(1)


@cli.command()
@click.argument('brand')
def show_brand(brand: str):
    """
    Muestra información detallada de una marca específica.
    
    Ejemplo:
    
        md2word show-brand weldtech
    """
    
    try:
        brand_manager = BrandManager()
        
        console.print(f"\n[bold blue]Información de Marca: {brand}[/bold blue]\n")
        
        # Cargar información
        info = brand_manager.get_brand_info(brand)
        brand_config = brand_manager.load_brand(brand)
        
        # Panel de información general
        console.print(Panel(
            f"[bold]{info['name']}[/bold]\n"
            f"[dim]{brand_config.brand.get('tagline', '')}[/dim]",
            title="Información General",
            border_style="blue"
        ))
        
        # Colores  
        console.print("\n[bold]Paleta de Colores:[/bold]")
        
        colors_table = Table(show_header=True, header_style="bold")
        colors_table.add_column("Color", style="cyan")
        colors_table.add_column("Hex", style="white")
        colors_table.add_column("RGB", style="dim")
        
        # Colores primarios
        for color_name, color_hex in brand_config.colors.get('primary', {}).items():
            rgb = brand_config.get_color_rgb(color_name)
            colors_table.add_row(
                color_name.replace('_', ' ').title(),
                color_hex,
                f"RGB{rgb}"
            )
        
        console.print(colors_table)
        
        # Fuentes
        console.print("\n[bold]Tipografía:[/bold]")
        fonts_table = Table(show_header=True, header_style="bold")
        fonts_table.add_column("Uso", style="cyan")
        fonts_table.add_column("Familia", style="white")
        fonts_table.add_column("Pesos", style="dim")
        
        for font_type, font_info in brand_config.fonts.items():
            fonts_table.add_row(
                font_type.title(),
                font_info.get('family', ''),
                str(font_info.get('weights', []))
            )
        
        console.print(fonts_table)
        
        # Assets
        console.print("\n[bold]Assets:[/bold]")
        assets_path = Path(info['assets_path'])
        
        if assets_path.exists():
            console.print(f"  Ubicación: [cyan]{assets_path}[/cyan]")
            
            # Listar archivos
            files = list(assets_path.glob("*"))
            if files:
                console.print("\n  Archivos disponibles:")
                for file in files[:10]:  # Primeros 10
                    size_kb = file.stat().st_size / 1024
                    console.print(f"    - {file.name} [dim]({size_kb:.1f} KB)[/dim]")
            else:
                console.print("  [yellow]ADVERTENCIA: No hay assets en este directorio[/yellow]")
        else:
            console.print(f"  [red]ERROR: Directorio no existe: {assets_path}[/red]")
        
        # Validar assets
        console.print("\n[bold]Validacion de Assets:[/bold]")
        if brand_manager.validate_assets(brand):
            console.print("  [green]OK - Todos los assets requeridos estan disponibles[/green]")
        else:
            console.print("  [yellow]ADVERTENCIA: Algunos assets faltan (ver advertencias arriba)[/yellow]")
        
        console.print()
        
    except FileNotFoundError:
        console.print(f"[bold red]ERROR:[/bold red] Marca '{brand}' no encontrada\n")
        
        # Mostrar marcas disponibles
        brand_manager = BrandManager()
        brands = brand_manager.list_available_brands()
        if brands:
            console.print("Marcas disponibles:")
            for b in brands:
                console.print(f"  • {b}")
        
        sys.exit(1)
    except Exception as e:
        console.print(f"[bold red]ERROR:[/bold red] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


@cli.command()
@click.argument('config_file', type=click.Path(exists=True))
def validate(config_file: str):
    """
    Valida un archivo de configuración YAML.
    
    Ejemplo:
    
        md2word validate mi_config.yaml
    """
    
    try:
        console.print(f"\n[bold blue]Validando configuración:[/bold blue] {config_file}\n")
        
        # Cargar archivo
        with open(config_file, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        console.print("[green]OK - Sintaxis YAML valida[/green]")
        
        # Validar estructura
        required_sections = ['document', 'metadata']
        missing = [s for s in required_sections if s not in config]
        
        if missing:
            console.print(f"\n[red]ERROR - Secciones faltantes:[/red]")
            for section in missing:
                console.print(f"  - {section}")
            sys.exit(1)
        
        console.print("[green]OK - Estructura de configuracion valida[/green]")
        
        # Mostrar secciones encontradas
        console.print("\n[bold]Secciones encontradas:[/bold]")
        for section in config.keys():
            console.print(f"  - {section}")
        
        # Validar campos de documento
        doc_fields = config.get('document', {})
        console.print("\n[bold]Información del documento:[/bold]")
        console.print(f"  Titulo: [cyan]{doc_fields.get('title', '[no definido]')}[/cyan]")
        console.print(f"  Version: [cyan]{doc_fields.get('version', '[no definido]')}[/cyan]")
        
        console.print("\n[bold green]OK - Configuracion valida[/bold green]\n")
        
    except yaml.YAMLError as e:
        console.print(f"\n[bold red]ERROR - Sintaxis YAML:[/bold red]")
        console.print(f"  {e}\n")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[bold red]ERROR:[/bold red] {e}\n")
        sys.exit(1)


@cli.command()
def info():
    """Muestra información sobre el sistema y las rutas configuradas."""
    
    try:
        brand_manager = BrandManager()
        
        console.print("\n[bold blue]Información del Sistema[/bold blue]\n")
        
        info_table = Table(show_header=False, box=None)
        info_table.add_column("Campo", style="cyan", no_wrap=True)
        info_table.add_column("Valor", style="white")
        
        # Información del sistema
        info_table.add_row("Version", "1.0.0")
        info_table.add_row("", "")
        
        # Rutas
        base_dir = Path(__file__).parent.parent
        info_table.add_row("Directorio base", str(base_dir))
        info_table.add_row("Plantillas", str(brand_manager.templates_dir))
        info_table.add_row("Assets", str(brand_manager.assets_dir))
        info_table.add_row("Config", str(base_dir / 'config'))
        info_table.add_row("", "")
        
        # Marcas disponibles
        brands = brand_manager.list_available_brands()
        info_table.add_row("Marcas disponibles", str(len(brands)))
        
        console.print(info_table)
        console.print()
        
    except Exception as e:
        console.print(f"[bold red]ERROR:[/bold red] {e}")
        sys.exit(1)


# Entry point
def main():
    """Entry point principal"""
    try:
        cli()
    except KeyboardInterrupt:
        console.print("\n\n[yellow]Operación cancelada por el usuario[/yellow]\n")
        sys.exit(0)


if __name__ == '__main__':
    main()

