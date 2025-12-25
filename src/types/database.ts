export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    role: 'admin' | 'customer'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name?: string | null
                    role?: 'admin' | 'customer'
                }
                Update: {
                    name?: string | null
                    role?: 'admin' | 'customer'
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    discounted_price: number | null
                    stock: number
                    brand_id: string | null
                    category_id: string | null
                    is_featured: boolean
                    is_active: boolean
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
                    total_amount: number
                    subtotal: number
                    discount_amount: number
                    shipping_address: Json
                    billing_address: Json | null
                    razorpay_order_id: string | null
                    customer_email: string | null
                    customer_phone: string | null
                    created_at: string
                    updated_at: string
                }
            }
            // Add other tables as needed
        }
    }
}
