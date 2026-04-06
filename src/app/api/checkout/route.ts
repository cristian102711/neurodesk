import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function GET() {
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

    const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`

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
        auto_return: 'approved',
        external_reference: dbUser.id, // Pasamos el ID de Base de Datos para identificar en el Webhook
      }
    })

    return new NextResponse(JSON.stringify({ url: response.init_point }))
  } catch (error) {
    console.error('[/api/checkout]', error)
    return NextResponse.json({ error: 'Internal Error - Verifica la consola de Next.js' }, { status: 500 })
  }
}
