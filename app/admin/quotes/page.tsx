"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface Quote {
  id: string
  customer_name: string
  service_type: string
  status: string
  assigned_to: string | null
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [plumbers, setPlumbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchQuotes()
    fetchPlumbers()
  }, [])

  const fetchQuotes = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("quotes").select("*")

    if (error) {
      console.error("Error fetching quotes:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van offertes.",
        variant: "destructive",
      })
    } else {
      setQuotes(data || [])
    }
    setIsLoading(false)
  }

  const fetchPlumbers = async () => {
    const { data, error } = await supabase.from("plumbers").select("id, name")

    if (error) {
      console.error("Error fetching plumbers:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van loodgieters.",
        variant: "destructive",
      })
    } else {
      setPlumbers(data || [])
    }
  }

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("quotes").update({ status: newStatus }).eq("id", id)

    if (error) {
      console.error("Error updating quote status:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Offertestatus is bijgewerkt.",
      })
      fetchQuotes()
    }
  }

  const assignQuote = async (id: string, plumberId: string) => {
    const { error } = await supabase.from("quotes").update({ assigned_to: plumberId }).eq("id", id)

    if (error) {
      console.error("Error assigning quote:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toewijzen van de offerte.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Offerte is toegewezen aan de loodgieter.",
      })
      fetchQuotes()
    }
  }

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.service_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Offerte Management</h1>
      <Input
        placeholder="Zoek offertes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Klantnaam</TableHead>
            <TableHead>Type Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Toegewezen aan</TableHead>
            <TableHead>Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Laden...
              </TableCell>
            </TableRow>
          ) : (
            filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.customer_name}</TableCell>
                <TableCell>{quote.service_type}</TableCell>
                <TableCell>
                  <Select value={quote.status} onValueChange={(value) => updateQuoteStatus(quote.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status wijzigen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">In afwachting</SelectItem>
                      <SelectItem value="approved">Goedgekeurd</SelectItem>
                      <SelectItem value="rejected">Afgewezen</SelectItem>
                      <SelectItem value="completed">Voltooid</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select value={quote.assigned_to || ""} onValueChange={(value) => assignQuote(quote.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Toewijzen aan loodgieter" />
                    </SelectTrigger>
                    <SelectContent>
                      {plumbers.map((plumber) => (
                        <SelectItem key={plumber.id} value={plumber.id}>
                          {plumber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Details bekijken
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

