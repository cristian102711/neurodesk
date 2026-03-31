'use client'

import { useChat, type UIMessage } from '@ai-sdk/react'
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function AIChatPage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, error } = useChat({
    api: '/api/chat',
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  // Extrae el texto de un UIMessage v6 que usa parts[]
  const getMessageText = (m: UIMessage): string => {
    if (!Array.isArray(m.parts) || m.parts.length === 0) {
      // fallback por compatibilidad
      return (m as Record<string, unknown>).content as string || ''
    }
    return m.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('')
  }

  // Filtra mensajes que tienen contenido visible (evita step-start vacíos)
  const visibleMessages = messages.filter((m) => {
    if (m.role === 'user') return true
    const text = getMessageText(m)
    return text.trim().length > 0
  })

  return (
    <div className="flex flex-col h-[calc(100vh)] bg-[#020817] p-4 lg:p-8">
      
      {/* Cabecera */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 shrink-0 flex items-center gap-4">
        <div className="bg-violet-500/20 p-3 rounded-xl border border-violet-500/30">
          <Sparkles className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Chat con IA</h1>
          <p className="text-gray-400 text-sm">
            Impulsado por GPT-4o Mini en tiempo real.{' '}
            <span className={`inline-block w-2 h-2 rounded-full ml-1 ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
          </p>
        </div>
      </div>

      {/* Caja de mensajes */}
      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-4">
        
        {/* Error de API */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Error: {error.message || 'La IA no pudo responder. Verifica tu API key.'}</span>
          </div>
        )}

        {visibleMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <Bot className="h-16 w-16 text-violet-400 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">NeuroBot está listo</h2>
            <p className="text-gray-400 max-w-sm">
              Pregúntame sobre cualquier idea de código, matemática o charlemos sobre tu día de trabajo.
            </p>
          </div>
        ) : (
          visibleMessages.map((m: UIMessage) => (
            <div
              key={m.id}
              className={`flex gap-3 p-4 rounded-xl ${
                m.role === 'user'
                  ? 'bg-white/5 border border-white/10 ml-8'
                  : 'bg-transparent mr-8'
              }`}
            >
              <div className="shrink-0">
                {m.role === 'user' ? (
                  <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-violet-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="text-gray-200 leading-relaxed overflow-x-auto flex-1 pt-1">
                <p className="whitespace-pre-wrap text-sm">{getMessageText(m)}</p>
              </div>
            </div>
          ))
        )}

        {/* Indicador de "pensando" */}
        {isLoading && (
          <div className="flex gap-3 p-4 mr-8">
            <div className="bg-violet-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 pt-2">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all shadow-lg"
            value={input}
            placeholder={isLoading ? 'La IA está pensando...' : 'Escribe tu pregunta aquí...'}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-violet-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="text-xs text-center text-gray-600 mt-3">
          NeuroBot puede cometer errores. Verifica la información importante.
        </p>
      </div>

    </div>
  )
}
