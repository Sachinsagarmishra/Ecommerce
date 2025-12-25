import { getMyOrders } from "@/services/orders";
import { getProfile } from "@/services/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, Heart, MapPin, ArrowRight } from "lucide-react";

export default async function CustomerDashboardPage() {
    const profile = await getProfile();
    const orders = await getMyOrders();
    const recentOrders = orders.slice(0, 3);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Hello, {profile?.name || "Member"}!</h1>
                <p className="text-gray-500">Welcome to your dashboard. Here's what's happening.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-blue-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-blue-600 uppercase">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{orders.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-purple-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-purple-600 uppercase">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">0</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-green-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-green-600 uppercase">Saved Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Recent Orders</h2>
                    <Link href="/dashboard/orders" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="border rounded-xl p-4 flex items-center justify-between hover:border-black transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <ShoppingBag className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-gray-500">₹{order.total_amount} • {order.status}</p>
                                    </div>
                                </div>
                                <Link href={`/dashboard/orders/${order.id}`}>
                                    <Button variant="ghost" size="sm">Details</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed">
                        <p className="text-gray-400">No recent orders yet.</p>
                        <Link href="/shop">
                            <Button variant="link" className="mt-2 text-blue-600">Start Shopping</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
