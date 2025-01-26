"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { checkAndNotifyLowCredits } from "@/utils/notifications"
import { CreditSystem } from "@/components/CreditSystem"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTranslation } from "@/hooks/useTranslation"

type Quote = {
  id: string
  name: string
  service_type: string
  description: string
  urgency: string
  status: string
  created_at: string
  amount?: number
}

type PlumberData = {
  id: string
  company_name: string
  credits: number
  subscription_type: string
  subscription_end_date: string
}

export function PlumberDashboard() {
  const { t } = useTranslation()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [plumberData, setPlumberData] = useState<PlumberData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPlumberData()
  }, [])

  const fetchPlumberData = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase.from("plumbers").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching plumber data:", error)
        toast({
          title: "Error",
          description: "Failed to load plumber data",
          variant: "destructive",
        })
      } else {
        setPlumberData(data)
        checkAndNotifyLowCredits(user.id)
      }

      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .eq("assigned_plumber_id", user.id)
        .order("created_at", { ascending: false })

      if (quotesError) {
        console.error("Error fetching quotes:", quotesError)
      } else {
        setQuotes(quotesData)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!plumberData) {
    return <div>Error loading plumber data</div>
  }

  return (
    <DashboardLayout type="plumber">
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.activeLeads")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.filter((q) => q.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.activeLeadsChange")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.availableCredits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plumberData?.credits || 0}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.subscriptionType", { type: plumberData?.subscription_type })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.completedJobs")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.filter((q) => q.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.completedJobsChange")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Credit System */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.creditSystem")}</CardTitle>
          </CardHeader>
          <CardContent>
            {plumberData.subscription_type !== "premium" && (
              <CreditSystem
                plumberId={plumberData?.id}
                currentCredits={plumberData?.credits}
                subscriptionType={plumberData?.subscription_type}
                subscriptionEndDate={plumberData?.subscription_end_date}
              />
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.revenueOverview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#1E3B8B" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("common.customer")}</TableHead>
                  <TableHead>{t("common.type")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead>{t("common.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.slice(0, 5).map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{quote.name}</TableCell>
                    <TableCell>{quote.service_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          quote.status === "pending" ? "secondary" : quote.status === "active" ? "default" : "success"
                        }
                      >
                        {t(`common.status.${quote.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/plumber/quotes/${quote.id}`}>{t("common.details")}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

