import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',                    // Landing page
  '/pricing',             // Precios
  '/sign-in(.*)',         // Login
  '/sign-up(.*)',         // Registro
  '/api/webhooks/clerk',  // Webhook de Clerk
])

const handler = clerkMiddleware(async (auth, request) => {
  // Si la ruta NO es pública → exigir login
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return handler(request, event)
}

export const config = {
  matcher: [
    // Aplica a todas las rutas excepto archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
