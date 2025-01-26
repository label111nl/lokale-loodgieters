import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon, MapIcon } from "lucide-react"

export default function ProvinceNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Provincie niet gevonden</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we kunnen de provincie die u zoekt niet vinden. Bekijk onze lijst met beschikbare provincies.
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link href="/" className="inline-flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/vind-een-loodgieter" className="inline-flex items-center">
              <MapIcon className="mr-2 h-4 w-4" />
              Alle provincies
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

