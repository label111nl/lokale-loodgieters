"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  author: string
  created_at: string
  status: string
}

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
    } else if (data) {
      setBlogPosts(data)
    }
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Blog Management</h2>
        <Button asChild>
          <Link href="/admin/blog/new">Create New Post</Link>
        </Button>
      </div>
      <div>
        <Input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{post.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" asChild>
                  <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
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

