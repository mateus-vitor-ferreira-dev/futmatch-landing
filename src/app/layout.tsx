import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// O recorte "para jogadores" é obrigatório nas três descrições.
//
// "Plataforma gratuita", sem qualificador, omite o modelo de negócio inteiro:
// o dono de espaço paga assinatura mensal. O texto certo já estava na
// `description`, que quase ninguém lê, enquanto o Open Graph e o Twitter — que
// são o que aparece quando alguém cola o link no WhatsApp ou no X — traziam a
// versão sem recorte (landing#44).
//
// `keywords` é o único lugar onde "pelada" fica de propósito, e continuou
// assim quando o rename varreu o resto da pilha (api#418): a copy é "partida",
// mas quem procura no Google digita "pelada". Termo de busca não é copy.
export const metadata: Metadata = {
  title: 'Só+1 — Encontre sua partida hoje',
  description:
    'Plataforma gratuita para jogadores: encontre partidas abertas, sorteie times e avalie jogadores. Do racha da várzea ao torneio organizado, tudo em um lugar.',
  keywords: [
    'pelada', 'futebol', 'society', 'futsal', 'quadras esportivas',
    'organização de partidas', 'sorteio de times', 'beach tennis',
    'vôlei', 'basquete', 'esportes Lavras', 'app esportes',
  ],
  openGraph: {
    title: 'Só+1 — Encontre sua partida hoje',
    description: 'Plataforma gratuita para jogadores: organize partidas, sorteie times e avalie jogadores. 12 modalidades, do futsal ao beach tennis.',
    type: 'website',
    url: 'https://so-mais-um.com',
    siteName: 'Só+1',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Só+1 — Encontre sua partida hoje',
    description: 'Plataforma gratuita para jogadores: organize partidas, sorteie times e avalie jogadores.',
  },
  // Os ícones não são declarados aqui de propósito: quem os define são os
  // arquivos `icon.svg`, `apple-icon.png` e `favicon.ico` deste diretório, pela
  // convenção de arquivo do App Router. Ter as duas coisas foi o que deixou o
  // favicon do template no ar por três meses (#41) — o `.ico` do create-next-app
  // vencia os `<link>` daqui, e ninguém percebia porque os dois pareciam certos.
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-(--font-inter)">{children}</body>
    </html>
  )
}
