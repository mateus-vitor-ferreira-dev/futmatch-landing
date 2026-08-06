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

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
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
