"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function BlogPostEditor({ params }: { params: { action: string; id: string } }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  const isEditing = params.action === "edit"

  useEffect(() => {
    if (isEditing) {
      fetchBlogPost()
    }
  }, [isEditing])

  const fetchBlogPost = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blog post:", error)
    } else if (data) {
      setTitle(data.title)
      setContent(data.content)
      setAuthor(data.author)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const blogPost = { title, content, author }

    if (isEditing) {
      const { error } = await supabase.from("blog_posts").update(blogPost).eq("id", params.id)

      if (error) {
        console.error("Error updating blog post:", error)
      } else {
        router.push("/admin/blog")
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert([blogPost])

      if (error) {
        console.error("Error creating blog post:", error)
      } else {
        router.push("/admin/blog")
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
        </div>
        <Button type="submit">{isEditing ? "Update Post" : "Create Post"}</Button>
      </form>
    </div>
  )
}

