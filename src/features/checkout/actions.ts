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

    const options = {
        amount: Math.round(amount * 100),
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
    razorpay_signature: string,
    formData: any
) {
    const supabase = await createClient();
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new Error("Payment verification failed");
    }

    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");

    const total_amount = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    const { data: { user } } = await supabase.auth.getUser();
    let userId = user?.id;

    // Handle "Create Account" if requested and not logged in
    if (!userId && formData.createAccount) {
        // In a real app, we'd trigger a Supabase Auth invite or signup here.
        // For now, we'll create a profile and link the order.
        // We'll use the email as a temporary ID or similar if needed.
    }

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: userId || null, // Allow NULL for guest
            total_amount: total_amount,
            subtotal: total_amount,
            status: "processing",
            shipping_address: {
                name: formData.name,
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                state: formData.state,
                pin_code: formData.pinCode,
                phone: formData.phone,
                email: formData.email
            },
            payment_status: "paid",
            payment_id: razorpay_payment_id,
            metadata: {
                guest_checkout: !userId,
                save_info: formData.saveInfo,
                create_account: formData.createAccount
            }
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
    if (user) {
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    } else {
        // Clear guest cart
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    }

    return { success: true, orderId: order.id };
}
