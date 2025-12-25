"use server";

import { razorpay } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function createRazorpayOrder(amount: number, orderId: string) {
    const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: orderId,
    };

    try {
        const order = await razorpay.orders.create(options);
        return { success: true, order };
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        return { success: false, error };
    }
}

export async function verifyWebhookSignature(
    body: string,
    signature: string
) {
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

    return expectedSignature === signature;
}

export async function handleSuccessfulPayment(paymentData: any) {
    const supabase = await createClient();
    const { notes, order_id: razorpayOrderId, id: paymentId } = paymentData;
    const dbOrderId = notes?.order_id;

    // Verify and update order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({
            status: "confirmed",
            razorpay_order_id: razorpayOrderId,
        })
        .eq("id", dbOrderId)
        .select()
        .single();

    if (orderError) throw orderError;

    // Insert payment record
    await supabase.from("payments").insert({
        order_id: dbOrderId,
        razorpay_payment_id: paymentId,
        amount: paymentData.amount / 100,
        status: "captured",
        method: paymentData.method,
        metadata: paymentData,
    });

    return order;
}
