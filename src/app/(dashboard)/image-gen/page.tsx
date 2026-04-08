'use client'

import { useState } from 'react'
import { Image as ImageIcon, Loader2, Download, Sparkles, Wand2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setImageUrl(null)
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'PLAN_LIMIT_REACHED') {
          setError('Has alcanzado el límite gratuito de tu plan. Mejora a Pro en Configuración para continuar.')
        } else {
          setError(data.error || 'Error al generar la imagen.')
        }
        return
      }

      setImageUrl(data.url)
      toast.success('¡Imagen generada exitosamente!')
    } catch (error) {
      setError('Error de conexión al servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `neurodesk-image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Descarga iniciada')
    } catch (e) {
      toast.error('Error al descargar la imagen')
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#020817] p-4 lg:p-8 space-y-6">
      
      {/* Cabecera */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
            <ImageIcon className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Estudio Visual IA</h1>
            <p className="text-gray-400 text-sm">Transforma tus ideas en imágenes de alta calidad.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium">
          <Wand2 className="h-3.5 w-3.5" />
          <span>Renderizado Ultrarrápido</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Panel de Creación */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Describe tu visión</label>
            <textarea
              className="w-full bg-[#030a1c]/80 border border-white/10 p-4 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 resize-none h-40 leading-relaxed text-sm z-10"
              placeholder="Ejemplo: Un astronauta montado en un caballo en un desierto de neón cyberpunk, arte conceptual, 4k, hiperrealista..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-900/20 uppercase tracking-widest text-xs z-10"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isLoading ? 'Renderizando Pixel a Pixel...' : 'Generar Imagen'}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm mt-4 z-10">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
          </div>
        </div>

        {/* Panel de Visualización */}
        <div className="flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
           
           {/* ActionBar */}
           <div className="absolute top-4 right-4 z-20 flex gap-2">
             {imageUrl && !isLoading && (
               <button 
                 onClick={handleDownload}
                 className="bg-black/80 hover:bg-black text-white p-2.5 rounded-lg backdrop-blur-md border border-white/10 transition-colors shadow-xl"
                 aria-label="Descargar imagen"
               >
                 <Download className="h-5 w-5" />
               </button>
             )}
           </div>

           <div className="flex-1 flex items-center justify-center p-8 bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-white/[0.01]">
             {isLoading ? (
               <div className="flex flex-col items-center text-center opacity-60">
                 <div className="bg-orange-500/10 w-24 h-24 rounded-2xl flex items-center justify-center border border-orange-500/30 animate-pulse mb-4">
                   <ImageIcon className="h-10 w-10 text-orange-400 animate-bounce" />
                 </div>
                 <p className="text-gray-400 font-medium text-sm animate-pulse tracking-wide">Creando obra de arte...</p>
               </div>
             ) : imageUrl ? (
               <div className="relative group w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-4 ring-orange-500/10">
                 <img 
                   src={imageUrl} 
                   alt={prompt || "Generación terminada"} 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
               </div>
             ) : (
               <div className="flex flex-col items-center text-center opacity-30">
                 <ImageIcon className="h-16 w-16 mb-4 text-gray-500" />
                 <p className="text-gray-400 max-w-xs text-sm">El lienzo está vacío. Escribe un prompt para crear algo extraordinario.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
