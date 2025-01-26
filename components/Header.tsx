import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue_Modern_Technician_Logo__4_-removebg-preview-xCb15ZpHOPQVwgCdRP0LLkZrFrcdBN.png"
            alt="Lokale Loodgieters"
            width={180}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center space-x-8">
          <Link href="/vind-een-loodgieter" className="flex items-center text-gray-600 hover:text-gray-900">
            <MapPin className="mr-2 h-4 w-4" />
            Kies je stad
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/diensten" className="text-gray-600 hover:text-gray-900">
              Diensten
            </Link>
            <Link href="/over-ons" className="text-gray-600 hover:text-gray-900">
              Over Ons
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/voor-loodgieters">Voor Loodgieters</Link>
            </Button>
            <Button className="bg-[#2EAE4E] hover:bg-[#259544]" asChild>
              <Link href="/offerte-aanvragen">Offerte Aanvragen</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

