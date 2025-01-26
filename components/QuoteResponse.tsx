"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/hooks/useTranslation"
import { deductCredits } from "@/utils/credit-management"

type Quote = {
  id: string
  name: string
  service_type: string
  description: string
  urgency: string
  status: string
  created_at: string
}

export function QuoteResponse({ quoteId, plumberId }: { quoteId: string; plumberId: string }) {
  const { t } = useTranslation()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [response, setResponse] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchQuote()
  }, [])

  const fetchQuote = async () => {
    const { data, error } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

    if (error) {
      console.error("Error fetching quote:", error)
      toast({
        title: t("quoteResponse.error.title"),
        description: t("quoteResponse.error.description"),
        variant: "destructive",
      })
    } else {
      setQuote(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Deduct 1 credit for responding to a lead
      await deductCredits(plumberId, 1, `Response to quote ${quoteId}`)

      const { data, error } = await supabase
        .from("quote_responses")
        .insert([{ quote_id: quoteId, response, estimated_cost: Number.parseFloat(estimatedCost) }])

      if (error) throw error

      await supabase.from("quotes").update({ status: "responded" }).eq("id", quoteId)

      toast({
        title: t("quoteResponse.submitSuccess.title"),
        description: t("quoteResponse.submitSuccess.description"),
      })
      router.push("/plumber/dashboard")
    } catch (error) {
      console.error("Error submitting response:", error)
      toast({
        title: t("quoteResponse.submitError.title"),
        description: t("quoteResponse.submitError.description"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>{t("common.loading")}</p>
  }

  if (!quote) {
    return <p>{t("quoteResponse.notFound")}</p>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("quoteResponse.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <p>
            <strong>{t("quoteResponse.customer")}:</strong> {quote.name}
          </p>
          <p>
            <strong>{t("quoteResponse.service")}:</strong> {quote.service_type}
          </p>
          <p>
            <strong>{t("quoteResponse.description")}:</strong> {quote.description}
          </p>
          <p>
            <strong>{t("quoteResponse.urgency")}:</strong> {quote.urgency}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="response">{t("quoteResponse.yourResponse")}</Label>
            <Textarea id="response" value={response} onChange={(e) => setResponse(e.target.value)} required rows={4} />
          </div>
          <div>
            <Label htmlFor="estimatedCost">{t("quoteResponse.estimatedCost")}</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? t("common.sending") : t("quoteResponse.sendResponse")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

