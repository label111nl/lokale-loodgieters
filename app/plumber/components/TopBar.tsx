import { Bell, User } from "lucide-react"

export function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-2xl font-semibold">Plumber Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell className="w-6 h-6" />
          </button>
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <User className="w-6 h-6 mr-2" />
            <span>John Doe</span>
          </button>
        </div>
      </div>
    </header>
  )
}

