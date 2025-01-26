import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Over Ons</h1>
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Lokale Loodgieters is het grootste platform voor betrouwbare loodgieters in Nederland. Wij verbinden
              gekwalificeerde vakmensen met klanten die op zoek zijn naar betrouwbare loodgietersservice.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Onze Missie</h2>
            <p className="mb-6">
              Wij streven ernaar om loodgietersdiensten toegankelijk, transparant en betrouwbaar te maken voor iedereen
              in Nederland.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Waarom Lokale Loodgieters?</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Meer dan 500 gecertificeerde loodgieters</li>
              <li>24/7 beschikbaarheid voor noodgevallen</li>
              <li>Transparante prijzen zonder verrassingen</li>
              <li>Kwaliteitsgarantie op alle werkzaamheden</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

