'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, List, Copy, Check, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Deployment {
  id?: string
  deploymentId?: string
  name?: string
  model?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

interface ListDeploymentsResult {
  success: boolean
  message?: string
  error?: string
  details?: string
  responseTime?: string
  deployments?: Deployment[]
  total?: number
  config?: {
    hasApiKey: boolean
    apiKeyPrefix?: string
    endpoint?: string
    testedEndpoints?: string[]
  }
  lastError?: {
    endpoint?: string
    authFormat?: string
    error?: string
    status?: number
  }
  solution?: {
    suggestion?: string
    steps?: string[]
    alternative?: string
  }
}

export default function ListDeployments() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ListDeploymentsResult | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [manualDeploymentId, setManualDeploymentId] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [loadingProjects, setLoadingProjects] = useState(false)

  const listProjects = async () => {
    setLoadingProjects(true)
    setProjects([])
    
    try {
      const response = await fetch('/api/images/list-projects')
      const data = await response.json()
      
      if (data.success && data.projects) {
        setProjects(data.projects)
        if (data.projects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data.projects[0].projectId || data.projects[0].id || '')
        }
        toast.success(`${data.projects.length} proyecto(s) encontrado(s)`)
      } else {
        toast.error('Error al listar proyectos', {
          description: data.details || data.error
        })
      }
    } catch (error) {
      toast.error('Error al listar proyectos')
    } finally {
      setLoadingProjects(false)
    }
  }

  const listDeployments = async () => {
    if (!selectedProjectId && projects.length === 0) {
      toast.error('Primero debes listar proyectos y seleccionar uno')
      return
    }
    
    setLoading(true)
    setResult(null)
    
    try {
      const url = selectedProjectId 
        ? `/api/images/list-deployments?projectId=${selectedProjectId}`
        : '/api/images/list-deployments'
      
      const response = await fetch(url)
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('Deployments listados exitosamente')
      } else {
        toast.error('Error al listar deployments', {
          description: data.details || data.error
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Error al listar deployments',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
      toast.error('Error al listar deployments')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    toast.success('Deployment ID copiado al portapapeles')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyToEnvLocal = (deploymentId: string) => {
    const envLine = `ABACUS_DEPLOYMENT_ID=${deploymentId}`
    navigator.clipboard.writeText(envLine)
    toast.success('Línea para .env.local copiada al portapapeles')
  }

  const handleManualDeploymentId = () => {
    if (!manualDeploymentId.trim()) {
      toast.error('Ingresa un Deployment ID')
      return
    }
    copyToEnvLocal(manualDeploymentId.trim())
    setManualDeploymentId('')
    setShowManualInput(false)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <List className="h-5 w-5" />
          Listar Deployments de Abacus.AI
        </CardTitle>
        <CardDescription className="text-gray-300">
          Obtén la lista de deployments disponibles para usar en la generación de imágenes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Listar Proyectos Primero */}
        <div className="space-y-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-400">
              Paso 1: Listar Proyectos (requerido)
            </p>
            <Button
              size="sm"
              onClick={listProjects}
              disabled={loadingProjects}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loadingProjects ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Listar Proyectos'
              )}
            </Button>
          </div>
          
          {projects.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Seleccionar Proyecto:</Label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 text-sm focus:ring-[#FF7A00] focus:border-[#FF7A00]"
              >
                {projects.map((project, index) => {
                  const projectId = project.projectId || project.id || ''
                  const projectName = project.name || project.projectName || `Proyecto ${index + 1}`
                  return (
                    <option key={index} value={projectId}>
                      {projectName} ({projectId.substring(0, 20)}...)
                    </option>
                  )
                })}
              </select>
            </div>
          )}
        </div>

        {/* Listar Deployments */}
        <Button
          onClick={listDeployments}
          disabled={loading || !selectedProjectId}
          className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Listando deployments...
            </>
          ) : (
            <>
              <List className="w-4 h-4 mr-2" />
              Listar Deployments {selectedProjectId ? `(Proyecto: ${selectedProjectId.substring(0, 10)}...)` : ''}
            </>
          )}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-semibold ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.success ? 'Deployments Listados' : 'Error al Listar Deployments'}
              </span>
            </div>

            {result.message && (
              <p className="text-sm text-gray-300 mb-2">{result.message}</p>
            )}

            {result.error && (
              <div className="mb-2">
                <p className="text-sm font-semibold text-red-400 mb-1">Error:</p>
                <p className="text-sm text-gray-300">{result.error}</p>
              </div>
            )}

            {result.details && (
              <div className="mb-2">
                <p className="text-sm font-semibold text-gray-400 mb-1">Detalles:</p>
                <p className="text-sm text-gray-300">{result.details}</p>
              </div>
            )}

            {result.responseTime && (
              <div className="mb-2">
                <p className="text-sm text-gray-400">
                  Tiempo de respuesta: <span className="text-white font-semibold">{result.responseTime}</span>
                </p>
              </div>
            )}

            {result.success && result.deployments && result.deployments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-400">
                    Deployments encontrados: <span className="text-white">{result.total || result.deployments.length}</span>
                  </p>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.deployments.map((deployment, index) => {
                    const deploymentId = deployment.id || deployment.deploymentId || 'N/A'
                    return (
                      <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-white">
                                {deployment.name || `Deployment ${index + 1}`}
                              </span>
                              {deployment.status && (
                                <Badge variant="outline" className={
                                  deployment.status === 'active' || deployment.status === 'ready'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }>
                                  {deployment.status}
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">ID:</span>
                                <code className="text-xs text-gray-300 font-mono bg-gray-900 px-2 py-1 rounded">
                                  {deploymentId}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(deploymentId)}
                                >
                                  {copiedId === deploymentId ? (
                                    <Check className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                              {deployment.model && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Modelo:</span>
                                  <span className="text-xs text-gray-300">{deployment.model}</span>
                                </div>
                              )}
                              {deployment.createdAt && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Creado:</span>
                                  <span className="text-xs text-gray-300">
                                    {new Date(deployment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => copyToEnvLocal(deploymentId)}
                          >
                            Copiar para .env.local
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {result.success && result.deployments && result.deployments.length === 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  No se encontraron deployments. Puedes crear uno desde el Dashboard de Abacus.AI.
                </p>
              </div>
            )}

            {result.solution && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-yellow-400 mb-2">💡 Solución Alternativa:</p>
                {result.solution.suggestion && (
                  <p className="text-sm text-gray-300 mb-3">{result.solution.suggestion}</p>
                )}
                {result.solution.steps && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-400 mb-2">Pasos para obtener el Deployment ID:</p>
                    <ol className="space-y-2 ml-4">
                      {result.solution.steps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-300 list-decimal">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {result.solution.alternative && (
                  <p className="text-sm text-gray-400 mt-2 italic">{result.solution.alternative}</p>
                )}
              </div>
            )}

            {result.config?.testedEndpoints && result.config.testedEndpoints.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-gray-400 mb-2">Endpoints Probados:</p>
                <ul className="space-y-1">
                  {result.config.testedEndpoints.map((endpoint, index) => (
                    <li key={index} className="text-sm text-gray-300 font-mono text-xs">
                      • {endpoint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Entrada Manual de Deployment ID */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-400">
              Ingresar Deployment ID Manualmente
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs"
            >
              {showManualInput ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
          
          {showManualInput && (
            <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="space-y-2">
                <Label htmlFor="manual-deployment-id" className="text-sm text-gray-300">
                  Deployment ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="manual-deployment-id"
                    placeholder="Pega aquí el deploymentId obtenido del Dashboard"
                    value={manualDeploymentId}
                    onChange={(e) => setManualDeploymentId(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:ring-[#FF7A00]"
                  />
                  <Button
                    onClick={handleManualDeploymentId}
                    disabled={!manualDeploymentId.trim()}
                    className="bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar para .env.local
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Si obtuviste el deploymentId del Dashboard de Abacus.AI, pégalo aquí y haz clic en "Copiar para .env.local"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

