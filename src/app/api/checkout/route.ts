import { currentUser } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user || !user.id || !user.primaryEmailAddress?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { subscription: true }
    })

    if (!dbUser) {
      return new NextResponse('User not found in DB', { status: 400 })
    }

    // Detectar la URL base dinámicamente desde los headers del request
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.startsWith('localhost') ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
    const settingsUrl = `${baseUrl}/settings`

    // Si ya es PRO y tiene tiempo restante, solo lo mandamos de vuelta a settings
    if (dbUser.subscription?.mpCurrentPeriodEnd && dbUser.subscription.mpCurrentPeriodEnd.getTime() > Date.now()) {
      return new NextResponse(JSON.stringify({ url: settingsUrl }))
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' })
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [
          {
            id: 'PRO_1_MONTH',
            title: 'NeuroDesk Pro - Acceso 1 Mes',
            unit_price: 10000,
            quantity: 1,
            currency_id: 'CLP',
            description: 'Acceso ilimitado a IA avanzada por 30 días',
          }
        ],
        payer: {
          email: user.primaryEmailAddress.emailAddress,
        },
        back_urls: {
          success: settingsUrl,
          failure: settingsUrl,
          pending: settingsUrl
        },
        // auto_return solo funciona con HTTPS en producción, lo omitimos en dev
        ...(process.env.NODE_ENV === 'production' ? { auto_return: 'approved' as const } : {}),
        external_reference: dbUser.id,
      }
    })

    return new NextResponse(JSON.stringify({ url: response.init_point }))
  } catch (error) {
    console.error('[/api/checkout]', error)
    const errStr = error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json({ error: errStr }, { status: 500 })
  }
}
