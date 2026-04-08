import { NextResponse } from 'next/server'
import { getApiLimits } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const limits = await getApiLimits()
    const isPro = await checkSubscription()

    if (!limits) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return NextResponse.json({ ...limits, isPro })
  } catch (error: unknown) {
    console.error('[/api/limits]', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
