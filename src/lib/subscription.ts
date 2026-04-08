import { currentUser } from '@clerk/nextjs/server'
import prisma from './prisma'

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
  const user = await currentUser()

  if (!user) {
    return false
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { subscription: true }
  })

  // Returns false if they have no subscription, or if it's expired
  if (!dbUser || !dbUser.subscription) return false

  const isValid =
    dbUser.subscription.mpPaymentId &&
    (dbUser.subscription.mpCurrentPeriodEnd?.getTime() ?? 0) + DAY_IN_MS > Date.now()

  return !!isValid
}
