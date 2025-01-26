"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase-client"
import { generateBlogPost, prioritizeLeads, matchPlumberToLead } from "@/lib/ai-services"
import { sendNotification } from "@/lib/notification-service"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("content")
  const [blogTopic, setBlogTopic] = useState("")
  const [blogKeywords, setBlogKeywords] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [users, setUsers] = useState([])
  const [systemSettings, setSystemSettings] = useState({
    ai_settings: { content_generation_enabled: true, lead_matching_enabled: true },
    notification_settings: { email_enabled: true, telegram_enabled: true, in_app_enabled: true },
  })

  useEffect(() => {
    fetchUsers()
    fetchSystemSettings()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*")
    if (data) setUsers(data)
    if (error) console.error("Error fetching users:", error)
  }

  const fetchSystemSettings = async () => {
    const { data, error } = await supabase.from("system_settings").select("*")
    if (data) {
      const settings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {})
      setSystemSettings(settings)
    }
    if (error) console.error("Error fetching system settings:", error)
  }

  const handleGenerateContent = async () => {
    const content = await generateBlogPost(
      blogTopic,
      blogKeywords.split(",").map((k) => k.trim()),
    )
    setGeneratedContent(content || "")
  }

  const handlePublishContent = async () => {
    const { error } = await supabase.from("blog_posts").insert([
      {
        title: blogTopic,
        content: generatedContent,
        keywords: blogKeywords.split(",").map((k) => k.trim()),
        published: true,
      },
    ])

    if (error) {
      console.error("Error publishing content:", error)
    } else {
      // Notify admin of successful publication
      await sendNotification("content_published", "admin", {
        subject: "New Blog Post Published",
        text: `Blog post "${blogTopic}" has been published successfully.`,
      })
    }
  }

  const handleProcessLeads = async () => {
    // Fetch unprocessed leads
    const { data: leads } = await supabase.from("leads").select("*").eq("processed", false)

    if (leads && leads.length > 0) {
      // Prioritize leads
      const prioritizedLeads = await prioritizeLeads(leads)

      // Match each lead with best plumber
      const { data: plumbers } = await supabase.from("plumbers").select("*")

      if (plumbers) {
        for (const lead of prioritizedLeads) {
          const match = await matchPlumberToLead(lead, plumbers)

          // Update lead with priority and matched plumber
          await supabase
            .from("leads")
            .update({
              priority_score: match.priority_score,
              matched_plumber_id: match.plumber_id,
              processed: true,
            })
            .eq("id", lead.id)

          // Notify matched plumber
          await sendNotification("new_lead", match.plumber_id, {
            subject: "New Lead Matched",
            text: `You have been matched with a new lead for ${lead.service_type}.`,
          })
        }
      }
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (error) {
      console.error("Error updating user role:", error)
    } else {
      fetchUsers()
    }
  }

  const handleUpdateSystemSetting = async (key, subKey, value) => {
    const updatedSettings = { ...systemSettings[key], [subKey]: value }
    const { error } = await supabase.from("system_settings").update({ value: updatedSettings }).eq("key", key)

    if (error) {
      console.error("Error updating system settings:", error)
    } else {
      setSystemSettings({ ...systemSettings, [key]: updatedSettings })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input placeholder="Blog topic" value={blogTopic} onChange={(e) => setBlogTopic(e.target.value)} />
              </div>
              <div>
                <Input
                  placeholder="Keywords (comma-separated)"
                  value={blogKeywords}
                  onChange={(e) => setBlogKeywords(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerateContent}>Generate Content</Button>
              {generatedContent && (
                <>
                  <Textarea value={generatedContent} onChange={(e) => setGeneratedContent(e.target.value)} rows={10} />
                  <Button onClick={handlePublishContent}>Publish Content</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleProcessLeads}>Process New Leads</Button>
              {/* Add more detailed lead management interface here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <select value={user.role} onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}>
                          <option value="plumber">Plumber</option>
                          <option value="admin">Admin</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">AI Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Enable Content Generation</span>
                  <Switch
                    checked={systemSettings.ai_settings.content_generation_enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSystemSetting("ai_settings", "content_generation_enabled", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Enable Lead Matching</span>
                  <Switch
                    checked={systemSettings.ai_settings.lead_matching_enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSystemSetting("ai_settings", "lead_matching_enabled", checked)
                    }
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-2">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Enable Email Notifications</span>
                  <Switch
                    checked={systemSettings.notification_settings.email_enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSystemSetting("notification_settings", "email_enabled", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Enable Telegram Notifications</span>
                  <Switch
                    checked={systemSettings.notification_settings.telegram_enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSystemSetting("notification_settings", "telegram_enabled", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Enable In-App Notifications</span>
                  <Switch
                    checked={systemSettings.notification_settings.in_app_enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSystemSetting("notification_settings", "in_app_enabled", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

