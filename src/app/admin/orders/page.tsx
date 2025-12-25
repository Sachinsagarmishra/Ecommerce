import { getAllOrders } from "@/services/orders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black uppercase tracking-tight italic">ORDERS MANAGEMENT</h1>
            </div>

            <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Order ID</TableHead>
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Customer</TableHead>
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Date</TableHead>
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Amount</TableHead>
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 uppercase tracking-wider text-xs">Payment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-medium whitespace-nowrap">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                const guestInfo = order.shipping_address as any;
                                const customerName = order.profiles?.name || guestInfo?.name || "Guest";
                                const customerEmail = order.profiles?.email || guestInfo?.email || "No Email";

                                return (
                                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-black text-xs uppercase text-gray-500">
                                            #{order.id.slice(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{customerName}</span>
                                                <span className="text-xs text-gray-500">{customerEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-gray-600">
                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="font-black text-gray-900">
                                            ₹{order.total_amount}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] bg-blue-50 text-blue-600 border-blue-100 px-3">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] bg-green-50 text-green-600 border-green-100 px-3">
                                                {order.payment_status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
