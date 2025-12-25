import { redirect } from "next/navigation";
import { isAdmin } from "@/services/auth";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Tags,
    Layers,
    Image as ImageIcon
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
        redirect("/");
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Categories", href: "/admin/categories", icon: Layers },
        { label: "Collections", href: "/admin/collections", icon: Tags },
        { label: "Brands", href: "/admin/brands", icon: ImageIcon },
        { label: "Customers", href: "/admin/customers", icon: Users },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                </div>
                <nav className="mt-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
