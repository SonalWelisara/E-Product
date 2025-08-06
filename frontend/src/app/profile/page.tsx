"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import ProductForm from "@/components/ProductForm"
import ProfileUpdateForm from "@/components/ProfileUpdateForm"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, User, Mail } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, token, refreshUser} = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showProfileUpdateForm, setShowProfileUpdateForm] = useState(false)

  useEffect(() => {
    if (user && token) {
      fetchUserProducts()
    }
  }, [user, token])

  const fetchUserProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const allProducts = await response.json()
        const userProducts = allProducts.filter((product: any) => product.owner_id === user?.id)
        setProducts(userProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setProductsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleProductSaved = () => {
    fetchUserProducts()
    setShowAddForm(false)
  }

  const handleProfileUpdated = () => {
    refreshUser()
    setShowProfileUpdateForm(false)
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <Dialog open={showProfileUpdateForm} onOpenChange={setShowProfileUpdateForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <ProfileUpdateForm onSuccess={handleProfileUpdated} />
                  </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSuccess={handleProductSaved} />
            </DialogContent>
          </Dialog>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">You haven't added any products yet.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4">
                    <Image
                    src={`http://localhost:8000${product.image_url}`}
                      // src={product.image || "/placeholder.svg?height=200&width=200"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-primary">${product.price}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm product={product} onSuccess={handleProductSaved} />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
