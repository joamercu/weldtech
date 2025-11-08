/**
 * Configuración de Plantillas Profesionales
 * Define constantes y metadatos para el sistema de plantillas
 */

export interface TemplateMetadata {
  id: string;
  name: string;
  nameEn: string;
  fileName: string;
  description: string;
  descriptionEn: string;
  features: string[];
  standard: string;
  version: string;
  category: 'qualification' | 'audit' | 'management';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // Tiempo estimado de llenado
  icon: string;
}

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'wps',
    name: 'WPS - Especificación de Procedimiento de Soldadura',
    nameEn: 'Welding Procedure Specification',
    fileName: 'WPS_Template_v1.0.xlsx',
    description: 'Template completo según ASME IX QW-482 y AWS D1.1 Clause 4. Incluye todas las secciones requeridas con validaciones automáticas.',
    descriptionEn: 'Complete template according to ASME IX QW-482 and AWS D1.1 Clause 4. Includes all required sections with automatic validations.',
    features: [
      'Formato Excel + PDF',
      'Campos autocalculados (heat input)',
      'Validaciones de rangos',
      'Dropdowns precargados (P-No., F-No.)',
      'Logo personalizable',
    ],
    standard: 'ASME IX QW-482 / AWS D1.1',
    version: '1.0',
    category: 'qualification',
    difficulty: 'intermediate',
    estimatedTime: '30-45 minutos',
    icon: '📋',
  },
  {
    id: 'pqr',
    name: 'PQR - Registro de Calificación de Procedimiento',
    nameEn: 'Procedure Qualification Record',
    fileName: 'PQR_Template_v1.0.xlsx',
    description: 'Template según ASME IX QW-483 con secciones para todos los ensayos requeridos y cálculos automáticos de parámetros.',
    descriptionEn: 'Template according to ASME IX QW-483 with sections for all required tests and automatic parameter calculations.',
    features: [
      'Formato Excel + PDF',
      'Cálculo automático de heat input',
      'Verificación de rangos vs. código',
      'Checklist de ensayos',
      'Sección de fotos (macro, fracture)',
    ],
    standard: 'ASME IX QW-483',
    version: '1.0',
    category: 'qualification',
    difficulty: 'advanced',
    estimatedTime: '1-2 horas',
    icon: '📊',
  },
  {
    id: 'wpq',
    name: 'WPQ - Calificación de Desempeño del Soldador',
    nameEn: 'Welder Performance Qualification',
    fileName: 'WPQ_Template_v1.0.xlsx',
    description: 'Template según ASME IX QW-484 y AWS D1.1 con auto-cálculo de rangos cualificados y alertas de vencimiento.',
    descriptionEn: 'Template according to ASME IX QW-484 and AWS D1.1 with auto-calculation of qualified ranges and expiration alerts.',
    features: [
      'Formato Excel + PDF',
      'Auto-cálculo de rango (tabla QW-451)',
      'Validación de criterios de aceptación',
      'Alertas de vencimiento (continuity)',
      'Espacio para foto y sello del soldador',
    ],
    standard: 'ASME IX QW-484 / AWS D1.1',
    version: '1.0',
    category: 'qualification',
    difficulty: 'intermediate',
    estimatedTime: '20-30 minutos',
    icon: '👷',
  },
  {
    id: 'checklist',
    name: 'Checklist de Auditoría (50+ puntos)',
    nameEn: 'Audit Checklist',
    fileName: 'Checklist_Auditoria_v1.0.xlsx',
    description: 'Checklist exhaustivo para auditorías de calificación de soldadores con scoring automático y plan de acción integrado.',
    descriptionEn: 'Comprehensive checklist for welder qualification audits with automatic scoring and integrated action plan.',
    features: [
      'Formato Excel',
      '50+ puntos de verificación',
      'Status por item (Compliant/Minor/Major)',
      'Auto-scoring (% compliance)',
      'Reporte ejecutivo auto-generado',
    ],
    standard: 'ASME IX / AWS D1.1 / ISO 9606',
    version: '1.0',
    category: 'audit',
    difficulty: 'beginner',
    estimatedTime: '1-2 horas (dependiendo de auditoría)',
    icon: '✅',
  },
  {
    id: 'matriz',
    name: 'Matriz de Trazabilidad WPS-PQR-WPQ-Soldador',
    nameEn: 'Traceability Matrix',
    fileName: 'Matriz_Trazabilidad_v1.0.xlsx',
    description: 'Sistema de trazabilidad completo para gestionar la relación entre WPS, PQRs, WPQs y soldadores activos.',
    descriptionEn: 'Complete traceability system to manage relationships between WPS, PQRs, WPQs and active welders.',
    features: [
      'Formato Excel',
      'Tabla relacional completa',
      'Filtros avanzados y búsqueda',
      'Alertas de WPS sin PQR',
      'Dashboard visual con charts',
    ],
    standard: 'Todos los estándares',
    version: '1.0',
    category: 'management',
    difficulty: 'advanced',
    estimatedTime: 'Uso continuo (gestión diaria)',
    icon: '🔗',
  },
];

/**
 * Obtiene metadata de un template por ID
 */
export function getTemplateById(id: string): TemplateMetadata | undefined {
  return TEMPLATES.find(t => t.id === id);
}

/**
 * Obtiene templates por categoría
 */
export function getTemplatesByCategory(category: TemplateMetadata['category']): TemplateMetadata[] {
  return TEMPLATES.filter(t => t.category === category);
}

/**
 * Obtiene templates por dificultad
 */
export function getTemplatesByDifficulty(difficulty: TemplateMetadata['difficulty']): TemplateMetadata[] {
  return TEMPLATES.filter(t => t.difficulty === difficulty);
}

/**
 * Configuración de marca de agua
 */
export const WATERMARK_CONFIG = {
  text: 'DESCARGA PÚBLICA - WeldTech Solutions',
  opacity: 0.15,
  fontSize: 40,
  color: '#999999',
  angle: 45,
};

/**
 * Configuración de rutas
 */
export const PATHS = {
  source: 'public/templates/source',
  preview: 'public/templates/preview',
  guides: 'public/templates/guides',
};

/**
 * Mensajes de la interfaz
 */
export const MESSAGES = {
  downloadPdfSuccess: 'Vista previa descargada. Regístrate gratis para obtener la versión Excel editable.',
  downloadExcelSuccess: '¡Plantilla Excel descargada con éxito!',
  downloadError: 'Error al descargar. Por favor intenta de nuevo.',
  notAuthenticated: 'Inicia sesión para descargar plantillas Excel editables sin marca de agua.',
  registerPrompt: 'Regístrate en 30 segundos para acceder a todas las plantillas Excel editables, sin marca de agua y 100% gratis.',
};

/**
 * Beneficios según tipo de usuario
 */
export const BENEFITS = {
  nonRegistered: [
    'Visualiza el diseño profesional',
    'Entiende la estructura del documento',
    'Formato PDF con marca de agua',
    'Solo lectura',
  ],
  registered: [
    'Archivo Excel completamente editable',
    'Sin marca de agua corporativa',
    'Todas las fórmulas y validaciones activas',
    'Personalizable con tu logo',
    'Actualizaciones gratuitas',
  ],
};

/**
 * FAQ sobre las plantillas
 */
export const TEMPLATE_FAQ = [
  {
    question: '¿Las plantillas son realmente gratuitas?',
    answer: 'Sí, 100% gratuitas. Solo necesitas crear una cuenta en 30 segundos para descargar las versiones Excel editables sin marca de agua.',
  },
  {
    question: '¿Puedo usar las plantillas comercialmente?',
    answer: 'Sí, puedes usarlas en tu empresa para crear documentos reales (WPS, PQR, WPQ). Solo no puedes redistribuir las plantillas mismas.',
  },
  {
    question: '¿Son compatibles con Excel 2016/2019/365?',
    answer: 'Sí, las plantillas están optimizadas para Excel 2016 y superiores. También funcionan en Microsoft 365.',
  },
  {
    question: '¿Funcionan en LibreOffice o Google Sheets?',
    answer: 'Funcionan parcialmente. Algunas funcionalidades avanzadas (formato condicional, validaciones) pueden tener limitaciones. Recomendamos Microsoft Excel.',
  },
  {
    question: '¿Puedo personalizar las plantillas?',
    answer: 'Sí, puedes agregar tu logo, cambiar colores, y modificar campos no protegidos. Las fórmulas están protegidas para evitar errores accidentales.',
  },
  {
    question: '¿Qué hago si encuentro un error en una plantilla?',
    answer: 'Contáctanos por email (soporte@weldtech.solutions) o WhatsApp (+57 313 369 1591) y lo corregiremos lo antes posible.',
  },
  {
    question: '¿Habrá más plantillas en el futuro?',
    answer: 'Sí, estamos trabajando en WPAR, WPQR y otras plantillas avanzadas. Los usuarios registrados recibirán notificaciones de nuevos lanzamientos.',
  },
];

/**
 * Estándares y códigos referenciados
 */
export const STANDARDS = {
  'ASME IX': {
    name: 'ASME Boiler and Pressure Vessel Code - Section IX',
    description: 'Welding, Brazing, and Fusing Qualifications',
    url: 'https://www.asme.org/codes-standards/find-codes-standards/bpvc-section-ix-welding-brazing-fusing-qualifications',
  },
  'AWS D1.1': {
    name: 'Structural Welding Code — Steel',
    description: 'American Welding Society Standard for Structural Steel Welding',
    url: 'https://www.aws.org/standards',
  },
  'ISO 9606': {
    name: 'Qualification testing of welders',
    description: 'International Standard for Welder Qualification',
    url: 'https://www.iso.org/standard/69029.html',
  },
  'ISO 3834': {
    name: 'Quality requirements for fusion welding of metallic materials',
    description: 'Quality Management System for Welding',
    url: 'https://www.iso.org/standard/63355.html',
  },
};

