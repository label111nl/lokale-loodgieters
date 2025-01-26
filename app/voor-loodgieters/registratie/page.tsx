import { SEO } from "@/components/SEO"
import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { LoodgieterRegistratieQuiz } from "@/components/LoodgieterRegistratieQuiz"

export default function PlumberRegistrationPage() {
  return (
    <>
      <SEO
        title="Word Partner | Lokale Loodgieters"
        description="Registreer als loodgieter op ons platform en ontvang relevante opdrachten in uw regio. Flexibele abonnementen en uitstekende ondersteuning."
      />
      <div className="min-h-screen flex flex-col">
        <TopBanner />
        <Header />
        <main className="flex-1 bg-gray-50">
          {/* Hero Section */}
          <section className="bg-white py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Word partner van <span className="text-primary">Lokale Loodgieters</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Ontvang relevante opdrachten in uw regio en laat uw bedrijf groeien
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Gratis registratie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Flexibele abonnementen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>Gekwalificeerde leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Uitstekende ondersteuning</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Registration Form Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <LoodgieterRegistratieQuiz />
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Voordelen van ons platform</h2>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Ontvang relevante leads in uw regio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Flexibele abonnementsmodellen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Gratis bedrijfsprofiel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>24/7 toegang tot uw dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Persoonlijke ondersteuning</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

