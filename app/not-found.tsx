import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pagina niet gevonden</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we kunnen de pagina die u zoekt niet vinden. Mogelijk is deze verplaatst of verwijderd.
        </p>
        <Button asChild>
          <Link href="/" className="inline-flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            Terug naar home
          </Link>
        </Button>
      </div>
    </div>
  )
}

