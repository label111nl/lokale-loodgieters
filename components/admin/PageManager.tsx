"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface Page {
  id: string
  title: string
  slug: string
  content: string
}

export function PageManager() {
  const [pages, setPages] = useState<Page[]>([])
  const [newPage, setNewPage] = useState({ title: "", slug: "", content: "" })
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    const { data, error } = await supabase.from("pages").select("*").order("created_at", { ascending: false })
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pages",
        variant: "destructive",
      })
    } else {
      setPages(data || [])
    }
  }

  const handleCreatePage = async () => {
    const { data, error } = await supabase.from("pages").insert([newPage])
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Page created successfully",
      })
      setNewPage({ title: "", slug: "", content: "" })
      fetchPages()
    }
  }

  const handleUpdatePage = async () => {
    if (!editingPage) return
    const { data, error } = await supabase
      .from("pages")
      .update({ title: editingPage.title, slug: editingPage.slug, content: editingPage.content })
      .eq("id", editingPage.id)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Page updated successfully",
      })
      setEditingPage(null)
      fetchPages()
    }
  }

  const handleDeletePage = async (id: string) => {
    const { error } = await supabase.from("pages").delete().eq("id", id)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Page deleted successfully",
      })
      fetchPages()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Page Manager</h2>
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={newPage.title}
          onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
        />
        <Input
          placeholder="Slug"
          value={newPage.slug}
          onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
        />
        <Textarea
          placeholder="Content"
          value={newPage.content}
          onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
        />
        <Button onClick={handleCreatePage}>Create Page</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => setEditingPage(page)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeletePage(page.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg space-y-4">
            <Input
              placeholder="Title"
              value={editingPage.title}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
            />
            <Input
              placeholder="Slug"
              value={editingPage.slug}
              onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={editingPage.content}
              onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingPage(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePage}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

