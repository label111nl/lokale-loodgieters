"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { sendConfirmationEmail } from "@/lib/email"

const SERVICES = [
  "Lekkage reparatie",
  "Ontstopping",
  "CV-ketel onderhoud",
  "Badkamer renovatie",
  "Dakgoot reparatie",
  "Toilet installatie",
  "Andere",
]

export function QuoteRequestForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    service_type: "",
    description: "",
    preferred_date: "",
    preferred_time: "",
    urgency: "normal",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.from("quotes").insert([formData])

      if (error) throw error

      // Send confirmation email
      await sendConfirmationEmail(formData.email, formData.name)

      toast({
        title: "Offerte aanvraag verzonden",
        description: "We hebben uw aanvraag ontvangen en sturen u een bevestigingsmail.",
      })
      router.push("/offerte-bevestiging")
    } catch (error) {
      console.error("Error submitting quote request:", error)
      toast({
        title: "Fout bij verzenden",
        description: "Er is een fout opgetreden. Probeer het later opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Offerte Aanvragen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Stad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="postal_code">Postcode</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="service_type">Type dienst</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData({ ...formData, service_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een dienst" />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
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
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_date">Voorkeursdatum</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="preferred_time">Voorkeurstijd</Label>
              <Select
                value={formData.preferred_time}
                onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een tijd" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Ochtend</SelectItem>
                  <SelectItem value="afternoon">Middag</SelectItem>
                  <SelectItem value="evening">Avond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Urgentie</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => setFormData({ ...formData, urgency: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normaal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent">Urgent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emergency" id="emergency" />
                <Label htmlFor="emergency">Noodgeval</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Bezig met verzenden..." : "Offerte Aanvragen"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

