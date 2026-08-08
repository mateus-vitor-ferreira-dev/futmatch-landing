import { getNumerosPublicos } from '@/lib/stats'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import AppPreviewSection from '@/components/landing/AppPreviewSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import OwnerSection from '@/components/landing/OwnerSection'
import CourtsSection from '@/components/landing/CourtsSection'
import FAQSection from '@/components/landing/FAQSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

// Server Component: os números são buscados no servidor e chegam prontos no
// HTML. Nada de useEffect no cliente — assim quem visita não vê a seção pular
// de vazia para preenchida, e o dado não depende do JavaScript carregar.
export default async function LandingPage() {
  const numeros = await getNumerosPublicos()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection numeros={numeros} />
        <FeaturesSection />
        <AppPreviewSection />
        <HowItWorksSection />
        <OwnerSection />
        <CourtsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
