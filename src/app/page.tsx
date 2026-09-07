import { getNumerosPublicos } from '@/lib/stats'
import { getGradeDePlanos } from '@/lib/planos'
import { getSports } from '@/lib/sports'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import AppPreviewSection from '@/components/landing/AppPreviewSection'
import TimesSection from '@/components/landing/TimesSection'
import AcessoSection from '@/components/landing/AcessoSection'
import PertoSection from '@/components/landing/PertoSection'
import CampeonatosSection from '@/components/landing/CampeonatosSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import OwnerSection from '@/components/landing/OwnerSection'
import EscolinhaEDayUseSection from '@/components/landing/EscolinhaEDayUseSection'
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
  const [numeros, planos, sports] = await Promise.all([
    getNumerosPublicos(),
    getGradeDePlanos(),
    getSports(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection numeros={numeros} />
        <FeaturesSection />
        <AppPreviewSection />
        {/*
          As quatro seções de profundidade, uma por épico que a semana fechou
          (#63). Entram aqui, e não entre a `FeaturesSection` e o
          `AppPreviewSection`, porque ali empurrariam a prova visual para o fim
          da página — que é onde ela vale menos. A ordem lida vira: visão geral
          → veja o app → os quatro recursos grandes → como começar.

          O `div` com o id existe para o menu: quatro entradas novas fariam uma
          navbar de nove itens, e o que a pessoa procura no menu é o assunto, não
          cada seção. Cada uma mantém o id próprio, para link direto.
        */}
        <div id="recursos">
          <TimesSection />
          <AcessoSection />
          <PertoSection />
          <CampeonatosSection />
        </div>
        <HowItWorksSection />
        <OwnerSection />
        {/*
          Logo depois do pitch do dono, e antes dos planos (#87). A `OwnerSection`
          diz "cadastre seu espaço"; esta diz de quantos jeitos ele vende; e os
          planos, logo abaixo, dizem quanto custa. A ordem lida é a da decisão.
        */}
        <EscolinhaEDayUseSection />
        {/*
          Logo depois da seção do dono, porque é a continuação da mesma
          conversa: ali ele vê o que ganha, aqui vê se existe um plano do
          tamanho do espaço dele. Some sozinha quando a API não responde.
        */}
        <PlanosSection grade={planos} />
        <CourtsSection sports={sports} />
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
