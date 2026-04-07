import { NextResponse, NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const paymentId = req.nextUrl.searchParams.get('payment_id')
    const status = req.nextUrl.searchParams.get('status')

    if (!paymentId || status !== 'approved') {
      return NextResponse.json({ verified: false, reason: 'Pago no aprobado o sin ID' })
    }

    // Verificar directamente con la API de Mercado Pago
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' })
    const payment = new Payment(client)
    const paymentInfo = await payment.get({ id: paymentId })

    if (paymentInfo.status !== 'approved' || !paymentInfo.external_reference) {
      return NextResponse.json({ verified: false, reason: 'Pago no verificado por MP' })
    }

    // Buscar el usuario en la DB por su clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser || dbUser.id !== paymentInfo.external_reference) {
      return NextResponse.json({ verified: false, reason: 'Usuario no coincide' })
    }

    // Otorgar 30 días desde hoy
    const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      create: {
        userId: dbUser.id,
        mpPaymentId: String(paymentInfo.id),
        mpCurrentPeriodEnd: expireDate,
        plan: 'PRO'
      },
      update: {
        mpPaymentId: String(paymentInfo.id),
        mpCurrentPeriodEnd: expireDate,
        plan: 'PRO'
      }
    })

    return NextResponse.json({ verified: true, plan: 'PRO', expiresAt: expireDate.toISOString() })
  } catch (error) {
    console.error('[/api/verify-payment]', error)
    const errStr = error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json({ error: errStr }, { status: 500 })
  }
}
