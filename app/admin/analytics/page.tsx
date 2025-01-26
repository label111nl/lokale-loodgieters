"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState("week")
  const [data, setData] = useState({
    totalQuotes: 0,
    completedJobs: 0,
    averageRating: 0,
    revenue: 0,
    quotesByService: [],
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalytics()
  }, []) // Removed unnecessary dependency: timeFrame

  const fetchAnalytics = async () => {
    // In een echte applicatie zou je hier complexere queries uitvoeren
    // om de juiste data op te halen op basis van het geselecteerde timeFrame
    const { data: quotes, error: quotesError } = await supabase.from("quotes").select("*")
    const { data: reviews, error: reviewsError } = await supabase.from("reviews").select("*")

    if (quotesError || reviewsError) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de analytische gegevens.",
        variant: "destructive",
      })
    } else {
      const completedJobs = quotes.filter((q) => q.status === "completed").length
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length || 0
      const revenue = quotes.reduce((sum, quote) => sum + (quote.price || 0), 0)

      const quotesByService = quotes.reduce((acc, quote) => {
        acc[quote.service_type] = (acc[quote.service_type] || 0) + 1
        return acc
      }, {})

      setData({
        totalQuotes: quotes.length,
        completedJobs,
        averageRating,
        revenue,
        quotesByService: Object.entries(quotesByService).map(([name, value]) => ({ name, value })),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics en Rapportage</h1>
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecteer periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Afgelopen week</SelectItem>
            <SelectItem value="month">Afgelopen maand</SelectItem>
            <SelectItem value="year">Afgelopen jaar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Offertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voltooide Opdrachten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gemiddelde Beoordeling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Omzet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{data.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offertes per Dienst</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.quotesByService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

