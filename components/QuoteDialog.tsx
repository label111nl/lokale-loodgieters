"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

interface FormStep {
  title: string
  fields: { id: string; label: string; type: string; options?: string[] }[]
}

const formSteps: FormStep[] = [
  {
    title: "Wat voor loodgietersdienst heeft u nodig?",
    fields: [
      {
        id: "service",
        label: "Selecteer een dienst",
        type: "radio",
        options: ["Lekkage verhelpen", "CV ketel onderhoud", "Verstopping oplossen", "Sanitair installatie", "Anders"],
      },
    ],
  },
  {
    title: "Hoe urgent is uw situatie?",
    fields: [
      {
        id: "urgency",
        label: "Selecteer urgentie",
        type: "radio",
        options: ["Direct (binnen 24 uur)", "Deze week", "Komende weken", "Geen haast"],
      },
    ],
  },
  {
    title: "Uw contactgegevens",
    fields: [
      { id: "name", label: "Naam", type: "text" },
      { id: "email", label: "E-mailadres", type: "email" },
      { id: "phone", label: "Telefoonnummer", type: "tel" },
      { id: "description", label: "Omschrijf uw situatie", type: "textarea" },
    ],
  },
]

export default function QuoteDialog() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const progress = ((currentStep + 1) / formSteps.length) * 100

  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-[#2EAE4E] hover:bg-[#259544]">
          Offerte Aanvragen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Offerte Aanvragen</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Progress value={progress} className="mb-4" />
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {formSteps[currentStep].fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  {field.type === "radio" && field.options ? (
                    <RadioGroup
                      onValueChange={(value) => handleInputChange(field.id, value)}
                      value={formData[field.id]}
                    >
                      {field.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                          <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Vorige
                </Button>
              )}
              {currentStep < formSteps.length - 1 ? (
                <Button type="button" onClick={handleNext} className="ml-auto">
                  Volgende
                </Button>
              ) : (
                <Button type="submit" className="ml-auto bg-[#2EAE4E] hover:bg-[#259544]">
                  Verstuur
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

