"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Plumber {
  id: string
  name: string
  email: string
  city: string
  status: string
  subscription: string
  leads_purchased: number
}

export default function PlumbersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [plumbers, setPlumbers] = useState<Plumber[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPlumbers()
  }, [])

  const fetchPlumbers = async () => {
    const { data, error } = await supabase.from("plumbers").select("*")

    if (error) {
      console.error("Error fetching plumbers:", error)
    } else if (data) {
      setPlumbers(data)
    }
  }

  const filteredPlumbers = plumbers.filter(
    (plumber) =>
      plumber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plumber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plumber.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Loodgieters Beheer</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nieuwe Loodgieter Toevoegen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe Loodgieter Toevoegen</DialogTitle>
            </DialogHeader>
            {/* Add form for new plumber here */}
            <p>Formulier om nieuwe loodgieter toe te voegen komt hier</p>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Zoek loodgieters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naam</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Stad</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Abonnement</TableHead>
            <TableHead>Gekochte Leads</TableHead>
            <TableHead>Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlumbers.map((plumber) => (
            <TableRow key={plumber.id}>
              <TableCell>{plumber.name}</TableCell>
              <TableCell>{plumber.email}</TableCell>
              <TableCell>{plumber.city}</TableCell>
              <TableCell>{plumber.status}</TableCell>
              <TableCell>{plumber.subscription}</TableCell>
              <TableCell>{plumber.leads_purchased}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Bewerken
                </Button>
                <Button variant="destructive" size="sm">
                  Verwijderen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

