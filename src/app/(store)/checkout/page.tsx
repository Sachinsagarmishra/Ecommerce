import { getCart } from "@/features/cart/actions";
import { CheckoutForm } from "./CheckoutForm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default async function CheckoutPage() {
    const cart = await getCart();

    if (!cart || !cart.cart_items?.length) {
        redirect("/cart");
    }

    const subtotal = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID!;

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-0">

                    {/* Left Column: Form (7 columns) */}
                    <div className="lg:col-span-7 px-4 py-12 sm:px-6 lg:px-8 border-r border-gray-100 min-h-screen">
                        <div className="max-w-xl ml-auto">
                            <Link href="/" className="inline-block mb-8">
                                <h1 className="text-2xl font-black italic tracking-tighter text-black">STØRE</h1>
                            </Link>

                            <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
                                <Link href="/cart" className="hover:text-black">Bag</Link>
                                <ChevronRight className="w-3 h-3 shrink-0" />
                                <span className="text-black font-bold">Information</span>
                                <ChevronRight className="w-3 h-3 shrink-0" />
                                <span>Shipping</span>
                                <ChevronRight className="w-3 h-3 shrink-0" />
                                <span>Payment</span>
                            </nav>

                            <CheckoutForm
                                subtotal={subtotal}
                                razorpayKeyId={razorpayKeyId}
                            />

                            <div className="mt-12 pt-8 border-t border-gray-100 flex gap-6 text-[11px] text-gray-500 font-medium tracking-tight">
                                <Link href="/policies/refund-policy" className="hover:underline">Refund policy</Link>
                                <Link href="/policies/shipping-policy" className="hover:underline">Shipping policy</Link>
                                <Link href="/policies/privacy-policy" className="hover:underline">Privacy policy</Link>
                                <Link href="/policies/terms-of-service" className="hover:underline">Terms of service</Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (5 columns) */}
                    <aside className="lg:col-span-5 hidden lg:block bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
                        <div className="max-w-md">
                            <div className="space-y-4 mb-8">
                                {cart.cart_items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white border shrink-0">
                                            <Image
                                                src={item.product.product_images?.[0]?.url || "https://placehold.co/400x400"}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 h-5 w-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">Default</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">₹{(item.product.discounted_price || item.product.price) * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 mb-8">
                                <input
                                    type="text"
                                    placeholder="Discount code or gift card"
                                    className="flex-1 h-12 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                                <button className="px-6 h-12 bg-gray-100 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                    Apply
                                </button>
                            </div>

                            <div className="space-y-2 border-b border-gray-200/50 pb-6 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-gray-600 font-medium">Subtotal</p>
                                    <p className="font-bold">₹{subtotal}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-gray-600 font-medium">Shipping</p>
                                    <p className="text-gray-400">Enter shipping address</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <div>
                                    <p className="font-black">Total</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Including GST</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-gray-400 font-bold">INR</span>
                                    <span className="text-2xl font-black">₹{subtotal}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
