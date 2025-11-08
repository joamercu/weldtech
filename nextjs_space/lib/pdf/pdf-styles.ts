/**
 * Estilos para PDF según manual de marca WeldTech
 */

export const brandColors = {
  // Principales
  darkSteel: { r: 15, g: 18, b: 22 },      // #0F1216
  weldOrange: { r: 255, g: 122, b: 0 },    // #FF7A00
  precisionBlue: { r: 42, g: 161, b: 255 }, // #2AA1FF
  
  // Complementarios
  steelGray: { r: 107, g: 114, b: 128 },    // #6B7280
  lightSteel: { r: 229, g: 231, b: 235 },  // #E5E7EB
  pureWhite: { r: 255, g: 255, b: 255 },    // #FFFFFF
  
  // Estados
  successGreen: { r: 16, g: 185, b: 129 },  // #10B981
  warningYellow: { r: 245, g: 158, b: 11 }, // #F59E0B
  errorRed: { r: 239, g: 68, b: 68 },       // #EF4444
};

export const typography = {
  h1: {
    font: 'helvetica',
    style: 'bold',
    size: 32,
    color: brandColors.pureWhite,
  },
  h2: {
    font: 'helvetica',
    style: 'bold',
    size: 24,
    color: brandColors.pureWhite,
  },
  h3: {
    font: 'helvetica',
    style: 'bold',
    size: 18,
    color: brandColors.pureWhite,
  },
  body: {
    font: 'helvetica',
    style: 'normal',
    size: 11,
    color: { r: 0, g: 0, b: 0 },
    lineHeight: 1.6,
  },
  label: {
    font: 'helvetica',
    style: 'bold',
    size: 10,
    color: brandColors.precisionBlue,
  },
};

export const pdfStyles = {
  page: {
    margin: { top: 20, right: 15, bottom: 20, left: 15 },
    backgroundColor: brandColors.darkSteel,
  },
  header: {
    backgroundColor: brandColors.weldOrange,
    color: brandColors.pureWhite,
    fontSize: 16,
    font: 'helvetica',
    style: 'bold',
    padding: 5,
    height: 8,
  },
  body: {
    color: { r: 0, g: 0, b: 0 },
    fontSize: 11,
    font: 'helvetica',
    style: 'normal',
    lineHeight: 1.6,
  },
  table: {
    headerBackground: brandColors.precisionBlue,
    headerColor: brandColors.pureWhite,
    rowAlternate: brandColors.lightSteel,
    borderColor: brandColors.steelGray,
    borderWidth: 0.5,
    padding: 4,
  },
  highlightBox: {
    backgroundColor: { r: 255, g: 122, b: 0, a: 0.1 },
    borderColor: brandColors.weldOrange,
    borderWidth: 1,
    borderRadius: 2,
    padding: 8,
  },
};

