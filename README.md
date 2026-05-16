# FutMatch — Landing Page

Landing page da plataforma **FutMatch**: organize peladas, encontre quadras e monte seu time em um único lugar.

## Stack

- **Next.js 16** (App Router) com **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **GSAP 3** — animações de entrada (ScrollTrigger no desktop, IntersectionObserver no mobile)
- **shadcn/ui** — componentes base (`Button`, `Badge`)
- **Lucide React** — ícones

## Estrutura

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # Composição das seções
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── CourtsSection.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── button.tsx
│       └── badge.tsx
└── lib/
    ├── useMobileScrollAnimation.ts   # Hook para animações mobile via IntersectionObserver
    └── utils.ts
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de produção
npm run lint    # ESLint
```

## Deploy

O projeto está configurado para deploy na **Vercel**. Qualquer push para `main` aciona um deploy automático.

App principal: [futmatch-web.vercel.app](https://futmatch-web.vercel.app)
