'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { FileText, Copy, Check, Scissors, Loader2, Sparkles, ChevronRight } from 'lucide-react'

export default function SummarizerPage() {
  const [textToSummarize, setTextToSummarize] = useState('')
  const [copied, setCopied] = useState(false)
  const [config, setConfig] = useState({
    length: 'medium',
    format: 'paragraphs'
  })

  // useCompletion es perfecto para tareas de "completado" como resúmenes
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/summarize',
    body: {
      length: config.length,
      format: config.format
    }
  })

  const handleSummarize = () => {
    if (!textToSummarize || textToSummarize.trim().length < 10) return
    complete(textToSummarize)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(completion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#020817] p-4 lg:p-8 space-y-6">
      
      {/* Cabecera */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
            <FileText className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Resumidor de IA</h1>
            <p className="text-gray-400 text-sm">Convierte textos largos en ideas claras al instante.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ahorra hasta un 90% de lectura</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Columna Izquierda: Entrada de Texto */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-blue-500/50 transition-all">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center shrink-0">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Texto Original</span>
              <span className="text-gray-600 text-xs">{textToSummarize.length} caracteres</span>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none leading-relaxed text-sm scrollbar-thin scrollbar-thumb-white/10"
              placeholder="Pega aquí el contenido largo que deseas resumir (artículos, ensayos, reportes...)"
              value={textToSummarize}
              onChange={(e) => setTextToSummarize(e.target.value)}
            />
          </div>

          {/* Configuración rápida del resumen */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shrink-0 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Longitud</label>
                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                  {['short', 'medium', 'long'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setConfig({ ...config, length: l })}
                      className={`px-3 py-1 rounded-md text-xs transition-all ${config.length === l ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {l === 'short' ? 'Corto' : l === 'medium' ? 'Medio' : 'Largo'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Formato</label>
                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                  {['paragraphs', 'bullets'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setConfig({ ...config, format: f })}
                      className={`px-3 py-1 rounded-md text-xs transition-all ${config.format === f ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {f === 'paragraphs' ? 'Párrafos' : 'Lista'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSummarize}
              disabled={isLoading || !textToSummarize.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Scissors className="h-4 w-4" />}
              {isLoading ? "Resumiendo..." : "Generar Resumen"}
            </button>
          </div>
        </div>

        {/* Columna Derecha: Resultado */}
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center shrink-0">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Resumen Inteligente</span>
            {completion && (
              <button 
                onClick={copyToClipboard}
                className="text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="text-xs">{copied ? "¡Copiado!" : "Copiar todo"}</span>
              </button>
            )}
          </div>
          
          <div className="flex-1 p-8 text-gray-200 leading-8 text-lg scrollbar-thin scrollbar-thumb-white/10 overflow-y-auto italic">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm mb-4">
                <span className="font-bold">Error:</span> {error.message || 'La IA no pudo procesar el resumen.'}
              </div>
            )}
            {!completion && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-[-20px]">
                <Sparkles className="h-12 w-12 mb-4" />
                <p>Tu resumen aparecerá aquí en tiempo real...</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap anim-text-appear prose prose-invert max-w-none">
                {completion}
                {isLoading && <span className="inline-block w-1.5 h-5 bg-blue-500 ml-1 animate-pulse" />}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10 bg-blue-500/5 mt-auto">
            <div className="flex items-center gap-3 text-xs text-blue-300 font-medium opacity-70">
              <Sparkles className="h-4 w-4" />
              <span>Optimizado por NeuroBot V-Sum</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
