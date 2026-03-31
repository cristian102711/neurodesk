'use client'

import { UserProfile } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Settings, User, CreditCard, Bell, Shield, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-[#020817] p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Cabecera */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
            <Settings className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
            <p className="text-gray-400 text-sm">Gestiona tu perfil y preferencias de IA.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Menú lateral de configuración */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/5 text-white font-medium border border-white/10 shadow-sm transition-all focus:outline-none">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </button>
          {['Plan & Créditos', 'Notificaciones', 'Seguridad', 'API Keys'].map((item) => (
            <button key={item} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] transition-colors focus:outline-none text-left">
              {item === 'Plan & Créditos' && <CreditCard className="h-4 w-4" />}
              {item === 'Notificaciones' && <Bell className="h-4 w-4" />}
              {item === 'Seguridad' && <Shield className="h-4 w-4" />}
              {item === 'API Keys' && <Sparkles className="h-4 w-4" />}
              <span>{item}</span>
            </button>
          ))}
        </div>

        {/* Sección de Perfil de Clerk */}
        <div className="md:col-span-3 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-violet-400" />
              Datos del Usuario
            </h3>
            <UserProfile 
              routing="hash"
              appearance={{
                baseTheme: dark,
                elements: {
                  card: "bg-transparent shadow-none border-none",
                  navbar: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  profileSectionTitle: "text-white/60 font-bold",
                  userPreviewMainIdentifier: "text-white",
                  userPreviewSecondaryIdentifier: "text-gray-400",
                  formButtonPrimary: "bg-violet-600 hover:bg-violet-500",
                  formFieldInput: "bg-white/5 border-white/10 text-white",
                  formFieldLabel: "text-gray-400",
                }
              }}
            />
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 border-l-4 border-l-red-600/50">
             <h3 className="text-red-400 font-bold mb-1 flex items-center gap-2">
               Zona de Peligro
             </h3>
             <p className="text-gray-500 text-sm mb-4">Eliminar tu cuenta borrará permanentemente todos tus historiales de chat y documentos resumidos.</p>
             <button className="bg-transparent border border-red-500/30 hover:bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none">
               Eliminar cuenta permanentemente
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
