"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRazorpayOrder } from "@/services/payments";
import { toast } from "sonner";
import Script from "next/script";

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleCheckout = async () => {
        setLoading(true);

        // 1. Create order in our DB (omitted for brevity, assume we have an order ID)
        const orderId = "temp_" + Math.random().toString(36).slice(2, 9);
        const amount = 999; // Example amount

        // 2. Create Razorpay Order
        const res = await createRazorpayOrder(amount, orderId);

        if (!res.success) {
            toast.error("Failed to initialize payment");
            setLoading(false);
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: res.order.amount,
            currency: "INR",
            name: "STØRE",
            description: "Purchase Payment",
            order_id: res.order.id,
            handler: function (response: any) {
                toast.success("Payment Successful! Order Confirmed.");
                // Redirect to success page
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            theme: {
                color: "#000000",
            },
            modal: {
                ondismiss: function () {
                    setLoading(false);
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <h1 className="text-3xl font-black mb-8 px-4 sm:px-0">CHECKOUT</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-gray-50/50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Shipping Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Enter full address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-24 rounded-2xl border-2 border-black bg-white shadow-xl overflow-hidden">
                        <CardHeader className="bg-black text-white py-6">
                            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>₹999.00</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold uppercase text-xs">FREE</span>
                            </div>
                            <div className="border-t border-dashed pt-4 flex justify-between items-end">
                                <span className="font-bold text-lg">Total</span>
                                <span className="text-3xl font-black">₹999.00</span>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-8 text-xl font-black rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                disabled={loading || !formData.email || !formData.address}
                            >
                                {loading ? "PROCESSING..." : "PLACE ORDER"}
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                                By clicking "PLACE ORDER", you agree to our Terms of Service and Refund Policy.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
