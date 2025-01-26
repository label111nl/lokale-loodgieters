import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, FileText, Settings, MessageSquare, LogOut } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/plumber" },
  { icon: Calendar, label: "Appointments", href: "/plumber/appointments" },
  { icon: FileText, label: "Invoices", href: "/plumber/invoices" },
  { icon: MessageSquare, label: "Messages", href: "/plumber/messages" },
  { icon: Settings, label: "Settings", href: "/plumber/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-bold">Plumber Panel</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100",
                  pathname === item.href && "bg-gray-100 text-blue-600",
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}

