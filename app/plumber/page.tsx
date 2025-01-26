"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Star } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function PlumberDashboard() {
  const [plumberData, setPlumberData] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPlumberData()
    fetchLeads()
  }, [])

  const fetchPlumberData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase.from("plumbers").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching plumber data:", error)
      } else if (data) {
        setPlumberData(data)
      }
    }
  }

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("plumber_id", plumberData?.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching leads:", error)
    } else if (data) {
      setLeads(data)
    }
  }

  if (!plumberData) return <div>Laden...</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nieuwe Leads</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter((l) => l.status === "new").length}</div>
            <p className="text-xs text-muted-foreground">Wachtend op reactie</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Leads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter((l) => l.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">In behandeling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beoordelingen</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plumberData.rating || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Gebaseerd op {plumberData.total_reviews || 0} beoordelingen</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recente Leads</h2>
        <div className="grid gap-4">
          {leads.slice(0, 5).map((lead) => (
            <Card key={lead.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{lead.job_type}</h3>
                  <p className="text-sm text-muted-foreground">{lead.location}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/plumber/leads/${lead.id}`}>Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {plumberData.subscription !== "monthly" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Upgrade naar Premium</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ontvang onbeperkt toegang tot leads voor €150 per maand
            </p>
            <Button onClick={handleSubscribe}>Nu Upgraden</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

