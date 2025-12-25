import Link from "next/link";
import { ShoppingBag, User, Search, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/services/auth";

export async function Navbar() {
    const profile = await getProfile();
    const isAdmin = profile?.role === "admin";

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-black italic tracking-tighter text-black">
                        STØRE
                    </Link>
                    <div className="hidden items-center gap-6 md:flex">
                        <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-black">
                            Shop All
                        </Link>
                        {isAdmin && (
                            <Link href="/admin" className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                                <ShieldCheck className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center border rounded-full px-3 py-1.5 bg-gray-50 border-gray-200">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48"
                        />
                    </div>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="w-5 h-5 text-gray-700" />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                0
                            </span>
                        </Button>
                    </Link>

                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <User className="w-5 h-5 text-gray-700" />
                        </Button>
                    </Link>

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="w-5 h-5 text-gray-700" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
