
'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileText, Save, Trash2, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

interface WPSData {
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

const initialData: WPSData = {
  wpsNumber: '',
  company: '',
  date: new Date().toISOString().split('T')[0],
  preparedBy: '',
  process: '',
  processType: '',
  jointType: '',
  grooveAngle: '',
  rootOpening: '',
  rootFaceThickness: '',
  backingType: '',
  baseMaterialSpec: '',
  baseMaterialType: '',
  baseMaterialThickness: '',
  pNumber: '',
  fillerMetalSpec: '',
  fillerMetalClassification: '',
  fillerMetalSize: '',
  fNumber: '',
  aNumber: '',
  currentType: '',
  polarity: '',
  amperageRange: '',
  voltageRange: '',
  travelSpeed: '',
  heatInput: '',
  position: '',
  groovePosition: '',
  filletPosition: '',
  preheatTemp: '',
  interpassTemp: '',
  pwhtRequired: 'No',
  pwhtTemp: '',
  pwhtTime: '',
  shieldingGasType: '',
  shieldingGasFlow: '',
  backingGas: '',
  backingGasFlow: '',
  beadType: '',
  oscillation: '',
  cleaning: '',
  peening: ''
}

export default function WPSBuilder() {
  const { data: session, status } = useSession()
  const [wpsData, setWpsData] = useState<WPSData>(initialData)
  const [savedWPS, setSavedWPS] = useState<WPSData[]>([])
  const [isGeneratingWord, setIsGeneratingWord] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof WPSData, value: string) => {
    setWpsData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!wpsData.wpsNumber || !wpsData.company) {
      toast.error('Por favor complete los campos obligatorios (WPS Number y Compañía)')
      return
    }
    
    setSavedWPS(prev => [...prev, { ...wpsData }])
    toast.success(`WPS ${wpsData.wpsNumber} guardado exitosamente`)
  }

  const handleClear = () => {
    setWpsData(initialData)
    toast.info('Formulario limpiado')
  }

  const handleExportPDF = () => {
    if (!wpsData.wpsNumber) {
      toast.error('Por favor ingrese un número de WPS antes de exportar')
      return
    }
    
    try {
      toast.info('Generando PDF...')
      const doc = new jsPDF()
      
      // Header
      doc.setFillColor(255, 122, 0)
      doc.rect(0, 0, 210, 25, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('WELDING PROCEDURE SPECIFICATION', 105, 12, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`WPS No: ${wpsData.wpsNumber || 'N/A'}`, 105, 20, { align: 'center' })
      
      let y = 35
      
      // General Information Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('GENERAL INFORMATION', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Company:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.company || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Date:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.date || 'N/A', 140, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Prepared By:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.preparedBy || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Process:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.process || 'N/A', 140, y)
      y += 10
      
      // Joint Design Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('JOINT DESIGN', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Joint Type:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.jointType || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Groove Angle:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.grooveAngle || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Root Opening:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.rootOpening || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Root Face:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.rootFaceThickness || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Backing:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.backingType || 'N/A', 50, y)
      y += 10
      
      // Base Metals Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('BASE METALS', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Specification:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.baseMaterialSpec || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Type/Grade:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.baseMaterialType || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Thickness Range:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.baseMaterialThickness || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('P-Number:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.pNumber || 'N/A', 155, y)
      y += 10
      
      // Filler Metals Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('FILLER METALS', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('AWS Specification:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.fillerMetalSpec || 'N/A', 60, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Classification:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.fillerMetalClassification || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Size/Diameter:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.fillerMetalSize || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('F-Number:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.fNumber || 'N/A', 155, y)
      y += 10
      
      // Check if we need a new page
      if (y > 240) {
        doc.addPage()
        y = 20
      }
      
      // Electrical Characteristics Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('ELECTRICAL CHARACTERISTICS', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Current Type:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.currentType || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Polarity:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.polarity || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Amperage Range:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.amperageRange || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Voltage Range:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.voltageRange || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Travel Speed:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.travelSpeed || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Heat Input:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.heatInput || 'N/A', 155, y)
      y += 10
      
      // Positions Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('POSITIONS', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Qualified Positions:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.position || 'N/A', 60, y)
      y += 10
      
      // Preheat & PWHT Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('PREHEAT & POSTWELD HEAT TREATMENT', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Preheat Temp:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.preheatTemp || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Interpass Temp:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.interpassTemp || 'N/A', 165, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('PWHT Required:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.pwhtRequired || 'N/A', 55, y)
      
      if (wpsData.pwhtRequired === 'Yes' || wpsData.pwhtRequired === 'Per Code') {
        doc.setFont('helvetica', 'bold')
        doc.text('PWHT Temp:', 120, y)
        doc.setFont('helvetica', 'normal')
        doc.text(wpsData.pwhtTemp || 'N/A', 155, y)
        y += 6
        
        doc.setFont('helvetica', 'bold')
        doc.text('PWHT Time:', 20, y)
        doc.setFont('helvetica', 'normal')
        doc.text(wpsData.pwhtTime || 'N/A', 50, y)
        y += 6
      } else {
        y += 6
      }
      y += 4
      
      // Shielding Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('SHIELDING', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Shielding Gas:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.shieldingGasType || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Flow Rate:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.shieldingGasFlow || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Backing Gas:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.backingGas || 'N/A', 55, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Flow Rate:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.backingGasFlow || 'N/A', 155, y)
      y += 10
      
      // Technique Section
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.text('TECHNIQUE', 20, y + 6)
      y += 12
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Bead Type:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.beadType || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Oscillation:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.oscillation || 'N/A', 155, y)
      y += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Cleaning:', 20, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.cleaning || 'N/A', 50, y)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Peening:', 120, y)
      doc.setFont('helvetica', 'normal')
      doc.text(wpsData.peening || 'N/A', 155, y)
      
      // Footer
      doc.setFillColor(128, 128, 128)
      doc.rect(0, 285, 210, 12, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text('WeldTech Solutions - WPS Builder', 105, 291, { align: 'center' })
      doc.text(`Generated: ${new Date().toLocaleDateString('es-ES')}`, 180, 291)
      
      doc.save(`WPS-${wpsData.wpsNumber}.pdf`)
      toast.success('WPS exportado exitosamente')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error al generar el PDF')
    }
  }

  const handleLoadExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar extensión
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Por favor seleccione un archivo Excel (.xlsx o .xls)')
      return
    }

    try {
      toast.info('Cargando archivo Excel...')
      
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      
      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      
      // Convertir a JSON (asume que la primera fila son headers)
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]
      
      if (jsonData.length === 0) {
        toast.error('El archivo Excel está vacío o no tiene el formato correcto')
        return
      }

      // Tomar la primera fila de datos
      const excelRow = jsonData[0]
      
      // Mapear campos del Excel al WPSData
      const loadedData: Partial<WPSData> = {}
      
      // Lista de campos esperados
      const fieldMapping: Record<string, keyof WPSData> = {
        'wpsNumber': 'wpsNumber',
        'company': 'company',
        'date': 'date',
        'preparedBy': 'preparedBy',
        'process': 'process',
        'processType': 'processType',
        'jointType': 'jointType',
        'grooveAngle': 'grooveAngle',
        'rootOpening': 'rootOpening',
        'rootFaceThickness': 'rootFaceThickness',
        'backingType': 'backingType',
        'baseMaterialSpec': 'baseMaterialSpec',
        'baseMaterialType': 'baseMaterialType',
        'baseMaterialThickness': 'baseMaterialThickness',
        'pNumber': 'pNumber',
        'fillerMetalSpec': 'fillerMetalSpec',
        'fillerMetalClassification': 'fillerMetalClassification',
        'fillerMetalSize': 'fillerMetalSize',
        'fNumber': 'fNumber',
        'aNumber': 'aNumber',
        'currentType': 'currentType',
        'polarity': 'polarity',
        'amperageRange': 'amperageRange',
        'voltageRange': 'voltageRange',
        'travelSpeed': 'travelSpeed',
        'heatInput': 'heatInput',
        'position': 'position',
        'groovePosition': 'groovePosition',
        'filletPosition': 'filletPosition',
        'preheatTemp': 'preheatTemp',
        'interpassTemp': 'interpassTemp',
        'pwhtRequired': 'pwhtRequired',
        'pwhtTemp': 'pwhtTemp',
        'pwhtTime': 'pwhtTime',
        'shieldingGasType': 'shieldingGasType',
        'shieldingGasFlow': 'shieldingGasFlow',
        'backingGas': 'backingGas',
        'backingGasFlow': 'backingGasFlow',
        'beadType': 'beadType',
        'oscillation': 'oscillation',
        'cleaning': 'cleaning',
        'peening': 'peening'
      }

      // Mapear datos
      let fieldsLoaded = 0
      Object.keys(fieldMapping).forEach(excelKey => {
        if (excelRow[excelKey] !== undefined && excelRow[excelKey] !== null) {
          loadedData[fieldMapping[excelKey]] = String(excelRow[excelKey])
          fieldsLoaded++
        }
      })

      if (fieldsLoaded === 0) {
        toast.error('No se encontraron campos válidos en el archivo Excel')
        return
      }

      // Actualizar datos del formulario
      setWpsData(prev => ({ ...prev, ...loadedData }))
      
      toast.success(`✅ Plantilla cargada: ${fieldsLoaded} campos importados`, {
        description: `WPS: ${loadedData.wpsNumber || 'Sin número'}`
      })
      
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Error loading Excel:', error)
      toast.error('Error al cargar el archivo Excel', {
        description: 'Verifique que el archivo tenga el formato correcto'
      })
    }
  }

  const handleGenerateWord = async () => {
    if (!wpsData.wpsNumber || !wpsData.company) {
      toast.error('Complete los campos obligatorios (WPS Number y Compañía)')
      return
    }

    setIsGeneratingWord(true)
    
    try {
      toast.info('Generando documento Word con branding corporativo...')
      
      const response = await fetch('/api/wps/generate-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wpsData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 503) {
          toast.error('API de generación no disponible', {
            description: 'Inicie el servidor Python: cd md2word-api && start_api.bat',
            duration: 5000
          })
          return
        }
        
        throw new Error(errorData.error || 'Error al generar documento')
      }

      // Descargar el archivo
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `WPS-${wpsData.wpsNumber}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('✅ Documento Word generado exitosamente', {
        description: 'Archivo descargado con imagen corporativa WeldTech'
      })
      
    } catch (error) {
      console.error('Error generating Word:', error)
      toast.error('Error al generar documento Word', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsGeneratingWord(false)
    }
  }

  const generateWPSText = (): string => {
    return `
WELDING PROCEDURE SPECIFICATION (WPS)
====================================

GENERAL INFORMATION
-------------------
WPS Number: ${wpsData.wpsNumber || 'N/A'}
Company: ${wpsData.company || 'N/A'}
Date: ${wpsData.date || 'N/A'}
Prepared By: ${wpsData.preparedBy || 'N/A'}

WELDING PROCESS
---------------
Process: ${wpsData.process || 'N/A'}
Type: ${wpsData.processType || 'N/A'}

JOINT DESIGN
------------
Joint Type: ${wpsData.jointType || 'N/A'}
Groove Angle: ${wpsData.grooveAngle || 'N/A'}
Root Opening: ${wpsData.rootOpening || 'N/A'}
Root Face Thickness: ${wpsData.rootFaceThickness || 'N/A'}
Backing: ${wpsData.backingType || 'N/A'}

BASE METALS
-----------
Specification: ${wpsData.baseMaterialSpec || 'N/A'}
Type/Grade: ${wpsData.baseMaterialType || 'N/A'}
Thickness Range: ${wpsData.baseMaterialThickness || 'N/A'}
P-Number: ${wpsData.pNumber || 'N/A'}

FILLER METALS
-------------
Specification: ${wpsData.fillerMetalSpec || 'N/A'}
Classification: ${wpsData.fillerMetalClassification || 'N/A'}
Size/Diameter: ${wpsData.fillerMetalSize || 'N/A'}
F-Number: ${wpsData.fNumber || 'N/A'}
A-Number: ${wpsData.aNumber || 'N/A'}

ELECTRICAL CHARACTERISTICS
---------------------------
Current Type: ${wpsData.currentType || 'N/A'}
Polarity: ${wpsData.polarity || 'N/A'}
Amperage Range: ${wpsData.amperageRange || 'N/A'}
Voltage Range: ${wpsData.voltageRange || 'N/A'}
Travel Speed: ${wpsData.travelSpeed || 'N/A'}
Heat Input: ${wpsData.heatInput || 'N/A'}

POSITIONS
---------
Position: ${wpsData.position || 'N/A'}
Groove: ${wpsData.groovePosition || 'N/A'}
Fillet: ${wpsData.filletPosition || 'N/A'}

PREHEAT & POSTWELD HEAT TREATMENT
----------------------------------
Preheat Temperature: ${wpsData.preheatTemp || 'N/A'}
Interpass Temperature: ${wpsData.interpassTemp || 'N/A'}
PWHT Required: ${wpsData.pwhtRequired || 'N/A'}
PWHT Temperature: ${wpsData.pwhtTemp || 'N/A'}
PWHT Time: ${wpsData.pwhtTime || 'N/A'}

SHIELDING
---------
Shielding Gas Type: ${wpsData.shieldingGasType || 'N/A'}
Shielding Gas Flow: ${wpsData.shieldingGasFlow || 'N/A'}
Backing Gas: ${wpsData.backingGas || 'N/A'}
Backing Gas Flow: ${wpsData.backingGasFlow || 'N/A'}

TECHNIQUE
---------
Bead Type: ${wpsData.beadType || 'N/A'}
Oscillation: ${wpsData.oscillation || 'N/A'}
Interpass Cleaning: ${wpsData.cleaning || 'N/A'}
Peening: ${wpsData.peening || 'N/A'}

Generated by WeldTech Solutions WPS Builder
Date: ${new Date().toLocaleDateString()}
    `.trim()
  }

  const completionPercentage = () => {
    const totalFields = Object.keys(wpsData).length
    const filledFields = Object.values(wpsData).filter(val => val !== '').length
    return Math.round((filledFields / totalFields) * 100)
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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              WPS Builder Interactivo
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Constructor de Especificaciones de Procedimientos de Soldadura (Welding Procedure Specification)
            </p>
          </div>

          {/* Info para usuarios autenticados */}
          {status === 'authenticated' && session && (
            <Card className="mb-6 bg-gradient-to-r from-purple-600/10 to-green-600/10 border-purple-600/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 rounded-full p-2">
                    <FileSpreadsheet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">Funciones de Desarrollador Activadas</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Como usuario autenticado, tienes acceso a funciones avanzadas:
                    </p>
                    <ul className="text-gray-300 text-sm space-y-1 mb-3">
                      <li>• <strong className="text-purple-400">Cargar Plantilla Excel</strong>: Importa datos WPS desde archivos .xlsx</li>
                      <li>• <strong className="text-green-400">Generar Word Profesional</strong>: Crea documentos con branding corporativo</li>
                    </ul>
                    <a 
                      href="/templates/plantilla_wps_ejemplo.xlsx" 
                      download
                      className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 underline"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Descargar plantilla Excel de ejemplo
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Bar */}
          <Card className="mb-8 bg-gradient-to-r from-[#FF7A00]/10 to-[#2AA1FF]/10 border-[#FF7A00]/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Progreso de completado</span>
                <Badge className="bg-[#FF7A00] text-white">{completionPercentage()}%</Badge>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-[#FF7A00] to-[#2AA1FF] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={handleSave} className="bg-[#FF7A00] hover:bg-[#FF7A00]/80">
              <Save className="w-4 h-4 mr-2" />
              Guardar WPS
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="border-[#2AA1FF] text-[#2AA1FF] hover:bg-[#2AA1FF]/10">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            
            {/* Botón para generar Word - solo para usuarios autenticados */}
            {status === 'authenticated' && session && (
              <Button 
                onClick={handleGenerateWord} 
                disabled={isGeneratingWord}
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-600/10"
              >
                {isGeneratingWord ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generar Word Profesional
                  </>
                )}
              </Button>
            )}
            
            {/* Botón para cargar plantilla Excel - solo para usuarios autenticados */}
            {status === 'authenticated' && session && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleLoadExcel}
                  className="hidden"
                  id="excel-upload"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-600/10"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Cargar Plantilla Excel
                  <Badge className="ml-2 bg-purple-600 text-white text-xs">Dev</Badge>
                </Button>
              </>
            )}
            
            <Button onClick={handleClear} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Form Tabs */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-900/50 mb-8">
              <TabsTrigger value="general" className="data-[state=active]:bg-[#FF7A00]">General</TabsTrigger>
              <TabsTrigger value="joint" className="data-[state=active]:bg-[#FF7A00]">Junta</TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-[#FF7A00]">Materiales</TabsTrigger>
              <TabsTrigger value="electrical" className="data-[state=active]:bg-[#FF7A00]">Eléctrico</TabsTrigger>
              <TabsTrigger value="thermal" className="data-[state=active]:bg-[#FF7A00]">Térmico</TabsTrigger>
              <TabsTrigger value="technique" className="data-[state=active]:bg-[#FF7A00]">Técnica</TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Información General</CardTitle>
                  <CardDescription className="text-gray-400">Datos básicos del WPS</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="wpsNumber" className="text-white flex items-center gap-2">
                      Número WPS <AlertCircle className="w-4 h-4 text-red-400" />
                    </Label>
                    <Input
                      id="wpsNumber"
                      value={wpsData.wpsNumber}
                      onChange={(e) => handleInputChange('wpsNumber', e.target.value)}
                      placeholder="Ej: WPS-001"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-white flex items-center gap-2">
                      Compañía <AlertCircle className="w-4 h-4 text-red-400" />
                    </Label>
                    <Input
                      id="company"
                      value={wpsData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nombre de la empresa"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-white">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={wpsData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preparedBy" className="text-white">Preparado por</Label>
                    <Input
                      id="preparedBy"
                      value={wpsData.preparedBy}
                      onChange={(e) => handleInputChange('preparedBy', e.target.value)}
                      placeholder="Nombre del inspector/ingeniero"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="process" className="text-white">Proceso de Soldadura</Label>
                    <select
                      id="process"
                      value={wpsData.process}
                      onChange={(e) => handleInputChange('process', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione proceso</option>
                      <option value="SMAW">SMAW (Stick)</option>
                      <option value="GMAW">GMAW (MIG)</option>
                      <option value="GTAW">GTAW (TIG)</option>
                      <option value="FCAW">FCAW (Flux-Cored)</option>
                      <option value="SAW">SAW (Submerged Arc)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="processType" className="text-white">Tipo de Proceso</Label>
                    <select
                      id="processType"
                      value={wpsData.processType}
                      onChange={(e) => handleInputChange('processType', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="Manual">Manual</option>
                      <option value="Semi-Automatic">Semi-Automático</option>
                      <option value="Automatic">Automático</option>
                      <option value="Machine">Máquina</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Joint Design Tab */}
            <TabsContent value="joint">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Diseño de Junta</CardTitle>
                  <CardDescription className="text-gray-400">Configuración de la junta soldada</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jointType" className="text-white">Tipo de Junta</Label>
                    <select
                      id="jointType"
                      value={wpsData.jointType}
                      onChange={(e) => handleInputChange('jointType', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="Butt Joint">Butt Joint (Tope)</option>
                      <option value="Corner Joint">Corner Joint (Esquina)</option>
                      <option value="T-Joint">T-Joint</option>
                      <option value="Lap Joint">Lap Joint (Solape)</option>
                      <option value="Edge Joint">Edge Joint (Borde)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="grooveAngle" className="text-white">Ángulo de Ranura</Label>
                    <Input
                      id="grooveAngle"
                      value={wpsData.grooveAngle}
                      onChange={(e) => handleInputChange('grooveAngle', e.target.value)}
                      placeholder="Ej: 30°, 60°, 90°"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rootOpening" className="text-white">Abertura de Raíz</Label>
                    <Input
                      id="rootOpening"
                      value={wpsData.rootOpening}
                      onChange={(e) => handleInputChange('rootOpening', e.target.value)}
                      placeholder="Ej: 2mm, 1/8 in"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rootFaceThickness" className="text-white">Espesor de Cara de Raíz</Label>
                    <Input
                      id="rootFaceThickness"
                      value={wpsData.rootFaceThickness}
                      onChange={(e) => handleInputChange('rootFaceThickness', e.target.value)}
                      placeholder="Ej: 1mm, 1/16 in"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backingType" className="text-white">Tipo de Respaldo</Label>
                    <select
                      id="backingType"
                      value={wpsData.backingType}
                      onChange={(e) => handleInputChange('backingType', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="None">Sin respaldo</option>
                      <option value="Steel Backing">Respaldo de acero</option>
                      <option value="Ceramic Backing">Respaldo cerámico</option>
                      <option value="Gas Backing">Respaldo de gas</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Materiales Base y de Aporte</CardTitle>
                  <CardDescription className="text-gray-400">Especificaciones de materiales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Base Metals Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF7A00] mb-4">Metal Base</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="baseMaterialSpec" className="text-white">Especificación</Label>
                        <Input
                          id="baseMaterialSpec"
                          value={wpsData.baseMaterialSpec}
                          onChange={(e) => handleInputChange('baseMaterialSpec', e.target.value)}
                          placeholder="Ej: ASTM A36, SA-516"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="baseMaterialType" className="text-white">Tipo/Grado</Label>
                        <Input
                          id="baseMaterialType"
                          value={wpsData.baseMaterialType}
                          onChange={(e) => handleInputChange('baseMaterialType', e.target.value)}
                          placeholder="Ej: Grade 70, Gr. B"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="baseMaterialThickness" className="text-white">Rango de Espesor</Label>
                        <Input
                          id="baseMaterialThickness"
                          value={wpsData.baseMaterialThickness}
                          onChange={(e) => handleInputChange('baseMaterialThickness', e.target.value)}
                          placeholder="Ej: 6mm - 25mm"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pNumber" className="text-white">P-Number (ASME)</Label>
                        <Input
                          id="pNumber"
                          value={wpsData.pNumber}
                          onChange={(e) => handleInputChange('pNumber', e.target.value)}
                          placeholder="Ej: P-1, P-8"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filler Metals Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2AA1FF] mb-4">Metal de Aporte</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fillerMetalSpec" className="text-white">Especificación AWS</Label>
                        <Input
                          id="fillerMetalSpec"
                          value={wpsData.fillerMetalSpec}
                          onChange={(e) => handleInputChange('fillerMetalSpec', e.target.value)}
                          placeholder="Ej: AWS A5.1, A5.18"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fillerMetalClassification" className="text-white">Clasificación</Label>
                        <Input
                          id="fillerMetalClassification"
                          value={wpsData.fillerMetalClassification}
                          onChange={(e) => handleInputChange('fillerMetalClassification', e.target.value)}
                          placeholder="Ej: E7018, ER70S-6"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fillerMetalSize" className="text-white">Tamaño/Diámetro</Label>
                        <Input
                          id="fillerMetalSize"
                          value={wpsData.fillerMetalSize}
                          onChange={(e) => handleInputChange('fillerMetalSize', e.target.value)}
                          placeholder="Ej: 3.2mm, 1/8 in"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fNumber" className="text-white">F-Number</Label>
                        <Input
                          id="fNumber"
                          value={wpsData.fNumber}
                          onChange={(e) => handleInputChange('fNumber', e.target.value)}
                          placeholder="Ej: F-1, F-4"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="aNumber" className="text-white">A-Number</Label>
                        <Input
                          id="aNumber"
                          value={wpsData.aNumber}
                          onChange={(e) => handleInputChange('aNumber', e.target.value)}
                          placeholder="Ej: A-1"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Electrical Tab */}
            <TabsContent value="electrical">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Características Eléctricas</CardTitle>
                  <CardDescription className="text-gray-400">Parámetros de soldadura</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currentType" className="text-white">Tipo de Corriente</Label>
                    <select
                      id="currentType"
                      value={wpsData.currentType}
                      onChange={(e) => handleInputChange('currentType', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="AC">AC (Corriente Alterna)</option>
                      <option value="DC">DC (Corriente Continua)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="polarity" className="text-white">Polaridad</Label>
                    <select
                      id="polarity"
                      value={wpsData.polarity}
                      onChange={(e) => handleInputChange('polarity', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione polaridad</option>
                      <option value="DCEP">DCEP (Electrode Positive)</option>
                      <option value="DCEN">DCEN (Electrode Negative)</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="amperageRange" className="text-white">Rango de Amperaje</Label>
                    <Input
                      id="amperageRange"
                      value={wpsData.amperageRange}
                      onChange={(e) => handleInputChange('amperageRange', e.target.value)}
                      placeholder="Ej: 90-120 A"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voltageRange" className="text-white">Rango de Voltaje</Label>
                    <Input
                      id="voltageRange"
                      value={wpsData.voltageRange}
                      onChange={(e) => handleInputChange('voltageRange', e.target.value)}
                      placeholder="Ej: 22-26 V"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelSpeed" className="text-white">Velocidad de Avance</Label>
                    <Input
                      id="travelSpeed"
                      value={wpsData.travelSpeed}
                      onChange={(e) => handleInputChange('travelSpeed', e.target.value)}
                      placeholder="Ej: 12-18 cm/min"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heatInput" className="text-white">Entrada de Calor</Label>
                    <Input
                      id="heatInput"
                      value={wpsData.heatInput}
                      onChange={(e) => handleInputChange('heatInput', e.target.value)}
                      placeholder="Ej: 1.0-2.5 kJ/mm"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="position" className="text-white">Posiciones de Soldadura</Label>
                    <Input
                      id="position"
                      value={wpsData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Ej: PA, PF, PE, All positions"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Thermal Tab */}
            <TabsContent value="thermal">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Tratamientos Térmicos</CardTitle>
                  <CardDescription className="text-gray-400">Precalentamiento y PWHT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="preheatTemp" className="text-white">Temperatura de Precalentamiento</Label>
                      <Input
                        id="preheatTemp"
                        value={wpsData.preheatTemp}
                        onChange={(e) => handleInputChange('preheatTemp', e.target.value)}
                        placeholder="Ej: 150°C, 300°F, None"
                        className="mt-2 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="interpassTemp" className="text-white">Temperatura Entre Pasadas</Label>
                      <Input
                        id="interpassTemp"
                        value={wpsData.interpassTemp}
                        onChange={(e) => handleInputChange('interpassTemp', e.target.value)}
                        placeholder="Ej: Max 250°C"
                        className="mt-2 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF7A00] mb-4">Tratamiento Térmico Post-Soldadura (PWHT)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="pwhtRequired" className="text-white">¿PWHT Requerido?</Label>
                        <select
                          id="pwhtRequired"
                          value={wpsData.pwhtRequired}
                          onChange={(e) => handleInputChange('pwhtRequired', e.target.value)}
                          className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Sí</option>
                          <option value="Per Code">Según Código</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="pwhtTemp" className="text-white">Temperatura PWHT</Label>
                        <Input
                          id="pwhtTemp"
                          value={wpsData.pwhtTemp}
                          onChange={(e) => handleInputChange('pwhtTemp', e.target.value)}
                          placeholder="Ej: 620-650°C"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                          disabled={wpsData.pwhtRequired === 'No'}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pwhtTime" className="text-white">Tiempo PWHT</Label>
                        <Input
                          id="pwhtTime"
                          value={wpsData.pwhtTime}
                          onChange={(e) => handleInputChange('pwhtTime', e.target.value)}
                          placeholder="Ej: 1 hr/in thickness"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                          disabled={wpsData.pwhtRequired === 'No'}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#2AA1FF] mb-4">Gas de Protección</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="shieldingGasType" className="text-white">Tipo de Gas</Label>
                        <select
                          id="shieldingGasType"
                          value={wpsData.shieldingGasType}
                          onChange={(e) => handleInputChange('shieldingGasType', e.target.value)}
                          className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                        >
                          <option value="">Seleccione gas</option>
                          <option value="None">Sin gas (SMAW)</option>
                          <option value="CO2">CO2</option>
                          <option value="Ar">Argon (Ar)</option>
                          <option value="Ar+CO2">Ar + CO2 Mix</option>
                          <option value="Ar+O2">Ar + O2 Mix</option>
                          <option value="He">Helio (He)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="shieldingGasFlow" className="text-white">Flujo de Gas</Label>
                        <Input
                          id="shieldingGasFlow"
                          value={wpsData.shieldingGasFlow}
                          onChange={(e) => handleInputChange('shieldingGasFlow', e.target.value)}
                          placeholder="Ej: 15-20 L/min, 20-25 CFH"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="backingGas" className="text-white">Gas de Respaldo</Label>
                        <Input
                          id="backingGas"
                          value={wpsData.backingGas}
                          onChange={(e) => handleInputChange('backingGas', e.target.value)}
                          placeholder="Ej: Argon, None"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="backingGasFlow" className="text-white">Flujo Gas Respaldo</Label>
                        <Input
                          id="backingGasFlow"
                          value={wpsData.backingGasFlow}
                          onChange={(e) => handleInputChange('backingGasFlow', e.target.value)}
                          placeholder="Ej: 10-15 L/min"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technique Tab */}
            <TabsContent value="technique">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Técnica de Soldadura</CardTitle>
                  <CardDescription className="text-gray-400">Métodos y procedimientos</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="beadType" className="text-white">Tipo de Cordón</Label>
                    <select
                      id="beadType"
                      value={wpsData.beadType}
                      onChange={(e) => handleInputChange('beadType', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="Stringer">Stringer (Recto)</option>
                      <option value="Weave">Weave (Tejido)</option>
                      <option value="Stringer or Weave">Stringer o Weave</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="oscillation" className="text-white">Oscilación</Label>
                    <Input
                      id="oscillation"
                      value={wpsData.oscillation}
                      onChange={(e) => handleInputChange('oscillation', e.target.value)}
                      placeholder="Ej: None, Max 3x electrode dia"
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cleaning" className="text-white">Limpieza Entre Pasadas</Label>
                    <select
                      id="cleaning"
                      value={wpsData.cleaning}
                      onChange={(e) => handleInputChange('cleaning', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione método</option>
                      <option value="Wire Brush">Cepillo de alambre</option>
                      <option value="Grinder">Esmeriladora</option>
                      <option value="Wire Brush + Grinder">Cepillo + Esmeriladora</option>
                      <option value="Chipping Hammer">Martillo cincelador</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="peening" className="text-white">Martillado (Peening)</Label>
                    <select
                      id="peening"
                      value={wpsData.peening}
                      onChange={(e) => handleInputChange('peening', e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                    >
                      <option value="">Seleccione opción</option>
                      <option value="None">No permitido</option>
                      <option value="Allowed">Permitido</option>
                      <option value="Required">Requerido</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Saved WPS List */}
          {savedWPS.length > 0 && (
            <Card className="mt-8 bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  WPS Guardados ({savedWPS.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedWPS.map((wps, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold">{wps.wpsNumber}</p>
                        <p className="text-gray-400 text-sm">{wps.company} - {wps.process}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWpsData(wps)}
                        className="border-[#2AA1FF] text-[#2AA1FF] hover:bg-[#2AA1FF]/10"
                      >
                        Cargar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
