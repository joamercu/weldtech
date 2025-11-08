import { marked } from 'marked';
import createDOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Inicializar DOMPurify para Node.js de manera lazy
// Configurar JSDOM para no cargar recursos externos durante el build
let domPurifyInstance: ReturnType<typeof createDOMPurify> | null = null;

function getDOMPurify() {
  if (!domPurifyInstance) {
    // Inicializar JSDOM solo cuando se necesite, no durante el build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      // Durante el build, crear una instancia mínima sin recursos
      const window = new JSDOM('', {
        url: 'about:blank',
        referrer: '',
        contentType: 'text/html',
        includeNodeLocations: false,
        storageQuota: 10000000,
        resources: 'usable',
        runScripts: 'outside-only',
        pretendToBeVisual: false,
        beforeParse(window: any) {
          // Evitar que JSDOM intente cargar recursos CSS durante el build
          window.document.defaultView = null;
        },
      }).window;
      domPurifyInstance = createDOMPurify(window as any);
    } else {
      const window = new JSDOM('', {
        url: 'about:blank',
        referrer: '',
        contentType: 'text/html',
        includeNodeLocations: false,
        storageQuota: 10000000,
        resources: 'usable',
        runScripts: 'outside-only',
        pretendToBeVisual: false,
      }).window;
      domPurifyInstance = createDOMPurify(window as any);
    }
  }
  return domPurifyInstance;
}

// Configurar marked para usar async
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Procesa un archivo markdown y lo convierte a HTML limpio
 * @param markdownPath - Ruta al archivo markdown
 * @returns HTML sanitizado y estilizado
 */
export async function processMarkdownToHTML(markdownPath: string): Promise<string> {
  try {
    // Leer archivo markdown
    const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
    
    // Parsear markdown a HTML (marked v11 usa parse async)
    const html = await marked.parse(markdownContent);
    
    // Sanitizar HTML
    const DOMPurify = getDOMPurify();
    const cleanHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img', 'div', 'span', 'hr',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'align'],
      ALLOW_DATA_ATTR: false,
    });
    
    // Aplicar clases de estilo para PDF
    const styledHTML = applyPDFStyles(cleanHTML);
    
    return styledHTML;
  } catch (error) {
    console.error('Error procesando markdown:', error);
    throw new Error(`Error al procesar markdown: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Procesa contenido markdown directamente (string)
 * @param markdownContent - Contenido markdown como string
 * @returns HTML sanitizado y estilizado
 */
export async function processMarkdownString(markdownContent: string): Promise<string> {
  try {
    // Parsear markdown a HTML (marked v11 usa parse async)
    const html = await marked.parse(markdownContent);
    
    // Sanitizar HTML
    const DOMPurify = getDOMPurify();
    const cleanHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img', 'div', 'span', 'hr',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'align'],
      ALLOW_DATA_ATTR: false,
    });
    
    // Aplicar clases de estilo para PDF
    const styledHTML = applyPDFStyles(cleanHTML);
    
    return styledHTML;
  } catch (error) {
    console.error('Error procesando markdown string:', error);
    throw new Error(`Error al procesar markdown: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Aplica clases de estilo específicas para PDF
 * @param html - HTML limpio
 * @returns HTML con clases de estilo aplicadas
 */
function applyPDFStyles(html: string): string {
  let styledHTML = html;
  
  // Aplicar estilos a headers
  styledHTML = styledHTML.replace(/<h1>/g, '<h1 class="pdf-h1">');
  styledHTML = styledHTML.replace(/<h2>/g, '<h2 class="pdf-h2">');
  styledHTML = styledHTML.replace(/<h3>/g, '<h3 class="pdf-h3">');
  styledHTML = styledHTML.replace(/<h4>/g, '<h4 class="pdf-h4">');
  
  // Aplicar estilos a párrafos
  styledHTML = styledHTML.replace(/<p>/g, '<p class="pdf-p">');
  
  // Aplicar estilos a listas
  styledHTML = styledHTML.replace(/<ul>/g, '<ul class="pdf-ul">');
  styledHTML = styledHTML.replace(/<ol>/g, '<ol class="pdf-ol">');
  styledHTML = styledHTML.replace(/<li>/g, '<li class="pdf-li">');
  
  // Aplicar estilos a tablas
  styledHTML = styledHTML.replace(/<table>/g, '<table class="pdf-table">');
  styledHTML = styledHTML.replace(/<thead>/g, '<thead class="pdf-thead">');
  styledHTML = styledHTML.replace(/<tbody>/g, '<tbody class="pdf-tbody">');
  styledHTML = styledHTML.replace(/<tr>/g, '<tr class="pdf-tr">');
  styledHTML = styledHTML.replace(/<th>/g, '<th class="pdf-th">');
  styledHTML = styledHTML.replace(/<td>/g, '<td class="pdf-td">');
  
  // Aplicar estilos a blockquotes (recuadros destacados)
  styledHTML = styledHTML.replace(/<blockquote>/g, '<blockquote class="pdf-blockquote">');
  
  // Aplicar estilos a enlaces
  styledHTML = styledHTML.replace(/<a /g, '<a class="pdf-link" ');
  
  // Aplicar estilos a código
  styledHTML = styledHTML.replace(/<code>/g, '<code class="pdf-code">');
  styledHTML = styledHTML.replace(/<pre>/g, '<pre class="pdf-pre">');
  
  return styledHTML;
}

/**
 * Obtiene la ruta del archivo markdown de la guía integral
 */
export function getGuiaIntegralMarkdownPath(): string {
  // Ruta relativa desde nextjs_space a docs
  // process.cwd() en Next.js API routes apunta a nextjs_space
  const markdownPath = path.join(process.cwd(), '..', 'docs', 'GUIA_INTEGRAL_WELDTECH.md');
  
  // Verificar si el archivo existe, si no, intentar ruta alternativa
  if (!fs.existsSync(markdownPath)) {
    // Intentar ruta absoluta desde el workspace root
    const altPath = path.join(process.cwd(), 'docs', 'GUIA_INTEGRAL_WELDTECH.md');
    if (fs.existsSync(altPath)) {
      return altPath;
    }
    // Si tampoco existe, lanzar error
    throw new Error(`No se encontró el archivo markdown en: ${markdownPath} o ${altPath}`);
  }
  
  return markdownPath;
}

