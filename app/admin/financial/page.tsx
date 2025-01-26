"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  date: string
  amount: number
  type: "income" | "expense"
  description: string
}

interface FinancialData {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  transactions: Transaction[]
  revenueByMonth: { name: string; value: number }[]
}

export default function FinancialManagement() {
  const [timeFrame, setTimeFrame] = useState("month")
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactions: [],
    revenueByMonth: [],
  })
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    type: "income",
    description: "",
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFinancialData()
  }, []) // Removed timeFrame dependency

  const fetchFinancialData = async () => {
    // In een echte applicatie zou je hier complexere queries uitvoeren
    // om de juiste data op te halen op basis van het geselecteerde timeFrame
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de financiële gegevens.",
        variant: "destructive",
      })
    } else {
      const totalRevenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      const netProfit = totalRevenue - totalExpenses

      const revenueByMonth = transactions
        .filter((t) => t.type === "income")
        .reduce(
          (acc, t) => {
            const month = new Date(t.date).toLocaleString("default", { month: "long" })
            acc[month] = (acc[month] || 0) + t.amount
            return acc
          },
          {} as Record<string, number>,
        )

      setFinancialData({
        totalRevenue,
        totalExpenses,
        netProfit,
        transactions,
        revenueByMonth: Object.entries(revenueByMonth).map(([name, value]) => ({ name, value })),
      })
    }
  }

  const handleAddTransaction = async () => {
    const { error } = await supabase.from("transactions").insert([newTransaction])

    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van de transactie.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Transactie is succesvol toegevoegd.",
      })
      fetchFinancialData()
      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        type: "income",
        description: "",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financieel Beheer</h1>
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecteer periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Deze maand</SelectItem>
            <SelectItem value="quarter">Dit kwartaal</SelectItem>
            <SelectItem value="year">Dit jaar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Totale Inkomsten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financialData.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Totale Uitgaven</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financialData.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Netto Winst</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{financialData.netProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inkomsten per Maand</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recente Transacties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Beschrijving</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bedrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.transactions.slice(0, 5).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.type === "income" ? "Inkomsten" : "Uitgaven"}</TableCell>
                  <TableCell>€{transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nieuwe Transactie Toevoegen</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddTransaction()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Datum
                </label>
                <Input
                  type="date"
                  id="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Bedrag
                </label>
                <Input
                  type="number"
                  id="amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as "income" | "expense" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Inkomsten</SelectItem>
                  <SelectItem value="expense">Uitgaven</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Beschrijving
              </label>
              <Input
                type="text"
                id="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Transactie Toevoegen</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

