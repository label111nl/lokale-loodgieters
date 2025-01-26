import { Button } from "@/components/ui/button"
import { Star, Users, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative bg-[#1E3B8B] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E3B8B] to-[#2B4ECE]" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Op zoek naar een uitstekende lokale loodgieter?</h1>
          <p className="text-xl mb-8">
            Geen paniek! Onze gekwalificeerde loodgieters staan 24/7 voor u klaar - Wij helpen u direct verder
          </p>

          <div className="flex gap-4 mb-16">
            <Button size="lg" className="bg-[#2EAE4E] hover:bg-[#259544]" asChild>
              <Link href="/offerte-aanvragen">Offerte Aanvragen</Link>
            </Button>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
              <Link href="/diensten">Bekijk Onze Diensten</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">4.9/5</div>
                <div className="text-sm opacity-80">Klantwaardering</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">500+</div>
                <div className="text-sm opacity-80">Loodgieters</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">30+</div>
                <div className="text-sm opacity-80">Steden</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">24/7</div>
                <div className="text-sm opacity-80">Beschikbaar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

