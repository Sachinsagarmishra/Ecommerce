import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, ChevronLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <div className="p-10 bg-gray-50 rounded-full mb-10 transition-transform hover:scale-110">
                <Ghost className="w-20 h-20 text-gray-300" />
            </div>

            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-gray-900">
                404 - LOST IN THE STØRE
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-lg mb-12">
                The item or page you are looking for has vanished into thin air. Don't worry, our latest collection is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link href="/products" className="flex-1">
                    <Button className="w-full h-14 rounded-2xl bg-black text-white font-black hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        <Search className="w-5 h-5" />
                        BROWSE SHOP
                    </Button>
                </Link>
                <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black flex items-center justify-center gap-2 hover:bg-gray-50">
                        <ChevronLeft className="w-5 h-5" />
                        GO HOME
                    </Button>
                </Link>
            </div>

            <div className="mt-20 border-t pt-10 w-full max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Need Help?</p>
                        <p className="text-sm font-medium text-gray-600">Contact our support team</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Track Order</p>
                        <p className="text-sm font-medium text-gray-600">See your recent purchases</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Security</p>
                        <p className="text-sm font-medium text-gray-600">Secure checkout guaranteed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
