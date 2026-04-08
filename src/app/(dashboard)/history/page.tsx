import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { Clock, MessageSquare, Image as ImageIcon, FileText, Code2, Trash2 } from 'lucide-react'

export default async function HistoryPage() {
  const user = await currentUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  })

  if (!dbUser) return null

  // Obtener generaciones completas
  const generations = await prisma.generation.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    take: 50 // Traer los últimos 50
  })

  if (generations.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#020817] p-8 text-center items-center justify-center">
        <Clock className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl text-gray-200 font-bold mb-2">No hay historial de uso</h2>
        <p className="text-gray-500 max-w-sm">Aún no has generado contenido con las IAs. Usa las herramientas del menú lateral para empezar.</p>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'CHAT': return <MessageSquare className="w-5 h-5 text-violet-400" />
      case 'IMAGE': return <ImageIcon className="w-5 h-5 text-orange-400" />
      case 'SUMMARIZE': return <FileText className="w-5 h-5 text-blue-400" />
      case 'CODE_REVIEW': return <Code2 className="w-5 h-5 text-green-400" />
      default: return <MessageSquare className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#020817] p-4 lg:p-8 space-y-6">
      
      {/* Cabecera */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-500/20 p-3 rounded-xl border border-gray-500/30">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Registro de Actividad</h1>
            <p className="text-gray-400 text-sm">Tu historial completo de interacciones con las IAs de NeuroDesk.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {generations.map((gen: { id: string, type: string, createdAt: Date, prompt: string, result: string }) => (
          <div key={gen.id} className="bg-white/5 border border-white/10 hover:border-gray-500/30 rounded-xl p-5 flex flex-col md:flex-row gap-4 transition-colors relative overflow-hidden group">
            
            <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-black/30 rounded-lg">
              {getIcon(gen.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {gen.type}
                </span>
                <span className="text-xs text-gray-600">
                  {new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(gen.createdAt))}
                </span>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-200 line-clamp-1 break-all">
                  <span className="text-gray-500 mr-2">Prompt:</span>
                  {gen.prompt}
                </p>
              </div>

              <div className="bg-black/40 rounded-lg p-3 border border-white/5 mt-3">
                {gen.type === 'IMAGE' ? (
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <ImageIcon className="w-4 h-4" /> 
                    Imagen generada exitosamente (No mostrada en texto)
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-3">
                    {gen.result}
                  </p>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
