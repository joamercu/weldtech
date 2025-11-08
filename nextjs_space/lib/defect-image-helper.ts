/**
 * Helper para manejar imágenes de defectos con sistema de fallback
 * 
 * Este módulo proporciona funciones para obtener las rutas de imágenes
 * de defectos, con soporte para imágenes generadas con Abacus.AI
 * y fallback a imágenes originales.
 */

interface DefectImagePaths {
  main: string
  crossSection?: string
  surfaceView?: string
  fallback: string
}

/**
 * Obtiene las rutas de imágenes para un defecto
 * 
 * @param defectId - ID del defecto (ej: 'porosidad', 'grietas')
 * @param useGenerated - Si usar imágenes generadas (default: true)
 * @returns Objeto con rutas de imágenes
 */
export function getDefectImagePaths(
  defectId: string,
  useGenerated: boolean = true
): DefectImagePaths {
  const basePath = '/herramientas'
  const generatedPath = `${basePath}/generated/abacus-ai/${defectId}`
  const originalPath = `${basePath}/${defectId}.jpg`
  const backupPath = `${basePath}/backup/2025-11-08-original/${defectId}.jpg`

  // Si se usan imágenes generadas, intentar cargar desde generated
  if (useGenerated) {
    return {
      main: `${generatedPath}/main.jpg`,
      crossSection: `${generatedPath}/cross-section.jpg`,
      surfaceView: `${generatedPath}/surface-view.jpg`,
      fallback: originalPath // Fallback a imagen original
    }
  }

  // Si no se usan imágenes generadas, usar original
  return {
    main: originalPath,
    fallback: backupPath // Fallback a respaldo
  }
}

/**
 * Verifica si una imagen existe
 * 
 * @param imagePath - Ruta de la imagen
 * @returns Promise que resuelve a true si la imagen existe
 */
export async function imageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Obtiene la mejor imagen disponible para un defecto
 * 
 * @param defectId - ID del defecto
 * @param imageType - Tipo de imagen ('main', 'crossSection', 'surfaceView')
 * @returns Ruta de la imagen disponible
 */
export async function getBestDefectImage(
  defectId: string,
  imageType: 'main' | 'crossSection' | 'surfaceView' = 'main'
): Promise<string> {
  const paths = getDefectImagePaths(defectId, true)
  
  // Intentar imagen generada primero
  let imagePath: string | undefined
  
  switch (imageType) {
    case 'main':
      imagePath = paths.main
      break
    case 'crossSection':
      imagePath = paths.crossSection
      break
    case 'surfaceView':
      imagePath = paths.surfaceView
      break
  }

  if (imagePath) {
    const exists = await imageExists(imagePath)
    if (exists) {
      return imagePath
    }
  }

  // Fallback a imagen original
  return paths.fallback
}

/**
 * Obtiene todas las imágenes disponibles para un defecto
 * 
 * @param defectId - ID del defecto
 * @returns Objeto con rutas de imágenes disponibles
 */
export async function getAllDefectImages(defectId: string): Promise<{
  main: string
  crossSection?: string
  surfaceView?: string
}> {
  const paths = getDefectImagePaths(defectId, true)
  const images: {
    main: string
    crossSection?: string
    surfaceView?: string
  } = {
    main: paths.fallback,
    surfaceView: paths.fallback
  }

  // Verificar imagen principal generada
  if (await imageExists(paths.main)) {
    images.main = paths.main
  }

  // Verificar imagen de corte transversal
  if (paths.crossSection && await imageExists(paths.crossSection)) {
    images.crossSection = paths.crossSection
  }

  // Verificar imagen superficial
  if (paths.surfaceView && await imageExists(paths.surfaceView)) {
    images.surfaceView = paths.surfaceView
  }

  return images
}

/**
 * Configuración de imágenes por defecto
 */
export const DEFECT_IMAGE_CONFIG = {
  useGenerated: true, // Usar imágenes generadas por defecto
  fallbackToOriginal: true, // Permitir fallback a originales
  fallbackToBackup: true // Permitir fallback a respaldo
}

