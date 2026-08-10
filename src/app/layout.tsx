import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Só+1 — Encontre sua pelada hoje',
  description:
    'Plataforma gratuita para jogadores: encontre partidas abertas, sorteie times e avalie jogadores. Do racha da várzea ao torneio organizado, tudo em um lugar.',
  keywords: [
    'pelada', 'futebol', 'society', 'futsal', 'quadras esportivas',
    'organização de partidas', 'sorteio de times', 'beach tennis',
    'vôlei', 'basquete', 'esportes Lavras', 'app esportes',
  ],
  openGraph: {
    title: 'Só+1 — Encontre sua pelada hoje',
    description: 'Plataforma gratuita para organizar peladas, sortear times e avaliar jogadores. 12 modalidades, do futsal ao beach tennis.',
    type: 'website',
    url: 'https://so-mais-um.com',
    siteName: 'Só+1',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Só+1 — Encontre sua pelada hoje',
    description: 'Plataforma gratuita para organizar peladas, sortear times e avaliar jogadores.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="min-h-full flex flex-col font-(--font-inter)">{children}</body>
    </html>
  )
}
