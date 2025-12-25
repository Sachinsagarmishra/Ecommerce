import { redirect } from "next/navigation";
import { getProfile } from "@/services/auth";
import Link from "next/link";
import {
    User,
    ShoppingBag,
    Heart,
    MapPin,
    LogOut,
    ChevronRight
} from "lucide-react";
import { signOut } from "@/features/auth/actions";

export default async function CustomerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getProfile();

    if (!profile) {
        redirect("/auth/login");
    }

    const navItems = [
        { label: "My Profile", href: "/dashboard/profile", icon: User },
        { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
        { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-2">
                    <div className="p-4 bg-white rounded-xl border mb-6 shadow-sm">
                        <h2 className="font-semibold text-lg">{profile.name || "User"}</h2>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 bg-white border rounded-lg hover:border-black hover:text-black transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>
                        ))}

                        <form action={async () => {
                            "use server";
                            const { signOut } = await import("@/services/auth");
                            await signOut();
                            redirect("/");
                        }}>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 bg-white border rounded-lg hover:bg-red-50 transition-all mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </form>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-white border rounded-xl p-6 shadow-sm min-h-[500px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
