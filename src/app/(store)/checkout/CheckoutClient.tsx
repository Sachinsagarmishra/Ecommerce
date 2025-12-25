"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPaymentOrder, verifyPayment } from "@/features/checkout/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CheckoutClientProps {
    amount: number;
    razorpayKeyId: string;
    userEmail: string;
    userName: string;
}

export function CheckoutClient({ amount, razorpayKeyId, userEmail, userName }: CheckoutClientProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const order = await createPaymentOrder();

            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: "STØRE",
                description: "Purchase from STØRE",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const result = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );
                        if (result.success) {
                            toast.success("Payment Successful!");
                            router.push(`/dashboard/orders/${result.orderId}`);
                        }
                    } catch (error: any) {
                        toast.error(error.message || "Payment verification failed");
                    }
                },
                prefill: {
                    name: userName,
                    email: userEmail,
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-xs font-medium text-blue-800 leading-relaxed">
                    Your payment is secured with Razorpay. We do not store your card details on our servers.
                </p>
            </div>

            <Button
                onClick={handlePayment}
                className="w-full h-16 rounded-2xl bg-black text-white font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    `PAY ₹${amount} NOW`
                )}
            </Button>
        </div>
    );
}
