import Link from "next/link"
import Image from "next/image"
import { Facebook, Youtube, Twitter } from "lucide-react"
import FAQ from "@/components/FAQ"

export default function Footer() {
  const cities = [
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Tilburg",
    "Almere",
    "Breda",
    "Nijmegen",
    "Enschede",
    "Apeldoorn",
  ]

  const quickLinks = [
    {
      title: "Voor Klanten",
      links: [
        { name: "Offerte Aanvragen", href: "/offerte-aanvragen" },
        { name: "Hoe werkt het", href: "/hoe-werkt-het" },
        { name: "Veel gestelde vragen", href: "/faq" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Voor Loodgieters",
      links: [
        { name: "Aanmelden als loodgieter", href: "/voor-loodgieters" },
        { name: "Tarieven", href: "/tarieven" },
        { name: "Voorwaarden", href: "/voorwaarden" },
        { name: "Helpdesk", href: "/helpdesk" },
      ],
    },
    {
      title: "Over Ons",
      links: [
        { name: "Over Lokale Loodgieters", href: "/over-ons" },
        { name: "Reviews", href: "/reviews" },
        { name: "Blog", href: "/blog" },
        { name: "Pers", href: "/pers" },
        { name: "Login", href: "/login" },
      ],
    },
  ]

  const services = [
    "Lekkages",
    "Ontstopping",
    "CV Installatie",
    "Sanitair",
    "Dakwerk",
    "Riolering",
    "Warmtepomp",
    "Noodservice",
  ]

  const footerFaqs = [
    {
      question: "Wat doet Lokale Loodgieters?",
      answer:
        "Lokale Loodgieters is een online platform dat klanten verbindt met ervaren loodgieters in hun regio voor diverse loodgietersklussen.",
    },
    {
      question: "Hoe vind ik een loodgieter via Lokale Loodgieters?",
      answer:
        "Plaats een klus via ons offerteformulier, ontvang offertes van lokale loodgieters, vergelijk en kies de beste match voor uw project.",
    },
    {
      question: "Wat kost het gebruik van Lokale Loodgieters?",
      answer:
        "Het gebruik van ons platform is gratis voor klanten. U betaalt alleen voor de diensten van de loodgieter die u kiest.",
    },
  ]

  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue_Modern_Technician_Logo__4_-removebg-preview-xCb15ZpHOPQVwgCdRP0LLkZrFrcdBN.png"
              alt="Lokale Loodgieters"
              width={180}
              height={40}
              className="mb-4"
            />
            <p className="text-gray-600 mb-4">Vind betrouwbare loodgieters in uw regio voor al uw loodgieterswerk.</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-400 hover:text-gray-600">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://youtube.com" className="text-gray-400 hover:text-gray-600">
                <Youtube className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-gray-600">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks.map((category, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="font-semibold text-lg mb-4">Veelgestelde Vragen</h3>
          <FAQ faqs={footerFaqs} className="mb-4" />
          <Link href="/faq" className="text-blue-600 hover:text-blue-800">
            Bekijk alle veelgestelde vragen
          </Link>
        </div>

        {/* Cities Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="font-semibold text-lg mb-4">Vind een loodgieter in uw stad</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {cities.map((city, index) => (
              <Link
                key={index}
                href={`/loodgieter/${city.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="font-semibold text-lg mb-4">Onze Diensten</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {services.map((service, index) => (
              <Link
                key={index}
                href={`/diensten/${service.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900"
              >
                {service}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-gray-900">
                Cookies
              </Link>
              <Link href="/voorwaarden" className="hover:text-gray-900">
                Algemene voorwaarden
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Lokale Loodgieters. Alle rechten voorbehouden.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

