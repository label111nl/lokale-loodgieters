import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, Settings, Menu, LogOut, Briefcase } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Loodgieters", href: "/admin/plumbers" },
  { icon: Users, label: "Loodgieters Management", href: "/admin/plumbers/management" },
  { icon: Users, label: "Klanten", href: "/admin/customers/management" },
  { icon: Briefcase, label: "Leads", href: "/admin/leads" },
  { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
  { icon: Menu, label: "Menu Beheer", href: "/admin/menu" },
  { icon: Settings, label: "Instellingen", href: "/admin/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-bold">Admin Panel</span>
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
          Uitloggen
        </button>
      </div>
    </div>
  )
}

