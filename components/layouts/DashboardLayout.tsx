"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, Settings, HelpCircle, LogOut, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Notifications } from "@/components/Notifications"

interface DashboardLayoutProps {
  children: React.ReactNode
  type: "plumber"
}

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
  const [search, setSearch] = useState("")
  const pathname = usePathname()

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/plumber/dashboard" },
    { icon: Users, label: "Leads", href: "/plumber/leads" },
    { icon: FileText, label: "Quotes", href: "/plumber/quotes" },
    { icon: Settings, label: "Settings", href: "/plumber/settings" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E1E2D] text-white flex flex-col">
        <div className="p-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue_Modern_Technician_Logo__4_-removebg-preview-xCb15ZpHOPQVwgCdRP0LLkZrFrcdBN.png"
            alt="Lokale Loodgieters"
            width={150}
            height={40}
            className="w-full"
          />
        </div>
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg transition-colors",
                pathname === item.href && "bg-white/10 text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href="/support"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            Support
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white"
            onClick={() => {
              // Handle logout
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User Name</p>
                    <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

