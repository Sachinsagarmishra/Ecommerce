import { getMyOrders } from "@/services/orders";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

export default async function CustomerOrdersPage() {
    const orders = await getMyOrders();

    const statusColors: any = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-500 text-sm">Track and manage your orders</p>
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <Package className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
                        <Link href="/shop">
                            <button className="mt-4 text-blue-600 font-semibold hover:underline">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="group border rounded-xl p-4 hover:border-black transition-all">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg">Order #{order.id.slice(0, 8)}</span>
                                        <Badge className={statusColors[order.status] || "bg-gray-100"}>
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Placed on {format(new Date(order.created_at), "PPP")}
                                    </p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="font-bold text-lg">₹{order.total_amount}</p>
                                    <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        className="text-sm text-blue-600 font-medium flex items-center gap-1 sm:justify-end mt-1"
                                    >
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
