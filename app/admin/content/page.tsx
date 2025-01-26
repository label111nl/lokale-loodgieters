"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("blog")
  const supabase = createClientComponentClient()

  const [blogPost, setBlogPost] = useState({ title: "", content: "" })
  const [faq, setFaq] = useState({ question: "", answer: "" })
  const [location, setLocation] = useState({ name: "", description: "" })

  const [blogPosts, setBlogPosts] = useState([])
  const [faqs, setFaqs] = useState([])
  const [locations, setLocations] = useState([])

  const fetchContent = async (type) => {
    const { data, error } = await supabase.from(type).select("*")
    if (error) {
      toast({
        title: "Error",
        description: `Fout bij het ophalen van ${type}.`,
        variant: "destructive",
      })
    } else {
      switch (type) {
        case "blog_posts":
          setBlogPosts(data)
          break
        case "faqs":
          setFaqs(data)
          break
        case "locations":
          setLocations(data)
          break
      }
    }
  }

  const handleSubmit = async (type) => {
    let data
    switch (type) {
      case "blog_posts":
        data = blogPost
        break
      case "faqs":
        data = faq
        break
      case "locations":
        data = location
        break
    }

    const { error } = await supabase.from(type).insert([data])
    if (error) {
      toast({
        title: "Error",
        description: `Fout bij het toevoegen van ${type}.`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: `${type} succesvol toegevoegd.`,
      })
      fetchContent(type)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="locations">Locaties</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <div className="space-y-4">
            <Input
              placeholder="Blog titel"
              value={blogPost.title}
              onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
            />
            <Textarea
              placeholder="Blog inhoud"
              value={blogPost.content}
              onChange={(e) => setBlogPost({ ...blogPost, content: e.target.value })}
            />
            <Button onClick={() => handleSubmit("blog_posts")}>Blog post toevoegen</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Bewerken
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="faq">
          <div className="space-y-4">
            <Input
              placeholder="Vraag"
              value={faq.question}
              onChange={(e) => setFaq({ ...faq, question: e.target.value })}
            />
            <Textarea
              placeholder="Antwoord"
              value={faq.answer}
              onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
            />
            <Button onClick={() => handleSubmit("faqs")}>FAQ toevoegen</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vraag</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Bewerken
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="locations">
          <div className="space-y-4">
            <Input
              placeholder="Locatie naam"
              value={location.name}
              onChange={(e) => setLocation({ ...location, name: e.target.value })}
            />
            <Textarea
              placeholder="Locatie beschrijving"
              value={location.description}
              onChange={(e) => setLocation({ ...location, description: e.target.value })}
            />
            <Button onClick={() => handleSubmit("locations")}>Locatie toevoegen</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Bewerken
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

