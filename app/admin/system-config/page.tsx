"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
}

interface PriceModel {
  id: string
  name: string
  description: string
  basePrice: number
}

export default function SystemConfiguration() {
  const [activeTab, setActiveTab] = useState("email-templates")
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [priceModels, setPriceModels] = useState<PriceModel[]>([])
  const [newEmailTemplate, setNewEmailTemplate] = useState<Omit<EmailTemplate, "id">>({
    name: "",
    subject: "",
    body: "",
  })
  const [newPriceModel, setNewPriceModel] = useState<Omit<PriceModel, "id">>({
    name: "",
    description: "",
    basePrice: 0,
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEmailTemplates()
    fetchPriceModels()
  }, [])

  const fetchEmailTemplates = async () => {
    const { data, error } = await supabase.from("email_templates").select("*")
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de e-mailsjablonen.",
        variant: "destructive",
      })
    } else {
      setEmailTemplates(data || [])
    }
  }

  const fetchPriceModels = async () => {
    const { data, error } = await supabase.from("price_models").select("*")
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de prijsmodellen.",
        variant: "destructive",
      })
    } else {
      setPriceModels(data || [])
    }
  }

  const handleAddEmailTemplate = async () => {
    const { error } = await supabase.from("email_templates").insert([newEmailTemplate])
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van het e-mailsjabloon.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "E-mailsjabloon is succesvol toegevoegd.",
      })
      fetchEmailTemplates()
      setNewEmailTemplate({ name: "", subject: "", body: "" })
    }
  }

  const handleAddPriceModel = async () => {
    const { error } = await supabase.from("price_models").insert([newPriceModel])
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van het prijsmodel.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Prijsmodel is succesvol toegevoegd.",
      })
      fetchPriceModels()
      setNewPriceModel({ name: "", description: "", basePrice: 0 })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Systeemconfiguratie</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="email-templates">E-mailsjablonen</TabsTrigger>
          <TabsTrigger value="price-models">Prijsmodellen</TabsTrigger>
        </TabsList>
        <TabsContent value="email-templates">
          <Card>
            <CardHeader>
              <CardTitle>E-mailsjablonen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Onderwerp</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Bewerken
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Nieuw E-mailsjabloon Toevoegen</h3>
                <Input
                  placeholder="Naam"
                  value={newEmailTemplate.name}
                  onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, name: e.target.value })}
                />
                <Input
                  placeholder="Onderwerp"
                  value={newEmailTemplate.subject}
                  onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, subject: e.target.value })}
                />
                <Textarea
                  placeholder="Inhoud"
                  value={newEmailTemplate.body}
                  onChange={(e) => setNewEmailTemplate({ ...newEmailTemplate, body: e.target.value })}
                />
                <Button onClick={handleAddEmailTemplate}>Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="price-models">
          <Card>
            <CardHeader>
              <CardTitle>Prijsmodellen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Beschrijving</TableHead>
                    <TableHead>Basisprijs</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.description}</TableCell>
                      <TableCell>€{model.basePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Bewerken
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Nieuw Prijsmodel Toevoegen</h3>
                <Input
                  placeholder="Naam"
                  value={newPriceModel.name}
                  onChange={(e) => setNewPriceModel({ ...newPriceModel, name: e.target.value })}
                />
                <Input
                  placeholder="Beschrijving"
                  value={newPriceModel.description}
                  onChange={(e) => setNewPriceModel({ ...newPriceModel, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Basisprijs"
                  value={newPriceModel.basePrice}
                  onChange={(e) => setNewPriceModel({ ...newPriceModel, basePrice: Number.parseFloat(e.target.value) })}
                />
                <Button onClick={handleAddPriceModel}>Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

