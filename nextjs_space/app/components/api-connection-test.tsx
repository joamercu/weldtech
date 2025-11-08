'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react'

interface ConnectionTestResult {
  success: boolean
  message?: string
  error?: string
  details?: string
  responseTime?: string
  config?: {
    hasApiKey: boolean
    apiKeyFormat?: string
    hasDeploymentId?: boolean
    apiKeyPrefix?: string
    endpoint?: string
    workingConfiguration?: string
  }
  testResult?: {
    status?: number
    hasResponse?: boolean
    responseType?: string
    successfulConfig?: string
    requestData?: any
  }
  testedConfigurations?: string[]
  lastError?: {
    config?: string
    error?: string
    status?: number
  }
  solution?: {
    required?: string
    steps?: string[]
    alternative?: string
    suggestion?: string
  }
}

export default function ApiConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<ConnectionTestResult | null>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/images/test-connection')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Error al probar conexión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Wifi className="h-5 w-5" />
          Prueba de Conexión con Abacus.AI
        </CardTitle>
        <CardDescription className="text-gray-300">
          Verifica que la API key sea válida y que la conexión funcione correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testConnection}
          disabled={testing}
          className="w-full bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Probando conexión...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              Probar Conexión
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
                {result.success ? 'Conexión Exitosa' : 'Error de Conexión'}
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

            {result.config && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-gray-400 mb-2">Configuración:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">API Key configurada:</span>
                    <Badge variant="outline" className={
                      result.config.hasApiKey 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {result.config.hasApiKey ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                  
                  {result.config.apiKeyFormat && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Formato de API Key:</span>
                      <Badge variant="outline" className={
                        result.config.apiKeyFormat === 'correcto'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {result.config.apiKeyFormat}
                      </Badge>
                    </div>
                  )}

                  {result.config.apiKeyPrefix && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">API Key (prefijo):</span>
                      <span className="text-sm text-gray-400 font-mono">{result.config.apiKeyPrefix}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Deployment ID:</span>
                    <Badge variant="outline" className={
                      result.config.hasDeploymentId
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {result.config.hasDeploymentId ? 'Configurado' : 'No configurado (opcional)'}
                    </Badge>
                  </div>

                  {result.config.endpoint && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Endpoint:</span>
                      <span className="text-sm text-gray-400 font-mono text-xs">{result.config.endpoint}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.testResult && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-gray-400 mb-2">Resultado de la Prueba:</p>
                <div className="space-y-2">
                  {result.testResult.successfulConfig && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Configuración exitosa:</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {result.testResult.successfulConfig}
                      </Badge>
                    </div>
                  )}
                  
                  {result.testResult.status && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Status HTTP:</span>
                      <Badge variant="outline" className={
                        result.testResult.status === 200
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {result.testResult.status}
                      </Badge>
                    </div>
                  )}
                  
                  {result.testResult.hasResponse !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Respuesta recibida:</span>
                      <Badge variant="outline" className={
                        result.testResult.hasResponse
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {result.testResult.hasResponse ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.testedConfigurations && result.testedConfigurations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-gray-400 mb-2">Configuraciones Probadas:</p>
                <ul className="space-y-1">
                  {result.testedConfigurations.map((config, index) => (
                    <li key={index} className="text-sm text-gray-300">
                      • {config}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.solution && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-semibold text-yellow-400 mb-2">💡 Solución Propuesta:</p>
                {result.solution.required && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-yellow-400 mb-2">{result.solution.required}</p>
                    {result.solution.steps && (
                      <ol className="space-y-2 ml-4">
                        {result.solution.steps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-300 list-decimal">
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                    {result.solution.alternative && (
                      <p className="text-sm text-gray-400 mt-2 italic">{result.solution.alternative}</p>
                    )}
                  </div>
                )}
                {result.solution.suggestion && (
                  <p className="text-sm text-gray-300">{result.solution.suggestion}</p>
                )}
              </div>
            )}
          </div>
        )}

        {!result && !testing && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">Información</span>
            </div>
            <p className="text-sm text-gray-300">
              Esta prueba enviará una solicitud de prueba a la API de Abacus.AI para verificar que:
            </p>
            <ul className="text-sm text-gray-300 mt-2 ml-4 list-disc space-y-1">
              <li>La API key esté configurada correctamente</li>
              <li>La conexión con el servidor funcione</li>
              <li>La API responda correctamente</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

