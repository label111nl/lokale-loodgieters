"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface ImageData {
  id: string
  url: string
  name: string
  category: string
}

export function ImageManager() {
  const [images, setImages] = useState<ImageData[]>([])
  const [newImage, setNewImage] = useState<File | null>(null)
  const [category, setCategory] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching images:", error)
    } else {
      setImages(data || [])
    }
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage) return

    const file = newImage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${category}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return
    }

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

    const { error: insertError } = await supabase.from("images").insert({
      url: urlData.publicUrl,
      name: file.name,
      category,
    })

    if (insertError) {
      console.error("Error inserting image data:", insertError)
    } else {
      fetchImages()
      setNewImage(null)
      setCategory("")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Image Manager</h2>
      <form onSubmit={handleImageUpload} className="space-y-4">
        <Input type="file" onChange={(e) => setNewImage(e.target.files?.[0] || null)} accept="image/*" />
        <Input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Button type="submit">Upload Image</Button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border p-2 rounded">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.name}
              width={200}
              height={200}
              className="object-cover"
            />
            <p className="mt-2 text-sm">{image.name}</p>
            <p className="text-xs text-gray-500">{image.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

