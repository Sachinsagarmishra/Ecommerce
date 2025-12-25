"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createPaymentOrder, verifyPayment } from "@/features/checkout/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ChevronDown, Info } from "lucide-react";

const checkoutSchema = z.object({
    email: z.string().email("Invalid email or mobile number"),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    address: z.string().min(5, "Address too short"),
    apartment: z.string().optional(),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    pinCode: z.string().min(6, "Invalid PIN code"),
    phone: z.string().min(10, "Invalid phone number"),
    saveInfo: z.boolean().default(false),
    createAccount: z.boolean().default(false),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
    subtotal: number;
    razorpayKeyId: string;
}

export function CheckoutForm({ subtotal, razorpayKeyId }: CheckoutFormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            saveInfo: false,
            createAccount: false,
        }
    });

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            const scripts = document.querySelectorAll('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            scripts.forEach(s => s.remove());
        };
    }, []);

    const onSubmit = async (data: CheckoutValues) => {
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
                prefill: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contact: data.phone,
                },
                theme: { color: "#000000" },
                handler: async function (response: any) {
                    try {
                        const result = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                            {
                                ...data,
                                name: `${data.firstName} ${data.lastName}`
                            }
                        );
                        if (result.success) {
                            toast.success("Payment Successful!");
                            router.push(`/checkout/success?orderId=${result.orderId}`);
                        }
                    } catch (error: any) {
                        toast.error(error.message || "Payment verification failed");
                    }
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

            {/* Contact Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold tracking-tight">Contact</h2>
                    <button type="button" className="text-xs font-bold text-gray-500 hover:text-black underline">Sign in</button>
                </div>
                <div className="space-y-2">
                    <Input
                        {...register("email")}
                        placeholder="Email or mobile phone number"
                        className={`h-12 rounded-lg border-gray-200 focus:ring-0 focus:border-black ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-bold">{errors.email.message}</p>}
                </div>
            </div>

            {/* Delivery Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Delivery</h2>

                <div className="space-y-4">
                    <div className="relative">
                        <select className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black">
                            <option>India</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <label className="absolute left-4 -top-2 px-1 bg-white text-[10px] text-gray-500 font-bold">Country/Region</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Input {...register("firstName")} placeholder="First name" className="h-12 border-gray-200" />
                            {errors.firstName && <p className="text-[11px] text-red-500 font-bold">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Input {...register("lastName")} placeholder="Last name" className="h-12 border-gray-200" />
                            {errors.lastName && <p className="text-[11px] text-red-500 font-bold">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <Input {...register("address")} placeholder="Address" className="h-12 border-gray-200" />
                    <Input {...register("apartment")} placeholder="Apartment, suite, etc. (optional)" className="h-12 border-gray-200" />

                    <div className="grid grid-cols-3 gap-4">
                        <Input {...register("city")} placeholder="City" className="h-12 border-gray-200" />
                        <div className="relative">
                            <select {...register("state")} className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-black">
                                <option value="Delhi">Delhi</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                {/* Add more states as needed */}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <Input {...register("pinCode")} placeholder="PIN code" className="h-12 border-gray-200" />
                    </div>

                    <div className="relative">
                        <Input {...register("phone")} placeholder="Phone" className="h-12 border-gray-200 pr-10" />
                        <Info className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="saveInfo" {...register("saveInfo")} />
                        <label htmlFor="saveInfo" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Save this information for next time
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="createAccount" {...register("createAccount")} />
                        <label htmlFor="createAccount" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Create account using this email
                        </label>
                    </div>
                </div>
            </div>

            {/* Shipping Method Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Shipping method</h2>
                <div className="p-10 bg-gray-50/50 border border-gray-100 rounded-xl text-center">
                    <p className="text-xs text-gray-500 font-medium tracking-tight">Enter your shipping address to view available shipping methods.</p>
                </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Payment</h2>
                    <p className="text-xs text-gray-500 font-medium">All transactions are secure and encrypted.</p>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-200">
                        <span className="text-sm font-bold">Cards, UPI, Netbanking</span>
                        <div className="flex gap-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Visa_Logo.png" className="h-3 w-auto" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-3 w-auto" alt="Mastercard" />
                        </div>
                    </div>
                    <div className="p-12 text-center bg-white flex flex-col items-center gap-6">
                        <div className="p-8 bg-gray-50 rounded-full">
                            <ShieldCheck className="w-16 h-16 text-gray-200" />
                        </div>
                        <p className="text-xs text-gray-600 font-medium max-w-[280px]">
                            After clicking "Pay now", you will be redirected to Razorpay to complete your purchase securely.
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-lg bg-black text-white font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Pay now"}
            </Button>
        </form>
    );
}
