"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface Plumber {
  id: string
  name: string
  email: string
  city: string
  status: string
  subscription: string
}

export default function PlumberManagement() {
  const [plumbers, setPlumbers] = useState<Plumber[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPlumbers()
  }, [])

  const fetchPlumbers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("plumbers").select("*")

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
    setIsLoading(false)
  }

  const updatePlumberStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("plumbers").update({ status: newStatus }).eq("id", id)

    if (error) {
      console.error("Error updating plumber status:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Loodgieterstatus is bijgewerkt.",
      })
      fetchPlumbers()
    }
  }

  const filteredPlumbers = plumbers.filter(
    (plumber) =>
      plumber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plumber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plumber.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Loodgieter Management</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Zoek loodgieters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nieuwe Loodgieter Toevoegen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe Loodgieter Toevoegen</DialogTitle>
            </DialogHeader>
            {/* Hier komt het formulier voor het toevoegen van een nieuwe loodgieter */}
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naam</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Stad</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Abonnement</TableHead>
            <TableHead>Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Laden...
              </TableCell>
            </TableRow>
          ) : (
            filteredPlumbers.map((plumber) => (
              <TableRow key={plumber.id}>
                <TableCell>{plumber.name}</TableCell>
                <TableCell>{plumber.email}</TableCell>
                <TableCell>{plumber.city}</TableCell>
                <TableCell>
                  <Select value={plumber.status} onValueChange={(value) => updatePlumberStatus(plumber.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status wijzigen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actief</SelectItem>
                      <SelectItem value="inactive">Inactief</SelectItem>
                      <SelectItem value="pending">In afwachting</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{plumber.subscription}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    Bewerken
                  </Button>
                  <Button variant="destructive" size="sm">
                    Verwijderen
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

