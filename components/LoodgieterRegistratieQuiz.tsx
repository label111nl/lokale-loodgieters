"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STEPS = [
  {
    id: "welcome",
    title: "Welkom bij Lokale Loodgieters",
    description: "Laten we samen uw profiel opzetten om meer klanten te bereiken.",
  },
  {
    id: "business",
    title: "Uw Bedrijf",
    description: "Vertel ons meer over uw loodgietersbedrijf.",
  },
  {
    id: "contact",
    title: "Contactgegevens",
    description: "Hoe kunnen klanten u bereiken?",
  },
  {
    id: "location",
    title: "Locatie",
    description: "Waar bent u gevestigd en in welke gebieden werkt u?",
  },
  {
    id: "services",
    title: "Uw Diensten",
    description: "Welke diensten biedt u aan?",
  },
  {
    id: "additional",
    title: "Aanvullende Informatie",
    description: "Vertel ons meer over uw ervaring en certificeringen.",
  },
  {
    id: "subscription",
    title: "Kies uw Abonnement",
    description: "Selecteer het plan dat het beste bij u past.",
  },
]

const SERVICES = [
  "Algemeen loodgieterswerk",
  "Ontstopping",
  "CV-installatie",
  "Badkamer renovatie",
  "Dakwerk",
  "Riolering",
  "Warmtepomp installatie",
]

export function LoodgieterRegistratieQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    company_name: "",
    kvk_number: "",
    btw_number: "",
    contact_first_name: "",
    contact_last_name: "",
    email: "",
    phone: "",
    website: "",
    street_address: "",
    house_number: "",
    postal_code: "",
    city: "",
    about_text: "",
    founded_year: "",
    company_size: "",
    services: [] as string[],
    certifications: [] as string[],
    work_area: [] as string[],
    provides_emergency_service: false,
    emergency_phone: "",
    insurance_info: "",
    warranty_terms: "",
    payment_methods: [] as string[],
    subscription_type: "",
  })

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    const { data, error } = await supabase.from("cities").select("id, name")
    if (error) {
      console.error("Error fetching cities:", error)
    } else {
      setCities(data)
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("plumbers").insert([formData])

      if (error) throw error

      toast({
        title: "Registratie succesvol",
        description: "Uw account is aangemaakt. We nemen binnenkort contact met u op.",
      })
      router.push("/registratie-bevestiging")
    } catch (error) {
      console.error("Error during registration:", error)
      toast({
        title: "Fout bij registratie",
        description: "Er is een fout opgetreden. Probeer het later opnieuw.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Welkom bij Lokale Loodgieters</h2>
            <p className="text-gray-600">
              We zijn blij dat u zich wilt aansluiten bij ons netwerk van professionele loodgieters. Deze registratie
              duurt ongeveer 5-10 minuten.
            </p>
            <Button onClick={handleNext} className="w-full md:w-auto">
              Start Registratie <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="company_name">Bedrijfsnaam</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kvk_number">KvK-nummer</Label>
                <Input
                  id="kvk_number"
                  value={formData.kvk_number}
                  onChange={(e) => setFormData({ ...formData, kvk_number: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="btw_number">BTW-nummer</Label>
                <Input
                  id="btw_number"
                  value={formData.btw_number}
                  onChange={(e) => setFormData({ ...formData, btw_number: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="founded_year">Oprichtingsjaar</Label>
              <Input
                id="founded_year"
                type="number"
                value={formData.founded_year}
                onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="company_size">Bedrijfsgrootte</Label>
              <Select
                value={formData.company_size}
                onValueChange={(value) => setFormData({ ...formData, company_size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer bedrijfsgrootte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 medewerkers</SelectItem>
                  <SelectItem value="6-10">6-10 medewerkers</SelectItem>
                  <SelectItem value="11-20">11-20 medewerkers</SelectItem>
                  <SelectItem value="21+">21+ medewerkers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_first_name">Voornaam</Label>
                <Input
                  id="contact_first_name"
                  value={formData.contact_first_name}
                  onChange={(e) => setFormData({ ...formData, contact_first_name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_last_name">Achternaam</Label>
                <Input
                  id="contact_last_name"
                  value={formData.contact_last_name}
                  onChange={(e) => setFormData({ ...formData, contact_last_name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="street_address">Straatnaam</Label>
              <Input
                id="street_address"
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="house_number">Huisnummer</Label>
                <Input
                  id="house_number"
                  value={formData.house_number}
                  onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postcode</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="city">Stad</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een stad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="work_area">Werkgebied</Label>
              <Select
                value={formData.work_area[0]}
                onValueChange={(value) => setFormData({ ...formData, work_area: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer uw werkgebied" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Alleen lokaal</SelectItem>
                  <SelectItem value="regional">Regionaal</SelectItem>
                  <SelectItem value="national">Landelijk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Selecteer uw diensten</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.services.includes(service)}
                      onChange={(e) => {
                        const updatedServices = e.target.checked
                          ? [...formData.services, service]
                          : formData.services.filter((s) => s !== service)
                        setFormData({ ...formData, services: updatedServices })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={service}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="about_text">Over uw bedrijf</Label>
              <Textarea
                id="about_text"
                value={formData.about_text}
                onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="certifications">Certificeringen (komma-gescheiden)</Label>
              <Input
                id="certifications"
                value={formData.certifications.join(", ")}
                onChange={(e) =>
                  setFormData({ ...formData, certifications: e.target.value.split(",").map((s) => s.trim()) })
                }
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="provides_emergency_service"
                checked={formData.provides_emergency_service}
                onChange={(e) => setFormData({ ...formData, provides_emergency_service: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="provides_emergency_service">Biedt u nooddiensten aan?</Label>
            </div>
            {formData.provides_emergency_service && (
              <div>
                <Label htmlFor="emergency_phone">Noodnummer</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="insurance_info">Verzekeringsinformatie</Label>
              <Textarea
                id="insurance_info"
                value={formData.insurance_info}
                onChange={(e) => setFormData({ ...formData, insurance_info: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="warranty_terms">Garantievoorwaarden</Label>
              <Textarea
                id="warranty_terms"
                value={formData.warranty_terms}
                onChange={(e) => setFormData({ ...formData, warranty_terms: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label>Betaalmethoden</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Contant", "Pin", "Creditcard", "Bankoverschrijving"].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`payment_${method}`}
                      checked={formData.payment_methods.includes(method)}
                      onChange={(e) => {
                        const updatedMethods = e.target.checked
                          ? [...formData.payment_methods, method]
                          : formData.payment_methods.filter((m) => m !== method)
                        setFormData({ ...formData, payment_methods: updatedMethods })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`payment_${method}`}>{method}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label>Kies uw abonnement</Label>
              <RadioGroup
                value={formData.subscription_type}
                onValueChange={(value) => setFormData({ ...formData, subscription_type: value })}
              >
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free">Gratis (Pay-Per-Lead)</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standaard (€50/maand)</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">Premium (€150/maand)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative pt-8">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{STEPS[currentStep].title}</span>
              <span>
                Stap {currentStep + 1} van {STEPS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button className="ml-auto" onClick={handleNext}>
              Volgende
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="ml-auto bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Bezig met versturen..." : "Registratie Voltooien"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

