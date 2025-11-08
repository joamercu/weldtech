'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface RangeResult {
  standard: string
  thicknessMin: number
  thicknessMax: number
  diameterMin: number | null
  diameterMax: number | null
  formula: string
  notes: string[]
}

export default function CalculadoraRangos() {
  const [testThickness, setTestThickness] = useState<string>('')
  const [testDiameter, setTestDiameter] = useState<string>('')
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['ASME IX', 'AWS D1.1', 'ISO 9606'])
  const [results, setResults] = useState<RangeResult[]>([])
  const [hasCalculated, setHasCalculated] = useState(false)

  const calculateASMEIX = (thickness: number, diameter: number | null): RangeResult => {
    let thicknessMin = 0
    let thicknessMax = 0
    let diameterMin = null
    let diameterMax = null
    const notes: string[] = []

    // ASME IX Thickness Rules (QW-452.1)
    if (thickness < 1.5) {
      // Thin material
      thicknessMin = 0
      thicknessMax = thickness * 2
      notes.push('Material delgado: Rango = 0 hasta 2T')
    } else {
      // Thick material
      thicknessMin = thickness / 2
      thicknessMax = thickness * 2
      notes.push('Material grueso: Rango = T/2 hasta 2T')
    }

    // ASME IX Diameter Rules for Pipe (QW-452.3)
    if (diameter && diameter > 0) {
      if (diameter < 75) {
        diameterMin = diameter
        diameterMax = null // Sin límite superior
        notes.push('Tubo pequeño: Califica mismo diámetro y mayores')
      } else {
        diameterMin = diameter / 2
        diameterMax = null // Sin límite superior
        notes.push('Tubo grande (≥75mm): Califica desde D/2 y mayores')
      }
    }

    return {
      standard: 'ASME IX',
      thicknessMin: Math.round(thicknessMin * 100) / 100,
      thicknessMax: Math.round(thicknessMax * 100) / 100,
      diameterMin: diameterMin ? Math.round(diameterMin * 100) / 100 : null,
      diameterMax: diameterMax,
      formula: thickness < 1.5 ? '0 a 2T' : 'T/2 a 2T',
      notes
    }
  }

  const calculateAWSD11 = (thickness: number, diameter: number | null): RangeResult => {
    let thicknessMin = 0
    let thicknessMax = 0
    const notes: string[] = []

    // AWS D1.1 Thickness Rules (Table 4.3)
    if (thickness < 10) {
      thicknessMin = 0
      thicknessMax = thickness + 3
      notes.push('T < 10mm: Rango = 0 hasta T + 3mm')
    } else if (thickness >= 10 && thickness < 15) {
      thicknessMin = 5
      thicknessMax = 38
      notes.push('10mm ≤ T < 15mm: Rango = 5mm hasta 38mm')
    } else {
      thicknessMin = 5
      thicknessMax = thickness * 2
      notes.push('T ≥ 15mm: Rango = 5mm hasta 2T')
    }

    // AWS D1.1 generalmente no tiene límites de diámetro específicos
    let diameterMin = null
    let diameterMax = null
    if (diameter && diameter > 0) {
      notes.push('AWS D1.1: Sin restricciones específicas de diámetro')
    }

    return {
      standard: 'AWS D1.1',
      thicknessMin: Math.round(thicknessMin * 100) / 100,
      thicknessMax: Math.round(thicknessMax * 100) / 100,
      diameterMin,
      diameterMax,
      formula: thickness < 10 ? '0 a T+3mm' : thickness < 15 ? '5-38mm' : '5mm a 2T',
      notes
    }
  }

  const calculateISO9606 = (thickness: number, diameter: number | null): RangeResult => {
    let thicknessMin = 0
    let thicknessMax = 0
    let diameterMin = null
    let diameterMax = null
    const notes: string[] = []

    // ISO 9606 Thickness Rules (Table 9)
    if (thickness < 3) {
      thicknessMin = 0
      thicknessMax = thickness * 2
      notes.push('Material delgado (<3mm): Rango = 0 hasta 2T')
    } else {
      thicknessMin = thickness / 2
      thicknessMax = thickness * 2
      notes.push('Material grueso (≥3mm): Rango = T/2 hasta 2T')
    }

    // ISO 9606 Diameter Rules (Table 10)
    if (diameter && diameter > 0) {
      if (diameter < 25) {
        diameterMin = diameter
        diameterMax = 2 * diameter
        notes.push('Tubo pequeño (<25mm): Rango = D hasta 2D')
      } else if (diameter >= 25 && diameter <= 150) {
        diameterMin = 25
        diameterMax = null
        notes.push('Tubo mediano (25-150mm): Califica ≥25mm hasta sin límite')
      } else {
        diameterMin = diameter / 2
        diameterMax = null
        notes.push('Tubo grande (>150mm): Califica desde D/2 y mayores')
      }
    }

    return {
      standard: 'ISO 9606',
      thicknessMin: Math.round(thicknessMin * 100) / 100,
      thicknessMax: Math.round(thicknessMax * 100) / 100,
      diameterMin: diameterMin ? Math.round(diameterMin * 100) / 100 : null,
      diameterMax: diameterMax ? Math.round(diameterMax * 100) / 100 : null,
      formula: thickness < 3 ? '0 a 2T' : 'T/2 a 2T',
      notes
    }
  }

  const handleCalculate = () => {
    const thickness = parseFloat(testThickness)
    const diameter = testDiameter ? parseFloat(testDiameter) : null

    if (isNaN(thickness) || thickness <= 0) {
      toast.error('Por favor ingrese un espesor válido')
      return
    }

    if (testDiameter && (isNaN(diameter!) || diameter! <= 0)) {
      toast.error('Por favor ingrese un diámetro válido o déjelo vacío')
      return
    }

    const calculatedResults: RangeResult[] = []

    selectedStandards.forEach(standard => {
      switch (standard) {
        case 'ASME IX':
          calculatedResults.push(calculateASMEIX(thickness, diameter))
          break
        case 'AWS D1.1':
          calculatedResults.push(calculateAWSD11(thickness, diameter))
          break
        case 'ISO 9606':
          calculatedResults.push(calculateISO9606(thickness, diameter))
          break
      }
    })

    setResults(calculatedResults)
    setHasCalculated(true)
    toast.success('Rangos calculados exitosamente')
  }

  const toggleStandard = (standard: string) => {
    if (selectedStandards.includes(standard)) {
      if (selectedStandards.length > 1) {
        setSelectedStandards(selectedStandards.filter(s => s !== standard))
      } else {
        toast.error('Debe seleccionar al menos una norma')
      }
    } else {
      setSelectedStandards([...selectedStandards, standard])
    }
  }

  const handleReset = () => {
    setTestThickness('')
    setTestDiameter('')
    setResults([])
    setHasCalculated(false)
  }

  return (
    <div className="min-h-screen bg-[#0F1216] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Calculadora de Rangos
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Calcula rangos de espesor y diámetro cualificados según ASME IX, AWS D1.1 e ISO 9606
            </p>
          </div>

          {/* Input Card */}
          <Card className="mb-8 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="w-6 h-6 text-[#FF7A00]" />
                Datos de la Prueba de Calificación
              </CardTitle>
              <CardDescription className="text-gray-400">
                Ingrese el espesor y diámetro (opcional) del cupón de prueba
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Standards Selection */}
              <div>
                <Label className="text-white mb-3 block">Normas a Calcular</Label>
                <div className="flex flex-wrap gap-3">
                  {['ASME IX', 'AWS D1.1', 'ISO 9606'].map(standard => (
                    <Button
                      key={standard}
                      variant={selectedStandards.includes(standard) ? 'default' : 'outline'}
                      className={selectedStandards.includes(standard) 
                        ? 'bg-[#FF7A00] hover:bg-[#FF7A00]/80' 
                        : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
                      onClick={() => toggleStandard(standard)}
                    >
                      {selectedStandards.includes(standard) && <CheckCircle className="w-4 h-4 mr-2" />}
                      {standard}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="thickness" className="text-white">
                    Espesor de Prueba (mm) *
                  </Label>
                  <Input
                    id="thickness"
                    type="number"
                    step="0.1"
                    min="0"
                    value={testThickness}
                    onChange={(e) => setTestThickness(e.target.value)}
                    placeholder="Ej: 10"
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Espesor del material de prueba soldado
                  </p>
                </div>

                <div>
                  <Label htmlFor="diameter" className="text-white">
                    Diámetro Exterior (mm) - Opcional
                  </Label>
                  <Input
                    id="diameter"
                    type="number"
                    step="0.1"
                    min="0"
                    value={testDiameter}
                    onChange={(e) => setTestDiameter(e.target.value)}
                    placeholder="Ej: 100 (dejar vacío si es placa)"
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Solo para pruebas en tubo/cañería
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#FF7A00]/80"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Rangos
                </Button>
                {hasCalculated && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {hasCalculated && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Resultados de Rangos Calificados</h2>
                <p className="text-gray-400">
                  Basado en espesor de prueba: <span className="text-[#FF7A00] font-bold">{testThickness} mm</span>
                  {testDiameter && (
                    <span> y diámetro: <span className="text-[#2AA1FF] font-bold">{testDiameter} mm</span></span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {results.map((result, index) => (
                  <motion.div
                    key={result.standard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-800 hover:border-[#FF7A00]/50 transition-all">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Badge className="bg-[#FF7A00] hover:bg-[#FF7A00]/80">
                              {result.standard}
                            </Badge>
                            Rangos Calificados
                          </span>
                          <span className="text-sm text-gray-400 font-normal">
                            Fórmula: {result.formula}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Thickness Range */}
                        <div className="p-4 bg-gradient-to-r from-[#FF7A00]/10 to-transparent rounded-lg border border-[#FF7A00]/30">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Info className="w-5 h-5 text-[#FF7A00]" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-2">Rango de Espesor</h4>
                              <div className="flex items-baseline gap-2 text-2xl font-bold">
                                <span className="text-[#FF7A00]">{result.thicknessMin} mm</span>
                                <span className="text-gray-500">hasta</span>
                                <span className="text-[#FF7A00]">{result.thicknessMax} mm</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Diameter Range */}
                        {(result.diameterMin !== null || result.diameterMax !== null) && (
                          <div className="p-4 bg-gradient-to-r from-[#2AA1FF]/10 to-transparent rounded-lg border border-[#2AA1FF]/30">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-[#2AA1FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Info className="w-5 h-5 text-[#2AA1FF]" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-2">Rango de Diámetro</h4>
                                <div className="flex items-baseline gap-2 text-2xl font-bold">
                                  {result.diameterMin !== null && (
                                    <>
                                      <span className="text-[#2AA1FF]">{result.diameterMin} mm</span>
                                      <span className="text-gray-500">
                                        {result.diameterMax === null ? 'y mayores' : 'hasta'}
                                      </span>
                                    </>
                                  )}
                                  {result.diameterMax !== null && (
                                    <span className="text-[#2AA1FF]">{result.diameterMax} mm</span>
                                  )}
                                  {result.diameterMin === null && result.diameterMax === null && (
                                    <span className="text-gray-400 text-base">Sin restricciones</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            Notas Importantes
                          </h4>
                          <ul className="space-y-1">
                            {result.notes.map((note, idx) => (
                              <li key={idx} className="text-gray-300 text-sm pl-6">
                                • {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* General Info Card */}
              <Card className="bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-400" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-3">
                  <p>
                    <strong className="text-white">Importante:</strong> Los rangos calculados son aproximados y deben verificarse 
                    con el código/norma correspondiente y considerando variables adicionales como:
                  </p>
                  <ul className="space-y-1 pl-6">
                    <li>• Tipo de material base (P-Number/Group Number)</li>
                    <li>• Proceso de soldadura utilizado</li>
                    <li>• Metal de aporte y características</li>
                    <li>• Posición de soldadura</li>
                    <li>• Tipo de junta y preparación</li>
                    <li>• Tratamiento térmico post soldadura</li>
                  </ul>
                  <p className="text-yellow-400 font-semibold">
                    ⚠️ Esta herramienta es una guía de referencia. Consulte siempre el código completo y un inspector calificado.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Info Card (when no results) */}
          {!hasCalculated && (
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="w-6 h-6 text-[#2AA1FF]" />
                  Cómo Usar Esta Calculadora
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Paso 1: Seleccione las Normas</h4>
                  <p className="text-sm">
                    Elija una o más normas para calcular los rangos simultáneamente (ASME IX, AWS D1.1, ISO 9606).
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Paso 2: Ingrese los Datos</h4>
                  <p className="text-sm">
                    <strong>Espesor:</strong> El espesor del material usado en la prueba de calificación (obligatorio).
                    <br />
                    <strong>Diámetro:</strong> Si la prueba fue en tubo/cañería, ingrese el diámetro exterior (opcional).
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Paso 3: Calcule</h4>
                  <p className="text-sm">
                    Haga clic en "Calcular Rangos" para obtener los espesores y diámetros calificados según cada norma.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">Ejemplo:</strong> Si soldó un cupón de prueba de 12mm de espesor en tubo de 100mm de diámetro,
                    la calculadora le mostrará qué espesores y diámetros puede soldar en producción según cada código.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
