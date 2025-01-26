"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { sendNewLeadNotification } from "@/lib/notifications"

type Plumber = {
  id: string
  company_name: string
  contact_person: string
  email: string
  subscription_status: string
}

type Quote = {
  id: string
  name: string
  service_type: string
  urgency: string
  status: string
  created_at: string
  priority_score?: number
  recommended_plumber_id?: string
}

export function AdminDashboard() {
  const [plumbers, setPlumbers] = useState<Plumber[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: plumbersData, error: plumbersError } = await supabase.from("plumbers").select("*")
    const { data: quotesData, error: quotesError } = await supabase.from("quotes").select("*")

    if (plumbersError) {
      console.error("Error fetching plumbers:", plumbersError)
      toast({
        title: "Error",
        description: "Failed to fetch plumbers data",
        variant: "destructive",
      })
    } else {
      setPlumbers(plumbersData)
    }

    if (quotesError) {
      console.error("Error fetching quotes:", quotesError)
      toast({
        title: "Error",
        description: "Failed to fetch quotes data",
        variant: "destructive",
      })
    } else {
      setQuotes(quotesData)
    }

    setLoading(false)
  }

  const handleApprovePlumber = async (plumberId: string) => {
    const { error } = await supabase.from("plumbers").update({ subscription_status: "active" }).eq("id", plumberId)

    if (error) {
      console.error("Error approving plumber:", error)
      toast({
        title: "Error",
        description: "Failed to approve plumber",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Plumber approved successfully",
      })
      fetchData()
    }
  }

  const handlePrioritizeQuote = async (quoteId: string) => {
    const { error } = await supabase.functions.invoke("prioritize-lead", {
      body: { quoteId },
    })

    if (error) {
      console.error("Error prioritizing quote:", error)
      toast({
        title: "Error",
        description: "Failed to prioritize quote",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Quote prioritized successfully",
      })
      fetchData()
    }
  }

  const handleMatchPlumber = async (quoteId: string) => {
    const { error } = await supabase.functions.invoke("match-plumber", {
      body: { quoteId },
    })

    if (error) {
      console.error("Error matching plumber:", error)
      toast({
        title: "Error",
        description: "Failed to match plumber",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Plumber matched successfully",
      })
      fetchData()
    }
  }

  const handleSendNotification = async (quoteId: string) => {
    try {
      await sendNewLeadNotification(quoteId)
      toast({
        title: "Success",
        description: "Telegram notification sent successfully",
      })
    } catch (error) {
      console.error("Error sending Telegram notification:", error)
      toast({
        title: "Error",
        description: "Failed to send Telegram notification",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plumbers">
          <TabsList>
            <TabsTrigger value="plumbers">Loodgieters</TabsTrigger>
            <TabsTrigger value="quotes">Offerte Aanvragen</TabsTrigger>
          </TabsList>
          <TabsContent value="plumbers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bedrijfsnaam</TableHead>
                  <TableHead>Contactpersoon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plumbers.map((plumber) => (
                  <TableRow key={plumber.id}>
                    <TableCell>{plumber.company_name}</TableCell>
                    <TableCell>{plumber.contact_person}</TableCell>
                    <TableCell>{plumber.email}</TableCell>
                    <TableCell>
                      <Badge variant={plumber.subscription_status === "active" ? "success" : "secondary"}>
                        {plumber.subscription_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plumber.subscription_status !== "active" && (
                        <Button onClick={() => handleApprovePlumber(plumber.id)}>Goedkeuren</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="quotes">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Klant</TableHead>
                  <TableHead>Dienst</TableHead>
                  <TableHead>Urgentie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioriteit</TableHead>
                  <TableHead>Aanbevolen Loodgieter</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{quote.name}</TableCell>
                    <TableCell>{quote.service_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.urgency === "emergency"
                            ? "destructive"
                            : quote.urgency === "urgent"
                              ? "warning"
                              : "default"
                        }
                      >
                        {quote.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.status === "pending" ? "secondary" : quote.status === "assigned" ? "success" : "default"
                        }
                      >
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{quote.priority_score || "N/A"}</TableCell>
                    <TableCell>
                      {quote.recommended_plumber_id
                        ? plumbers.find((p) => p.id === quote.recommended_plumber_id)?.company_name
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handlePrioritizeQuote(quote.id)} className="mr-2">
                        Prioriteren
                      </Button>
                      <Button onClick={() => handleMatchPlumber(quote.id)} className="mr-2">
                        Loodgieter Matchen
                      </Button>
                      <Button onClick={() => handleSendNotification(quote.id)}>Telegram Notificatie</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

