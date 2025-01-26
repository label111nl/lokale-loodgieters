"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, { message: "Naam moet minimaal 2 karakters lang zijn" }),
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  phone: z.string().min(10, { message: "Ongeldig telefoonnummer" }),
  company: z.string().min(2, { message: "Bedrijfsnaam moet minimaal 2 karakters lang zijn" }),
  city: z.string().min(2, { message: "Stad moet minimaal 2 karakters lang zijn" }),
  subscription: z.enum(["free", "premium"], {
    required_error: "Selecteer een abonnement",
  }),
})

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
      subscription: "free",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Here you would typically send the form data to your backend
    console.log(values)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulating API call
    setIsSubmitting(false)
    alert("Registratie succesvol! We nemen binnenkort contact met u op.")
    form.reset()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Registreer als Loodgieter</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam</FormLabel>
                <FormControl>
                  <Input placeholder="Uw volledige naam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrijfsnaam</FormLabel>
                <FormControl>
                  <Input placeholder="Uw bedrijfsnaam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stad</FormLabel>
                <FormControl>
                  <Input placeholder="Uw stad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subscription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abonnement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een abonnement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Gratis (€35 per lead)</SelectItem>
                    <SelectItem value="premium">Premium (€150/maand, onbeperkt leads)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Kies het abonnement dat het beste bij u past</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Bezig met registreren..." : "Registreren"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

