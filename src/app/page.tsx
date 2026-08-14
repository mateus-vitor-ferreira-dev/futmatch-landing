import { getNumerosPublicos } from '@/lib/stats'
import { getGradeDePlanos } from '@/lib/planos'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import AppPreviewSection from '@/components/landing/AppPreviewSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import OwnerSection from '@/components/landing/OwnerSection'
import PlanosSection from '@/components/landing/PlanosSection'
import CourtsSection from '@/components/landing/CourtsSection'
import RoadmapSection from '@/components/landing/RoadmapSection'
import FAQSection from '@/components/landing/FAQSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

// Server Component: os números são buscados no servidor e chegam prontos no
// HTML. Nada de useEffect no cliente — assim quem visita não vê a seção pular
// de vazia para preenchida, e o dado não depende do JavaScript carregar.
export default async function LandingPage() {
  // Em paralelo: são duas rotas independentes, e encadeá-las somaria as duas
  // latências no tempo de resposta da página.
  const [numeros, planos] = await Promise.all([
    getNumerosPublicos(),
    getGradeDePlanos(),
  ])

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
        {/*
          Logo depois da seção do dono, porque é a continuação da mesma
          conversa: ali ele vê o que ganha, aqui vê se existe um plano do
          tamanho do espaço dele. Some sozinha quando a API não responde.
        */}
        <PlanosSection grade={planos} />
        <CourtsSection />
        {/*
          O roadmap entra depois de tudo o que já existe e antes do FAQ: quem
          chega aqui já leu a página inteira de funcionalidades reais, então não
          há como confundir uma lista com a outra.
        */}
        <RoadmapSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
