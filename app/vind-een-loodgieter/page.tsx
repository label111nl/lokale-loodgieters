import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

interface City {
  id: number
  name: string
  slug: string
}

export default async function FindPlumberPage() {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: cities, error } = await supabase.from("cities").select("id, name, slug").order("name")

    if (error) {
      console.error("Error fetching cities:", error)
      return <div>Er is een fout opgetreden bij het laden van de steden. Probeer het later opnieuw.</div>
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Vind een Loodgieter in jouw Stad</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities && cities.length > 0 ? (
            cities.map((city: City) => (
              <Link
                key={city.id}
                href={`/loodgieter/${city.slug}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold">{city.name}</h2>
                <p className="text-sm text-gray-600">Vind loodgieters in {city.name}</p>
              </Link>
            ))
          ) : (
            <p>Er zijn momenteel geen steden beschikbaar.</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return <div>Er is een onverwachte fout opgetreden. Probeer het later opnieuw.</div>
  }
}

