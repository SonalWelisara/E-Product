"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

interface Product {
  id?: string
  title: string
  description: string
  price: number
  image?: string
}

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [title, setTitle] = useState(product?.title || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", price)

      if (image) {
        formData.append("image", image)
      }

      const url = product ? `http://localhost:8000/products/${product.id}` : "http://localhost:8000/products/"

      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${product ? "updated" : "created"} successfully!`,
        })
        onSuccess()
      } else {
        const error = await response.json()
        let errorMessage= (error.detail || `Failed to ${product ? "update" : "create"} product`)
        if (error.detail && Array.isArray(error.detail) && error.detail.length > 0) {
          errorMessage = error.detail[0].msg
        }

        throw new Error(errorMessage)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${product ? "update" : "create"} product`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="flex-1"
          />
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
        {!product && <p className="text-sm text-gray-500">Select an image for your product</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  )
}
