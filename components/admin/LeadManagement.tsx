"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/hooks/useTranslation"

interface Lead {
  id: string
  customer_name: string
  description: string
  city: string
  status: string
  assigned_plumber_id: string | null
  created_at: string
}

interface Plumber {
  id: string
  company_name: string
}

export function LeadManagement() {
  const { t } = useTranslation()
  const [leads, setLeads] = useState<Lead[]>([])
  const [plumbers, setPlumbers] = useState<Plumber[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
    fetchPlumbers()
  }, [])

  const fetchLeads = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching leads:", error)
      toast({
        title: t("leadManagement.fetchLeadsError.title"),
        description: t("leadManagement.fetchLeadsError.description"),
        variant: "destructive",
      })
    } else {
      setLeads(data || [])
    }
    setIsLoading(false)
  }

  const fetchPlumbers = async () => {
    const { data, error } = await supabase.from("plumbers").select("id, company_name")
    if (error) {
      console.error("Error fetching plumbers:", error)
      toast({
        title: t("leadManagement.fetchPlumbersError.title"),
        description: t("leadManagement.fetchPlumbersError.description"),
        variant: "destructive",
      })
    } else {
      setPlumbers(data || [])
    }
  }

  const handleAssignPlumber = async (leadId: string, plumberId: string | null) => {
    const { error } = await supabase
      .from("quotes")
      .update({ assigned_plumber_id: plumberId, status: plumberId ? "assigned" : "pending" })
      .eq("id", leadId)

    if (error) {
      console.error("Error assigning plumber:", error)
      toast({
        title: t("leadManagement.assignPlumberError.title"),
        description: t("leadManagement.assignPlumberError.description"),
        variant: "destructive",
      })
    } else {
      toast({
        title: t("leadManagement.assignPlumberSuccess.title"),
        description: t("leadManagement.assignPlumberSuccess.description"),
      })
      fetchLeads()
    }
  }

  const filteredLeads = leads.filter((lead) =>
    Object.values(lead).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("leadManagement.title")}</h1>
      <Input
        placeholder={t("leadManagement.searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("common.date")}</TableHead>
            <TableHead>{t("common.customer")}</TableHead>
            <TableHead>{t("common.description")}</TableHead>
            <TableHead>{t("common.city")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead>{t("leadManagement.assignedPlumber")}</TableHead>
            <TableHead>{t("common.action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("common.loading")}
              </TableCell>
            </TableRow>
          ) : (
            filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{lead.customer_name}</TableCell>
                <TableCell>{lead.description}</TableCell>
                <TableCell>{lead.city}</TableCell>
                <TableCell>
                  <Badge variant={lead.status === "pending" ? "secondary" : "success"}>{lead.status}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.assigned_plumber_id || ""}
                    onValueChange={(value) => handleAssignPlumber(lead.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t("leadManagement.selectPlumber")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{t("leadManagement.noPlumber")}</SelectItem>
                      {plumbers.map((plumber) => (
                        <SelectItem key={plumber.id} value={plumber.id}>
                          {plumber.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/leads/${lead.id}`}>{t("common.details")}</Link>
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

