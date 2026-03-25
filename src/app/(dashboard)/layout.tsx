import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Code2,
  Settings,
  Zap
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
  { href: '/ai-chat', icon: MessageSquare, label: 'Chat con IA' },
  { href: '/summarizer', icon: FileText, label: 'Resumidor' },
  { href: '/code-review', icon: Code2, label: 'Revisión de Código' },
  { href: '/settings', icon: Settings, label: 'Configuración' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#020817]">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        {/* Logo de la aplicación */}
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-violet-500" />
            <span className="text-white font-bold text-xl">NeuroDesk</span>
          </Link>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Perfil del usuario al final del sidebar */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton />
          <span className="text-gray-400 text-sm">Mi Cuenta</span>
        </div>
      </aside>

      {/* Contenido principal donde se renderizan las páginas */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
