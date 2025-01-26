"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Section {
  id: string
  type: "text" | "image" | "cta"
  content: string
}

interface PageData {
  id: string
  title: string
  slug: string
  content: Section[]
  meta_description: string
  is_published: boolean
}

export function PageEditor({ pageId }: { pageId?: string }) {
  const [page, setPage] = useState<PageData>({
    id: "",
    title: "",
    slug: "",
    content: [],
    meta_description: "",
    is_published: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (pageId) {
      fetchPage(pageId)
    }
  }, [pageId])

  const fetchPage = async (id: string) => {
    setIsLoading(true)
    const { data, error } = await supabase.from("pages").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching page:", error)
      toast({
        title: "Error",
        description: "Failed to fetch page data. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setPage(data)
    }
    setIsLoading(false)
  }

  const savePage = async () => {
    setIsSaving(true)
    if (pageId) {
      const { error } = await supabase.from("pages").update(page).eq("id", pageId)

      if (error) {
        console.error("Error updating page:", error)
        toast({
          title: "Error",
          description: "Failed to update page. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Page updated successfully.",
        })
      }
    } else {
      const { data, error } = await supabase.from("pages").insert(page).select()

      if (error) {
        console.error("Error creating page:", error)
        toast({
          title: "Error",
          description: "Failed to create page. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        setPage(data[0])
        toast({
          title: "Success",
          description: "Page created successfully.",
        })
      }
    }
    setIsSaving(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setPage((page) => {
        const oldIndex = page.content.findIndex((item) => item.id === active.id)
        const newIndex = page.content.findIndex((item) => item.id === over.id)

        return {
          ...page,
          content: arrayMove(page.content, oldIndex, newIndex),
        }
      })
    }
  }

  const addSection = (type: "text" | "image" | "cta") => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      content: "",
    }
    setPage({ ...page, content: [...page.content, newSection] })
  }

  const updateSection = (id: string, content: string) => {
    setPage({
      ...page,
      content: page.content.map((section) => (section.id === id ? { ...section, content } : section)),
    })
  }

  const removeSection = (id: string) => {
    setPage({
      ...page,
      content: page.content.filter((section) => section.id !== id),
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  function SortableItem(props: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.children}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Page Editor</h2>
      <Input
        type="text"
        value={page.title}
        onChange={(e) => setPage({ ...page, title: e.target.value })}
        placeholder="Page Title"
      />
      <Input
        type="text"
        value={page.slug}
        onChange={(e) => setPage({ ...page, slug: e.target.value })}
        placeholder="Page Slug"
      />
      <Textarea
        value={page.meta_description}
        onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
        placeholder="Meta Description"
      />
      <div className="space-x-2">
        <Button onClick={() => addSection("text")}>Add Text</Button>
        <Button onClick={() => addSection("image")}>Add Image</Button>
        <Button onClick={() => addSection("cta")}>Add CTA</Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={page.content.map((section) => section.id)} strategy={verticalListSortingStrategy}>
          {page.content.map((section) => (
            <SortableItem key={section.id} id={section.id}>
              <div className="border p-4 rounded mb-4">
                {section.type === "text" && (
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    placeholder="Enter text content"
                  />
                )}
                {section.type === "image" && (
                  <Input
                    type="text"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    placeholder="Enter image URL"
                  />
                )}
                {section.type === "cta" && (
                  <Input
                    type="text"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    placeholder="Enter CTA text"
                  />
                )}
                <Button onClick={() => removeSection(section.id)} className="mt-2">
                  Remove
                </Button>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <div className="flex justify-between">
        <Button onClick={savePage} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Page"
          )}
        </Button>
        <Button variant="outline" onClick={() => setPage({ ...page, is_published: !page.is_published })}>
          {page.is_published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  )
}

