"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { CreditSystem } from "@/components/CreditSystem"

export default function AdminDashboard() {
  const [plumbers, setPlumbers] = useState([])
  const [selectedPlumber, setSelectedPlumber] = useState(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchPlumbers()
  }, [])

  const fetchPlumbers = async () => {
    const { data, error } = await supabase.from("plumbers").select("*")
    if (error) {
      console.error("Error fetching plumbers:", error)
    } else {
      setPlumbers(data)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plumber Management</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            onChange={(e) => setSelectedPlumber(plumbers.find((p) => p.id === e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a plumber</option>
            {plumbers.map((plumber) => (
              <option key={plumber.id} value={plumber.id}>
                {plumber.company_name}
              </option>
            ))}
          </select>
          {selectedPlumber && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">{selectedPlumber.company_name}</h2>
              <CreditSystem
                plumberId={selectedPlumber.id}
                currentCredits={selectedPlumber.credits}
                subscriptionType={selectedPlumber.subscription_type}
                subscriptionEndDate={selectedPlumber.subscription_end_date}
                isAdmin={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

