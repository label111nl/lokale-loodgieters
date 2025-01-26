"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { QuoteResponse } from "@/components/QuoteResponse"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/hooks/useTranslation"
import { SEO } from "@/components/SEO"

export default function LeadDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchLead()
  }, [])

  const fetchLead = async () => {
    const { data, error } = await supabase.from("quotes").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching lead:", error)
      toast({
        title: t("leadDetail.error.title"),
        description: t("leadDetail.error.description"),
        variant: "destructive",
      })
    } else {
      setLead(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div>{t("common.loading")}</div>
  }

  if (!lead) {
    return <div>{t("leadDetail.notFound")}</div>
  }

  return (
    <>
      <SEO title={`${t("leadDetail.title")} | Lokale Loodgieters`} description={t("leadDetail.description")} />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{t("leadDetail.title")}</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{lead.service_type}</h2>
          <p className="text-gray-600 mb-2">{t("leadDetail.status", { status: lead.status })}</p>
          <p className="text-gray-600 mb-2">
            {t("leadDetail.created", { date: new Date(lead.created_at).toLocaleString() })}
          </p>
          <p className="whitespace-pre-wrap">{lead.description}</p>
        </div>
        <QuoteResponse quoteId={lead.id} />
      </div>
    </>
  )
}

