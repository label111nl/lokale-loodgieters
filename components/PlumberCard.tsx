import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, Award, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PlumberCardProps {
  id: string
  companyName: string
  fullName: string
  city: string
  rating: number
  totalReviews: number
  imageUrl: string
  services: string[]
  isEmergencyAvailable: boolean
}

export function PlumberCard({
  id,
  companyName,
  fullName,
  city,
  rating,
  totalReviews,
  imageUrl,
  services,
  isEmergencyAvailable,
}: PlumberCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || "/placeholder.svg?height=192&width=384"}
            alt={companyName}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{companyName}</h3>
            <p className="text-sm text-muted-foreground">{fullName}</p>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="font-bold">{rating}</span>
            <span className="text-sm text-muted-foreground ml-1">({totalReviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm">{city}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {services.slice(0, 3).map((service) => (
            <span key={service} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {service}
            </span>
          ))}
          {services.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100">+{services.length - 3}</span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          {isEmergencyAvailable && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">24/7 Beschikbaar</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Gecertificeerd</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/offerte-aanvragen?plumber=${id}`}>Offerte Aanvragen</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/loodgieter/${id}`}>Bekijk Profiel</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

