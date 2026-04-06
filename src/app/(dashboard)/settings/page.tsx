'use client'

import { useUser } from '@clerk/nextjs'
import {
  Settings, User, CreditCard, Bell, Shield, Sparkles,
  Mail, Link as LinkIcon, CheckCircle, Edit3, Crown
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const tabs = [
  { id: 'profile',       label: 'Perfil',          icon: User },
  { id: 'plan',          label: 'Plan & Créditos',  icon: CreditCard },
  { id: 'notifications', label: 'Notificaciones',   icon: Bell },
  { id: 'security',      label: 'Seguridad',        icon: Shield },
  { id: 'apikeys',       label: 'API Keys',         icon: Sparkles },
]

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="min-h-full bg-[#020817] p-4 lg:p-8">

      {/* Cabecera */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
          <Settings className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
          <p className="text-gray-400 text-sm">Gestiona tu perfil y preferencias de IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar de navegación */}
        <div className="space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left focus:outline-none text-sm font-medium ${
                activeTab === id
                  ? 'bg-violet-600/20 text-white border border-violet-500/30 shadow-sm shadow-violet-500/10'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Panel derecho */}
        <div className="md:col-span-3 space-y-5">

          {/* ── PERFIL ── */}
          {activeTab === 'profile' && (
            <>
              {/* Tarjeta de usuario */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                {/* Banner */}
                <div className="h-24 bg-gradient-to-r from-violet-900/60 via-blue-900/60 to-indigo-900/60 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
                </div>

                {/* Avatar + nombre */}
                <div className="px-6 pb-6">
                  <div className="flex items-end justify-between -mt-10 mb-4">
                    <div className="relative">
                      {isLoaded && user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt="Avatar"
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-2xl border-4 border-[#020817] object-cover shadow-xl"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl border-4 border-[#020817] bg-violet-800 flex items-center justify-center shadow-xl">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#020817]" title="Online" />
                    </div>

                    <a
                      href="https://accounts.clerk.dev/user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all text-sm font-medium"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Editar perfil
                    </a>
                  </div>

                  {isLoaded && user ? (
                    <>
                      <h2 className="text-xl font-bold text-white">{user.fullName || 'Usuario'}</h2>
                      <p className="text-gray-500 text-sm mt-0.5">Plan Gratuito · Miembro desde {new Date(user.createdAt!).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-6 bg-white/5 rounded-lg w-48 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded-lg w-32 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info de contacto */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-gray-400">Información de Cuenta</h3>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-500/10 p-2 rounded-lg">
                        <Mail className="h-4 w-4 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Correo electrónico</p>
                        <p className="text-white text-sm font-medium">{isLoaded ? (user?.primaryEmailAddress?.emailAddress ?? '—') : '...'}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Principal
                    </span>
                  </div>

                  {/* ID */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 p-2 rounded-lg">
                        <LinkIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">ID de Usuario</p>
                        <p className="text-white text-sm font-mono">{isLoaded ? (user?.id?.slice(0, 26) + '…') : '...'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Método de acceso */}
                  {isLoaded && (user?.externalAccounts?.length ?? 0) > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-lg">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Método de acceso</p>
                          <p className="text-white text-sm font-medium">Google SSO</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">Conectado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Zona de peligro */}
              <div className="bg-red-500/5 border border-red-500/10 border-l-4 border-l-red-600/50 rounded-2xl p-6">
                <h3 className="text-red-400 font-bold mb-1">⚠ Zona de Peligro</h3>
                <p className="text-gray-500 text-sm mb-4">Eliminar tu cuenta borrará permanentemente todos tus datos, historiales de chat y resúmenes.</p>
                <button className="border border-red-500/30 hover:bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm transition-all">
                  Eliminar cuenta permanentemente
                </button>
              </div>
            </>
          )}

          {/* ── PLAN ── */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              {/* Card plan actual */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-gray-400" /> Plan Actual</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400">GRATUITO</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Chats', used: 0, total: 10 },
                    { label: 'Resúmenes', used: 0, total: 5 },
                    { label: 'Revisiones', used: 0, total: 3 },
                  ].map(({ label, used, total }) => (
                    <div key={label} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-white">{used}<span className="text-gray-600 text-sm font-normal">/{total}</span></p>
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${(used / total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Card */}
              <div className="bg-gradient-to-br from-violet-900/40 via-blue-900/30 to-indigo-900/40 border border-violet-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest">Pro</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">$10 / mes</h3>
                    <p className="text-gray-400 text-sm">IA sin límites, acceso a GPT-4o, historial completo y soporte prioritario.</p>
                    <ul className="mt-4 space-y-1.5">
                      {['Chats ilimitados', 'Resúmenes ilimitados', 'Revisión de código avanzada', 'Historial guaradado', 'Acceso API'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="mt-6 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-violet-500/20">
                  Mejorar a Pro — Próximamente
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICACIONES ── */}
          {activeTab === 'notifications' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-6">Preferencias de Notificaciones</h3>
              {[
                { label: 'Resumen semanal de uso', desc: 'Recibe un email con tu actividad de la semana', on: true },
                { label: 'Alertas de límite de cuota', desc: 'Aviso cuando te acerques al 80% de tu límite', on: true },
                { label: 'Novedades de producto', desc: 'Nuevas funcionalidades y actualizaciones', on: false },
              ].map(({ label, desc, on }) => (
                <div key={label} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${on ? 'bg-violet-600' : 'bg-white/10'}`}>
                    <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-all shadow ${on ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SEGURIDAD ── */}
          {activeTab === 'security' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-violet-400" />Seguridad</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300 mb-6">
                <p>La autenticación, gestión de contraseñas y sesiones activas se administran mediante <strong>Clerk</strong>, que cumple con los estándares SOC2 y GDPR.</p>
              </div>
              <a
                href="https://accounts.clerk.dev/user/security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-fit px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-sm transition-all"
              >
                <Shield className="h-4 w-4" /> Gestionar Seguridad en Clerk →
              </a>
            </div>
          )}

          {/* ── API KEYS ── */}
          {activeTab === 'apikeys' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">API Keys</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Accede a las herramientas de NeuroDesk mediante tu propia API key. Disponible en el Plan Pro.</p>
              <button
                onClick={() => setActiveTab('plan')}
                className="bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/30 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                Ver Plan Pro
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
