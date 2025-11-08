/**
 * Excel Handler - Manejo de archivos Excel para plantillas
 * Funciones para leer, validar y servir archivos Excel
 */

import * as fs from 'fs';
import * as path from 'path';
import { TEMPLATES, getTemplateById } from './templates-config';

/**
 * Obtiene la ruta completa de un template Excel
 */
export function getTemplatePath(templateId: string): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} no encontrado`);
  }

  const filePath = path.join(process.cwd(), 'public', 'templates', 'source', template.fileName);
  return filePath;
}

/**
 * Obtiene la ruta del PDF preview
 */
export function getPreviewPath(templateId: string): string {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template ${templateId} no encontrado`);
  }

  const pdfFileName = template.fileName.replace('.xlsx', '_Preview.pdf');
  const filePath = path.join(process.cwd(), 'public', 'templates', 'preview', pdfFileName);
  return filePath;
}

/**
 * Verifica si un template Excel existe
 */
export function templateExists(templateId: string): boolean {
  try {
    const filePath = getTemplatePath(templateId);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Verifica si el preview PDF existe
 */
export function previewExists(templateId: string): boolean {
  try {
    const filePath = getPreviewPath(templateId);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Lee un template Excel y retorna el buffer
 */
export function readTemplate(templateId: string): Buffer {
  const filePath = getTemplatePath(templateId);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo Excel no encontrado: ${templateId}`);
  }

  return fs.readFileSync(filePath);
}

/**
 * Lee un preview PDF y retorna el buffer
 */
export function readPreview(templateId: string): Buffer {
  const filePath = getPreviewPath(templateId);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo PDF preview no encontrado: ${templateId}`);
  }

  return fs.readFileSync(filePath);
}

/**
 * Obtiene información de un template
 */
export function getTemplateInfo(templateId: string) {
  return getTemplateById(templateId);
}

/**
 * Obtiene todos los templates disponibles
 */
export function getAllTemplates() {
  return TEMPLATES;
}

/**
 * Obtiene el tamaño del archivo en bytes
 */
export function getTemplateSize(templateId: string): number {
  try {
    const filePath = getTemplatePath(templateId);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * Obtiene el tamaño del preview PDF
 */
export function getPreviewSize(templateId: string): number {
  try {
    const filePath = getPreviewPath(templateId);
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

