import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/products";
import { getAllOrders } from "@/services/orders";
import { Package, ShoppingBag, Users, Zap } from "lucide-react";

export default async function AdminDashboardPage() {
    const products = await getProducts();
    const orders = await getAllOrders();

    const stats = [
        {
            label: "Total Sales",
            value: `₹${orders.filter(o => o.status !== 'pending').reduce((acc, curr) => acc + Number(curr.total_amount), 0)}`,
            icon: Zap,
            color: "text-yellow-600 bg-yellow-50"
        },
        {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Active Products",
            value: products.filter(p => p.is_active).length,
            icon: Package,
            color: "text-green-600 bg-green-50"
        },
        {
            label: "Total Customers",
            value: new Set(orders.map(o => o.user_id)).size,
            icon: Users,
            color: "text-purple-600 bg-purple-50"
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">DASHBOARD OVERVIEW</h1>
                <p className="text-gray-500 mt-2 font-medium">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden rounded-2xl group hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Table could go here */}
                <Card className="rounded-2xl border-none shadow-sm min-h-[300px] flex items-center justify-center bg-gray-50/50">
                    <p className="font-medium text-gray-400">Sales Chart (Coming Soon)</p>
                </Card>
                <Card className="rounded-2xl border-none shadow-sm min-h-[300px] flex items-center justify-center bg-gray-50/50">
                    <p className="font-medium text-gray-400">Recent User Activity (Coming Soon)</p>
                </Card>
            </div>
        </div>
    );
}
