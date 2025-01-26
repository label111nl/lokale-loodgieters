"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface AIModel {
  id: string
  name: string
  type: string
  description: string
  status: "active" | "inactive"
}

interface AIConfiguration {
  id: string
  modelId: string
  key: string
  value: string
}

export default function AIManagement() {
  const [activeTab, setActiveTab] = useState("models")
  const [aiModels, setAIModels] = useState<AIModel[]>([])
  const [aiConfigurations, setAIConfigurations] = useState<AIConfiguration[]>([])
  const [newModel, setNewModel] = useState<Omit<AIModel, "id">>({
    name: "",
    type: "",
    description: "",
    status: "inactive",
  })
  const [newConfiguration, setNewConfiguration] = useState<Omit<AIConfiguration, "id">>({
    modelId: "",
    key: "",
    value: "",
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAIModels()
    fetchAIConfigurations()
  }, [])

  const fetchAIModels = async () => {
    const { data, error } = await supabase.from("ai_models").select("*")
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de AI-modellen.",
        variant: "destructive",
      })
    } else {
      setAIModels(data || [])
    }
  }

  const fetchAIConfigurations = async () => {
    const { data, error } = await supabase.from("ai_configurations").select("*")
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van de AI-configuraties.",
        variant: "destructive",
      })
    } else {
      setAIConfigurations(data || [])
    }
  }

  const handleAddModel = async () => {
    const { error } = await supabase.from("ai_models").insert([newModel])
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van het AI-model.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "AI-model is succesvol toegevoegd.",
      })
      fetchAIModels()
      setNewModel({ name: "", type: "", description: "", status: "inactive" })
    }
  }

  const handleAddConfiguration = async () => {
    const { error } = await supabase.from("ai_configurations").insert([newConfiguration])
    if (error) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van de AI-configuratie.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "AI-configuratie is succesvol toegevoegd.",
      })
      fetchAIConfigurations()
      setNewConfiguration({ modelId: "", key: "", value: "" })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="models">AI Modellen</TabsTrigger>
          <TabsTrigger value="configurations">AI Configuraties</TabsTrigger>
        </TabsList>
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Modellen</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>{model.status}</TableCell>
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
                <h3 className="text-lg font-semibold">Nieuw AI Model Toevoegen</h3>
                <Input
                  placeholder="Naam"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
                <Input
                  placeholder="Type"
                  value={newModel.type}
                  onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
                />
                <Textarea
                  placeholder="Beschrijving"
                  value={newModel.description}
                  onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                />
                <Select
                  value={newModel.status}
                  onValueChange={(value) => setNewModel({ ...newModel, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actief</SelectItem>
                    <SelectItem value="inactive">Inactief</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddModel}>Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configurations">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuraties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Sleutel</TableHead>
                    <TableHead>Waarde</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiConfigurations.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>{aiModels.find((m) => m.id === config.modelId)?.name || "Onbekend"}</TableCell>
                      <TableCell>{config.key}</TableCell>
                      <TableCell>{config.value}</TableCell>
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
                <h3 className="text-lg font-semibold">Nieuwe AI Configuratie Toevoegen</h3>
                <Select
                  value={newConfiguration.modelId}
                  onValueChange={(value) => setNewConfiguration({ ...newConfiguration, modelId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Sleutel"
                  value={newConfiguration.key}
                  onChange={(e) => setNewConfiguration({ ...newConfiguration, key: e.target.value })}
                />
                <Input
                  placeholder="Waarde"
                  value={newConfiguration.value}
                  onChange={(e) => setNewConfiguration({ ...newConfiguration, value: e.target.value })}
                />
                <Button onClick={handleAddConfiguration}>Toevoegen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

