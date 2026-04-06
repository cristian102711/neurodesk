import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'

export const maxDuration = 45 // Resúmenes largos pueden tomar tiempo
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
    }

    const { text, length = 'medium', format = 'paragraphs' } = await req.json()

    if (!text || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'El texto es demasiado corto para resumir.' }), { status: 400 })
    }

    const freeTrial = await checkApiLimit('summarize')
    if (!freeTrial) {
      return new Response(JSON.stringify({ error: 'PLAN_LIMIT_REACHED' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Construcción del prompt especializado
    const lengthPrompt = {
      short: "muy breve (máximo 2-3 frases)",
      medium: "resumen moderado que cubra lo esencial",
      long: "resumen detallado y exhaustivo"
    }[length as 'short' | 'medium' | 'long']

    const formatPrompt = {
      paragraphs: "en párrafos bien redactados",
      bullets: "utilizando puntos de viñeta (bullet points) para fácil lectura"
    }[format as 'paragraphs' | 'bullets']

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: `Eres un experto en síntesis y análisis de información. El usuario te proporcionará un texto y debes resumirlo de forma ${lengthPrompt} y ${formatPrompt}. Mantén el tono del texto original pero sé mucho más conciso. No inventes información.`,
      prompt: `Texto a resumir:\n\n${text}`,
      async onFinish() {
        await increaseApiLimit('summarize')
      }
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[/api/summarize] Error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
