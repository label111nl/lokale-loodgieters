"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { loadStripe, Stripe } from "@stripe/stripe-js"

// Type definitions
interface SubscriptionPlan {
  name: string
  price: number
  credits: number
  description: string
}

interface SubscriptionPageProps {
  plumberId: string
  currentSubscription: string
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Subscription plans data
const subscriptionPlans: SubscriptionPlan[] = [
  { name: "Gratis", price: 0, credits: 0, description: "Pay-per-lead, €35 per lead" },
  { name: "Standaard", price: 50, credits: 4, description: "€50/maand, inclusief 4 leads" },
  { name: "Premium", price: 150, credits: 0, description: "€150/maand, onbeperkt aantal leads" },
]

export function SubscriptionPage({ plumberId, currentSubscription }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentSubscription)
  const supabase = createClientComponentClient()

  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const response = await fetch("/api/create-subscription-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName: selectedPlan, plumberId }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { sessionId } = await response.json()
      if (!sessionId) {
        throw new Error('No session ID returned')
      }

      const result = await stripe.redirectToCheckout({ sessionId })
      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Abonnementen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name} className={selectedPlan === plan.name ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€{plan.price}/maand</p>
              <p>{plan.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setSelectedPlan(plan.name)}
                variant={selectedPlan === plan.name ? "default" : "outline"}
                className="w-full"
              >
                {selectedPlan === plan.name ? "Geselecteerd" : "Selecteer"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button 
        onClick={handleSubscribe} 
        disabled={selectedPlan === currentSubscription}
        className="w-full"
      >
        {selectedPlan === currentSubscription ? "Huidig Abonnement" : "Abonneer"}
      </Button>
    </div>
  )
}