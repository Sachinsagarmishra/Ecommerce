import { NextRequest, NextResponse } from "next/server";
import {
    verifyWebhookSignature,
    handleSuccessfulPayment
} from "@/services/payments";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const isValid = await verifyWebhookSignature(body, signature);

    if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    try {
        if (event === "payment.captured" || event === "order.paid") {
            const paymentData = payload.payload.payment?.entity || payload.payload.order?.entity;
            await handleSuccessfulPayment(paymentData);
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
    }
}
