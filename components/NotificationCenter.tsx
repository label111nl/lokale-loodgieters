"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { getUnreadNotifications, markNotificationAsRead } from "@/utils/notification-service"
import { useTranslation } from "@/hooks/useTranslation"

export function NotificationCenter() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Fetch every minute
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    const unreadNotifications = await getUnreadNotifications("current-user-id") // Replace with actual user ID
    setNotifications(unreadNotifications)
    setUnreadCount(unreadNotifications.length)
  }

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id)
    fetchNotifications()
    toast({
      title: notification.title,
      description: notification.message,
    })
    // Handle navigation or other actions based on notification type
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications.title")}</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">{t("notifications.noNotifications")}</p>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="flex flex-col items-start p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="font-semibold">{notification.title}</span>
                  <span className="text-sm text-gray-600">{notification.message}</span>
                  <span className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</span>
                </DropdownMenuItem>
              ))
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

