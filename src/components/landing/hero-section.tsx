'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection({ userId }: { userId: string | null }) {
  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 max-w-4xl mx-auto mt-20"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-8"
      >
        <Sparkles className="h-4 w-4" />
        <span>La nueva era de productividad impulsada por IA</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6"
      >
        Tu cerebro digital <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
          automatizado.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Genera imágenes, revisa código fuente, interactúa con el chat más inteligente y resume documentos largos en segundos. Todo en un solo lugar.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link 
          href={userId ? "/dashboard" : "/sign-up"}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
        >
          {userId ? "Continuar al Dashboard" : "Comenzar gratis"}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </motion.main>
  )
}
