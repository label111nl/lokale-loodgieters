"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNotifications()
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, handleNewNotification)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase]) // Added supabase to the dependency array

  const fetchNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
      if (error) console.error("Error fetching notifications:", error)
    }
  }

  const handleNewNotification = (payload) => {
    setNotifications((prev) => [payload.new, ...prev])
    setUnreadCount((prev) => prev + 1)
  }

  const markAsRead = async (id) => {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id)

    if (error) console.error("Error marking notification as read:", error)
    else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => prev - 1)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} onClick={() => markAsRead(notification.id)}>
            <div className={`w-full ${notification.read ? "opacity-50" : ""}`}>
              <div className="font-semibold">{notification.data.subject}</div>
              <div className="text-sm">{notification.data.text}</div>
            </div>
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && <DropdownMenuItem>No notifications</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

