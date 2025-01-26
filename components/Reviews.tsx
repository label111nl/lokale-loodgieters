import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  author: string
  rating: number
  text: string
  date: string
}

interface ReviewsProps {
  reviews?: Review[]
  className?: string
}

const defaultReviews: Review[] = [
  {
    author: "Jan de Vries",
    rating: 5,
    text: "Uitstekende service! De loodgieter was binnen een uur ter plaatse en heeft het probleem snel en vakkundig opgelost.",
    date: "2 dagen geleden",
  },
  {
    author: "Maria Jansen",
    rating: 5,
    text: "Zeer tevreden met de service. Duidelijke communicatie en nette afwerking van het werk.",
    date: "1 week geleden",
  },
  {
    author: "Peter Bakker",
    rating: 5,
    text: "Snelle en professionele service voor een eerlijke prijs. Zeker een aanrader!",
    date: "2 weken geleden",
  },
]

export function Reviews({ reviews = defaultReviews, className }: ReviewsProps) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Wat onze klanten zeggen</h2>
          <p className="text-lg text-gray-600">Bekijk de ervaringen van klanten die u voorgingen</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.text}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{review.author}</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews

