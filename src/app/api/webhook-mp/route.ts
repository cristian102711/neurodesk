import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('data.id') || url.searchParams.get('id')
    const topic = url.searchParams.get('type') || url.searchParams.get('topic')

    if (!id) return new NextResponse('No ID found', { status: 200 })

    if (topic === 'payment') {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' })
      const payment = new Payment(client)
      const paymentInfo = await payment.get({ id: id })

      if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
         // Otorgar 30 días sumados al día de hoy
         const expireDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

         await prisma.subscription.upsert({
           where: { userId: paymentInfo.external_reference },
           create: {
             userId: paymentInfo.external_reference,
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
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('MP Webhook Error:', error)
    return new NextResponse('Webhook Error', { status: 400 })
  }
}
