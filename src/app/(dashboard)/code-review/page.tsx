'use client'

import { useState, useRef } from 'react'
import { Code2, Terminal, Play, Bug, ShieldCheck, Zap, Loader2, Copy, Check } from 'lucide-react'

export default function CodeReviewPage() {
  const [codeToReview, setCodeToReview] = useState('')
  const [completion, setCompletion] = useState('')
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState('javascript')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleReview = async () => {
    if (!codeToReview.trim() || codeToReview.trim().length < 5) return

    setCompletion('')
    setError(null)
    setIsLoading(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch('/api/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToReview, language }),
        signal: ctrl.signal,
      })

      if (!res.ok) {
        const msg = await res.text()
        setError(msg || 'Error al analizar el código.')
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setCompletion((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        setError('Error de conexión con la IA.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(completion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#020817] p-4 lg:p-8 space-y-6">
      
      {/* Cabecera */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 flex items-center justify-between border-l-4 border-l-green-500/50 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30">
            <Code2 className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Code Reviewer</h1>
            <p className="text-gray-400 text-sm">Auditoría experta de código en tiempo real.</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-3 py-1.5 rounded-lg bg-white/5">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500/70" />
            <span>Audit</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium px-3 py-1.5 rounded-lg bg-white/5">
            <Zap className="h-3.5 w-3.5 text-orange-500/70" />
            <span>Optimization</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Editor de Entrada */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-green-500/40 shadow-inner">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-gray-500" />
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Source Input</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-gray-400 text-[10px] px-2 py-1 rounded outline-none cursor-pointer focus:border-green-500/50"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="react">React (JSX/TSX)</option>
                <option value="css">CSS / Tailwind</option>
                <option value="sql">SQL / Prisma</option>
              </select>
            </div>
            <textarea
              className="flex-1 w-full bg-[#030a1c] p-6 text-green-100/90 font-mono text-sm placeholder:text-gray-700 focus:outline-none resize-none leading-relaxed"
              spellCheck="false"
              placeholder={'// Pega tu función, componente o script aquí...\nfunction example() {\n  return "optimízame";\n}'}
              value={codeToReview}
              onChange={(e) => setCodeToReview(e.target.value)}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isLoading || !codeToReview.trim()}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-100 shadow-xl shadow-green-950/20 uppercase tracking-widest text-xs"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            {isLoading ? 'Analizando Código...' : 'Iniciar Revisión'}
          </button>
        </div>

        {/* Panel de Resultados */}
        <div className="flex flex-col bg-[#030a1c]/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm relative">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-green-500" />
              <span className="text-green-500/80 text-xs font-bold uppercase tracking-widest">Audit Report</span>
            </div>
            {completion && (
              <button onClick={copyToClipboard} className="text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="text-[10px] uppercase font-bold">{copied ? '¡Copiado!' : 'Copy Report'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 p-6 text-gray-300 leading-relaxed overflow-y-auto">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm mb-4">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
            {!completion && !isLoading && !error ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="bg-gray-500/5 w-20 h-20 rounded-full flex items-center justify-center border border-dashed border-gray-500/30 mb-4 animate-pulse">
                  <ShieldCheck className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-white font-medium mb-1 tracking-wide">Esperando Código</h3>
                <p className="text-xs text-gray-500 max-w-[240px]">El arquitecto de IA analizará tu lógica y sugerirá mejoras instantáneas.</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm font-mono text-gray-300 leading-relaxed">
                {completion}
                {isLoading && (
                  <div className="mt-4 flex items-center gap-2 text-green-500 text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" /> Generando insights...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
      </div>
    </div>
  )
}
