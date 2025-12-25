import { getCart } from "@/features/cart/actions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { CartItemActions } from "./CartItemActions";
import { redirect } from "next/navigation";

export default async function CartPage() {
    const cart = await getCart();

    if (!cart || !cart.cart_items?.length) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="p-8 bg-gray-50 rounded-full mb-6">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">YOUR BAG IS EMPTY</h1>
                <p className="text-gray-500 font-medium mb-8">Ready to start shopping? Explore our latest arrivals.</p>
                <Link href="/products">
                    <Button className="h-14 px-8 rounded-2xl bg-black text-white font-black hover:bg-gray-800 transition-all">
                        EXPLORE PRODUCTS
                    </Button>
                </Link>
            </div>
        );
    }

    const subtotal = cart.cart_items.reduce((acc: number, item: any) => {
        const price = item.product.discounted_price || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-8">YOUR SHOPPING BAG</h1>

            <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                <div className="lg:col-span-8">
                    <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                        {cart.cart_items.map((item: any) => (
                            <li key={item.id} className="flex py-6 sm:py-10">
                                <div className="relative flex-shrink-0">
                                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-gray-50 border shadow-sm">
                                        <Image
                                            src={item.product.image_url?.[0]?.url || "https://placehold.co/400x400"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-bold uppercase tracking-wider">
                                                    <Link href={`/products/${item.product.slug}`} className="text-gray-700 hover:text-black">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-lg font-black text-gray-900">
                                                ₹{item.product.discounted_price || item.product.price}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <CartItemActions itemId={item.id} quantity={item.quantity} />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Order Summary */}
                <section className="mt-16 rounded-3xl bg-gray-50 px-8 py-10 lg:col-span-4 lg:mt-0 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black italic tracking-tighter uppercase mb-6">ORDER SUMMARY</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal</p>
                            <p className="text-sm font-black text-gray-900">₹{subtotal}</p>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Estimated Delivery</p>
                            <p className="text-sm font-black text-gray-900">FREE</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <p className="text-xl font-black italic tracking-tighter uppercase text-gray-900">Total</p>
                            <p className="text-xl font-black text-gray-900">₹{subtotal}</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <Link href="/checkout">
                            <Button className="w-full h-16 rounded-2xl bg-black text-white font-black text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                                PROCEED TO CHECKOUT
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
