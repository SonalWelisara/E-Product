"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ShoppingBag, User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout, isInitialized } = useAuth()

  if (!isInitialized) {
    return (
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/products" className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">E-Product</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="ghost">Products</Button>
              </Link>
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/products" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">E-Product</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost">Products</Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
