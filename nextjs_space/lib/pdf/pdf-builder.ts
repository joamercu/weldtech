import { jsPDF } from 'jspdf';
import { processMarkdownToHTML, getGuiaIntegralMarkdownPath } from './markdown-processor';
import { pdfStyles, brandColors, typography } from './pdf-styles';
import { JSDOM } from 'jsdom';
import type { User } from 'next-auth';
import * as fs from 'fs';
import * as path from 'path';

export interface PDFGenerationOptions {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
}

/**
 * Constructor de PDF para la Guía de Servicio
 */
export class PDFBuilder {
  private pdf: jsPDF;
  private currentY: number = 0;
  private pageWidth: number = 210; // A4 width in mm
  private pageHeight: number = 297; // A4 height in mm
  private margin: { top: number; right: number; bottom: number; left: number };
  private contentWidth: number;
  private options: PDFGenerationOptions;
  private lineHeight: number = 6; // Altura de línea en mm
  private logoBase64: string | null = null;
  private logoHorizontalBase64: string | null = null;
  private tocEntries: Array<{ title: string; page: number }> = []; // Entradas de tabla de contenidos
  private currentTableHeader: Array<{ text: string; width: number }> | null = null; // Encabezado de tabla actual

  constructor(options: PDFGenerationOptions) {
    this.options = options;
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    
    this.margin = { top: 25, right: 15, bottom: 25, left: 15 }; // Aumentado para logo
    this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;
    this.currentY = this.margin.top;
    
    // Cargar logos
    this.loadLogos();
  }

  /**
   * Carga los logos desde el sistema de archivos
   */
  private loadLogos(): void {
    try {
      // Logo vertical para portada
      const logoVerticalPath = path.join(process.cwd(), 'public', 'logo', 'weldtech-vertical-full-color.png');
      if (fs.existsSync(logoVerticalPath)) {
        const logoBuffer = fs.readFileSync(logoVerticalPath);
        this.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
      
      // Logo horizontal para encabezados
      const logoHorizontalPath = path.join(process.cwd(), 'public', 'logo', 'weldtech-horizontal-full-color.png');
      if (fs.existsSync(logoHorizontalPath)) {
        const logoBuffer = fs.readFileSync(logoHorizontalPath);
        this.logoHorizontalBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (error) {
      console.warn('No se pudieron cargar los logos:', error);
    }
  }

  /**
   * Genera el PDF completo de la Guía de Servicio
   */
  async generate(): Promise<Buffer> {
    try {
      // 1. Portada
      await this.addCoverPage();
      
      // 2. Leer y procesar markdown
      const markdownPath = getGuiaIntegralMarkdownPath();
      const html = await processMarkdownToHTML(markdownPath);
      
      // 3. Agregar contenido principal (con encabezados y pies de página)
      // Esto llenará tocEntries con los números de página correctos
      await this.addMainContent(html);
      
      // 4. Ahora generar tabla de contenidos con números de página actualizados
      // Guardar posición actual
      const currentPage = this.pdf.getCurrentPageInfo().pageNumber;
      const currentY = this.currentY;
      
      // Ir a la página 2 (después de la portada) para generar la TOC
      // Como jsPDF no permite insertar páginas fácilmente, generaremos la TOC
      // en una nueva página y luego reorganizaremos si es necesario
      // Por ahora, generaremos la TOC al final con los números correctos
      this.addPageWithHeader();
      this.currentY = this.margin.top;
      this.addTableOfContents();
      
      // 5. Agregar metadata
      this.addMetadata();
      
      // 6. Convertir a Buffer
      const pdfBlob = this.pdf.output('arraybuffer');
      return Buffer.from(pdfBlob);
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error(`Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Agrega la portada del PDF
   */
  private async addCoverPage(): Promise<void> {
    // Fondo con gradiente (simulado con rectángulos)
    this.pdf.setFillColor(15, 18, 22); // Dark Steel
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
    
    // Logo vertical (centrado)
    if (this.logoBase64) {
      try {
        const logoWidth = 60; // mm
        const logoHeight = 90; // mm (manteniendo proporción 2:3)
        const logoX = (this.pageWidth - logoWidth) / 2;
        const logoY = 40;
        
        this.pdf.addImage(this.logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Error agregando logo en portada:', error);
        // Fallback a texto si el logo falla
        this.pdf.setFillColor(255, 122, 0); // Orange
        this.pdf.rect(this.pageWidth / 2 - 40, 50, 80, 30, 'F');
        this.pdf.setTextColor(255, 255, 255);
        this.pdf.setFontSize(20);
        this.pdf.text('WELDTECH', this.pageWidth / 2, 65, { align: 'center' });
        this.pdf.text('SOLUTIONS', this.pageWidth / 2, 75, { align: 'center' });
      }
    } else {
      // Fallback si no hay logo
    this.pdf.setFillColor(255, 122, 0); // Orange
    this.pdf.rect(this.pageWidth / 2 - 40, 50, 80, 30, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.pdf.text('WELDTECH', this.pageWidth / 2, 65, { align: 'center' });
    this.pdf.text('SOLUTIONS', this.pageWidth / 2, 75, { align: 'center' });
    }
    
    // Título principal
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Guía Integral de Servicios', this.pageWidth / 2, 150, { align: 'center' });
    
    // Subtítulo
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(200, 200, 200);
    this.pdf.text('WeldTech Solutions', this.pageWidth / 2, 165, { align: 'center' });
    
    // Información del usuario
    if (this.options.userName || this.options.userEmail) {
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.text('Generado para:', this.pageWidth / 2, 180, { align: 'center' });
      if (this.options.userName) {
        this.pdf.text(this.options.userName, this.pageWidth / 2, 190, { align: 'center' });
      }
      if (this.options.userEmail) {
        this.pdf.setFontSize(10);
        this.pdf.text(this.options.userEmail, this.pageWidth / 2, 200, { align: 'center' });
      }
    }
    
    // Fecha de generación
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(150, 150, 150);
    this.pdf.text(`Generado: ${fecha}`, this.pageWidth / 2, 260, { align: 'center' });
    
    // Versión
    this.pdf.text('Versión 1.0 | Noviembre 2025', this.pageWidth / 2, 275, { align: 'center' });
    
    // Código QR (esquina inferior derecha)
    // TODO: Implementar generación de QR cuando esté disponible
    
    // Línea decorativa
    this.pdf.setDrawColor(255, 122, 0); // Orange
    this.pdf.setLineWidth(2);
    this.pdf.line(this.margin.left, 280, this.pageWidth - this.margin.right, 280);
    
    // Nueva página para contenido
    this.addPageWithHeader();
  }

  /**
   * Agrega tabla de contenidos con referencias de página actualizadas
   */
  private addTableOfContents(): void {
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFillColor(255, 122, 0); // Orange
    this.pdf.rect(this.margin.left, this.currentY, this.contentWidth, 10, 'F');
    this.pdf.text('Tabla de Contenidos', this.margin.left + 5, this.currentY + 7);
    this.currentY += 15;
    
    // Lista de secciones con referencias de página
    const sections = [
      '1. Introducción',
      '2. Quiénes Somos',
      '3. Portafolio de Servicios',
      '4. Lista de Verificación de Diagnóstico',
      '5. Plan de Calidad Personalizado',
      '6. Metodología de Trabajo',
      '7. Casos de Éxito',
      '8. Proceso de Onboarding',
      '9. Contacto y Soporte',
    ];
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
    sections.forEach((section, index) => {
      if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
        this.addPageWithHeader();
      }
      
      // Buscar la página correspondiente en las entradas de TOC
      const tocEntry = this.tocEntries.find(entry => entry.title === section);
      const pageNumber = tocEntry ? tocEntry.page : '...';
      
      this.pdf.text(section, this.margin.left, this.currentY);
      this.pdf.text(String(pageNumber), this.pageWidth - this.margin.right - 10, this.currentY, {
        align: 'right',
      });
      this.currentY += 8;
    });
    
    this.currentY += 10;
  }

  /**
   * Verifica si necesitamos una nueva página y la agrega si es necesario
   * Implementa saltos de página estratégicos para evitar cortar contenido importante
   */
  private checkPageBreak(requiredHeight: number = 0, isHeading: boolean = false): void {
    const availableHeight = this.pageHeight - this.currentY - this.margin.bottom;
    
    // Para títulos, asegurar al menos 2 líneas de contenido después
    const minHeightForHeading = isHeading ? requiredHeight + (this.lineHeight * 2) : requiredHeight;
    
    // Si no hay suficiente espacio, agregar nueva página
    if (availableHeight < minHeightForHeading || this.currentY > this.pageHeight - this.margin.bottom - 10) {
      this.addPageWithHeader();
    }
  }

  /**
   * Agrega una nueva página con encabezado y pie de página
   */
  private addPageWithHeader(): void {
    this.pdf.addPage();
    this.currentY = this.margin.top;
    this.addHeader();
    this.addFooter();
  }

  /**
   * Agrega encabezado con logo en todas las páginas (excepto portada)
   */
  private addHeader(): void {
    const pageNumber = this.pdf.getCurrentPageInfo().pageNumber;
    
    // No agregar encabezado en la portada (página 1)
    if (pageNumber === 1) return;
    
    // Logo horizontal pequeño en la esquina superior izquierda
    if (this.logoHorizontalBase64) {
      try {
        const logoWidth = 40; // mm
        const logoHeight = 13.3; // mm (manteniendo proporción 3:1)
        this.pdf.addImage(this.logoHorizontalBase64, 'PNG', this.margin.left, 5, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Error agregando logo en encabezado:', error);
      }
    }
    
    // Línea decorativa debajo del logo
    this.pdf.setDrawColor(255, 122, 0); // Orange
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin.left, 20, this.pageWidth - this.margin.right, 20);
  }

  /**
   * Agrega pie de página con información en todas las páginas
   */
  private addFooter(): void {
    const pageNumber = this.pdf.getCurrentPageInfo().pageNumber;
    const totalPages = this.pdf.getNumberOfPages();
    
    // No agregar pie de página en la portada
    if (pageNumber === 1) return;
    
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    
    // Texto izquierdo: nombre de la guía
    this.pdf.text('Guía Integral de Servicios - WeldTech Solutions', this.margin.left, this.pageHeight - 10, {
      align: 'left',
    });
    
    // Texto derecho: número de página
    this.pdf.text(`Página ${pageNumber} de ${totalPages}`, this.pageWidth - this.margin.right, this.pageHeight - 10, {
      align: 'right',
    });
    
    // Línea decorativa arriba del pie de página
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin.left, this.pageHeight - 15, this.pageWidth - this.margin.right, this.pageHeight - 15);
  }

  /**
   * Agrega el contenido principal del PDF
   */
  private async addMainContent(html: string): Promise<void> {
    // Parsear HTML con jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const body = document.body;
    
    // Procesar todos los nodos hijos del body recursivamente
    const childNodes = Array.from(body.childNodes);
    for (const node of childNodes) {
      await this.processNode(node as any);
    }
  }

  /**
   * Procesa un nodo del DOM recursivamente
   */
  private async processNode(node: Node): Promise<void> {
    if (node.nodeType === 3) {
      // Nodo de texto
      const text = node.textContent?.trim();
      if (text) {
        await this.addText(text);
      }
    } else if (node.nodeType === 1) {
      // Nodo de elemento
      const element = node as Element;
      await this.processElement(element);
    }
  }

  /**
   * Procesa un elemento HTML y lo agrega al PDF
   */
  private async processElement(element: Element): Promise<void> {
    const tagName = element.tagName.toLowerCase();
    
    // Verificar si necesitamos nueva página (con encabezado y pie de página)
    this.checkPageBreak(20);
    
    switch (tagName) {
      case 'h1':
        await this.addHeading(element, 24, 'bold', true); // true = es nivel 1, requiere nueva página
        break;
      case 'h2':
        await this.addHeading(element, 20, 'bold', false, true); // true = es nivel 2, requiere nueva página si no hay espacio
        break;
      case 'h3':
        await this.addHeading(element, 16, 'bold');
        break;
      case 'h4':
        await this.addHeading(element, 14, 'bold');
        break;
      case 'h5':
      case 'h6':
        await this.addHeading(element, 12, 'bold');
        break;
      case 'p':
        await this.addParagraph(element);
        break;
      case 'ul':
      case 'ol':
        await this.addList(element, tagName === 'ol');
        break;
      case 'table':
        await this.addTable(element);
        break;
      case 'blockquote':
        await this.addBlockquote(element);
        break;
      case 'pre':
      case 'code':
        await this.addCode(element);
        break;
      case 'hr':
        this.addHorizontalRule();
        break;
      case 'strong':
      case 'b':
        // Texto en negrita - procesar hijos y aplicar formato
        await this.addFormattedText(element, 'bold');
        break;
      case 'em':
      case 'i':
        // Texto en cursiva - procesar hijos y aplicar formato
        await this.addFormattedText(element, 'italic');
        break;
      case 'a':
        // Enlaces - extraer texto (sin URL por ahora)
        const linkText = this.extractTextFromElement(element);
        if (linkText) {
          await this.addText(linkText);
        }
        break;
      case 'br':
        // Salto de línea
        this.currentY += this.lineHeight;
        break;
      case 'div':
      case 'span':
      case 'section':
      case 'article':
      case 'main':
      case 'header':
      case 'footer':
      case 'aside':
        // Procesar elementos hijos recursivamente
        const children = Array.from(element.childNodes);
        for (const child of children) {
          await this.processNode(child);
        }
        break;
      default:
        // Para otros elementos, procesar hijos recursivamente
        const defaultChildren = Array.from(element.childNodes);
        if (defaultChildren.length > 0) {
          for (const child of defaultChildren) {
            await this.processNode(child);
          }
        } else {
          // Si no tiene hijos, extraer texto
          const text = this.extractTextFromElement(element);
          if (text) {
            await this.addText(text);
          }
        }
        break;
    }
  }

  /**
   * Agrega texto con formato (negrita o cursiva)
   */
  private async addFormattedText(element: Element, style: 'bold' | 'italic'): Promise<void> {
    const text = this.extractTextFromElement(element);
    if (!text) return;
    
    this.checkPageBreak(20);
    
    this.pdf.setFontSize(typography.body.size);
    this.pdf.setFont('helvetica', style);
    this.pdf.setTextColor(0, 0, 0);
    
    // Usar división mejorada que respeta palabras completas
    const lines = this.splitTextToLines(text, this.contentWidth);
    
    lines.forEach((line: string, index: number) => {
      if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
        this.addPageWithHeader();
      }
      
      const lineAlign = index < lines.length - 1 ? 'justify' : 'left';
      this.pdf.text(line, this.margin.left, this.currentY, {
        align: lineAlign,
        maxWidth: this.contentWidth,
      });
      this.currentY += this.lineHeight;
    });
    
    // Restaurar fuente normal
    this.pdf.setFont('helvetica', 'normal');
  }

  /**
   * Agrega un título al PDF con saltos de página estratégicos
   * @param element Elemento HTML del encabezado
   * @param fontSize Tamaño de fuente
   * @param style Estilo (bold/normal)
   * @param isLevel1 Si es true, siempre inicia en nueva página
   * @param isLevel2 Si es true, inicia en nueva página si no hay suficiente espacio
   */
  private async addHeading(
    element: Element, 
    fontSize: number, 
    style: 'bold' | 'normal',
    isLevel1: boolean = false,
    isLevel2: boolean = false
  ): Promise<void> {
    const text = this.extractTextFromElement(element);
    if (!text) return;
    
    // Calcular altura estimada del encabezado
    this.pdf.setFontSize(fontSize);
    const textLines = this.pdf.splitTextToSize(text, this.contentWidth - 10);
    const estimatedHeight = (textLines.length * (this.lineHeight + 2)) + 20;
    
    // Para h1: siempre iniciar en nueva página si no hay suficiente espacio
    if (isLevel1) {
      const availableHeight = this.pageHeight - this.currentY - this.margin.bottom;
      const pageContentHeight = this.pageHeight - this.margin.top - this.margin.bottom;
      
      // Si no hay suficiente espacio (menos de 70% de la página disponible), nueva página
      // Esto asegura que h1 siempre tenga espacio suficiente para su contenido
      if (availableHeight < pageContentHeight * 0.7 || this.currentY > this.margin.top + 50) {
        this.addPageWithHeader();
      }
      
      // Agregar espacio antes del h1 para mejor presentación
      if (this.currentY > this.margin.top + 10) {
        this.currentY += 10;
      }
      
      // Registrar en TOC para h1
      const pageNumber = this.pdf.getCurrentPageInfo().pageNumber;
      const tocTitle = textLines[0].trim();
      
      // Lista de secciones para mapear
      const sections = [
        '1. Introducción',
        '2. Quiénes Somos',
        '3. Portafolio de Servicios',
        '4. Lista de Verificación de Diagnóstico',
        '5. Plan de Calidad Personalizado',
        '6. Metodología de Trabajo',
        '7. Casos de Éxito',
        '8. Proceso de Onboarding',
        '9. Contacto y Soporte',
      ];
      
      // Buscar sección correspondiente
      const matchingSection = sections.find(section => {
        const sectionText = section.substring(3).toLowerCase().trim();
        const titleLower = tocTitle.toLowerCase();
        return titleLower.includes(sectionText) || 
               sectionText.includes(titleLower.substring(0, Math.min(15, titleLower.length))) ||
               section.toLowerCase().includes(titleLower.substring(0, 10));
      });
      
      if (matchingSection) {
        // Buscar si ya existe una entrada
        const existingIndex = this.tocEntries.findIndex(entry => entry.title === matchingSection);
        if (existingIndex >= 0) {
          this.tocEntries[existingIndex].page = pageNumber;
        } else {
          this.tocEntries.push({ title: matchingSection, page: pageNumber });
        }
      }
    }
    // Para h2: iniciar en nueva página si no hay suficiente espacio
    else if (isLevel2) {
      const availableHeight = this.pageHeight - this.currentY - this.margin.bottom;
      const pageContentHeight = this.pageHeight - this.margin.top - this.margin.bottom;
      
      // Si no hay suficiente espacio (menos de 50% de la página disponible), nueva página
      // Esto asegura que h2 tenga espacio suficiente para su contenido y al menos 2-3 párrafos
      if (availableHeight < pageContentHeight * 0.5 || this.currentY > this.margin.top + 200) {
        this.addPageWithHeader();
      }
      
      // Agregar espacio antes del h2 para mejor presentación
      if (this.currentY > this.margin.top + 5) {
        this.currentY += 8;
      }
    }
    // Para otros niveles: verificar espacio normal
    else {
      this.checkPageBreak(estimatedHeight, true);
      if (this.currentY > this.margin.top + 5) {
        this.currentY += 6;
      }
    }
    
    // Verificar nuevamente después de agregar espacios
    this.checkPageBreak(estimatedHeight, true);
    
    // Header de sección con fondo naranja
    this.pdf.setFillColor(brandColors.weldOrange.r, brandColors.weldOrange.g, brandColors.weldOrange.b);
    const headerHeight = isLevel1 ? 10 : 8; // h1 más alto
    this.pdf.rect(this.margin.left, this.currentY, this.contentWidth, headerHeight, 'F');
    
    // Texto del título
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', style);
    this.pdf.setTextColor(255, 255, 255);
    
    // Renderizar primera línea en el header
    this.pdf.text(textLines[0], this.margin.left + 5, this.currentY + (isLevel1 ? 7 : 6));
    this.currentY += headerHeight + 5;
    
    // Si hay más líneas, agregarlas con verificación de página
    if (textLines.length > 1) {
      for (let i = 1; i < textLines.length; i++) {
        if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
          this.addPageWithHeader();
        }
        this.pdf.setFontSize(fontSize);
        this.pdf.setFont('helvetica', style);
        this.pdf.setTextColor(0, 0, 0); // Texto negro para líneas adicionales
        this.pdf.text(textLines[i], this.margin.left, this.currentY);
        this.currentY += this.lineHeight + 2;
      }
    }
    
    // Espacio adicional después de h1 y h2
    if (isLevel1) {
      this.currentY += 8;
    } else if (isLevel2) {
      this.currentY += 6;
    } else {
      this.currentY += 4;
    }
  }

  /**
   * Limpia y normaliza el texto extraído de elementos HTML
   */
  private cleanText(text: string): string {
    if (!text) return '';
    
    // Normalizar espacios en blanco y eliminar caracteres problemáticos
    let cleaned = text
      // Eliminar emojis y símbolos especiales problemáticos
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis generales
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticones
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transporte y mapas
      .replace(/[\u{2600}-\u{26FF}]/gu, '') // Símbolos varios
      .replace(/[\u{2700}-\u{27BF}]/gu, '') // Símbolos decorativos
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Emojis suplementarios
      .replace(/[\u{1FA00}-\u{1FAFF}]/gu, '') // Emojis extendidos
      // Eliminar caracteres de dibujo ASCII (box-drawing characters)
      .replace(/[\u2500-\u257F]/g, '') // Box drawing characters (─, │, ┌, ┐, └, ┘, ├, ┤, ┬, ┴, ┼)
      .replace(/[\u2580-\u259F]/g, '') // Block elements
      // Eliminar caracteres zero-width y separadores
      .replace(/\u200B/g, '') // Eliminar zero-width space
      .replace(/\u200C/g, '') // Eliminar zero-width non-joiner
      .replace(/\u200D/g, '') // Eliminar zero-width joiner
      .replace(/\uFEFF/g, '') // Eliminar zero-width no-break space
      .replace(/\u2028/g, ' ') // Reemplazar line separator con espacio
      .replace(/\u2029/g, ' ') // Reemplazar paragraph separator con espacio
      // Eliminar caracteres de control y caracteres problemáticos
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Eliminar caracteres de control
      // Eliminar caracteres problemáticos pero mantener Unicode válido (español, acentos, etc.)
      .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '') // Mantener ASCII, Latin Extended, y Latin Extended Additional
      // Normalizar espacios y eliminar líneas vacías múltiples
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Reducir múltiples líneas vacías a dos
      .replace(/\s+/g, ' ') // Normalizar múltiples espacios a uno solo
      .trim();
    
    return cleaned;
  }

  /**
   * Extrae texto de un elemento HTML procesando elementos inline correctamente
   */
  private extractTextFromElement(element: Element): string {
    let text = '';
    
    // Procesar nodos recursivamente
    const processNode = (node: Node) => {
      if (node.nodeType === 3) {
        // Nodo de texto
        const nodeText = node.textContent || '';
        // Limpiar caracteres problemáticos inmediatamente
        const cleanedNodeText = nodeText
          .replace(/[\u2500-\u257F]/g, '') // Eliminar box drawing characters
          .replace(/[\u2580-\u259F]/g, '') // Eliminar block elements
          .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Eliminar emojis
          .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Eliminar emoticones
          .replace(/[\u{2600}-\u{26FF}]/gu, '') // Eliminar símbolos varios
          .replace(/[\u{2700}-\u{27BF}]/gu, ''); // Eliminar símbolos decorativos
        text += cleanedNodeText;
      } else if (node.nodeType === 1) {
        // Nodo de elemento
        const elem = node as Element;
        const tagName = elem.tagName.toLowerCase();
        
        // Agregar espacio antes de ciertos elementos
        if (['p', 'div', 'li', 'br'].includes(tagName) && text && !text.endsWith(' ')) {
          text += ' ';
        }
        
        // Procesar hijos
        Array.from(elem.childNodes).forEach(processNode);
        
        // Agregar espacio después de ciertos elementos
        if (['strong', 'em', 'b', 'i', 'span'].includes(tagName) && text && !text.endsWith(' ')) {
          text += ' ';
        }
      }
    };
    
    Array.from(element.childNodes).forEach(processNode);
    
    return this.cleanText(text);
  }

  /**
   * Agrega un párrafo al PDF
   */
  private async addParagraph(element: Element): Promise<void> {
    const text = this.extractTextFromElement(element);
    if (!text) return;
    
    await this.addText(text);
  }

  /**
   * Divide texto en líneas respetando palabras completas
   * Usa la fuente y tamaño actuales del PDF
   */
  private splitTextToLines(text: string, maxWidth: number): string[] {
    if (!text || text.trim() === '') {
      return [];
    }
    
    // Guardar configuración actual de fuente
    const currentFontSize = this.pdf.getFontSize();
    const currentFont = this.pdf.getFont();
    
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) {
      return [text];
    }
    
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.pdf.getTextWidth(testLine);
      
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        // Si una palabra es muy larga, dividirla forzosamente
        const wordWidth = this.pdf.getTextWidth(word);
        if (wordWidth > maxWidth) {
          const wordLines = this.pdf.splitTextToSize(word, maxWidth);
          lines.push(...wordLines.slice(0, -1));
          currentLine = wordLines[wordLines.length - 1] || word;
        } else {
          currentLine = word;
        }
      }
      
      // Si es la última palabra, agregar la línea actual
      if (index === words.length - 1 && currentLine) {
        lines.push(currentLine);
      }
    });
    
    // Restaurar configuración de fuente (aunque no debería haber cambiado)
    this.pdf.setFontSize(currentFontSize);
    this.pdf.setFont(currentFont.fontName, currentFont.fontStyle);
    
    return lines.length > 0 ? lines : [text];
  }

  /**
   * Agrega texto al PDF con alineación justificada
   */
  private async addText(text: string, align: 'left' | 'center' | 'right' | 'justify' = 'justify'): Promise<void> {
    if (!text) return;
    
    // Verificar si necesitamos nueva página
    this.checkPageBreak(20);
    
    this.pdf.setFontSize(typography.body.size);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
    // Usar división mejorada que respeta palabras completas
    const lines = this.splitTextToLines(text, this.contentWidth);
    
    lines.forEach((line: string, index: number) => {
      if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
        this.addPageWithHeader();
      }
      
      // Usar alineación justificada para todas las líneas excepto la última
      // La última línea se alinea a la izquierda para evitar espacios excesivos
      const lineAlign = (align === 'justify' && index < lines.length - 1) ? 'justify' : 'left';
      
      this.pdf.text(line, this.margin.left, this.currentY, {
        align: lineAlign,
        maxWidth: this.contentWidth,
      });
      this.currentY += this.lineHeight;
    });
    
    this.currentY += 3; // Espacio después del párrafo
  }

  /**
   * Agrega una lista al PDF
   */
  private async addList(element: Element, ordered: boolean): Promise<void> {
    const items = element.querySelectorAll('li');
    
    items.forEach((item, index) => {
      if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
        this.addPageWithHeader();
      }
      
      const text = this.extractTextFromElement(item);
      if (!text) return;
      
      this.pdf.setFontSize(typography.body.size);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
      // Bullet o número
      const prefix = ordered ? `${index + 1}. ` : '• ';
      const bulletWidth = this.pdf.getTextWidth(prefix);
      const textWidth = this.contentWidth - bulletWidth - 5;
      
      // Usar división mejorada que respeta palabras completas
      const lines = this.splitTextToLines(text, textWidth);
      
      lines.forEach((line: string, lineIndex: number) => {
        if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
          this.addPageWithHeader();
        }
        
        if (lineIndex === 0) {
          // Primera línea con bullet/número
          this.pdf.text(prefix, this.margin.left, this.currentY);
          this.pdf.text(line, this.margin.left + bulletWidth + 2, this.currentY, {
            align: 'left',
            maxWidth: textWidth,
          });
        } else {
          // Líneas siguientes con indentación
          this.pdf.text(line, this.margin.left + bulletWidth + 2, this.currentY, {
            align: 'left',
            maxWidth: textWidth,
          });
        }
        this.currentY += this.lineHeight;
      });
      
      this.currentY += 2; // Espacio entre items
    });
    
    this.currentY += 3; // Espacio después de la lista
  }

  /**
   * Agrega una tabla al PDF con mejor ajuste de texto y espaciado
   */
  private async addTable(element: Element): Promise<void> {
    const rows = element.querySelectorAll('tr');
    if (rows.length === 0) return;
    
    // Calcular altura estimada de la tabla
    const estimatedTableHeight = rows.length * 9 + 20; // 9mm por fila + padding
    
    // Verificar si necesitamos nueva página (con margen estratégico para tablas)
    this.checkPageBreak(estimatedTableHeight);
    
    // Espaciado mejorado
    const cellPadding = 5; // Padding horizontal aumentado
    const cellPaddingVertical = 3; // Padding vertical
    const baseRowHeight = 9; // Altura base aumentada
    const rowSpacing = 0.5; // Espaciado entre filas
    const numCols = rows[0].querySelectorAll('th, td').length;
    const colWidth = this.contentWidth / numCols;
    
    // Primero, calcular la altura necesaria para cada fila
    const rowHeights: number[] = [];
    rows.forEach((row) => {
      const cells = row.querySelectorAll('th, td');
      let maxLines = 1;
      
      cells.forEach((cell) => {
        const text = this.extractTextFromElement(cell);
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', 'normal');
        const lines = this.splitTextToLines(text, colWidth - cellPadding * 2);
        maxLines = Math.max(maxLines, lines.length);
      });
      
      // Altura mínima de 9mm, más 5mm por cada línea adicional
      // Incluir padding vertical en el cálculo
      const textHeight = maxLines * this.lineHeight;
      const rowHeight = Math.max(
        baseRowHeight, 
        textHeight + (cellPaddingVertical * 2) + 2
      );
      rowHeights.push(rowHeight);
    });
    
    // Guardar encabezado de tabla si existe (primera fila con th)
    const firstRow = rows[0];
    const firstRowCells = firstRow?.querySelectorAll('th, td');
    const firstRowIsHeader = firstRowCells?.[0]?.tagName.toLowerCase() === 'th';
    
    if (firstRowIsHeader && firstRowCells) {
      this.currentTableHeader = Array.from(firstRowCells).map(cell => ({
        text: this.extractTextFromElement(cell),
        width: colWidth,
      }));
    } else {
      this.currentTableHeader = null;
    }
    
    // Variable para rastrear si el encabezado ya fue renderizado en una nueva página
    let headerRenderedOnNewPage = false;
    
    // Ahora renderizar las filas con las alturas calculadas
    rows.forEach((row, rowIndex) => {
      const rowHeight = rowHeights[rowIndex];
      const cells = row.querySelectorAll('th, td');
      const isHeader = cells[0]?.tagName.toLowerCase() === 'th';
      
      // Verificar si necesitamos nueva página
      if (this.currentY > this.pageHeight - this.margin.bottom - rowHeight) {
        this.addPageWithHeader();
        
        // Si hay encabezado de tabla guardado, repetirlo en la nueva página
        // Esto aplica tanto para rowIndex === 0 (primera fila) como para rowIndex > 0
        if (this.currentTableHeader) {
          const headerRowHeight = rowHeights[0] || baseRowHeight;
          
          // Dibujar fondo del encabezado
          let xPos = this.margin.left;
          this.currentTableHeader.forEach((headerCell, colIndex) => {
            this.pdf.setFillColor(42, 161, 255); // Precision Blue
            this.pdf.rect(xPos, this.currentY, headerCell.width, headerRowHeight, 'F');
            
            // Borde
            this.pdf.setDrawColor(210, 210, 210);
            this.pdf.setLineWidth(0.3);
            this.pdf.rect(xPos, this.currentY, headerCell.width, headerRowHeight);
            
            xPos += headerCell.width;
          });
          
          // Renderizar texto del encabezado
          xPos = this.margin.left;
          this.currentTableHeader.forEach((headerCell, colIndex) => {
            this.pdf.setFontSize(8);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.setTextColor(255, 255, 255);
            
            const lines = this.splitTextToLines(headerCell.text, headerCell.width - cellPadding * 2);
            const totalTextHeight = lines.length * this.lineHeight;
            const cellTop = this.currentY;
            const cellBottom = cellTop + headerRowHeight;
            const cellCenterY = cellTop + (headerRowHeight / 2);
            const textCenterY = cellCenterY - (totalTextHeight / 2);
            const minY = cellTop + cellPaddingVertical;
            const maxY = cellBottom - cellPaddingVertical - totalTextHeight;
            const startY = Math.max(minY, Math.min(textCenterY, maxY));
            
            lines.forEach((line: string, lineIndex: number) => {
              const yPos = startY + (lineIndex * this.lineHeight);
              if (yPos + this.lineHeight <= cellBottom - cellPaddingVertical) {
                this.pdf.text(line, xPos + (headerCell.width / 2), yPos, {
                  align: 'center',
                  maxWidth: headerCell.width - cellPadding * 2,
                });
              }
            });
            
            xPos += headerCell.width;
          });
          
          this.currentY += headerRowHeight + rowSpacing;
          headerRenderedOnNewPage = true;
        }
      }
      
      // Si es la primera fila (encabezado) y ya la renderizamos arriba en nueva página, saltarla
      if (isHeader && rowIndex === 0 && headerRenderedOnNewPage) {
        // Ya fue renderizada arriba, saltar esta iteración
        headerRenderedOnNewPage = false; // Resetear para la siguiente tabla
        return;
      }
      
      // Resetear flag si no es header
      if (!isHeader) {
        headerRenderedOnNewPage = false;
      }
      
      // Dibujar fondos y bordes primero
      let xPos = this.margin.left;
      cells.forEach((cell, colIndex) => {
        // Fondo para header con mejor contraste
        if (isHeader) {
          // Header con color más claro para mejor contraste
          this.pdf.setFillColor(42, 161, 255); // Precision Blue más claro
          this.pdf.rect(xPos, this.currentY, colWidth, rowHeight, 'F');
        } else if (rowIndex % 2 === 1) {
          // Filas alternadas con fondo muy claro para buen contraste
          this.pdf.setFillColor(252, 252, 252);
          this.pdf.rect(xPos, this.currentY, colWidth, rowHeight, 'F');
        } else {
          // Filas pares con fondo blanco puro
          this.pdf.setFillColor(255, 255, 255);
          this.pdf.rect(xPos, this.currentY, colWidth, rowHeight, 'F');
        }
        
        // Borde más visible para mejor definición
        this.pdf.setDrawColor(210, 210, 210);
        this.pdf.setLineWidth(0.3);
        this.pdf.rect(xPos, this.currentY, colWidth, rowHeight);
        
        xPos += colWidth;
      });
      
      // Ahora agregar el texto con centrado vertical mejorado
      xPos = this.margin.left;
      cells.forEach((cell, colIndex) => {
        const text = this.extractTextFromElement(cell);
        
        // Configurar fuente con mejor contraste
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', isHeader ? 'bold' : 'normal');
        
        // Asegurar buen contraste: texto blanco en header, texto oscuro en celdas
        if (isHeader) {
          this.pdf.setTextColor(255, 255, 255); // Blanco en header
        } else {
          this.pdf.setTextColor(30, 30, 30); // Texto oscuro para mejor legibilidad
        }
        
        // Dividir texto en líneas respetando palabras completas
        const lines = this.splitTextToLines(text, colWidth - cellPadding * 2);
        
        // Calcular posición vertical centrada de forma precisa
        const cellTop = this.currentY;
        const cellBottom = cellTop + rowHeight;
        const totalTextHeight = lines.length * this.lineHeight;
        
        // Centrar verticalmente: calcular el punto medio de la celda
        const cellCenterY = cellTop + (rowHeight / 2);
        const textCenterY = cellCenterY - (totalTextHeight / 2);
        
        // Asegurar que el texto no se salga de los límites de la celda
        const minY = cellTop + cellPaddingVertical;
        const maxY = cellBottom - cellPaddingVertical - totalTextHeight;
        const startY = Math.max(minY, Math.min(textCenterY, maxY));
        
        // Renderizar cada línea con centrado vertical
        lines.forEach((line: string, lineIndex: number) => {
          const yPos = startY + (lineIndex * this.lineHeight);
          
          // Verificar que la línea esté dentro de la celda
          if (yPos + this.lineHeight <= cellBottom - cellPaddingVertical) {
            // Usar alineación centrada horizontalmente
            this.pdf.text(line, xPos + (colWidth / 2), yPos, {
              align: 'center',
              maxWidth: colWidth - cellPadding * 2,
            });
          }
        });
        
        xPos += colWidth;
      });
      
      this.currentY += rowHeight + rowSpacing;
    });
    
    this.currentY += 8; // Espacio después de la tabla aumentado
  }

  /**
   * Agrega un blockquote (recuadro destacado) al PDF
   */
  private async addBlockquote(element: Element): Promise<void> {
    const text = this.extractTextFromElement(element);
    if (!text) return;
    
    if (this.currentY > this.pageHeight - this.margin.bottom - 20) {
      this.addPageWithHeader();
    }
    
    // Fondo destacado
    this.pdf.setFillColor(255, 122, 0, 0.1);
    this.pdf.setDrawColor(brandColors.weldOrange.r, brandColors.weldOrange.g, brandColors.weldOrange.b);
    this.pdf.setLineWidth(1);
    
    const padding = 5;
    const estimatedHeight = Math.ceil(text.length / 50) * this.lineHeight + padding * 2;
    
    this.pdf.rect(this.margin.left, this.currentY, this.contentWidth, estimatedHeight, 'FD');
    
    // Texto
    this.pdf.setFontSize(typography.body.size);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(0, 0, 0);
    
    // Usar división mejorada que respeta palabras completas
    const lines = this.splitTextToLines(text, this.contentWidth - padding * 2);
    lines.forEach((line: string, index: number) => {
      // Usar alineación justificada para blockquotes
      const lineAlign = index < lines.length - 1 ? 'justify' : 'left';
      this.pdf.text(line, this.margin.left + padding, this.currentY + 5, {
        align: lineAlign,
        maxWidth: this.contentWidth - padding * 2,
      });
      this.currentY += this.lineHeight;
    });
    
    this.currentY += padding + 5; // Espacio después del blockquote
  }

  /**
   * Agrega código al PDF con manejo mejorado de desbordamiento
   */
  private async addCode(element: Element): Promise<void> {
    let text = element.textContent || '';
    if (!text) return;
    
    // Limpiar texto de código: eliminar caracteres de dibujo ASCII y emojis
    text = text
      .replace(/[\u2500-\u257F]/g, '') // Eliminar box drawing characters (─, │, ┌, ┐, └, ┘, ├, ┤, ┬, ┴, ┼)
      .replace(/[\u2580-\u259F]/g, '') // Eliminar block elements
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Eliminar emojis
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Eliminar emoticones
      .replace(/[\u{2600}-\u{26FF}]/gu, '') // Eliminar símbolos varios
      .replace(/[\u{2700}-\u{27BF}]/gu, '') // Eliminar símbolos decorativos
      .replace(/\u200B/g, '') // Eliminar zero-width space
      .replace(/\u200C/g, '') // Eliminar zero-width non-joiner
      .replace(/\u200D/g, '') // Eliminar zero-width joiner
      .replace(/\uFEFF/g, '') // Eliminar zero-width no-break space
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Eliminar caracteres de control
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Reducir múltiples líneas vacías
      .replace(/^\s*│\s*/gm, '') // Eliminar caracteres │ al inicio de línea
      .replace(/\s*│\s*$/gm, '') // Eliminar caracteres │ al final de línea
      .trim();
    
    if (!text) return;
    
    // Verificar espacio disponible antes de agregar el bloque
    this.checkPageBreak(30);
    
    // Configuración de fuente para código
    const fontSize = 8; // Tamaño de fuente más pequeño para mejor ajuste
    const padding = 4; // Padding aumentado para mejor legibilidad
    const maxLineWidth = this.contentWidth - (padding * 2); // Ancho máximo disponible
    
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('courier', 'normal');
    
    // Dividir texto en líneas originales (preservar estructura)
    const originalLines = text.split('\n');
    
    // Procesar cada línea: limpiar y dividir si es necesario
    const processedLines: string[] = [];
    
    originalLines.forEach((originalLine: string) => {
      // Limpiar línea de caracteres problemáticos
      let cleanLine = originalLine
        .replace(/[\u2500-\u257F]/g, '') // Eliminar box drawing characters
        .replace(/[\u2580-\u259F]/g, '') // Eliminar block elements
        .trim();
      
      // Si la línea está vacía después de limpiar, agregar línea vacía
      if (!cleanLine) {
        processedLines.push('');
        return;
      }
      
      // Verificar si la línea cabe en el ancho disponible
      this.pdf.setFontSize(fontSize);
      this.pdf.setFont('courier', 'normal');
      const lineWidth = this.pdf.getTextWidth(cleanLine);
      
      if (lineWidth <= maxLineWidth) {
        // La línea cabe, agregarla tal cual
        processedLines.push(cleanLine);
      } else {
        // La línea es muy larga, dividirla respetando palabras
        const words = cleanLine.split(/\s+/);
        let currentLine = '';
        
        words.forEach((word: string) => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = this.pdf.getTextWidth(testLine);
          
          if (testWidth <= maxLineWidth) {
            currentLine = testLine;
          } else {
            // Agregar línea actual y empezar nueva
            if (currentLine) {
              processedLines.push(currentLine);
            }
            
            // Si la palabra sola es muy larga, dividirla forzosamente
            const wordWidth = this.pdf.getTextWidth(word);
            if (wordWidth > maxLineWidth) {
              const wordLines = this.pdf.splitTextToSize(word, maxLineWidth);
              processedLines.push(...wordLines.slice(0, -1));
              currentLine = wordLines[wordLines.length - 1] || word;
            } else {
              currentLine = word;
            }
          }
        });
        
        // Agregar última línea si existe
        if (currentLine) {
          processedLines.push(currentLine);
        }
      }
    });
    
    if (processedLines.length === 0) return;
    
    // Calcular altura de línea ajustada
    const lineHeight = fontSize * 0.5; // Altura de línea ajustada al tamaño de fuente
    const totalHeight = (processedLines.length * lineHeight) + (padding * 2);
    
    // Verificar si necesitamos nueva página antes de empezar
    if (this.currentY + totalHeight > this.pageHeight - this.margin.bottom) {
      this.addPageWithHeader();
    }
    
    // Configurar colores para mejor contraste
    const backgroundColor = [248, 248, 248]; // Fondo muy claro para buen contraste
    const borderColor = [220, 220, 220]; // Borde suave
    const textColor = [30, 30, 30]; // Texto oscuro para mejor legibilidad
    
    const startY = this.currentY;
    const endY = startY + totalHeight;
    
    // PRIMERO: Dibujar fondo completo antes de renderizar texto
    this.pdf.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
    this.pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    this.pdf.setLineWidth(0.3);
    this.pdf.rect(this.margin.left, startY, this.contentWidth, totalHeight, 'FD');
    
    // SEGUNDO: Renderizar líneas de código sobre el fondo
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('courier', 'normal');
    this.pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    let currentY = startY + padding;
    let blockStartY = startY;
    
    processedLines.forEach((line: string, index: number) => {
      // Verificar si necesitamos nueva página durante el renderizado
      if (currentY + lineHeight > this.pageHeight - this.margin.bottom - 5) {
        // Dibujar fondo del bloque actual antes de cambiar de página
        if (currentY > blockStartY) {
          const blockHeight = currentY - blockStartY + (padding * 2);
          this.pdf.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
          this.pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
          this.pdf.setLineWidth(0.3);
          this.pdf.rect(this.margin.left, blockStartY, this.contentWidth, blockHeight, 'FD');
        }
        
        // Nueva página
        this.addPageWithHeader();
        currentY = this.currentY + padding;
        blockStartY = this.currentY;
        
        // Dibujar fondo en nueva página
        const remainingLines = processedLines.length - index;
        const remainingHeight = (remainingLines * lineHeight) + (padding * 2);
        this.pdf.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
        this.pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        this.pdf.setLineWidth(0.3);
        this.pdf.rect(this.margin.left, blockStartY, this.contentWidth, remainingHeight, 'FD');
      }
      
      // Renderizar línea sobre el fondo
      if (line) {
        this.pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        this.pdf.text(line, this.margin.left + padding, currentY + fontSize * 0.3);
      }
      currentY += lineHeight;
    });
    
    // Actualizar posición Y
    this.currentY = currentY + padding;
    
    // Espacio después del código
    this.currentY += 5;
  }

  /**
   * Agrega una línea horizontal
   */
  private addHorizontalRule(): void {
      if (this.currentY > this.pageHeight - this.margin.bottom - 10) {
        this.pdf.addPage();
        this.currentY = this.margin.top;
      }
    
    this.currentY += 5;
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin.left, this.currentY, this.pageWidth - this.margin.right, this.currentY);
    this.currentY += 5;
  }

  /**
   * Agrega metadata al PDF
   */
  private addMetadata(): void {
    this.pdf.setProperties({
      title: 'Guía Integral de Servicios - WeldTech Solutions',
      subject: 'Guía completa de servicios, metodología y casos de éxito',
      author: 'WeldTech Solutions',
      keywords: 'soldadura, calificación, ASME, AWS, ISO, WPS, PQR, WPQ',
      creator: 'WeldTech Solutions - Professional Welding Services'
    });
  }
}

/**
 * Genera el PDF de la Guía de Servicio
 */
export async function generateServiceGuidePDF(options: PDFGenerationOptions): Promise<Buffer> {
  const builder = new PDFBuilder(options);
  return await builder.generate();
}

