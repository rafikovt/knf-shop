export type Rarity = 'consumer' | 'industrial' | 'mil-spec' | 'restricted' | 'classified' | 'covert'

export type Product = {
  id: string
  name: string
  price: number
  rarity: Rarity
  inStock: boolean
  tags: string[]
  image: string
  updatedAt: string
}

export type CartItem = {
  productId: string
  name: string
  price: number
  qty: number
  image: string
  inStock: boolean
}

export type Cart = {
  items: CartItem[]
  subtotal: number
  currency: 'USD'
  updatedAt: string
}
