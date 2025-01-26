import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SEOContent from "@/components/SEOContent"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

type Province = Database["public"]["Tables"]["provinces"]["Row"]
type City = Database["public"]["Tables"]["cities"]["Row"]

async function getProvinceData(provinceSlug: string) {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })

    console.log("Fetching province data for slug:", provinceSlug)

    // Get province data
    const { data: province, error: provinceError } = await supabase
      .from("provinces")
      .select("*")
      .eq("slug", provinceSlug)
      .single()

    if (provinceError) {
      console.error("Error fetching province:", provinceError)
      return null
    }

    if (!province) {
      console.error("Province not found for slug:", provinceSlug)
      return null
    }

    console.log("Found province:", province)

    // Get cities for this province
    const { data: cities, error: citiesError } = await supabase
      .from("cities")
      .select("*")
      .eq("province_id", province.id)
      .order("name")

    if (citiesError) {
      console.error("Error fetching cities:", citiesError)
      return null
    }

    console.log(`Found ${cities?.length || 0} cities for province:`, province.name)

    return {
      name: province.name,
      slug: province.slug,
      cities: cities || [],
    }
  } catch (error) {
    console.error("Unexpected error in getProvinceData:", error)
    return null
  }
}

export default async function ProvincePage({ params }: { params: { province: string } }) {
  console.log("Rendering ProvincePage for params:", params)

  const provinceData = await getProvinceData(params.province)

  if (!provinceData) {
    console.log("Province data not found, redirecting to not-found")
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vind een loodgieter in {provinceData.name}</h1>
            <p className="text-xl mb-8 max-w-2xl">
              Bekijk betrouwbare en gecertificeerde loodgieters in {provinceData.name}. 24/7 beschikbaar voor
              spoedgevallen.
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Steden in {provinceData.name}</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {provinceData.cities.map((city) => (
              <Button key={city.id} variant="outline" className="justify-start" asChild>
                <Link href={`/vind-een-loodgieter/${provinceData.slug}/${city.slug}`}>Loodgieter in {city.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="container mx-auto px-4 py-12">
          <SEOContent location={provinceData.name} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

