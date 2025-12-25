"use server";

import { createClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay";
import { getCart } from "@/features/cart/actions";
import crypto from "crypto";

export async function createPaymentOrder() {
    const cart = await getCart();
    if (!cart || !cart.cart_items?.length) {
        throw new Error("Cart is empty");
    }

    const amount = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    // Razorpay amount is in paise (₹1 = 100 paise)
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency
        };
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        throw new Error("Failed to create payment order");
    }
}

export async function verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) {
    const supabase = await createClient();
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new Error("Payment verification failed");
    }

    // Payment is verified, create the order in database and clear cart
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");

    const total_amount = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: user.user.id,
            total_amount: total_amount,
            subtotal: total_amount,
            status: "processing",
            shipping_address: {}, // Would normally collect this
            payment_status: "paid"
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = cart.cart_items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discounted_price || item.product.price
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Clear Cart
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);

    return { success: true, orderId: order.id };
}
