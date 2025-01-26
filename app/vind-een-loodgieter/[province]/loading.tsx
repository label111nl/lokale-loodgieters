import { Skeleton } from "@/components/ui/skeleton"
import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ProvinceLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main>
        <div className="relative bg-[#1E3B8B] text-white py-20">
          <div className="relative container mx-auto px-4">
            <Skeleton className="h-12 w-2/3 bg-white/20 mb-6" />
            <Skeleton className="h-6 w-1/2 bg-white/20" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

