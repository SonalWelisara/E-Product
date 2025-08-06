"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  owner_name: string
  owner_email: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products/")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4">
                      <Image
                        src={`http://localhost:8000${product.image_url}`}
                        alt={product.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <Badge variant="secondary">{product.owner_name}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
