"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getSessionId() {
    const cookieStore = await cookies();
    return cookieStore.get("cart_session_id")?.value;
}

async function setSessionId() {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookieStore.set("cart_session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
    }
    return sessionId;
}

export async function getCart() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = await getSessionId();

    if (!user && !sessionId) return null;

    let query = supabase
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
                    product_images(url)
                )
            )
        `);

    if (user) {
        query = query.eq("user_id", user.id);
    } else {
        query = query.eq("session_id", sessionId).is("user_id", null);
    }

    const { data: cart } = await query.maybeSingle();

    // Do NOT auto-create cart on GET to avoid cookie issues during render
    return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // During an ACTION, it's safe to set session cookies
    const sessionId = user ? null : await setSessionId();

    let cart = await getCart();

    if (!cart) {
        const insertData = user
            ? { user_id: user.id }
            : { session_id: sessionId };

        const { data: newCart, error: cartError } = await supabase
            .from("carts")
            .insert(insertData)
            .select()
            .single();

        if (cartError) return { error: cartError.message };
        cart = newCart;
    }

    const { data: existingItem } = await supabase
        .from("cart_items")
        .select()
        .eq("cart_id", cart!.id)
        .eq("product_id", productId)
        .maybeSingle();

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
