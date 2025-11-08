'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2, Calendar, Award, AlertCircle, CheckCircle2, User, Edit, Search, Download } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface Qualification {
  id: string
  welderName: string
  welderID: string
  standard: string
  process: string
  position: string
  material: string
  certificationDate: string
  expiryDate: string
  status: 'active' | 'expiring-soon' | 'expired'
  testingAgency: string
  notes: string
}

export default function QualificationTracker() {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: '1',
      welderName: 'Juan Pérez',
      welderID: 'WLD-001',
      standard: 'AWS D1.1',
      process: 'SMAW',
      position: '3G, 4G',
      material: 'Carbon Steel',
      certificationDate: '2024-05-15',
      expiryDate: '2024-11-15',
      status: 'expiring-soon',
      testingAgency: 'AWS Certified Testing',
      notes: 'Renovación pendiente'
    },
    {
      id: '2',
      welderName: 'María González',
      welderID: 'WLD-002',
      standard: 'ASME IX',
      process: 'GTAW',
      position: '6G',
      material: 'Stainless Steel',
      certificationDate: '2024-08-01',
      expiryDate: '2025-08-01',
      status: 'active',
      testingAgency: 'ASME Authorized',
      notes: 'Calificación completa'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentQualification, setCurrentQualification] = useState<Qualification | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [formData, setFormData] = useState({
    welderName: '',
    welderID: '',
    standard: '',
    process: '',
    position: '',
    material: '',
    certificationDate: '',
    expiryDate: '',
    testingAgency: '',
    notes: ''
  })

  const calculateStatus = (expiryDate: string): 'active' | 'expiring-soon' | 'expired' => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring-soon'
    return 'active'
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddQualification = () => {
    if (!formData.welderName || !formData.welderID || !formData.certificationDate || !formData.expiryDate) {
      toast.error('Por favor complete los campos obligatorios')
      return
    }

    const newQualification: Qualification = {
      id: Date.now().toString(),
      ...formData,
      status: calculateStatus(formData.expiryDate)
    }

    setQualifications(prev => [...prev, newQualification])
    toast.success('Calificación agregada exitosamente')
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditQualification = () => {
    if (!currentQualification) return

    const updatedQualifications = qualifications.map(q =>
      q.id === currentQualification.id
        ? { ...formData, id: q.id, status: calculateStatus(formData.expiryDate) }
        : q
    )

    setQualifications(updatedQualifications)
    toast.success('Calificación actualizada')
    resetForm()
    setIsAddDialogOpen(false)
    setIsEditMode(false)
    setCurrentQualification(null)
  }

  const handleDeleteQualification = (id: string) => {
    setQualifications(prev => prev.filter(q => q.id !== id))
    toast.success('Calificación eliminada')
  }

  const openEditDialog = (qual: Qualification) => {
    setCurrentQualification(qual)
    setFormData({
      welderName: qual.welderName,
      welderID: qual.welderID,
      standard: qual.standard,
      process: qual.process,
      position: qual.position,
      material: qual.material,
      certificationDate: qual.certificationDate,
      expiryDate: qual.expiryDate,
      testingAgency: qual.testingAgency,
      notes: qual.notes
    })
    setIsEditMode(true)
    setIsAddDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      welderName: '',
      welderID: '',
      standard: '',
      process: '',
      position: '',
      material: '',
      certificationDate: '',
      expiryDate: '',
      testingAgency: '',
      notes: ''
    })
  }

  const filteredQualifications = qualifications.filter(qual => {
    const matchesSearch =
      qual.welderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qual.welderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qual.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qual.process.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || qual.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'expiring-soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'expiring-soon':
        return 'Por Vencer'
      case 'expired':
        return 'Vencido'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />
      case 'expiring-soon':
        return <AlertCircle className="w-4 h-4" />
      case 'expired':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const stats = {
    total: qualifications.length,
    active: qualifications.filter(q => q.status === 'active').length,
    expiringSoon: qualifications.filter(q => q.status === 'expiring-soon').length,
    expired: qualifications.filter(q => q.status === 'expired').length
  }

  const handleExportPDF = () => {
    try {
      toast.info('Generando PDF...')
      const doc = new jsPDF()
      
      // Header
      doc.setFillColor(255, 122, 0)
      doc.rect(0, 0, 210, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('Qualification Tracker Report', 105, 10, { align: 'center' })
      doc.setFontSize(10)
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 105, 17, { align: 'center' })
      
      let y = 30
      
      // Stats
      doc.setFillColor(42, 161, 255, 0.1)
      doc.rect(15, y, 180, 25, 'F')
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Resumen Estadístico', 20, y + 7)
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total: ${stats.total}`, 20, y + 14)
      doc.text(`Activos: ${stats.active}`, 60, y + 14)
      doc.text(`Por Vencer: ${stats.expiringSoon}`, 100, y + 14)
      doc.text(`Vencidos: ${stats.expired}`, 150, y + 14)
      
      y += 32
      
      // Table Header
      doc.setFillColor(42, 161, 255)
      doc.rect(15, y, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('Soldador', 18, y + 5)
      doc.text('ID', 55, y + 5)
      doc.text('Norma', 75, y + 5)
      doc.text('Proceso', 105, y + 5)
      doc.text('Posiciones', 135, y + 5)
      doc.text('Estado', 170, y + 5)
      
      y += 10
      
      // Table Content
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      
      filteredQualifications.forEach((qual, index) => {
        if (y > 270) {
          doc.addPage()
          y = 20
          
          // Repeat header on new page
          doc.setFillColor(42, 161, 255)
          doc.rect(15, y, 180, 8, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8)
          doc.text('Soldador', 18, y + 5)
          doc.text('ID', 55, y + 5)
          doc.text('Norma', 75, y + 5)
          doc.text('Proceso', 105, y + 5)
          doc.text('Posiciones', 135, y + 5)
          doc.text('Estado', 170, y + 5)
          y += 10
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'normal')
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245)
          doc.rect(15, y - 3, 180, 6, 'F')
        }
        
        doc.setFontSize(7)
        const nameText = qual.welderName.length > 18 ? qual.welderName.substring(0, 16) + '...' : qual.welderName
        doc.text(nameText, 18, y)
        doc.text(qual.welderID, 55, y)
        doc.text(qual.standard, 75, y)
        doc.text(qual.process, 105, y)
        doc.text(qual.position, 135, y)
        
        // Status with color
        if (qual.status === 'active') {
          doc.setTextColor(34, 197, 94)
        } else if (qual.status === 'expiring-soon') {
          doc.setTextColor(234, 179, 8)
        } else {
          doc.setTextColor(239, 68, 68)
        }
        doc.text(getStatusLabel(qual.status), 170, y)
        doc.setTextColor(0, 0, 0)
        
        y += 6
        
        // Additional details in smaller text
        doc.setFontSize(6)
        doc.setTextColor(100, 100, 100)
        doc.text(`Material: ${qual.material}`, 18, y)
        doc.text(`Cert: ${new Date(qual.certificationDate).toLocaleDateString('es-ES')}`, 90, y)
        doc.text(`Vence: ${new Date(qual.expiryDate).toLocaleDateString('es-ES')}`, 135, y)
        y += 5
        
        if (qual.notes) {
          const notesSplit = doc.splitTextToSize(`Notas: ${qual.notes}`, 175)
          doc.text(notesSplit, 18, y)
          y += notesSplit.length * 3
        }
        
        y += 3
        doc.setTextColor(0, 0, 0)
        
        // Separator line
        doc.setDrawColor(220, 220, 220)
        doc.line(15, y, 195, y)
        y += 3
      })
      
      // Footer on all pages
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(128, 128, 128)
        doc.rect(0, 285, 210, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(`WeldTech Solutions - Qualification Tracker | Página ${i} de ${pageCount}`, 105, 291, { align: 'center' })
      }
      
      doc.save(`Qualification_Tracker_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`)
      toast.success('PDF generado exitosamente')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error al generar el PDF')
    }
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
              Qualification Tracker
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Sistema de seguimiento y gestión de certificaciones de soldadores
            </p>
          </div>

          {/* Export Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleExportPDF}
              className="bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte a PDF
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Award className="w-10 h-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Activos</p>
                    <p className="text-3xl font-bold text-white">{stats.active}</p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Por Vencer</p>
                    <p className="text-3xl font-bold text-white">{stats.expiringSoon}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Vencidos</p>
                    <p className="text-3xl font-bold text-white">{stats.expired}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="mb-8 bg-gray-900/50 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, ID, norma o proceso..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="expiring-soon">Por vencer</option>
                  <option value="expired">Vencidos</option>
                </select>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open)
                  if (!open) {
                    resetForm()
                    setIsEditMode(false)
                    setCurrentQualification(null)
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FF7A00] hover:bg-[#FF7A00]/80">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Calificación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-white">
                        {isEditMode ? 'Editar Calificación' : 'Nueva Calificación'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {isEditMode ? 'Actualice la información de la calificación' : 'Complete la información del soldador certificado'}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                      {/* Welder Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="welderName" className="text-white">Nombre del Soldador *</Label>
                          <Input
                            id="welderName"
                            value={formData.welderName}
                            onChange={(e) => handleInputChange('welderName', e.target.value)}
                            placeholder="Nombre completo"
                            className="mt-2 bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="welderID" className="text-white">ID del Soldador *</Label>
                          <Input
                            id="welderID"
                            value={formData.welderID}
                            onChange={(e) => handleInputChange('welderID', e.target.value)}
                            placeholder="WLD-XXX"
                            className="mt-2 bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>

                      {/* Certification Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="standard" className="text-white">Norma/Código</Label>
                          <select
                            id="standard"
                            value={formData.standard}
                            onChange={(e) => handleInputChange('standard', e.target.value)}
                            className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                          >
                            <option value="">Seleccione norma</option>
                            <option value="AWS D1.1">AWS D1.1 - Structural Steel</option>
                            <option value="ASME IX">ASME Section IX</option>
                            <option value="API 1104">API 1104 - Pipeline</option>
                            <option value="AWS D1.2">AWS D1.2 - Aluminum</option>
                            <option value="EN ISO 9606">EN ISO 9606</option>
                            <option value="AWS D1.6">AWS D1.6 - Stainless Steel</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="process" className="text-white">Proceso de Soldadura</Label>
                          <select
                            id="process"
                            value={formData.process}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position" className="text-white">Posiciones Calificadas</Label>
                          <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            placeholder="Ej: 1G, 2G, 3G, 4G, 5G, 6G"
                            className="mt-2 bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="material" className="text-white">Material</Label>
                          <select
                            id="material"
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                            className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                          >
                            <option value="">Seleccione material</option>
                            <option value="Carbon Steel">Acero al Carbono</option>
                            <option value="Stainless Steel">Acero Inoxidable</option>
                            <option value="Aluminum">Aluminio</option>
                            <option value="Low Alloy Steel">Acero de Baja Aleación</option>
                            <option value="Nickel Alloys">Aleaciones de Níquel</option>
                          </select>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="certificationDate" className="text-white">Fecha de Certificación *</Label>
                          <Input
                            id="certificationDate"
                            type="date"
                            value={formData.certificationDate}
                            onChange={(e) => handleInputChange('certificationDate', e.target.value)}
                            className="mt-2 bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate" className="text-white">Fecha de Expiración *</Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className="mt-2 bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>

                      {/* Testing Agency */}
                      <div>
                        <Label htmlFor="testingAgency" className="text-white">Agencia de Pruebas</Label>
                        <Input
                          id="testingAgency"
                          value={formData.testingAgency}
                          onChange={(e) => handleInputChange('testingAgency', e.target.value)}
                          placeholder="Nombre de la entidad certificadora"
                          className="mt-2 bg-gray-800 border-gray-700 text-white"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes" className="text-white">Notas</Label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Información adicional..."
                          rows={3}
                          className="mt-2 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={isEditMode ? handleEditQualification : handleAddQualification}
                          className="flex-1 bg-[#FF7A00] hover:bg-[#FF7A00]/80"
                        >
                          {isEditMode ? 'Actualizar' : 'Guardar'} Calificación
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            resetForm()
                            setIsAddDialogOpen(false)
                            setIsEditMode(false)
                            setCurrentQualification(null)
                          }}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Qualifications List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredQualifications.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="py-12 text-center">
                  <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No se encontraron calificaciones</p>
                </CardContent>
              </Card>
            ) : (
              filteredQualifications.map((qual, index) => (
                <motion.div
                  key={qual.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-[#FF7A00]/50 transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Welder Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#2AA1FF] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{qual.welderName}</h3>
                              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                                {qual.welderID}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(qual.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(qual.status)}
                                  {getStatusLabel(qual.status)}
                                </span>
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                              <div>
                                <p className="text-gray-500">Norma</p>
                                <p className="text-gray-300 font-semibold">{qual.standard}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Proceso</p>
                                <p className="text-gray-300 font-semibold">{qual.process}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Posiciones</p>
                                <p className="text-gray-300 font-semibold">{qual.position}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Material</p>
                                <p className="text-gray-300 font-semibold">{qual.material}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Certificación: {new Date(qual.certificationDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Vence: {new Date(qual.expiryDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {qual.testingAgency && (
                              <p className="text-gray-500 text-sm mt-2">
                                Certificado por: <span className="text-gray-300">{qual.testingAgency}</span>
                              </p>
                            )}
                            {qual.notes && (
                              <p className="text-gray-400 text-sm mt-2 italic">{qual.notes}</p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(qual)}
                            className="border-[#2AA1FF] text-[#2AA1FF] hover:bg-[#2AA1FF]/10"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQualification(qual.id)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Info Card */}
          <Card className="mt-8 bg-gradient-to-r from-[#FF7A00]/10 to-[#2AA1FF]/10 border-[#FF7A00]/30">
            <CardHeader>
              <CardTitle className="text-white">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <ul className="space-y-2">
                <li>• <strong>Renovación:</strong> Las certificaciones típicamente requieren renovación cada 6 meses a 1 año.</li>
                <li>• <strong>Alerta de Vencimiento:</strong> El sistema marca como "Por Vencer" las certificaciones que expiran en 30 días o menos.</li>
                <li>• <strong>AWS/ASME:</strong> Mantener documentación de actividad de soldadura continua para renovaciones.</li>
                <li>• <strong>Calificación por Posición:</strong> Posiciones más difíciles (6G) pueden cubrir posiciones más simples según el código.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

