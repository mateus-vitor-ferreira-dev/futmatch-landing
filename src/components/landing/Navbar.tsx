'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import LogoSvg from '@/components/LogoSvg'

const links = [
  { label: 'Funcionalidades', href: '#features' },
  { label: 'Como funciona',   href: '#how-it-works' },
  { label: 'Modalidades',     href: '#courts' },
  { label: 'Para espaços',    href: '#owner' },
]

export default function Navbar() {
  const navRef     = useRef<HTMLElement>(null)
  const mobileRef  = useRef<HTMLDivElement>(null)
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeHref, setActiveHref] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Active section highlight
    const sectionIds = links.map(l => l.href.slice(1))
    const observers: IntersectionObserver[] = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHref(`#${id}`) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [])

  // Animate mobile menu open/close
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    if (menuOpen) {
      el.style.display = 'flex'
      gsap.fromTo(el, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
    } else {
      gsap.to(el, {
        opacity: 0, y: -6, duration: 0.15, ease: 'power2.in',
        onComplete: () => { el.style.display = 'none' },
      })
    }
  }, [menuOpen])

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center opacity-90 hover:opacity-100 transition-opacity">
          <LogoSvg width={88} />
        </a>

        <ul className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  activeHref === link.href
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-green-400'
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a href="https://app.so-mais-um.com/login">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              Entrar
            </Button>
          </a>
          <a href="https://app.so-mais-um.com/register">
            <Button size="sm" className="btn-shimmer">Começar grátis</Button>
          </a>
        </div>

        <button
          className="lg:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu — always mounted, visibility controlled by GSAP */}
      <div
        ref={mobileRef}
        style={{ display: 'none' }}
        className="lg:hidden bg-gray-950/97 backdrop-blur-md border-t border-white/10 px-6 py-5 flex-col gap-4"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              'font-medium transition-colors text-base',
              activeHref === link.href ? 'text-green-400' : 'text-gray-300'
            )}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <hr className="border-white/10" />
        <a href="https://app.so-mais-um.com/login">
          <Button variant="ghost" className="w-full text-gray-300">Entrar</Button>
        </a>
        <a href="https://app.so-mais-um.com/register">
          <Button className="w-full btn-shimmer">Começar grátis</Button>
        </a>
      </div>
    </nav>
  )
}
