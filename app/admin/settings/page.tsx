"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("")
  const [siteDescription, setSiteDescription] = useState("")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [stripeSecretKey, setStripeSecretKey] = useState("")
  const [stripePublishableKey, setStripePublishableKey] = useState("")

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("settings").select("*").single()

    if (error) {
      console.error("Error fetching settings:", error)
    } else if (data) {
      setSiteName(data.site_name)
      setSiteDescription(data.site_description)
      setMaintenanceMode(data.maintenance_mode)
      setPaymentMethod(data.payment_method)
      setStripeSecretKey(data.stripe_secret_key || "")
      setStripePublishableKey(data.stripe_publishable_key || "")
    }
  }

  const handleSave = async () => {
    const { error } = await supabase.from("settings").upsert({
      site_name: siteName,
      site_description: siteDescription,
      maintenance_mode: maintenanceMode,
      payment_method: paymentMethod,
      stripe_secret_key: stripeSecretKey,
      stripe_publishable_key: stripePublishableKey,
    })

    if (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het opslaan van de instellingen.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Instellingen opgeslagen!",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Site-instellingen</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="site-name">Sitenaam</Label>
          <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="site-description">Sitebeschrijving</Label>
          <Textarea
            id="site-description"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          <Label htmlFor="maintenance-mode">Onderhoudsmodus</Label>
        </div>
        <div>
          <Label>Betaalmethode</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe">Stripe</Label>
            </div>
          </RadioGroup>
        </div>
        {paymentMethod === "stripe" && (
          <>
            <div>
              <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
              <Input
                id="stripe-secret-key"
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
                type="password"
              />
            </div>
            <div>
              <Label htmlFor="stripe-publishable-key">Stripe Publishable Key</Label>
              <Input
                id="stripe-publishable-key"
                value={stripePublishableKey}
                onChange={(e) => setStripePublishableKey(e.target.value)}
                type="password"
              />
            </div>
          </>
        )}
        <Button onClick={handleSave}>Instellingen Opslaan</Button>
      </div>
    </div>
  )
}

