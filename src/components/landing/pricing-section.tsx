'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

const pricingPlans = [
  {
    name: "Gratis",
    price: "$0",
    description: "Para uso casual y exploración.",
    features: [
      { name: "5 Resúmenes diarios", included: true },
      { name: "10 Chats diarios", included: true },
      { name: "5 Imágenes generadas", included: true },
      { name: "Soporte prioritario", included: false },
      { name: "Acceso temprano a betas", included: false },
    ],
    buttonText: "Comenzar gratis",
    badge: null
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Para profesionales que exigen el máximo.",
    features: [
      { name: "Resúmenes ILIMITADOS", included: true },
      { name: "Chats ILIMITADOS", included: true },
      { name: "Imágenes ILIMITADAS", included: true },
      { name: "Soporte prioritario", included: true },
      { name: "Acceso temprano a betas", included: true },
    ],
    buttonText: "Mejorar a Pro",
    badge: "Más Popular"
  }
]

export default function PricingSection() {
  const { userId } = useAuth()

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 mb-24 px-6 relative z-10" id="pricing">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Planes Simples y Transparentes</h2>
        <p className="text-gray-400">Todo el poder de la Inteligencia Artificial a tu alcance.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pricingPlans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className={`relative p-8 rounded-3xl border flex flex-col bg-white/5 backdrop-blur-md ${plan.badge ? 'border-violet-500 shadow-2xl shadow-violet-900/20' : 'border-white/10'}`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400">/mes</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3">
                  {feature.included ? (
                    <div className="bg-violet-500/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-violet-400" />
                    </div>
                  ) : (
                    <div className="bg-gray-500/10 p-1 rounded-full">
                      <X className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <span className={feature.included ? "text-gray-200" : "text-gray-500"}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <Link 
              href={!userId ? "/sign-up" : (plan.badge ? "/settings" : "/dashboard")}
              className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${plan.badge ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-900/40' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {plan.buttonText}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
