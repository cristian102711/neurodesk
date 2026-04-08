import Link from 'next/link'
import { Bot, Zap, Shield } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import HeroSection from '@/components/landing/hero-section'
import PricingSection from '@/components/landing/pricing-section'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Navbar Minimalista */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-violet-500" />
          <span className="text-white font-bold text-xl tracking-tight">NeuroDesk</span>
        </div>
        <div>
          {userId ? (
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Ir al Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition">
                Iniciar Sesión
              </Link>
              <Link href="/sign-up" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section animado */}
      <HeroSection userId={userId} />

        {/* Feature Highlights Minimalistas */}
      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 z-10 w-full mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="bg-violet-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Bot className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Modelos de Vanguardia</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Impulsado por la versión más rápida y potente con integraciones directas a las mejores APIs.</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Resultados Inmediatos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Respuestas renderizadas en tiempo real con streaming sin tiempos de espera aburridos.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="bg-green-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Privacidad Total</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Tu historial e información guardada de manera segura con encriptación de extremo a extremo.</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <PricingSection />

    </div>
  )
}
