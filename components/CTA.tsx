import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <div className="bg-gradient-to-r from-primary to-[#2B4ECE] text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Klaar om een loodgieter te vinden?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Plaats gratis uw aanvraag en ontvang binnen 24 uur offertes van gekwalificeerde loodgieters bij u in de buurt.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-[#2EAE4E] hover:bg-[#259544]" asChild>
            <Link href="/offerte-aanvragen">
              Offerte Aanvragen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
            <Link href="/vind-een-loodgieter">Vind een Loodgieter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

