"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"

interface CreditTransaction {
  id: string
  plumber_id: string
  amount: number
  type: "purchase" | "usage"
  created_at: string
  description: string
}

export default function CreditHistoryPage() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCreditHistory()
  }, [])

  const fetchCreditHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("plumber_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching credit history:", error)
      } else {
        setTransactions(data || [])
      }
    }
  }

  return (
    <DashboardLayout type="plumber">
      <h1 className="text-2xl font-bold mb-4">Credit History</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardLayout>
  )
}

