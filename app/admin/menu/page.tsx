"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface MenuItem {
  id: string
  name: string
  url: string
  order: number
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemUrl, setNewItemUrl] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*").order("order", { ascending: true })

    if (error) {
      console.error("Error fetching menu items:", error)
    } else if (data) {
      setMenuItems(data)
    }
  }

  const addMenuItem = async () => {
    if (newItemName && newItemUrl) {
      const newItem = {
        name: newItemName,
        url: newItemUrl,
        order: menuItems.length,
      }

      const { data, error } = await supabase.from("menu_items").insert([newItem]).select()

      if (error) {
        console.error("Error adding menu item:", error)
      } else if (data) {
        setMenuItems([...menuItems, data[0]])
        setNewItemName("")
        setNewItemUrl("")
      }
    }
  }

  const removeMenuItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id)

    if (error) {
      console.error("Error removing menu item:", error)
    } else {
      setMenuItems(menuItems.filter((item) => item.id !== id))
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(menuItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({ ...item, order: index }))
    setMenuItems(updatedItems)

    // Update the order in the database
    const { error } = await supabase.from("menu_items").upsert(updatedItems)

    if (error) {
      console.error("Error updating menu item order:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Menu Management</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Menu Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Menu Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
            <Input placeholder="Menu Item URL" value={newItemUrl} onChange={(e) => setNewItemUrl(e.target.value)} />
            <Button onClick={addMenuItem}>Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="menu-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {menuItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.url}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeMenuItem(item.id)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

