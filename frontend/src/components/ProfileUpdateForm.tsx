"use client";

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProfileUpdateFormProps {
  onSuccess: () => void
}

export default function ProfileUpdateForm({ onSuccess }: ProfileUpdateFormProps) {
  const { user, token, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = "http://localhost:8000/auth/me"
      
      const updateData = {
        name,
        current_password: currentPassword,
        new_password: newPassword || undefined,
      }

      const isNameChanged = name !== user?.name
      const isPasswordChanged = !!newPassword
      
      if (!isNameChanged && !isPasswordChanged) {
        toast({
          title: "Info",
          description: "No changes were made.",
        })
        setLoading(false)
        return
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        refreshUser()
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.detail || "Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Enter new password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Profile
      </Button>
    </form>
  )
}