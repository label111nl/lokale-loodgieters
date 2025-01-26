"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  published_at: string | null
}

export function BlogPostManager() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [newPost, setNewPost] = useState({ title: "", content: "", author: "" })
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } else {
      setBlogPosts(data || [])
    }
  }

  const handleCreatePost = async () => {
    const { data, error } = await supabase.from("blogs").insert([newPost])
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      })
      setNewPost({ title: "", content: "", author: "" })
      fetchBlogPosts()
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return
    const { data, error } = await supabase
      .from("blogs")
      .update({ title: editingPost.title, content: editingPost.content, author: editingPost.author })
      .eq("id", editingPost.id)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })
      setEditingPost(null)
      fetchBlogPosts()
    }
  }

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      fetchBlogPosts()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Blog Post Manager</h2>
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <Input
          placeholder="Author"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
        />
        <Button onClick={handleCreatePost}>Create Post</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.published_at ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => setEditingPost(post)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg space-y-4">
            <Input
              placeholder="Title"
              value={editingPost.title}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
            />
            <Textarea
              placeholder="Content"
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
            />
            <Input
              placeholder="Author"
              value={editingPost.author}
              onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

