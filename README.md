# 🧠 NeuroDesk — AI-Powered Productivity Suite

![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.x-cyan?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-white?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

**NeuroDesk** es una plataforma SaaS (Software as a Service) de alto rendimiento lista para producción, diseñada para agrupar múltiples herramientas de Inteligencia Artificial en un solo panel de control limpio y profesional. 

Desarrollada con la arquitectura más moderna del mercado (Next.js App Router, Server Components y Turbopack), **NeuroDesk** sirve como una demostración clara de ingeniería de punta, diseño escalable y monetización nativa integrada.

## ✨ Características Principales

*   **Autenticación B2C (Auth)**: Sistema de login y registro altamente seguro gestionado vía Clerk Middleware (`proxy.ts`).
*   **Múltiples Modelos de IA (Vercel SDK + Groq + OpenAI)**:
    *   💬 **Chat Inteligente**: Conversaciones rápidas en tiempo real con LLMs de vanguardia.
    *   📝 **Resumidor de Texto**: Extracción de ideas clave sobre textos gigantes al instante.
    *   💻 **Revisor de Código**: Asistente de depuración que analiza, refactoriza y explica tu código.
    *   🎨 **Generador Visual**: Creación de imágenes desde cero basándose en tus prompts (`Pollinations/DALL-E`).
*   **Límites de Uso en Tiempo Real (Rate Limiting)**: Sistema estructurado con Prisma ORM que cuenta los tokens e interacciones (imágenes, chats, resúmenes) de cada usuario y bloquea accesos si se acaba su *Free Tier*.
*   **Suscripciones Premium (Monetización)**: Integrado con Mercado Pago mediante Webhooks, asignando automáticamente Roles VIP (Plan Pro) tras confirmar un pago exitoso, otorgando generación ilimitada instantánea.
*   **Diseño Premium (UI/UX)**: Interfaz oscura "Glassmorphism" construida con Tailwind CSS 4.x, notificaciones personalizadas con `react-hot-toast`, e impactantes Landing Pages animadas con `Framer Motion`.
*   **Base de Datos en la Nube**: Persistencia global usando PostgreSQL a través de *Neon DB*.

## 🚀 Tecnologías y Arquitectura

*   **Frontend**: React 19 / Next.js 16 (App Router), `lucide-react` para iconografía fluida. Components de Shadcn UI de apoyo.
*   **Backend**: Server Actions, API Routes asíncronas (`/api/chat`, `/api/image`, etc.), y Validadores de sesión.
*   **Base de Datos**: PostgreSQL Serverless (Neon) conectado vía Prisma ORM `schema`.
*   **Tipado**: TypeScript Estricto sin uso de variables locales tipo `any`.
*   **Animación**: `Framer Motion` (Hero Animations, Viewport Events).

## 🗂 Estructura del Proyecto

```text
neurodesk/
├── prisma/                 # Esquemas DB (User, Generation, Subscription, API Limits)
├── src/
│   ├── app/                # Rutas de Front y Back (Next.js v15 App Router)
│   │   ├── (auth)/         # Interfaz de SignIn y SignUp custom de Clerk
│   │   ├── (dashboard)/    # Pantallas protegidas (historial, chat, code-review...)
│   │   ├── api/            # Webhooks MP/Clerk y Endpoints IA con AI Vercel SDK
│   │   └── page.tsx        # Landing Page Pública (Marketing UI)
│   ├── components/         # Botones, Cards, Componentes de Landing (Hero, Pricing)
│   ├── lib/                # Lógica core de prisma singleton, subscription, api-limit
│   ├── proxy.ts            # Patrón Moderno Edge Proxy para Middleware (Sustituto de middleware.ts)
```

## 🛠 Configuración e Instalación

Para ejecutar este proyecto localmente, necesitas clonar el repositorio, instalar dependencias e iniciar los servicios:

```bash
# 1. Clona el proyecto
git clone https://github.com/tu-usuario/neurodesk.git
cd neurodesk

# 2. Instala dependencias
npm install

# 3. Empuja las tablas a tu base de datos y genera el Prisma client
npx prisma db push
npx prisma generate

# 4. Inicia el servidor Turbopack
npm run dev
```

### Variables de Entorno (`.env`)

Asegúrate de configurar tu `.env` con las siguientes llaves para que los servicios de terceros funcionen:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL="postgresql://usuario:contraseña@servidor.neon.tech/neondb?sslmode=require"
GROQ_API_KEY=gsk_...
MP_ACCESS_TOKEN=APP_USR-...
CLERK_WEBHOOK_SECRET=whsec_...
```

## 🧠 Lecciones y Enfoque de Ingeniería

Este proyecto fue estructurado bajo la mentalidad pura de un **Senior Fullstack Developer**:
- Prevención de Strict Types y purgado de linting warnings.
- Construido evitando "Client Components" tanto como sea posible, usando RSC (React Server Components) en Páginas (ej: `dashboard/page.tsx` con límite estático) para maximizar velocidad SEO e indexación inicial.
- Mitigación del temido *"Multiple children hydration error"* de Clerk en Next.js 16.
- Bases sólidas para integrar pasarelas de pago alternativas aislando los módulos en `utils/subscription.ts`.

---
*Diseñado con ☕️ y Código.*
