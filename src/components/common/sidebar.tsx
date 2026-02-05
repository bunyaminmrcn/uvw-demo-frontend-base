import Link from "next/link"
import { LayoutDashboard, FileText, Settings, HelpCircle } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  //{ name: "Blogs", icon: FileText, href: "/dashboard/blogs" },
  //{ name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Help", icon: HelpCircle, href: "/dashboard/help" },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <span className="text-2xl font-semibold">Blog Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:text-white hover:bg-gray-700",
                  item.name === "Blogs" && "bg-gray-700"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        
      </nav>
    </div>
  )
}

