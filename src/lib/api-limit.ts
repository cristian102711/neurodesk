import { currentUser } from '@clerk/nextjs/server'
import prisma from './prisma'
import { checkSubscription } from './subscription'

// Constants for limits
export const MAX_FREE_CHATS = 10
export const MAX_FREE_SUMMARIES = 5
export const MAX_FREE_REVIEWS = 3

export type ApiLimitType = 'chat' | 'summarize' | 'codeReview'

// Utility to get the current limit based on type
const getLimitValue = (type: ApiLimitType) => {
  if (type === 'chat') return MAX_FREE_CHATS
  if (type === 'summarize') return MAX_FREE_SUMMARIES
  if (type === 'codeReview') return MAX_FREE_REVIEWS
  return 0
}

// Ensure the user exists in our DB, if not create them
// And return their ID
async function getOrCreateDbUser(clerkId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
      }
    })
  }

  return user.id
}

export async function checkApiLimit(type: ApiLimitType) {
  const user = await currentUser()
  if (!user) return false

  const isPro = await checkSubscription()
  if (isPro) return true

  const userId = await getOrCreateDbUser(user.id, user.primaryEmailAddress?.emailAddress || '')

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  // Has never used the API
  if (!userApiLimit) {
    return true
  }

  const limitValue = getLimitValue(type)

  if (type === 'chat' && userApiLimit.chatCount < limitValue) return true
  if (type === 'summarize' && userApiLimit.summaryCount < limitValue) return true
  if (type === 'codeReview' && userApiLimit.codeReviewCount < limitValue) return true

  return false // Limit reached
}

export async function increaseApiLimit(type: ApiLimitType) {
  const user = await currentUser()
  if (!user) return

  const isPro = await checkSubscription()
  if (isPro) return

  const userId = await getOrCreateDbUser(user.id, user.primaryEmailAddress?.emailAddress || '')

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  if (userApiLimit) {
    await prisma.userApiLimit.update({
      where: { userId },
      data: {
        chatCount: type === 'chat' ? userApiLimit.chatCount + 1 : userApiLimit.chatCount,
        summaryCount: type === 'summarize' ? userApiLimit.summaryCount + 1 : userApiLimit.summaryCount,
        codeReviewCount: type === 'codeReview' ? userApiLimit.codeReviewCount + 1 : userApiLimit.codeReviewCount,
      }
    })
  } else {
    await prisma.userApiLimit.create({
      data: {
        userId,
        chatCount: type === 'chat' ? 1 : 0,
        summaryCount: type === 'summarize' ? 1 : 0,
        codeReviewCount: type === 'codeReview' ? 1 : 0,
      }
    })
  }
}

export async function getApiLimits() {
  const user = await currentUser()
  if (!user) return null

  const userId = await getOrCreateDbUser(user.id, user.primaryEmailAddress?.emailAddress || '')

  const limit = await prisma.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  if (!limit) {
    return {
      chats: { used: 0, total: MAX_FREE_CHATS },
      summaries: { used: 0, total: MAX_FREE_SUMMARIES },
      reviews: { used: 0, total: MAX_FREE_REVIEWS },
    }
  }

  return {
    chats: { used: limit.chatCount, total: MAX_FREE_CHATS },
    summaries: { used: limit.summaryCount, total: MAX_FREE_SUMMARIES },
    reviews: { used: limit.codeReviewCount, total: MAX_FREE_REVIEWS },
  }
}
