'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageGeneratorProps {
  initialData?: any; // Datos de entrada (ej: datos WPS)
  onImageGenerated?: (imageUrl: string) => void;
}

export default function ImageGenerator({ initialData, onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Ingrese un prompt para generar la imagen');
      return;
    }

    setGenerating(true);
    setImageUrl(null);
    setGeneratedPrompt(null);
    
    try {
      toast.info('Generando imagen con IA...');
      
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style: style || undefined,
          data: initialData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Error al generar imagen');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al generar imagen');
      }

      setImageUrl(result.imageUrl);
      setGeneratedPrompt(result.prompt);
      
      toast.success('✅ Imagen generada exitosamente');
      
      // Llamar callback si existe
      if (onImageGenerated && result.imageUrl) {
        onImageGenerated(result.imageUrl);
      }

    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Error al generar imagen', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      // Si es una URL, descargar la imagen
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weldtech-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Imagen descargada');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Error al descargar imagen');
    }
  };

  const handleClear = () => {
    setPrompt('');
    setStyle('');
    setImageUrl(null);
    setGeneratedPrompt(null);
  };

  // Prompts predefinidos de marca WeldTech
  const presetPrompts = [
    {
      label: 'Soldador en Acción',
      prompt: 'Professional welder in action, wearing full protective gear, electric welding arc creating bright orange sparks, dark industrial workshop background'
    },
    {
      label: 'Equipo de Soldadura',
      prompt: 'Professional welding equipment close-up, modern welding machine, TIG torch and electrode holder, on dark metal workbench'
    },
    {
      label: 'Inspector de Calidad',
      prompt: 'QA inspector examining welded joint, wearing safety glasses, using precision measurement tools, technical clipboard'
    }
  ];

  const handlePresetPrompt = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generador de Imágenes IA
          </CardTitle>
          <CardDescription>
            Genera imágenes profesionales con estilo de marca WeldTech usando Abacus.AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompts predefinidos */}
          <div className="space-y-2">
            <Label>Prompts Predefinidos</Label>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetPrompt(preset.prompt)}
                  disabled={generating}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Campo de prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt de Imagen *</Label>
            <Textarea
              id="prompt"
              placeholder="Describe la imagen que deseas generar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={generating}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              El prompt se combinará automáticamente con el estilo de marca WeldTech
            </p>
          </div>

          {/* Campo de estilo opcional */}
          <div className="space-y-2">
            <Label htmlFor="style">Estilo Adicional (Opcional)</Label>
            <Input
              id="style"
              placeholder="Ej: close-up, wide angle, detail shot..."
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={generating}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate} 
              disabled={generating || !prompt.trim()}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generar Imagen
                </>
              )}
            </Button>
            
            {imageUrl && (
              <>
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleClear}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mostrar prompt generado */}
          {generatedPrompt && (
            <div className="space-y-2">
              <Label>Prompt Completo Generado</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="text-muted-foreground whitespace-pre-wrap break-words">
                  {generatedPrompt}
                </p>
              </div>
            </div>
          )}

          {/* Mostrar imagen generada */}
          {imageUrl && (
            <div className="space-y-2">
              <Label>Imagen Generada</Label>
              <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt="Imagen generada"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Información de datos de entrada */}
          {initialData && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="text-muted-foreground">
                <strong>Datos de entrada:</strong> Los datos proporcionados se incorporarán al prompt
                {initialData.wpsNumber && ` (WPS ${initialData.wpsNumber})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

