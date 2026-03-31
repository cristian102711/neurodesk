import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const maxDuration = 60 // El análisis de código puede ser pesado
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
    }
    const { code, language = 'javascript' } = await req.json()

    if (!code || code.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Ingresa un código válido para revisar.' }), { status: 400 })
    }

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: `Eres un Arquitecto de Software Senior y Experto en Seguridad de Código. 
      Tu tarea es realizar una revisión técnica exhaustiva del código proporcionado. 
      Debes buscar: 
      1. Bugs potenciales y errores lógicos. 
      2. Vulnerabilidades de seguridad. 
      3. Mejoras de legibilidad y arquitectura. 
      4. Optimización de rendimiento. 
      Responde en formato Markdown, utiliza bloques de código para mostrar ejemplos mejorados y sé muy constructivo.`,
      prompt: `Lenguaje: ${language}\n\nCódigo a revisar:\n\n\`\`\`${language}\n${code}\n\`\`\``,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[/api/code-review] Error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
