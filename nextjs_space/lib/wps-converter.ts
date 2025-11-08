/**
 * Utilidades para convertir datos WPS a diferentes formatos
 */

export interface WPSData {
  // General Info
  wpsNumber: string
  company: string
  date: string
  preparedBy: string
  
  // Welding Process
  process: string
  processType: string
  
  // Joint Design
  jointType: string
  grooveAngle: string
  rootOpening: string
  rootFaceThickness: string
  backingType: string
  
  // Base Metals
  baseMaterialSpec: string
  baseMaterialType: string
  baseMaterialThickness: string
  pNumber: string
  
  // Filler Metals
  fillerMetalSpec: string
  fillerMetalClassification: string
  fillerMetalSize: string
  fNumber: string
  aNumber: string
  
  // Electrical Characteristics
  currentType: string
  polarity: string
  amperageRange: string
  voltageRange: string
  travelSpeed: string
  heatInput: string
  
  // Positions
  position: string
  groovePosition: string
  filletPosition: string
  
  // Preheat & PWHT
  preheatTemp: string
  interpassTemp: string
  pwhtRequired: string
  pwhtTemp: string
  pwhtTime: string
  
  // Shielding
  shieldingGasType: string
  shieldingGasFlow: string
  backingGas: string
  backingGasFlow: string
  
  // Technique
  beadType: string
  oscillation: string
  cleaning: string
  peening: string
}

/**
 * Convierte datos WPS a formato Markdown estructurado
 * para generar documentos Word profesionales
 */
export function wpsDataToMarkdown(data: WPSData): string {
  const sections: string[] = [];

  // Header principal
  sections.push('# ESPECIFICACIÓN DE PROCEDIMIENTO DE SOLDADURA');
  sections.push(`## Welding Procedure Specification - WPS No: ${data.wpsNumber || 'N/A'}`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Información General
  sections.push('## 1. INFORMACIÓN GENERAL');
  sections.push('');
  sections.push('| Campo | Valor |');
  sections.push('|-------|-------|');
  sections.push(`| **WPS Number** | ${data.wpsNumber || 'N/A'} |`);
  sections.push(`| **Company** | ${data.company || 'N/A'} |`);
  sections.push(`| **Date** | ${data.date || 'N/A'} |`);
  sections.push(`| **Prepared By** | ${data.preparedBy || 'N/A'} |`);
  sections.push(`| **Welding Process** | ${data.process || 'N/A'} (${data.processType || 'N/A'}) |`);
  sections.push('');

  // Diseño de Junta
  sections.push('## 2. DISEÑO DE JUNTA / JOINT DESIGN');
  sections.push('');
  sections.push('| Parámetro | Especificación |');
  sections.push('|-----------|----------------|');
  sections.push(`| **Joint Type** | ${data.jointType || 'N/A'} |`);
  sections.push(`| **Groove Angle** | ${data.grooveAngle || 'N/A'} |`);
  sections.push(`| **Root Opening** | ${data.rootOpening || 'N/A'} |`);
  sections.push(`| **Root Face Thickness** | ${data.rootFaceThickness || 'N/A'} |`);
  sections.push(`| **Backing Type** | ${data.backingType || 'N/A'} |`);
  sections.push('');

  // Materiales Base
  sections.push('## 3. MATERIALES BASE / BASE METALS');
  sections.push('');
  sections.push('| Especificación | Valor |');
  sections.push('|----------------|-------|');
  sections.push(`| **Material Specification** | ${data.baseMaterialSpec || 'N/A'} |`);
  sections.push(`| **Type/Grade** | ${data.baseMaterialType || 'N/A'} |`);
  sections.push(`| **Thickness Range** | ${data.baseMaterialThickness || 'N/A'} |`);
  sections.push(`| **P-Number (ASME)** | ${data.pNumber || 'N/A'} |`);
  sections.push('');

  // Materiales de Aporte
  sections.push('## 4. MATERIALES DE APORTE / FILLER METALS');
  sections.push('');
  sections.push('| Especificación | Valor |');
  sections.push('|----------------|-------|');
  sections.push(`| **AWS Specification** | ${data.fillerMetalSpec || 'N/A'} |`);
  sections.push(`| **Classification** | ${data.fillerMetalClassification || 'N/A'} |`);
  sections.push(`| **Size/Diameter** | ${data.fillerMetalSize || 'N/A'} |`);
  sections.push(`| **F-Number** | ${data.fNumber || 'N/A'} |`);
  sections.push(`| **A-Number** | ${data.aNumber || 'N/A'} |`);
  sections.push('');

  // Características Eléctricas
  sections.push('## 5. CARACTERÍSTICAS ELÉCTRICAS / ELECTRICAL CHARACTERISTICS');
  sections.push('');
  sections.push('| Parámetro | Rango/Valor |');
  sections.push('|-----------|-------------|');
  sections.push(`| **Current Type** | ${data.currentType || 'N/A'} |`);
  sections.push(`| **Polarity** | ${data.polarity || 'N/A'} |`);
  sections.push(`| **Amperage Range** | ${data.amperageRange || 'N/A'} |`);
  sections.push(`| **Voltage Range** | ${data.voltageRange || 'N/A'} |`);
  sections.push(`| **Travel Speed** | ${data.travelSpeed || 'N/A'} |`);
  sections.push(`| **Heat Input** | ${data.heatInput || 'N/A'} |`);
  sections.push('');

  // Posiciones de Soldadura
  sections.push('## 6. POSICIONES DE SOLDADURA / WELDING POSITIONS');
  sections.push('');
  sections.push('| Tipo | Posiciones Calificadas |');
  sections.push('|------|------------------------|');
  sections.push(`| **General Position** | ${data.position || 'N/A'} |`);
  sections.push(`| **Groove Welding** | ${data.groovePosition || 'N/A'} |`);
  sections.push(`| **Fillet Welding** | ${data.filletPosition || 'N/A'} |`);
  sections.push('');

  // Tratamiento Térmico
  sections.push('## 7. TRATAMIENTO TÉRMICO / HEAT TREATMENT');
  sections.push('');
  sections.push('### Precalentamiento y Temperatura Entre Pasadas');
  sections.push('');
  sections.push('| Parámetro | Temperatura |');
  sections.push('|-----------|-------------|');
  sections.push(`| **Preheat Temperature** | ${data.preheatTemp || 'N/A'} |`);
  sections.push(`| **Interpass Temperature** | ${data.interpassTemp || 'N/A'} |`);
  sections.push('');

  sections.push('### Tratamiento Térmico Post-Soldadura (PWHT)');
  sections.push('');
  sections.push('| Parámetro | Valor |');
  sections.push('|-----------|-------|');
  sections.push(`| **PWHT Required** | ${data.pwhtRequired || 'N/A'} |`);
  
  if (data.pwhtRequired === 'Yes' || data.pwhtRequired === 'Sí' || data.pwhtRequired === 'Per Code') {
    sections.push(`| **PWHT Temperature** | ${data.pwhtTemp || 'N/A'} |`);
    sections.push(`| **PWHT Time** | ${data.pwhtTime || 'N/A'} |`);
  }
  sections.push('');

  // Gas de Protección
  sections.push('## 8. GAS DE PROTECCIÓN / SHIELDING GAS');
  sections.push('');
  sections.push('| Tipo | Especificación |');
  sections.push('|------|----------------|');
  sections.push(`| **Shielding Gas Type** | ${data.shieldingGasType || 'N/A'} |`);
  sections.push(`| **Flow Rate** | ${data.shieldingGasFlow || 'N/A'} |`);
  sections.push(`| **Backing Gas** | ${data.backingGas || 'N/A'} |`);
  sections.push(`| **Backing Gas Flow** | ${data.backingGasFlow || 'N/A'} |`);
  sections.push('');

  // Técnica de Soldadura
  sections.push('## 9. TÉCNICA DE SOLDADURA / WELDING TECHNIQUE');
  sections.push('');
  sections.push('| Aspecto | Especificación |');
  sections.push('|---------|----------------|');
  sections.push(`| **Bead Type** | ${data.beadType || 'N/A'} |`);
  sections.push(`| **Oscillation** | ${data.oscillation || 'N/A'} |`);
  sections.push(`| **Interpass Cleaning** | ${data.cleaning || 'N/A'} |`);
  sections.push(`| **Peening** | ${data.peening || 'N/A'} |`);
  sections.push('');

  // Footer
  sections.push('---');
  sections.push('');
  sections.push('**Documento generado por WeldTech Solutions - WPS Builder**');
  sections.push('');
  sections.push(`*Fecha de generación: ${new Date().toLocaleString('es-ES')}*`);

  return sections.join('\n');
}

/**
 * Prepara los datos WPS para enviar a la API de generación de Word
 */
export function formatWPSForWord(data: WPSData) {
  return {
    title: `Welding Procedure Specification - ${data.wpsNumber}`,
    subtitle: `Especificación de Procedimiento de Soldadura`,
    project: data.company || 'WeldTech Project',
    client: data.company || '',
    author: data.preparedBy || 'WeldTech Solutions',
    version: '1.0',
    brand: 'weldtech'
  };
}

/**
 * Valida que los datos WPS mínimos estén presentes
 */
export function validateWPSData(data: Partial<WPSData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.wpsNumber || data.wpsNumber.trim() === '') {
    errors.push('WPS Number es requerido');
  }

  if (!data.company || data.company.trim() === '') {
    errors.push('Company es requerido');
  }

  if (!data.process || data.process.trim() === '') {
    errors.push('Welding Process es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

