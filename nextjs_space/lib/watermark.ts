
import { jsPDF } from 'jspdf';

export interface WatermarkOptions {
  text: string;
  opacity?: number;
  fontSize?: number;
  color?: string;
  angle?: number;
}

/**
 * Aplica marca de agua a un PDF con múltiples capas y mejor cobertura
 * @param pdf - Instancia de jsPDF
 * @param options - Opciones de configuración de la marca de agua
 */
export function applyWatermarkToPDF(
  pdf: jsPDF,
  options: WatermarkOptions = {
    text: 'DESCARGA PÚBLICA - WeldTech Solutions',
    opacity: 0.15,
    fontSize: 40,
    color: '#999999',
    angle: 45,
  }
) {
  const { text, opacity = 0.15, fontSize = 40, color = '#999999', angle = 45 } = options;
  
  const pageCount = pdf.getNumberOfPages();
  
  // Aplicar marca de agua a todas las páginas
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Capa 1: Marca de agua principal en el centro
    pdf.saveGraphicsState();
    pdf.setGState(new (pdf as any).GState({ opacity }));
    pdf.setTextColor(color);
    pdf.setFontSize(fontSize);
    
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    pdf.text(text, centerX, centerY, {
      align: 'center',
      angle,
      baseline: 'middle',
    });
    pdf.restoreGraphicsState();
    
    // Capa 2: Marcas de agua en 4 esquinas
    const positions = [
      { x: pageWidth * 0.25, y: pageHeight * 0.25 },  // Superior izquierda
      { x: pageWidth * 0.75, y: pageHeight * 0.25 },  // Superior derecha
      { x: pageWidth * 0.25, y: pageHeight * 0.75 },  // Inferior izquierda
      { x: pageWidth * 0.75, y: pageHeight * 0.75 },  // Inferior derecha
    ];
    
    positions.forEach(pos => {
      pdf.saveGraphicsState();
      pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.7 }));
      pdf.setTextColor(color);
      pdf.setFontSize(fontSize * 0.7);
      
      pdf.text(text, pos.x, pos.y, {
        align: 'center',
        angle,
        baseline: 'middle',
      });
      
      pdf.restoreGraphicsState();
    });
    
    // Capa 3: Patrón de cobertura adicional
    const stepX = pageWidth / 3;
    const stepY = pageHeight / 3;
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const x = stepX * (col + 0.5);
        const y = stepY * (row + 0.5);
        
        // Saltear posiciones ya dibujadas
        if ((col === 1 && row === 1) || (col === 1 && row === 2)) {
          continue;
        }
        
        pdf.saveGraphicsState();
        pdf.setGState(new (pdf as any).GState({ opacity: opacity * 0.5 }));
        pdf.setTextColor(color);
        pdf.setFontSize(fontSize * 0.6);
        
        pdf.text(text, x, y, {
          align: 'center',
          angle,
          baseline: 'middle',
        });
        
        pdf.restoreGraphicsState();
      }
    }
  }
  
  return pdf;
}

/**
 * Aplica marca de agua a un canvas (para imágenes) con múltiples capas
 * @param canvas - Elemento canvas
 * @param options - Opciones de configuración de la marca de agua
 */
export function applyWatermarkToCanvas(
  canvas: HTMLCanvasElement,
  options: WatermarkOptions = {
    text: 'DESCARGA PÚBLICA - WeldTech Solutions',
    opacity: 0.15,
    fontSize: 40,
    color: '#999999',
    angle: 45,
  }
) {
  const { text, opacity = 0.15, fontSize = 40, color = '#999999', angle = 45 } = options;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Capa 1: Marca de agua principal en el centro (más visible)
  ctx.save();
  ctx.globalAlpha = Math.min(opacity * 1.2, 0.25); // Aumentar visibilidad ligeramente
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.translate(width / 2, height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillText(text, 0, 0);
  ctx.restore();
  
  // Capa 2: Marcas de agua en esquinas (4 esquinas)
  const positions = [
    { x: width * 0.25, y: height * 0.25 },  // Superior izquierda
    { x: width * 0.75, y: height * 0.25 },  // Superior derecha
    { x: width * 0.25, y: height * 0.75 },  // Inferior izquierda
    { x: width * 0.75, y: height * 0.75 },  // Inferior derecha
  ];
  
  positions.forEach(pos => {
    ctx.save();
    ctx.globalAlpha = opacity * 0.8; // Mejor visibilidad en esquinas
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize * 0.7}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.translate(pos.x, pos.y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });
  
  // Capa 3: Patrón repetido para máxima cobertura
  const patternSize = Math.max(width, height) * 0.4;
  for (let x = -patternSize; x < width + patternSize; x += patternSize) {
    for (let y = -patternSize; y < height + patternSize; y += patternSize) {
      // Saltear la posición central ya dibujada
      if (Math.abs(x - width / 2) < patternSize / 2 && Math.abs(y - height / 2) < patternSize / 2) {
        continue;
      }
      
      ctx.save();
      ctx.globalAlpha = opacity * 0.6; // Mejor visibilidad del patrón
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize * 0.6}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }
}

/**
 * Registra una descarga en la base de datos
 * @param data - Datos de la descarga
 */
export async function trackDownload(data: {
  documentType: string;
  documentName: string;
  hasWatermark: boolean;
  userId?: string;
  userEmail?: string;
}) {
  try {
    const response = await fetch('/api/downloads/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Error tracking download');
    }
  } catch (error) {
    console.error('Error tracking download:', error);
  }
}

/**
 * Obtiene el texto de marca de agua según el estado del usuario
 * @param isAuthenticated - Si el usuario está autenticado
 * @returns Texto de la marca de agua o null si no se debe aplicar
 */
export function getWatermarkText(isAuthenticated: boolean): string | null {
  if (isAuthenticated) {
    return null; // No aplicar marca de agua para usuarios autenticados
  }
  return 'DESCARGA PÚBLICA - WeldTech Solutions';
}
