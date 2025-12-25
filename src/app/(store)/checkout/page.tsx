import { getCart } from "@/features/cart/actions";
import { getProfile } from "@/services/auth";
import { CheckoutClient } from "./CheckoutClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default async function CheckoutPage() {
    const cart = await getCart();
    const profile = await getProfile();

    if (!cart || !cart.cart_items?.length) {
        redirect("/cart");
    }

    if (!profile) {
        redirect("/auth/login");
    }

    const subtotal = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID!;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Link href="/cart" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                BACK TO BAG
            </Link>

            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-12">CHECKOUT</h1>

            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                <div className="lg:col-span-7 space-y-8">
                    {/* Delivery Address Placeholder */}
                    <Card className="p-8 rounded-3xl border-none shadow-sm bg-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Delivery Address
                            </h2>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-gray-900">{profile.name}</p>
                            <p className="text-sm font-medium text-gray-500">{profile.email}</p>
                            <p className="text-sm font-medium text-gray-400 mt-4 italic">Address functionality coming soon. For now, we will use your profile info.</p>
                        </div>
                    </Card>

                    {/* Order Summary Mobile-like View */}
                    <div className="block lg:hidden">
                        {/* Summary code same as sidebar but for mobile */}
                    </div>
                </div>

                <aside className="lg:col-span-5 mt-12 lg:mt-0">
                    <Card className="p-8 rounded-3xl border-none shadow-sm bg-white border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-black italic tracking-tighter uppercase mb-8">IN YOUR BAG</h2>

                        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                            {cart.cart_items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                                        <Image
                                            src={item.product.image_url?.[0]?.url || "https://placehold.co/400x400"}
                                            alt={item.product.name}
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold uppercase truncate">{item.product.name}</p>
                                        <p className="text-sm font-medium text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black">₹{(item.product.discounted_price || item.product.price) * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</p>
                                <p className="text-sm font-black text-gray-900">₹{subtotal}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
                                <p className="text-sm font-black text-green-600">FREE</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <p className="text-xl font-black italic tracking-tighter uppercase">Total</p>
                                <p className="text-xl font-black text-gray-900">₹{subtotal}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <CheckoutClient
                                amount={subtotal}
                                razorpayKeyId={razorpayKeyId}
                                userEmail={profile.email}
                                userName={profile.name || "Customer"}
                            />
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
