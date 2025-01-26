"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface Review {
  id: string
  plumber_name: string
  customer_name: string
  rating: number
  comment: string
  status: string
}

export default function QualityControl() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("reviews").select("*")

    if (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van beoordelingen.",
        variant: "destructive",
      })
    } else {
      setReviews(data || [])
    }
    setIsLoading(false)
  }

  const updateReviewStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("reviews").update({ status: newStatus }).eq("id", id)

    if (error) {
      console.error("Error updating review status:", error)
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Beoordelingsstatus is bijgewerkt.",
      })
      fetchReviews()
    }
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.plumber_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kwaliteitscontrole</h1>
      <Input
        placeholder="Zoek beoordelingen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loodgieter</TableHead>
            <TableHead>Klant</TableHead>
            <TableHead>Beoordeling</TableHead>
            <TableHead>Opmerking</TableHead>
            <TableHead>Status</TableHead>
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
            filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.plumber_name}</TableCell>
                <TableCell>{review.customer_name}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>
                  <Select value={review.status} onValueChange={(value) => updateReviewStatus(review.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status wijzigen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">In afwachting</SelectItem>
                      <SelectItem value="approved">Goedgekeurd</SelectItem>
                      <SelectItem value="rejected">Afgewezen</SelectItem>
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

