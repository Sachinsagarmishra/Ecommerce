import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, Truck } from "lucide-react";
import Image from "next/image";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams;
    const supabase = await createClient();

    const { data: order, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                product:products(name, slug, product_images(url))
            )
        `)
        .eq("id", orderId)
        .single();

    if (error || !order) {
        redirect("/");
    }

    const shipping = order.shipping_address as any;

    return (
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Order Confirmed</p>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-gray-900">
                    THANK YOU FOR YOUR PURCHASE!
                </h1>
                <p className="text-gray-500 font-medium">
                    Order <span className="text-black font-bold">#{order.id.slice(0, 8).toUpperCase()}</span> has been placed and is being processed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <h2 className="text-sm font-black uppercase tracking-wider">Shipping Address</h2>
                    </div>
                    <div className="text-sm font-medium text-gray-600 space-y-1">
                        <p className="text-black font-bold">{shipping.name}</p>
                        <p>{shipping.address}</p>
                        {shipping.apartment && <p>{shipping.apartment}</p>}
                        <p>{shipping.city}, {shipping.state} {shipping.pinCode}</p>
                        <p className="pt-2">{shipping.phone}</p>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <h2 className="text-sm font-black uppercase tracking-wider">Shipping Method</h2>
                    </div>
                    <p className="text-sm font-bold">Standard Delivery (Free)</p>
                    <p className="text-xs text-gray-400 font-medium mt-1 italic">Expected in 3-5 business days</p>
                </div>
            </div>

            <div className="border border-gray-100 rounded-3xl overflow-hidden mb-12">
                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items
                    </h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {order.order_items.map((item: any) => (
                        <div key={item.id} className="p-6 flex items-center gap-4">
                            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                                <Image
                                    src={item.product.product_images?.[0]?.url || "https://placehold.co/400x400"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate uppercase tracking-tight">{item.product.name}</h3>
                                <p className="text-sm text-gray-500 font-medium">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-black text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-2xl font-black italic tracking-tighter uppercase">
                        <span>Total Paid</span>
                        <span>₹{order.total_amount}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="flex-1">
                    <Button className="w-full h-14 rounded-2xl bg-black text-white font-black hover:bg-gray-800 transition-all">
                        CONTINUE SHOPPING
                    </Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black">
                        VIEW ALL ORDERS
                    </Button>
                </Link>
            </div>
        </div>
    );
}
