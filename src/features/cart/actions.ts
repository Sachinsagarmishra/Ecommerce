"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCart() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: cart } = await supabase
        .from("carts")
        .select(`
            id,
            cart_items (
                id,
                quantity,
                product:products (
                    id,
                    name,
                    slug,
                    price,
                    discounted_price,
                    image_url:product_images(url)
                )
            )
        `)
        .eq("user_id", user.id)
        .single();

    if (!cart) {
        // Create cart if doesn't exist
        const { data: newCart } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select()
            .single();
        return newCart;
    }

    return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Please log in to add items to cart" };
    }

    let cart = await getCart();
    if (!cart) return { error: "Failed to initialize cart" };

    const { data: existingItem } = await supabase
        .from("cart_items")
        .select()
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .single();

    if (existingItem) {
        const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existingItem.quantity + quantity })
            .eq("id", existingItem.id);
        if (error) return { error: error.message };
    } else {
        const { error } = await supabase
            .from("cart_items")
            .insert({
                cart_id: cart.id,
                product_id: productId,
                quantity
            });
        if (error) return { error: error.message };
    }

    revalidatePath("/cart");
    revalidatePath(`/products/${productId}`);
    return { success: true };
}

export async function removeFromCart(itemId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

    if (error) return { error: error.message };

    revalidatePath("/cart");
    return { success: true };
}

export async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return removeFromCart(itemId);

    const supabase = await createClient();
    const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);

    if (error) return { error: error.message };

    revalidatePath("/cart");
    return { success: true };
}
