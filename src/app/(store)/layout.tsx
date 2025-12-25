import { Navbar } from "@/components/Navbar";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} STØRE. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
