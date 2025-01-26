import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SEOContent from "@/components/SEOContent"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

type Province = Database["public"]["Tables"]["provinces"]["Row"]
type City = Database["public"]["Tables"]["cities"]["Row"]

async function getCityData(provinceSlug: string, citySlug: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // First get the province
  const { data: province, error: provinceError } = await supabase
    .from("provinces")
    .select("*")
    .eq("slug", provinceSlug)
    .single()

  if (provinceError || !province) {
    console.error("Error fetching province:", provinceError)
    return null
  }

  // Then get the city
  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("province_id", province.id)
    .eq("slug", citySlug)
    .single()

  if (cityError || !city) {
    console.error("Error fetching city:", cityError)
    return null
  }

  return {
    name: city.name,
    province: {
      name: province.name,
      slug: province.slug,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: { province: string; city: string }
}) {
  const cityData = await getCityData(params.province, params.city)

  if (!cityData) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative bg-[#1E3B8B] text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E3B8B] to-[#2B4ECE]" />
          <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Loodgieter in {cityData.name}</h1>
            <p className="text-xl mb-8 max-w-2xl">
              Vind direct een betrouwbare loodgieter in {cityData.name}. 24/7 beschikbaar voor spoedgevallen.
            </p>
            <Button size="lg" className="bg-[#2EAE4E] hover:bg-[#259544]" asChild>
              <Link href="/offerte-aanvragen">Direct een loodgieter nodig?</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-yellow-400" />
                  <div>
                    <div className="font-bold">Beoordeeld met 4.8/5</div>
                    <div className="text-sm text-gray-600">Door klanten in {cityData.name}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">24/7 Beschikbaar</div>
                    <div className="text-sm text-gray-600">Ook voor spoedgevallen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-bold">Gecertificeerd</div>
                    <div className="text-sm text-gray-600">Erkende loodgieters</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-[#2EAE4E]" />
                  <div>
                    <div className="font-bold">Garantie</div>
                    <div className="text-sm text-gray-600">Op alle werkzaamheden</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SEO Content */}
        <div className="container mx-auto px-4 py-12">
          <SEOContent location={cityData.name} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

