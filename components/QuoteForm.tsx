"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, ArrowRight } from "lucide-react"

const formSchema = z.object({
  companyName: z.string().optional(),
  contactName: z.string().min(2, { message: "Naam moet minimaal 2 karakters lang zijn" }),
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  phone: z.string().min(10, { message: "Ongeldig telefoonnummer" }),
  address: z.string().min(5, { message: "Adres moet minimaal 5 karakters lang zijn" }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 karakters lang zijn" }),
})

const steps = [
  { title: "Over uw bedrijf", fields: ["companyName"] },
  { title: "Contactgegevens", fields: ["contactName", "email", "phone"] },
  { title: "Projectdetails", fields: ["address", "description"] },
]

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    console.log(values)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    alert("Uw aanvraag is succesvol verzonden! We nemen binnen 24 uur contact met u op.")
    form.reset()
    setCurrentStep(0)
  }

  const currentFields = steps[currentStep].fields

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">
            Stap {currentStep + 1} van {steps.length}
          </h3>
          <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {currentFields.includes("companyName") && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrijfsnaam (optioneel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Uw bedrijfsnaam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes("contactName") && (
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam</FormLabel>
                    <FormControl>
                      <Input placeholder="Uw naam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes("email") && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="uw@email.nl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes("phone") && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefoonnummer</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0612345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes("address") && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input placeholder="Straat en huisnummer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentFields.includes("description") && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschrijving van de klus</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Beschrijf uw klus zo gedetailleerd mogelijk"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vorige
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {currentStep === steps.length - 1 ? (
                isSubmitting ? (
                  "Bezig met verzenden..."
                ) : (
                  "Versturen"
                )
              ) : (
                <>
                  Volgende
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

