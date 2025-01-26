import { PlumberProfileForm } from "@/components/PlumberProfileForm"
import { SEO } from "@/components/SEO"

export default function PlumberProfilePage() {
  return (
    <>
      <SEO
        title="Profiel Bewerken | Lokale Loodgieters"
        description="Bewerk je loodgietersprofiel op het Lokale Loodgieters platform."
      />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Profiel Bewerken</h1>
        <PlumberProfileForm />
      </div>
    </>
  )
}

