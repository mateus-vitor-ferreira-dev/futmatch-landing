import Link from 'next/link'
import type { ReactNode } from 'react'
import LogoSvg from '@/components/LogoSvg'

export const LEGAL_LAST_UPDATED = '10 de agosto de 2026'

type LegalDocumentProps = {
  title: string
  description: string
  children: ReactNode
}

export default function LegalDocument({ title, description, children }: LegalDocumentProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="Voltar para a página inicial"><LogoSvg width={88} /></Link>
          <Link className="text-sm text-gray-400 transition-colors hover:text-green-400" href="/">Voltar ao início</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">Documentos legais</p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">{description}</p>
        <p className="mt-5 text-sm text-gray-500">Última atualização: <time dateTime="2026-08-10">{LEGAL_LAST_UPDATED}</time></p>
        <aside aria-label="Aviso sobre revisão jurídica" className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
          <strong>Minuta para revisão jurídica.</strong> Este documento não deve ser publicado em produção antes da aprovação do responsável jurídico da Só+1.
        </aside>
        <article className="legal-document mt-12 space-y-10">{children}</article>
        <nav aria-label="Outros documentos legais" className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row sm:gap-6">
          <Link className="text-green-400 hover:text-green-300" href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link className="text-green-400 hover:text-green-300" href="/termos-de-uso">Termos de Uso</Link>
        </nav>
      </main>
    </div>
  )
}
