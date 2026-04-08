import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { getApiLimits } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import {
  MessageSquare,
  FileText,
  Code2,
  Image,
  Zap,
  TrendingUp,
  Crown
} from 'lucide-react'

const quickActions = [
  { label: 'Nuevo Chat IA', href: '/ai-chat', icon: MessageSquare },
  { label: 'Resumir Texto', href: '/summarizer', icon: FileText },
  { label: 'Revisar Código', href: '/code-review', icon: Code2 },
]

export default async function DashboardPage() {
  const user = await currentUser()
  const apiLimits = await getApiLimits()
  const isPro = await checkSubscription()

  const stats = [
    { label: 'Chats de IA Hoy', value: isPro ? 'Ilimitado' : `${apiLimits?.chats.used || 0} / ${apiLimits?.chats.total || 10}`, icon: MessageSquare, color: 'text-violet-400' },
    { label: 'Resúmenes Hoy', value: isPro ? 'Ilimitado' : `${apiLimits?.summaries.used || 0} / ${apiLimits?.summaries.total || 5}`, icon: FileText, color: 'text-blue-400' },
    { label: 'Revisiones de Código', value: isPro ? 'Ilimitado' : `${apiLimits?.reviews.used || 0} / ${apiLimits?.reviews.total || 3}`, icon: Code2, color: 'text-green-400' },
    { label: 'Imágenes Generadas', value: isPro ? 'Ilimitado' : `${apiLimits?.images.used || 0} / ${apiLimits?.images.total || 5}`, icon: Image, color: 'text-orange-400' },
  ]

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
      <div className={`border rounded-xl p-4 flex items-center justify-between ${isPro ? 'bg-amber-500/10 border-amber-500/20' : 'bg-violet-500/10 border-violet-500/20'}`}>
        <div className="flex items-center gap-3">
          {isPro ? (
            <Crown className="h-5 w-5 text-amber-400" />
          ) : (
            <Zap className="h-5 w-5 text-violet-400" />
          )}
          <span className={isPro ? "text-amber-300 font-medium" : "text-violet-300 font-medium"}>
            Estás en el <strong>{isPro ? "Plan Pro" : "Plan Gratuito"}</strong>
          </span>
        </div>
        {!isPro && (
          <Link href="/settings" className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-1.5 rounded-lg transition-colors">
            Mejorar a Pro
          </Link>
        )}
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
