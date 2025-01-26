"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  city: string
  status: string
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("customers").select("*")

    if (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van klanten.",
        variant: "destructive",
      })
    } else {
      setCustomers(data || [])
    }
    setIsLoading(false)
  }

  const updateCustomerStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("customers").update({ status: newStatus }).eq("id", id)

    if (error) {
      console.error("Error updating customer status:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Klantstatus is bijgewerkt.",
      })
      fetchCustomers()
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Klanten Management</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Zoek klanten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Nieuwe Klant Toevoegen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe Klant Toevoegen</DialogTitle>
            </DialogHeader>
            {/* Hier komt het formulier voor het toevoegen van een nieuwe klant */}
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
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <Select value={customer.status} onValueChange={(value) => updateCustomerStatus(customer.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status wijzigen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actief</SelectItem>
                      <SelectItem value="inactive">Inactief</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
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

