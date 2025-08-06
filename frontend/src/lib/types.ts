export interface User {
  id: string
  name: string
  email: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  owner_name: string
  owner_email: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}
