"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

const serviceTypes = [
  "Lekkage reparatie",
  "Ontstopping",
  "CV-ketel onderhoud",
  "Badkamer renovatie",
  "Toilet installatie",
  "Andere",
]

const urgencyLevels = [
  { value: "low", label: "Laag - binnen een week" },
  { value: "medium", label: "Gemiddeld - binnen 48 uur" },
  { value: "high", label: "Hoog - binnen 24 uur" },
  { value: "emergency", label: "Noodgeval - zo snel mogelijk" },
]

export function RequestQuoteForm() {
  const [formData, setFormData] = useState({
    service_type: "",
    description: "",
    urgency: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Fout",
        description: "U moet ingelogd zijn om een offerte aan te vragen.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("quotes").insert([
      {
        ...formData,
        customer_id: user.id,
        status: "pending",
      },
    ])

    if (error) {
      console.error("Error submitting quote:", error)
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het indienen van uw offerte-aanvraag.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Uw offerte-aanvraag is succesvol ingediend.",
      })
      router.push("/customer/dashboard")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offerte Aanvragen</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="service_type">Type dienst</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData({ ...formData, service_type: value })}
            >
              <SelectTrigger id="service_type">
                <SelectValue placeholder="Selecteer een dienst" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Beschrijving van het probleem</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beschrijf uw probleem of de gewenste dienst"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="urgency">Urgentie</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Selecteer urgentieniveau" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Bezig met indienen..." : "Offerte Aanvragen"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

