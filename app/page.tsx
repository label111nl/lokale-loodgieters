import { SEO } from "@/components/SEO"
import { AnimatedSection } from "@/components/AnimatedSection"
import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Reviews from "@/components/Reviews"
import CommonProblems from "@/components/CommonProblems"
import Footer from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <>
      <SEO
        title="Vind Betrouwbare Loodgieters in Uw Buurt"
        description="Lokale Loodgieters verbindt u met gekwalificeerde loodgieters in uw omgeving. Snel, betrouwbaar en 24/7 beschikbaar voor al uw loodgietersbehoeften."
      />
      <div className="min-h-screen flex flex-col">
        <TopBanner />
        <Header />
        <main>
          <Hero />

          {/* Feature Section 1 */}
          <AnimatedSection className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
            <div className="container mx-auto px-4 relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Professionele CV & Verwarmingsservice</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Onze gecertificeerde experts zorgen voor optimale prestaties van uw verwarmingssysteem. 24/7
                    beschikbaar voor al uw verwarmingsbehoeften.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/diensten/cv-onderhoud">Meer over CV onderhoud</Link>
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-heiko-ruth-53441229-7859953%20(1).jpg-2zw2jqnnPSL7V7A2fJ8yRc9vznmRYA.jpeg"
                    alt="CV Ketel Onderhoud"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature Section 2 */}
          <AnimatedSection className="py-24 relative overflow-hidden bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-anilkarakaya-6419128%20(1).jpg-mjakRGLRIBRmqln7tKq3X4cTpkGWGb.jpeg"
                    alt="Loodgieter aan het werk"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-white">Expert Loodgieterswerk</h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Van kleine reparaties tot complete renovaties, onze ervaren loodgieters staan voor u klaar met
                    vakkundige oplossingen.
                  </p>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/diensten">Bekijk alle diensten</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature Section 3 */}
          <AnimatedSection className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50" />
            <div className="container mx-auto px-4 relative">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Gasleidingen & Installaties</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Veiligheid staat voorop bij het werken met gas. Onze specialisten zorgen voor veilige en betrouwbare
                    gasinstallaties.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/diensten/gas">Meer over gasservice</Link>
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-scottwebb-1029635.jpg-CgoRSVsfAz8C5nbznAiScXTEXlYVFo.jpeg"
                    alt="Gasinstallatie"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          <Reviews />
          <CommonProblems />
        </main>
        <Footer />
      </div>
    </>
  )
}

