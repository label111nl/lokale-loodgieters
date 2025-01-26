"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

interface Page {
  id: string
  title: string
  slug: string
  created_at: string
}

export default function PageManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pages, setPages] = useState<Page[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    const { data, error } = await supabase.from("pages").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching pages:", error)
    } else if (data) {
      setPages(data)
    }
  }

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Page Management</h2>
        <Button asChild>
          <Link href="/admin/pages/new">Create New Page</Link>
        </Button>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" asChild>
                  <Link href={`/admin/pages/edit/${page.id}`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

