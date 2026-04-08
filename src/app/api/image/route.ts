import { NextResponse } from 'next/server'
import { checkApiLimit, increaseApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 45

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido' }, { status: 400 })
    }

    const freeTrial = await checkApiLimit('image')
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return NextResponse.json({ error: 'PLAN_LIMIT_REACHED' }, { status: 403 })
    }

    // Para la demo, usamos una API gratuita de generación de imagen por prompt
    // Pollinations.ai genera imágenes estáticas usando la URL.
    // Reemplaza esto con fetch a OpenAI (DALL-E 3) cuando tengas la API key de OpenAI.
    
    // Codificamos el prompt para URL segura
    const encodedPrompt = encodeURIComponent(prompt)
    
    // Número aleatorio para forzar bypass de caché en Pollinations
    const seed = Math.floor(Math.random() * 1000000)
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`
    
    // Obtenemos el usuario de la db
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (dbUser) {
      await prisma.generation.create({
        data: {
          userId: dbUser.id,
          type: 'IMAGE',
          prompt: prompt,
          result: imageUrl,
        }
      })
    }

    // Descontar saldo
    if (!isPro) {
      await increaseApiLimit('image')
    }

    return NextResponse.json({ url: imageUrl })

  } catch (error: unknown) {
    console.error('[/api/image]', error)
    return NextResponse.json(
      { error: 'Error interno conectando con el modelo generador de imágenes.' },
      { status: 500 }
    )
  }
}
