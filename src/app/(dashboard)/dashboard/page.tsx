import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import {
  MessageSquare,
  FileText,
  Code2,
  Image,
  Zap,
  TrendingUp
} from 'lucide-react'

const stats = [
  { label: 'Chats de IA Hoy', value: '0 / 10', icon: MessageSquare, color: 'text-violet-400' },
  { label: 'Resúmenes Hoy', value: '0 / 5', icon: FileText, color: 'text-blue-400' },
  { label: 'Revisiones de Código', value: '0', icon: Code2, color: 'text-green-400' },
  { label: 'Imágenes Generadas', value: '0', icon: Image, color: 'text-orange-400' },
]

const quickActions = [
  { label: 'Nuevo Chat IA', href: '/ai-chat', icon: MessageSquare },
  { label: 'Resumir Texto', href: '/summarizer', icon: FileText },
  { label: 'Revisar Código', href: '/code-review', icon: Code2 },
]

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="p-8 space-y-8">
      {/* Encabezado: Saludo al usuario */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Bienvenido de vuelta, {user?.firstName ?? 'amigo'} 👋
        </h1>
        <p className="text-gray-400 mt-1">Aquí tienes un resumen de tu área de trabajo con IA.</p>
      </div>

      {/* Banner del plan actual (Free/Pro) */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-violet-400" />
          <span className="text-violet-300 font-medium">Estás en el <strong>Plan Gratuito</strong></span>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
          Mejorar a Pro
        </button>
      </div>

      {/* Tarjetas con métricas principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Accesos directos a las herramientas IA */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-violet-500/50 rounded-xl p-4 text-gray-300 hover:text-white transition-all group"
            >
              <action.icon className="h-5 w-5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
