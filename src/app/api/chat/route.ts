import { streamText, convertToModelMessages } from 'ai'
import { groq } from '@ai-sdk/groq'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // 1. Verificar autenticación
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Extraer mensajes
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Mensajes inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 3. Convertir UIMessages a ModelMessages (formato que entiende streamText)
    const modelMessages = await convertToModelMessages(messages)

    // 4. Crear stream con Groq
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: modelMessages,
      system:
        'Eres NeuroBot, un asistente avanzado de productividad diseñado por Cristian Carlos. ' +
        'Eres experto en programación, resumen de textos e ideas innovadoras. ' +
        'Siempre respondes de forma clara, directa y estructurada. ' +
        'Te diriges al usuario con un tono amigable, profesional y muy eficiente.',
    })

    // 5. Retornar stream en formato UIMessage (compatible con useChat v6)
    return result.toUIMessageStreamResponse()

  } catch (err) {
    console.error('[/api/chat] Error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
