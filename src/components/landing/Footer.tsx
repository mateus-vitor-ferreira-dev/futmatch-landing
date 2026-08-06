import { Mail, AtSign, GitBranch } from 'lucide-react'
import LogoSvg from '@/components/LogoSvg'

const platformLinks = [
  { label: 'Começar grátis',    href: 'https://app.so-mais-um.com/register' },
  { label: 'Entrar na conta',   href: 'https://app.so-mais-um.com/login' },
  { label: 'Funcionalidades',   href: '#features' },
  { label: 'Como funciona',     href: '#how-it-works' },
  { label: 'Modalidades',       href: '#courts' },
  { label: 'Portal de parceiros', href: 'https://app.so-mais-um.com/seja-parceiro' },
]

const socialLinks = [
  {
    Icon: Mail,
    label: 'E-mail',
    href: 'mailto:mateus.ferreira10profissional@gmail.com',
    text: 'mateus.ferreira10profissional@gmail.com',
  },
  {
    Icon: AtSign,
    label: 'Instagram',
    href: 'https://instagram.com/so_mais_um_app',
    text: '@so_mais_um_app',
  },
  {
    Icon: GitBranch,
    label: 'GitHub',
    href: 'https://github.com/mateus-vitor-ferreira-dev',
    text: 'github.com/mateus-vitor-ferreira-dev',
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <LogoSvg width={96} />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              A plataforma que conecta jogadores, espaços e peladas. Do racha da várzea ao torneio organizado.
            </p>
            {/* Social icon row */}
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-900 border border-white/5 hover:border-green-500/30 hover:text-green-400 text-gray-500 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Plataforma</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-green-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contato</h4>
            <ul className="space-y-4">
              {socialLinks.map(({ Icon, label, href, text }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-gray-500 hover:text-green-400 text-sm transition-colors duration-200 group"
                  >
                    <Icon size={15} className="mt-0.5 flex-shrink-0 group-hover:text-green-400" />
                    <span className="break-all">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Só+1. Todos os direitos reservados.
          </p>
          <p className="text-gray-700 text-xs">
            Feito com <span className="text-green-500">paixão</span> por quem ama jogar
          </p>
        </div>
      </div>
    </footer>
  )
}
