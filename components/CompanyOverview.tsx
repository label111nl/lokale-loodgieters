import { ReactRuntime } from "@makeswift/runtime/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// Makeswift imports
import { TextInput, List, Image as MakeswiftImage, Style } from "@makeswift/runtime/controls"

export function CompanyOverview({ className }: { className?: string }) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Lokale Loodgieters, uw betrouwbare partner</h2>
            <p className="text-lg text-gray-600 mb-6">
              Met meer dan 500 gekwalificeerde loodgieters verspreid over heel Nederland, zijn wij er altijd voor u. Of
              het nu gaat om een spoedgeval of regulier onderhoud, u kunt op ons rekenen.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                24/7 beschikbaar voor spoedgevallen
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Gekwalificeerde en ervaren loodgieters
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Transparante prijzen, geen verrassingen
              </li>
            </ul>
            <Button size="lg" asChild>
              <Link href="/offerte-aanvragen">Direct een loodgieter nodig?</Link>
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <MakeswiftImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/www.britishgas.co.uk_plumbing.html-v59XdcWBbqLKdP4GW66xhQ8adGZq4L.png"
              alt="Lokale Loodgieters servicewagen"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Register with Makeswift
ReactRuntime.registerComponent(CompanyOverview, {
  type: "company-overview",
  label: "Company Overview",
  props: {
    title: TextInput({ label: "Title" }),
    description: TextInput({ label: "Description", multiline: true }),
    features: List({
      label: "Features",
      type: TextInput(),
    }),
    image: MakeswiftImage({ label: "Image" }),
    buttonText: TextInput({ label: "Button Text" }),
    buttonLink: TextInput({ label: "Button Link" }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

